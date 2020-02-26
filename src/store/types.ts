// 画面に対応するデータ
// storeで管理する方
// 機能ごと、それぞれのディレクトリに定義する

// カタチとして持っておきたい
// firebaseと対応する

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
  fromLinks: Comb[]; //Firebase上ではprimitiveでないものは、docを保存する
  toLinks: Comb[];
  comments: Comment[];
};

export type Comb = {
  doc?: string;
  postDoc: string;
  ansDoc: string;
  path: string;
  thm: string;
  body: string;
  ans: Ans;
};

export type Comment = {
  doc?: string;
  ansDoc: string;
  userName: string;
  content: string;
  numGood: number;
};
