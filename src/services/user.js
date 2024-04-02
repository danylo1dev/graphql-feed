import prisma from "../prisma";
import hashPassword from "../utils/hashPassword";

createUser = async ({ password, ...data }) => {
  const hashedPassword = await hashPassword(password);
  const user = await prisma.mutation.createUser({
    data: {
      data,
      password: hashedPassword,
    },
  });

  return user;
};
deleteUser = async (userId, info) => {
  return await prisma.mutation.deleteUser(
    {
      where: {
        id: userId,
      },
    },
    info
  );
};
updateUser = async ({ password, userId, ...data }, info) => {
  if (typeof password === "string") {
    password = await hashPassword(password);
  }

  return prisma.mutation.updateUser(
    {
      where: {
        id: userId,
      },
      password,
      data,
    },
    info
  );
};
