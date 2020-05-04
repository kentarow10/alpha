import React, { useContext } from 'react';
import {
  NavigationNativeContainer,
  NavigationContext,
  NavigationProp,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import myNavCreator from './myNav/navCreator';

import { StackNavigator } from './stack';
import { DrawerContent } from './drawerContent';
import { View } from 'react-native';
import Profile from '../profile/profile';
import MyNices from '../drawer/myNices';
import TimeLine from '../timeline/timeline';
import Posted from '../behind/posted';
import Detail from '../behind/detail';
import Post from '../behind/post';
import { answer } from '../behind/answer';
import flame from '../core/flame';
import { EditProfile } from '../profile/editProfile';
import post from '../behind/post';
import { useDispatch } from 'react-redux';
import { getRootNavigation } from '../store/screenMgr/mgr';

// const Drawer = createDrawerNavigator();
const Drawer = myNavCreator();

const red = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};
const blue = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};
const yellow = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};
const orange = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};
const green = () => {
  return <View style={{ backgroundColor: 'white', flex: 1 }}></View>;
};

export const HomeNavigator = () => {
  const dispatch = useDispatch();
  const rootNavigation: NavigationProp<
    Record<string, object>,
    string,
    any,
    any,
    {}
  > = useContext(NavigationContext);
  dispatch(getRootNavigation({ rootNav: rootNavigation }));

  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="PROFILE"
        component={Profile}
        options={{
          inTab: true,
          icon: {
            name: 'account-outline',
          },
        }}
      />
      <Drawer.Screen
        name="TIMELINE"
        component={TimeLine}
        options={{
          inTab: true,
          icon: {
            name: 'home-outline',
          },
        }}
      />
      <Drawer.Screen
        name="YELLOW"
        component={yellow}
        options={{
          inTab: true,
          icon: {
            name: 'earth',
          },
        }}
      />
      <Drawer.Screen
        name="投稿する"
        component={post}
        options={{
          inNav: true,
          icon: {
            name: 'file-image',
            color: 'orange',
            size: 20,
          },
        }}
      />
      <Drawer.Screen
        name="お知らせ"
        component={red}
        options={{
          inNav: true,
          icon: {
            name: 'information-outline',
            color: 'orange',
            size: 20,
          },
        }}
      />
      <Drawer.Screen
        name="プロフィール編集"
        component={EditProfile}
        options={{
          inNav: true,
          icon: {
            name: 'circle-edit-outline',
            color: 'green',
            size: 20,
          },
          // unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="THANKYOUCARD設定"
        component={blue}
        options={{
          inNav: true,
          icon: {
            name: 'email-outline',
            color: 'green',
            size: 20,
          },
        }}
      />
      <Drawer.Screen
        name="FLAME"
        component={flame}
        options={{
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="POST"
        component={Post}
        options={{
          unmountOnBlur: true,
        }}
      />
    </Drawer.Navigator>
  );
};
