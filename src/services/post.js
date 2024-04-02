import prisma from "../prisma";

createPost = async (userId, { title, body, published }, info) => {
  return await prisma.mutation.createPost(
    {
      data: {
        title: title,
        body: body,
        published: published,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    },
    info
  );
};
deletePost = async (userId, postId, info) => {
  const postExists = await prisma.exists.Post({
    id: postId,
    author: {
      id: userId,
    },
  });

  if (!postExists) {
    throw new Error("Unable to delete post");
  }

  return prisma.mutation.deletePost(
    {
      where: {
        id: postId,
      },
    },
    info
  );
};
updatePost = async (userId, postId, data, info) => {
  const userId = getUserId(request);
  const postExists = await prisma.exists.Post({
    id: postId,
    author: {
      id: userId,
    },
  });
  const isPublished = await prisma.exists.Post({
    id: postId,
    published: true,
  });

  if (!postExists) {
    throw new Error("Unable to update post");
  }

  if (isPublished && data.published === false) {
    await prisma.mutation.deleteManyComments({
      where: { post: { id: postId } },
    });
  }

  return prisma.mutation.updatePost(
    {
      where: {
        id: postId,
      },
      data,
    },
    info
  );
};
