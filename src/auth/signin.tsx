/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useContext, createContext, useEffect } from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { GetAuth, login } from '../store/auth/auth';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';

const signin = () => {
  const dispatch = useDispatch();
  //   const state = useSelector(GetAuth);
  const [signup, setSignup] = useState({
    email: '',
    pass: '',
  });
  const setEmail = (v: string) => {
    setSignup({ ...signup, email: v });
  };
  const setPass = (v: string) => {
    setSignup({ ...signup, pass: v });
  };

  return (
    <SafeAreaView>
      <TextInput
        // style={styles.field}
        label="メールアドレス"
        mode="outlined"
        value={signup.email}
        onChangeText={setEmail}
      />
      <TextInput
        // style={styles.field}
        label="パスワード"
        mode="outlined"
        value={signup.pass}
        onChangeText={setPass}
        secureTextEntry={true}
      />
      <Button
        onPress={() => {
          dispatch(login(signup.email, signup.pass));
        }}
        mode="contained"
        // style={styles.btnLogin}
      >
        →
      </Button>
    </SafeAreaView>
  );
};

export default signin;
