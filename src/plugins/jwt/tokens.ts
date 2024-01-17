// TODO: actual token repository

type TokenEntry = {
  id: string;
  sub: string;
  expires: Date;
};

const refreshTokens: TokenEntry[] = [];

const clearExpiredTokens = () => {
  const now = new Date();
  let index = refreshTokens.length - 1;
  while (index > -1) {
    if (refreshTokens[index].expires < now) {
      refreshTokens.splice(index, 1);
    }
    index--;
  }
};

export const addRefreshToken = (id: string, sub: string, expires: Date) => {
  refreshTokens.push({ id, sub, expires });
};

export const checkRefreshToken = (id: string): boolean => {
  const entry = refreshTokens.find((item) => item.id === id);
  if (entry) {
    if (entry.expires > new Date()) {
      return true;
    }
    clearExpiredTokens();
  }
  return false;
};

export const removeRefreshTokens = (sub: string) => {
  let index = refreshTokens.length - 1;
  while (index > -1) {
    if (refreshTokens[index].sub === sub) {
      refreshTokens.splice(index, 1);
    }
    index--;
  }
};
