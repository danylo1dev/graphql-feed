import getUserId from "../utils/getUserId";
import * as PostService from "../services/post";
import * as UserService from "../services/user";
import * as CommentService from "../services/user";
const Query = {
  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return PostService.myPosts(userId, args, info);
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return await PostService.post(args.id, userId, info);
  },
  posts(parent, args, _, info) {
    return PostService.posts(args, info);
  },
  comments(parent, args, { prisma }, info) {
    return CommentService.comments(args);
  },
  me(parent, args, { request }, info) {
    const userId = getUserId(request);
    return UserService.me(userId);
  },
  users(parent, args, _, info) {
    return UserService.users(args, info);
  },
};

export { Query as default };
