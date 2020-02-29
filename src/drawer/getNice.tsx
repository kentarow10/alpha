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
import { View, Button as Bt, FlatList, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import {
  GetAllMe,
  asyncGetMyInfo,
  asyncGetMyCombs,
  asyncGetMyNicePosts,
} from '../store/me/me';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetUid } from '../store/auth/auth';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const getNice = () => {
  const dispatch = useDispatch();
  const me = useSelector(GetAllMe);
  const uid = useSelector(GetUid);

  useEffect(() => {
    dispatch(asyncGetMyNicePosts(uid));
    console.log(me);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', height: HEIGHT }}>
      <FlatList
        data={me.myNicePosts}
        // data={profilekai.profilekai.nodes}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        renderItem={item => (
          <View>
            <Text>{item.item.path}</Text>
            <Text>{item.item.by}</Text>
          </View>
        )}
      />
      <Text>aaaaaaaa</Text>
    </SafeAreaView>
  );
};

export default getNice;
