import { extractFragmentReplacements } from "prisma-binding";
import Mutation from "./Mutation";
import Subscription from "./Subscription";
import User from "./User";

const resolvers = {
  Mutation,
  Subscription,
  User,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
