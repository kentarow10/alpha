import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
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

export const RootNavigator = () => {
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
            name: 'link-variant',
          },
        }}
      />
      <Drawer.Screen
        name="お知らせ"
        component={MyNices}
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
        }}
      />
      <Drawer.Screen
        name="THANKYOUCARD設定"
        component={green}
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
