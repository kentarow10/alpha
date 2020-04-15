import { useState, useEffect } from 'react';
import { rtdb } from '../../firebase/firebase';

const asyncGetUserName = async (uid: string) => {
  const uJson = await rtdb.ref(uid).once('value');

  return uJson.val().name;
};

export const useName = (uid: string) => {
  const [name, setName] = useState('');
  useEffect(() => {
    const getName = async userId => {
      const nm = await asyncGetUserName(userId);
      setName(nm);
    };
    getName(uid);
  }, []);

  return name;
};
