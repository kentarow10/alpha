/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTheme,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
} from 'react-native-paper';
import { View, Button as Bt } from 'react-native';
import { GetAllMe, asyncGetMyInfo, asyncGetMyCombs } from '../store/me/me';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetUid } from '../store/auth/auth';

const getNice = () => {
  const dispatch = useDispatch();
  const me = useSelector(GetAllMe);
  const uid = useSelector(GetUid);

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}></SafeAreaView>
  );
};

export default getNice;
