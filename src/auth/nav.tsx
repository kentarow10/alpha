/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useContext, createContext, useEffect } from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';

import { GetAuth, asyncAutoLogin } from '../store/auth/auth';
import firebase from '../../firebase/firebase';
import SignInScreen from './signin';
import SignUpScreen from './signup';
// import ResetPassword from './resetpass';
import { RootNavigator } from '../home/home';
import Sample from '../../training/Sample';

const HEIGHT = Dimensions.get('window').height;

const SplashScreen = () => {
  const state = useSelector(GetAuth);
  console.log(state);

  return <View style={{ backgroundColor: 'red', height: HEIGHT }}></View>;
};

const authNav = () => {
  const Stack = createStackNavigator();
  const dispatch = useDispatch();
  const state = useSelector(GetAuth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      setLoading(true);
      await Font.loadAsync({
        myfont: require('../../assets/fonts/logotypejp_mp_b_1.1.ttf'),
        tegaki: require('../../assets/fonts/851MkPOP_002.ttf'),
      });
    };
    loadFonts();
    setLoading(false);
  }, []);

  return (
    <Stack.Navigator headerMode="none">
      {state.isFetching || loading ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : state.uid === '' ? (
        <>
          {/* <Stack.Screen name="sample" component={Sample} /> */}
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          {/* <Stack.Screen name="ResetPassword" component={ResetPassword} /> */}
        </>
      ) : (
        <Stack.Screen name="Home" component={RootNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default authNav;
