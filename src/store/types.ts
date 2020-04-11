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
    thms: string[];
    order: number;
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
  thms: string[];
  order: number;
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

export type Comment = {
  comDoc: string;
  com: string;
  comBy: string;
  comAt: firebase.firestore.Timestamp;
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
  order: number;
  body: string;
  postedBy?: string;
  ansBy?: string;
  postedAt: firebase.firestore.Timestamp;
  ansAt: firebase.firestore.Timestamp;
};
