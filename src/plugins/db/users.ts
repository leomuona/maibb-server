import { Pool, RowDataPacket } from "mysql2/promise";

interface IUser extends RowDataPacket {
  id: string;
  name: string;
  username: string;
  password: string;
  active: boolean;
}

export type UserData = {
  id: string;
  name: string;
  username: string;
  password: string;
  active: boolean;
};

export type NewUserData = {
  name: string;
  username: string;
  password: string;
};

export const insertUser = async (
  user: NewUserData,
  pool: Pool,
): Promise<UserData> => {
  try {
    const id = crypto.randomUUID();
    const query =
      "INSERT INTO `users` (`id`, `name`, `username`, `password`) VALUES (?, ?, ?, ?)";
    const values = [id, user.name, user.username, user.password];
    await pool.execute(query, values);
    return { ...user, id, active: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUser = async (
  id: string,
  pool: Pool,
): Promise<UserData | null> => {
  try {
    const query = "SELECT * FROM `users` WHERE `id` = ?";
    const [results] = await pool.execute<IUser[]>(query, [id]);
    return results[0] ? results[0] : null;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const getUserByUsername = async (
  username: string,
  pool: Pool,
): Promise<UserData | null> => {
  try {
    const query = "SELECT * FROM `users` WHERE `username` = ?";
    const [results] = await pool.execute<IUser[]>(query, [username]);
    return results[0] ? results[0] : null;
  } catch (error) {
    console.log(error);
  }
  return null;
};
