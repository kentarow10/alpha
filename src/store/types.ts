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

export type NavigationParamList = {
  POSTED: {
    postDoc: string;
    uri: string;
    owner: string;
    thms: string[];
    createdAt: Date;
  };
  DETAIL: {
    postedParam: PostedParams;
    commentBody: string;
    commentOwner: string;
    commentedAt: Date;
  };
};

export type DetailParams = {
  postedParam: PostedParams;
  commentBody: string;
  commentOwner: string;
  commentedAt: Date;
};

export type PostedParams = {
  postDoc: string;
  uri: string;
  owner: string;
  thms: string[];
  createdAt: Date;
};

export type Post = {
  doc?: string;
  path: string;
  uri?: string;
  thm: string[];
  ownerId: string;
  numNice: number;
  createdAt: Date;
};

export type Ans = {
  ansDoc?: string;
  postDoc?: string;
  uri?: string;
  body: string;
  ansBy: string;
  ansAt: Date;
  orderThm: number;
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
