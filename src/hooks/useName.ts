import { useState, useEffect } from 'react';
import { asyncGetName } from '../helper';

export const useName = (uid: string) => {
  const [name, setName] = useState('');
  useEffect(() => {
    const getName = async userId => {
      const nm = await asyncGetName(userId);
      setName(nm);
    };
    getName(uid);
  }, []);

  return name;
};
