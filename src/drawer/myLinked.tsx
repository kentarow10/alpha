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
  asyncGetMyNicePosts,
  asyncGetMyGotitAnss,
  asyncGetMyLinkedAnss,
} from '../store/me/me';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetUid } from '../store/auth/auth';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const getLinked = () => {
  const dispatch = useDispatch();
  const me = useSelector(GetAllMe);
  const uid = useSelector(GetUid);

  useEffect(() => {
    dispatch(asyncGetMyLinkedAnss(uid));
    console.log(me);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', height: HEIGHT }}>
      <FlatList
        data={me.myLinkedCombs}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        renderItem={item => (
          <View>
            <Text>{item.item}</Text>
            <Text>{item.item}</Text>
          </View>
        )}
      />
      <Text>aaaaaaaa</Text>
    </SafeAreaView>
  );
};

export default getLinked;
