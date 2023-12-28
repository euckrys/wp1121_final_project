export type User = {
  id: string;
  isCoach: boolean;
  username: string;
  email: string;
  provider: "github" | "credentials";
  avartarUrl: string;
  hasProfile: boolean;
};


export type UserInfo = {
  isCoach: boolean,
  displayName: string,
  sportType: string,
  age: string,
  height: string,
  weight: string,
  place?: string,
  license?: string,
  availableTime?: Array<boolean>,
  appointment?: Array<string>,
};

export type Coach = {
  userId: string,
  isCoach: boolean,
  displayName: string,
  avatarUrl: string,
  sportType: string,
  age: string,
  height: string,
  weight: string,
  place?: string,
  license?: string,
  availableTime?: Array<boolean>,
  appointment?: Array<string>,
};

export type PostWithReplies = {
  id: string,
  postId: string,
  authorId: string,
  author: string,
  sportType: string,
  description: string,
  updatedAt: Date,
  replies: {
    author: string;
    id: number;
    content: string;
    authorId: string;
    toPostId: string;
    createdAt: Date;
  }[];
};


export type Reply = {
  toPostId: string,
  authorId: string,
  author: string,
  content: string,
}
