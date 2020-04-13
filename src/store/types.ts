export type Post = {
  postDoc: string;
  path?: string;
  uri?: string;
  width: number;
  height: number;
  thms: string[];
  postBy: string;
  postAt: firebase.firestore.Timestamp;
  numNice?: number;
  niceByList?: string[];
};

export type Pin = {
  postDoc: string;
  ansDoc: string;
  uri: string;
  width: number;
  height: number;
  thms: string[];
  order: number;
  body: string;
  postBy: string;
  postAt: firebase.firestore.Timestamp;
  ansBy: string;
  ansAt: firebase.firestore.Timestamp;
  numNice?: number;
};

export type Comment = Pin & {
  comDoc: string;
  com: string;
  comBy: string;
  comAt: firebase.firestore.Timestamp;
};

export type NicePost = Post & {
  niceBy: string;
  niceAt: firebase.firestore.Timestamp;
};

export type GotitPin = Pin & {
  gotitBy: string;
  gotitAt: firebase.firestore.Timestamp;
};

export type LinkPin = Pin & {
  linkAt: firebase.firestore.Timestamp;
  parentAnsDoc?: string;
};

export type NavigationParamList = {
  FLAME: {
    postDoc: string;
    uri: string;
    width: number;
    height: number;
    postBy: string;
    thms: string[];
    postAt: firebase.firestore.Timestamp;
    toDetail: boolean;
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
    postBy: string;
    ansBy: string;
    postAt: firebase.firestore.Timestamp;
    ansAt: firebase.firestore.Timestamp;
  };
};

// me

export type User = {
  uid: string;
  userName: string;
  iconPath?: string;
  siBody: string;
};
