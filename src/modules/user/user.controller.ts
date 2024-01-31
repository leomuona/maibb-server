import { FastifyReply, FastifyRequest } from "fastify";
import { comparePassword, hashPassword } from "../../utils/hash";
import { LoginPropsType, RegisterUserPropsType } from "./user.schema";

export const login = async (
  request: FastifyRequest<{ Body: LoginPropsType }>,
  reply: FastifyReply,
) => {
  const user = await request.server.db.users.getByUsername(
    request.body.username,
  );
  if (!user) {
    return reply.code(400).send("login or password incorrect");
  }

  const correct = await comparePassword(request.body.password, user.password);
  if (!correct) {
    return reply.code(400).send("login or password incorrect");
  }

  const token = request.server.jwt.create(user.id);
  return { token };
};

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    request.server.jwt.invalidate(request);

    return reply.code(200).send();
  } catch (_err) {
    return reply.code(401).send("Unauthorized");
  }
};

export const getAuthenticatedUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!request.userId) {
    return reply.code(401).send("Unauthorized");
  }

  const user = await request.server.db.users.get(request.userId);
  if (!user) {
    return reply.code(500).send("Unable to find user");
  }

  const response = { id: user.id, name: user.name };
  return reply.code(200).send(response);
};

export const registerUser = async (
  request: FastifyRequest<{ Body: RegisterUserPropsType }>,
  reply: FastifyReply,
) => {
  const userData = request.body;
  const existingUser = await request.server.db.users.getByUsername(
    userData.username,
  );
  if (existingUser) {
    return reply.code(400).send("User already exists");
  }
  const { password, ...rest } = userData;
  const hashedPassword = await hashPassword(password);

  const newUser = await request.server.db.users.create({
    ...rest,
    password: hashedPassword,
  });

  const response = { id: newUser.id, name: newUser.name };
  return reply.code(200).send(response);
};
