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
  ansDoc: string;
  thm: string;
  ans: string;
  fromLinks: Comb[];
  toLinks: Comb[];
};
