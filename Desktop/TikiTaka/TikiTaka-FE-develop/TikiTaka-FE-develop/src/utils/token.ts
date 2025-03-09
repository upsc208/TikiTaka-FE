const ACCESS_TOKEN_KEY = 'accessToken';

export const tokenStorage = {
  set(accessToken: string) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  get(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },
  remove() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};