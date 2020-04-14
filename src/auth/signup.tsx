/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useReducer,
} from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { GetAuth, createUser } from '../store/auth/auth';
import firebase from '../../firebase/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';

const signup = () => {
  const dispatch = useDispatch();
  //   const state = useSelector(GetAuth);
  const [signup, setSignup] = useState({
    email: 'test@test.com',
    pass: 'password',
    userName: 'テストユーザー',
    accountName: 'account_name',
  });
  const setEmail = (v: string) => {
    setSignup({ ...signup, email: v });
  };
  const setPass = (v: string) => {
    setSignup({ ...signup, pass: v });
  };
  const setName = (v: string) => {
    setSignup({ ...signup, userName: v });
  };
  const setAcName = (v: string) => {
    setSignup({ ...signup, accountName: v });
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
      <TextInput
        // style={styles.field}
        label="ニックネーム"
        mode="outlined"
        value={signup.userName}
        onChangeText={setName}
      />
      <TextInput
        // style={styles.field}
        label="アカウントネーム"
        mode="outlined"
        value={signup.accountName}
        onChangeText={setAcName}
      />
      <Button
        onPress={() => {
          dispatch(
            createUser(
              signup.email,
              signup.pass,
              signup.userName,
              signup.accountName,
            ),
          );
        }}
        mode="contained"
        // style={styles.btnLogin}
      >
        →
      </Button>
    </SafeAreaView>
  );
};

export default signup;
