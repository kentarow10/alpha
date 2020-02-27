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

const profile = () => {
  const dispatch = useDispatch();
  const me = useSelector(GetAllMe);
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
          left={props => <Avatar.Image size={24} source={me.iconPath} />}
        />
        <Card.Content>
          <Title>{me.userName}</Title>
          <Paragraph>{me.siBody}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
};

export default profile;
