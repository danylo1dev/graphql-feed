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

me = (userId) => {
  return prisma.query.user({
    where: {
      id: userId,
    },
  });
};
users = ({ first, skip, after, orderBy, query }, info) => {
  const opArgs = {
    first,
    skip,
    after,
    orderBy,
  };

  if (query) {
    opArgs.where = {
      OR: [
        {
          name_contains: query,
        },
      ],
    };
  }

  return prisma.query.users(opArgs, info);
};
