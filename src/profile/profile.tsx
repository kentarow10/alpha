/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTheme,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
} from 'react-native-paper';
import { View, Button as Bt, Image, Text } from 'react-native';
import { GetAllMe, asyncGetMyInfo, asyncGetMyCombs } from '../store/me/me';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import { asyncGetAnss } from '../store/behind/behind';
import { NavigationContext } from '@react-navigation/native';

const profile = () => {
  const dispatch = useDispatch();
  const me = useSelector(GetAllMe);
  const navigation = useContext(NavigationContext);
  const user = firebase.auth().currentUser;
  let uid = '';
  if (user != null) {
    uid = user.uid;
  }

  useEffect(() => {
    dispatch(asyncGetMyInfo(uid));
    dispatch(asyncGetMyCombs(uid));
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Card>
        <Card.Title
          title={me.userName}
          subtitle="Card Subtitle"
          left={props => (
            <Avatar.Image size={24} source={{ uri: me.iconPath }} />
          )}
        />
        <Card.Content>
          <Title>{me.userName}</Title>
          <Paragraph>{me.siBody}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Card.Actions>
          <Button
            onPress={() => {
              navigation.navigate('POST');
            }}
          >
            投稿する
          </Button>
        </Card.Actions>
      </Card>
      <FlatList
        data={me.myCombs}
        // data={[1, 2, 3, 4]}
        renderItem={item => {
          return (
            <View>
              <Image
                source={{ uri: item.item.uri }}
                style={{ width: 50, height: 50 }}
              />
              <Text>{item.item.thms[item.item.orderThm - 1]}</Text>
              <Text>{item.item.body}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default profile;
