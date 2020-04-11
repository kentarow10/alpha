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
  createdAt: firebase.firestore.Timestamp;
  ansColl: 'answers';
  ansDoc: string;
  uri: string;
  body: string;
  ansBy: string;
  ansAt: firebase.firestore.Timestamp;
  orderThm: number;
  comColl: 'comments';
  comDoc: string;
  comBody: string;
  commentedAt: firebase.firestore.Timestamp;
};

export type NavigationParamList = {
  FLAME: {
    postDoc: string;
    uri: string;
    width: number;
    height: number;
    owner: string;
    thms: string[];
    postedAt: firebase.firestore.Timestamp;
  };
  DETAIL: {
    postDoc: string;
    ansDoc: string;
    uri: string;
    width: number;
    height: number;
    thm: string;
    body: string;
    numNice: number;
    postedBy: string;
    ansBy: string;
    postedAt: firebase.firestore.Timestamp;
    ansAt: firebase.firestore.Timestamp;
  };
  // ANSWER: {
  //   postDoc: string;
  //   postBy: string;
  //   postAt: firebase.firestore.Timestamp;
  //   uri: string;
  //   width: number;
  //   height: number;
  //   thms: string[];
  // };
};

export type DetailParams = {
  postDoc: string;
  ansDoc: string;
  uri: string;
  width: number;
  height: number;
  thm: string;
  body: string;
  numNice: number;
  postedBy: string;
  ansBy: string;
  postedAt: firebase.firestore.Timestamp;
  ansAt: firebase.firestore.Timestamp;
};

export type PostedParams = {
  postDoc: string;
  uri: string;
  owner: string;
  width: number;
  height: number;
  numNice: number;
  niceByList: string[];
  thms: string[];
  createdAt: firebase.firestore.Timestamp;
};

export type Post = {
  postDoc?: string;
  path?: string;
  uri?: string;
  width?: number;
  height?: number;
  thms: string[];
  owner: string;
  numNice?: number;
  postedAt: Date;
};

export type Ans = {
  ansDoc?: string;
  postDoc?: string;
  uri?: string;
  body: string;
  ansBy: string;
  ansAt: firebase.firestore.Timestamp;
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
  comDoc: string;
  com: string;
  comBy: string;
  comAt: Date;
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

export type Pin = {
  ansDoc: string;
  postDoc: string;
  uri: string;
  thms: string[];
  orderThm: number;
  body: string;
  postedBy?: string;
  ansBy?: string;
  postedAt: firebase.firestore.Timestamp;
  ansAt: firebase.firestore.Timestamp;
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
