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

post = async (postId, userId, info) => {
  const userId = getUserId(request, false);

  const posts = await prisma.query.posts(
    {
      where: {
        id: postId,
        OR: [
          {
            published: true,
          },
          {
            author: {
              id: userId,
            },
          },
        ],
      },
    },
    info
  );

  if (posts.length === 0) {
    throw new Error("Post not found");
  }

  return posts[0];
};

posts = ({ first, skip, after, orderBy, query }, info) => {
  const opArgs = {
    first: first,
    skip: skip,
    after: after,
    orderBy: orderBy,
    where: {
      published: true,
    },
  };

  if (query) {
    opArgs.where.OR = [
      {
        title_contains: query,
      },
      {
        body_contains: query,
      },
    ];
  }

  return prisma.query.posts(opArgs, info);
};

myPosts = (userId, { first, skip, after, orderBy, query }, info) => {
  const opArgs = {
    first: first,
    skip: skip,
    after: after,
    orderBy: orderBy,
    where: {
      author: {
        id: userId,
      },
    },
  };

  if (query) {
    opArgs.where.OR = [
      {
        title_contains: query,
      },
      {
        body_contains: query,
      },
    ];
  }

  return prisma.query.posts(opArgs, info);
};
