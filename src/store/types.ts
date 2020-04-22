export type Post = {
  postDoc: string;
  path?: string;
  uri?: string;
  width: number;
  height: number;
  thms: string[];
  poster?: string;
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
  poster?: string;
  postBy: string;
  postAt: firebase.firestore.Timestamp;
  answer?: string;
  ansBy: string;
  ansAt: firebase.firestore.Timestamp;
  numNice?: number;
};

export type Comment = Pin & {
  comDoc: string;
  com: string;
  commenter?: string;
  comBy: string;
  comAt: firebase.firestore.Timestamp;
};

export type NicePost = Post & {
  flag?: boolean;
  nicer?: string;
  niceBy: string;
  niceAt: firebase.firestore.Timestamp;
};

export type GotitPin = Pin & {
  flag?: boolean;
  gotter?: string;
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
    poster?: string;
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
    poster?: string;
    answer?: string;
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
