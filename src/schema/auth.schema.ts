import { Static, Type } from "@sinclair/typebox";

export const LoginProps = Type.Object({
  username: Type.String(),
  password: Type.String(),
});
export type LoginPropsType = Static<typeof LoginProps>;

export const Token = Type.Object({
  token: Type.String(),
});
export type TokenType = Static<typeof Token>;

export const AuthenticatedUser = Type.Object({
  id: Type.String(),
  name: Type.String(),
});
export type AuthenticatedUserType = Static<typeof AuthenticatedUser>;

export const loginSchema = {
  body: LoginProps,
  response: {
    200: Token,
  },
};

export const getAuthenticatedUserSchema = {
  response: {
    200: AuthenticatedUser,
  },
};
