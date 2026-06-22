let accessToken: string | null = null;
let refreshToken: string | null = null;
let nickname: string | null = null;

export const tokenStore = {
  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,
  getNickname: () => nickname,
  setTokens: (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
  },
  setNickname: (n: string) => {
    nickname = n;
  },
  clear: () => {
    accessToken = null;
    refreshToken = null;
    nickname = null;
  },
};
