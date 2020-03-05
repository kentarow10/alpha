// 画面に対応するデータ
// storeで管理する方
// 機能ごと、それぞれのディレクトリに定義する

// カタチとして持っておきたい
// firebaseと対応する

type FireStoreUser = {
  userColl: 'users';
  uid: string;
  iconPath: string;
  siBody: string;
};

type FireStorePost = {
  postColl: 'posts';
  postDoc: string;
  path: string;
  owner: string;
  thms: string[];
  createdAt: Date;
  ansColl: 'answers';
  ansDoc: string;
  uri: string;
  body: string;
  ansBy: string;
  ansAt: Date;
  orderThm: number;
  comColl: 'comments';
  comDoc: string;
  comBody: string;
  commentedAt: Date;
};

export type DetailParams = {
  postedParam: PostedParams;
  commentBody: string;
  commentOwner: string;
  commentedAt: Date;
};

export type PostedParams = {
  postDoc: string;
  path: string;
  owner: string;
  thms: string[];
  createdAt: Date;
  ansDoc: string;
  uri: string;
  body: string;
  ans_by: string;
  ans_at: Date;
  orderThm: number;
};

export type Post = {
  doc?: string;
  path: string;
  thm: string[];
  ownerId: string;
  numNice: number;
  createdAt: Date;
};

export type Ans = {
  doc?: string;
  postDoc: string;
  orderThm: number;
  ownerId: string;
  fromLinks: string[]; //Firebase上ではprimitiveでないものは、docを保存する
  toLinks: string[];
  comments: string[];
};

// export type Comb = {
//   doc?: string;
//   postDoc: string;
//   ansDoc: string;
//   path: string;
//   thm: string;
//   body: string;
//   ans: Ans;
// };

export type Comment = {
  doc?: string;
  ansDoc: string;
  userName: string;
  content: string;
  numGood: number;
};

// me

export type User = {
  uid: string;
  userName: string;
  iconPath?: string;
  siBody: string;
};

export type Nice = {
  postDoc: string;
  uri: string;
  by: string;
};

export type Comb = {
  ansDoc: string;
  postDoc: string;
  uri: string;
  thm: string;
  ans: string;
  postedBy?: string;
  answeredBy?: string;
};

// export type Gotit = {
//   ansDoc: string;
//   postDoc: string;
//   uri: string;
//   thm: string;
//   ans: string;
//   postedBy: string;
//   answeredBy: string;
// };

// export type Linked = {
//   ansDoc: string;
//   postDoc: string;
//   uri: string;
//   thm: string;
//   ans: string;

// }
