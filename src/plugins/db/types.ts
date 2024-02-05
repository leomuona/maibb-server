import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  users: UsersTable;
}

export interface UsersTable {
  id: string;
  name: string;
  username: string;
  password: string;
  active: Generated<boolean>;
  admin: Generated<false>;
}

export type User = Selectable<UsersTable>;
export type UserInsert = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

// for users we want to have a bit less options
export type NewUser = {
  name: string;
  username: string;
  password: string;
};
