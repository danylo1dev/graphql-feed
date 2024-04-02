import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import * as UserService from "../services/user";
import * as PostService from "../services/post";
import * as CommentService from "../services/comment";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const user = await UserService.createUser({ ...args.data });

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login");
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return UserService.deleteUser(userId, info);
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return UserService.updateUser({ userId, ...args.data }, info);
  },

  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return PostService.createPost(userId, args.data, info);
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return PostService.deletePost(userId, args.id, info);
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return PostService.updatePost(userId, args.id, args.data, info);
  },

  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return await CommentService.createComment(userId, args.data, info);
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return await CommentService.deleteComment(userId, args.id, info);
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return await CommentService.updateComment(userId, args.id, args.data, info);
  },
};

export { Mutation as default };
