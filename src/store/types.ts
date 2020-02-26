// 画面に対応するデータ

export type Profile = {
  isLoading: boolean;
  isError: boolean;
  userName: string;
  iconPath?: string;
  siBody: string;
  myCombs: Comb[];
  myPosts: Post[];
};

// カタチとして持っておきたい
// firebaseと対応する？

export type User = {
  doc?: string;
  uid: string;
  userName: string;
  iconPath?: string;
  siBody: string;
};

export type Post = {
  doc?: string;
  path: string;
  thm: string[];
  ownerId: string;
  numNice: number;
  createdAt: string;
};

export type Ans = {
  doc?: string;
  postDoc: string;
  orderThm: number;
  ownerId: string;
  fromLinks: Comb[];
  toLinks: Comb[];
};

export type Comb = {
  doc?: string;
  postDoc: string;
  ansDoc: string;
  path: string;
  thm: string;
  ans: string;
  fromLinks: Comb[];
  toLinks: Comb[];
};
