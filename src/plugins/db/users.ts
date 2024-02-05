import { database } from "./database";
import { NewUser, User, UserInsert } from "./types";

export const createUser = async (user: NewUser): Promise<string> => {
  try {
    const id = crypto.randomUUID();
    const values: UserInsert = {
      id,
      name: user.name,
      username: user.username,
      password: user.password,
    };

    await database.insertInto("users").values(values).executeTakeFirstOrThrow();

    return id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUser = async (id: string): Promise<User | undefined> => {
  return await database
    .selectFrom("users")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
};

export const getUserByUsername = async (
  username: string,
): Promise<User | undefined> => {
  return await database
    .selectFrom("users")
    .where("username", "=", username)
    .selectAll()
    .executeTakeFirst();
};
