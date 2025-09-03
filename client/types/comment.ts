type Comment = {
  comment: {
    id: string;
    userId: string;
    author: {
      name: string;
      avatarUrl?: string;
    };
    comment: string;
    createdAt: string;
    updatedAt?: string;
  };
  user: string;
};

export default Comment;
