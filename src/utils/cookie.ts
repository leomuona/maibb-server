import { env } from "../config/env";

type Entry = {
  key: string;
  value: string;
};

export const parseCookies = (cookieHeader: string | undefined): Entry[] => {
  if (!cookieHeader) {
    return [];
  }

  const pairs = cookieHeader
    .split(";")
    .map((c) => c.split("=").map((x) => x.trim()))
    .filter((p) => p[0]);

  return pairs.map((pair) => ({ key: pair[0], value: pair[1] ?? "" }));
};

export const buildRefreshTokenCookie = (token: string) => {
  let cookie = `${env.JWT_REFRESH_COOKIE_NAME}=${token}`;
  cookie += "; HttpOnly"; // hide from javascript
  cookie += "; Path=/";
  cookie += `; Max-Age=${env.JWT_REFRESH_TOKEN_VALIDITY}`;
  // cookie += "; Secure" // https only
  return cookie;
};

export const getRefreshTokenFromCookie = (
  cookieHeader: string | undefined,
): string | undefined => {
  const cookies = parseCookies(cookieHeader);
  const refreshCookie = cookies.find(
    (x) => x.key === env.JWT_REFRESH_COOKIE_NAME,
  );
  return refreshCookie?.value;
};
