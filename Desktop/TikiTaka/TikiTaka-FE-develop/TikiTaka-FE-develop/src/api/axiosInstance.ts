import axios, {AxiosInstance} from 'axios';
import {tokenStorage} from '../utils/token';
import {postReissueToken} from './service/auth';

const config = {
  backend: {
    baseURL: process.env.REACT_APP_BASE_URL,
  },
};

const server = config.backend.baseURL;

const instance: AxiosInstance = axios.create({
  baseURL: server,
  withCredentials: true,
});

let refreshTokenPromise: Promise<string | null> | null = null;
let isSessionExpired = false;

instance.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      if (!isSessionExpired) {
        isSessionExpired = true;
        alert('서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
      }
      return Promise.reject(error);
    }

    const {status} = error.response;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = postReissueToken()
            .then(({accessToken}) => {
              return accessToken;
            })
            .catch((err) => {
              console.error('토큰 재발급 실패:', err);
              throw err;
            })
            .finally(() => {
              refreshTokenPromise = null;
            });
        }

        const newAccessToken = await refreshTokenPromise;
        if (!newAccessToken) throw new Error('토큰 재발급 실패');

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (reissueError) {
        if (!isSessionExpired) {
          isSessionExpired = true;
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
        tokenStorage.remove();
        window.location.href = '/';
        return Promise.reject(reissueError);
      }
    }

    if (status === 419) {
      alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
      tokenStorage.remove();
      window.location.href = '/';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default instance;
