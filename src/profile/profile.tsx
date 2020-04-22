/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTheme,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
} from 'react-native-paper';
import { View, Button as Bt, Image, Text, FlatList } from 'react-native';
import {
  GetAllMe,
  asyncGetMyInfo,
  asyncGetMyPosts,
  asyncGetMyPins,
} from '../store/me/me';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';
import { asyncGetAnss } from '../store/behind/behind';
import { NavigationContext } from '@react-navigation/native';
import { Ftext } from '../components/Ftext';
import { Tegaki } from '../components/Tegaki';
import { asyncGetUserName } from '../store/screenMgr/mgr';
import { GetUid } from '../store/auth/auth';
import { useName } from '../hooks/useName';

const profile = () => {
  const dispatch = useDispatch();
  const me = useSelector(GetAllMe);
  const uid = useSelector(GetUid);
  const myname = useName(uid);
  const navigation = useContext(NavigationContext);

  useEffect(() => {
    dispatch(asyncGetMyInfo(uid));
    // dispatch(asyncGetMyPosts(uid));
    // dispatch(asyncGetMyPins(uid));
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Card>
        <Card.Title
          title={myname}
          subtitle="Card Subtitle"
          left={props => (
            <Avatar.Image size={24} source={{ uri: me.iconPath }} />
          )}
        />
        <Card.Content>
          <Paragraph>{me.siBody}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Bt
            title="投稿する"
            onPress={() => {
              navigation.navigate('POST');
            }}
          />
        </Card.Actions>
      </Card>
      <Ftext text="自分の投稿" />
      <FlatList
        data={me.myPosts}
        // horizontal={true}
        onRefresh={() => {
          dispatch(asyncGetMyPosts(uid));
        }}
        refreshing={me.isFetching}
        renderItem={item => {
          return (
            <View>
              <Image
                source={{ uri: item.item.uri }}
                style={{ width: 150, height: 150 }}
              />
              <Text>{item.item.postBy}</Text>
            </View>
          );
        }}
      />
      <Tegaki text="自分の回答" />
      <FlatList
        data={me.myPins}
        horizontal={true}
        onRefresh={() => {
          dispatch(asyncGetMyPins(uid));
        }}
        refreshing={me.isFetching}
        renderItem={item => {
          return (
            <View>
              <Image
                source={{ uri: item.item.uri }}
                style={{ width: 50, height: 50 }}
              />
              <Text>{item.item.thms[item.item.order - 1]}</Text>
              <Text>{item.item.body}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default profile;
