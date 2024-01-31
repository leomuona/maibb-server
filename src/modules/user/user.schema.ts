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

export const loginSchema = {
  body: LoginProps,
  response: {
    200: Token,
  },
  tags: ["user"],
};

export const logoutSchema = {
  tags: ["user"],
};

export const BasicUser = Type.Object({
  id: Type.String(),
  name: Type.String(),
});
export type BasicUserType = Static<typeof BasicUser>;

export const getAuthenticatedUserSchema = {
  response: {
    200: BasicUser,
  },
  tags: ["user"],
};

export const RegisterUserProps = Type.Object({
  name: Type.String(),
  username: Type.String(),
  password: Type.String(),
});
export type RegisterUserPropsType = Static<typeof RegisterUserProps>;

export const registerUserSchema = {
  body: RegisterUserProps,
  response: {
    200: BasicUser,
  },
  tags: ["user"],
};
