import prisma from "../prisma";

createComment = async (userId, data, info) => {
  const postExists = await prisma.exists.Post({
    id: data.post,
    published: true,
  });

  if (!postExists) {
    throw new Error("Unable to find post");
  }

  return await prisma.mutation.createComment(
    {
      data: {
        text: data.text,
        author: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: data.post,
          },
        },
      },
    },
    info
  );
};
deleteComment = async (userId, commentId, info) => {
  const commentExists = await prisma.exists.Comment({
    id: commentId,
    author: {
      id: userId,
    },
  });

  if (!commentExists) {
    throw new Error("Unable to delete comment");
  }

  return prisma.mutation.deleteComment(
    {
      where: {
        id: commentId,
      },
    },
    info
  );
};
updateComment = async (userId, commentId, data, info) => {
  const commentExists = await prisma.exists.Comment({
    id: commentId,
    author: {
      id: userId,
    },
  });

  if (!commentExists) {
    throw new Error("Unable to update comment");
  }

  return prisma.mutation.updateComment(
    {
      where: {
        id: commentId,
      },
      data,
    },
    info
  );
};
comments = ({ first, skip, after, orderBy }, info) => {
  const opArgs = {
    first,
    skip,
    after,
    orderBy,
  };

  return prisma.query.comments(opArgs, info);
};
