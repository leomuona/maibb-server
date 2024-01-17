import { AuthenticatedUserType } from "../schema/auth.schema";

const mikkiHiiri = {
  id: "4579863e-1970-4ca7-aa5e-0c82c51df145",
  name: "Mikki Hiiri",
};

export const loginUser = (
  username: string,
  password: string,
): AuthenticatedUserType => {
  // TODO actual login
  if (username === "mikki" && password === "hiiri") {
    return mikkiHiiri;
  }
  throw new Error("Username or password is not correct");
};

export const getUser = (id: string): AuthenticatedUserType | undefined => {
  if (id === mikkiHiiri.id) {
    return mikkiHiiri;
  }
  return undefined;
};
