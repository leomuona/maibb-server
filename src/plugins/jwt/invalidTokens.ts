// TODO: actual token repository

type TokenEntry = {
  jti: string;
  exp: number;
};

const tokens: TokenEntry[] = [];

const clearExpiredTokens = () => {
  const now = Date.now() / 1000; // exp is seconds, not ms
  let index = tokens.length - 1;
  while (index > -1) {
    if (tokens[index].exp < now) {
      tokens.splice(index, 1);
    }
    index--;
  }
};

export const invalidateToken = (jti: string, exp: number) => {
  tokens.push({ jti, exp });
};

export const isTokenInvalidated = (jti: string): boolean => {
  const entry = tokens.find((item) => item.jti === jti);
  if (entry) {
    // this could be somewhere else
    clearExpiredTokens();
    return true;
  }
  return false;
};
