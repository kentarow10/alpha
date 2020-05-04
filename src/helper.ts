import { rtdb, db, storage } from '../firebase/firebase';

const formatDate = (date: Date, format: string): string => {
  format = format.replace(/YYYY/, date.getFullYear().toString());
  format = format.replace(/MM/, (date.getMonth() + 1).toString());
  format = format.replace(/DD/, date.getDate().toString());
  format = format.replace(/HH/, ('0' + date.getHours().toString()).slice(-2));
  format = format.replace(/NN/, ('0' + date.getMinutes().toString()).slice(-2));

  return format;
};

export const timeExpress = (time: firebase.firestore.Timestamp): string => {
  const date = time.toDate();
  const format = 'YYYY-MM-DD HH:NN';
  const ex = formatDate(date, format);

  return ex;
};

export const asyncGetUrlFromPath = async (path: string) => {
  const url = await storage.ref(path).getDownloadURL();

  return url;
};

export const asyncGetName = async (uid: string) => {
  const uJson = await rtdb.ref(uid).once('value');

  return uJson.val().name;
};

export const asyncGetUserInfo = async (uid: string) => {
  const user = await db
    .collection('users')
    .doc(uid)
    .get();

  const name: string = user.data().name;
  const path = user.data().iconPath;
  const uri: string = await asyncGetUrlFromPath(path);

  return { name, uri };
};

export const calcHeightRank = (h: number) => {
  if (h <= 650) {
    return 650;
  } else if (650 < h && h <= 700) {
    return 700;
  } else if (700 < h && h <= 750) {
    return 750;
  } else if (750 < h && h <= 800) {
    return 800;
  } else if (800 < h && h <= 850) {
    return 850;
  } else if (850 < h) {
    return 900;
  }
};
