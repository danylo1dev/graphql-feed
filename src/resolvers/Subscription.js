const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find((post) => post.id == postId && post.published);
      if (!post) {
        throw new Error("post not found");
      }
      return pubsub.asyncIterator(`comment-for-${postId}`);
    },
  },
};

export { Subscription as default };
