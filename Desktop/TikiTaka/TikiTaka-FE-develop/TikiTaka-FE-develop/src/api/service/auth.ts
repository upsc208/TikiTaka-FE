import axios from 'axios';
import {tokenStorage} from '../../utils/token';
import instance from '../axiosInstance';

const config = {
  backend: {
    baseURL: process.env.REACT_APP_BASE_URL || '',
  },
};

export async function postLogin(loginData: LoginData) {
  try {
    const existingToken = tokenStorage.get();
    if (existingToken) {
      tokenStorage.remove();
    }

    const response = await instance.post('/login', loginData);
    const {data, headers} = response;
    const authorizationHeader = headers['authorization'] || headers['Authorization'];

    if (authorizationHeader) {
      const accessToken = authorizationHeader.replace('Bearer ', '');
      tokenStorage.set(accessToken);
      return {...data, accessToken};
    }
  } catch (error) {
    throw error;
  }
}

export async function postLogout() {
  try {
    const token = tokenStorage.get();
    if (!token) throw new Error('로그인 정보가 없습니다.');
    tokenStorage.remove();

    const response = await instance.post('/logout', null, {withCredentials: true});
    if (response.status === 200) {
    } else {
      console.error('로그아웃 실패:', response.statusText);
    }
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
}

export async function postReissueToken() {
  try {
    const baseURL = config.backend.baseURL.replace(/\/$/, '');
    const response = await axios.post(`${baseURL}/reissue`, null, {
      withCredentials: true,
    });
    const {headers} = response;

    let newAccessToken = headers['authorization'] || headers['Authorization'];
    if (newAccessToken?.startsWith('Bearer ')) {
      newAccessToken = newAccessToken.replace('Bearer ', '');
    }

    if (newAccessToken) {
      tokenStorage.set(newAccessToken);
    }
    return {accessToken: newAccessToken};
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    throw error;
  }
}
