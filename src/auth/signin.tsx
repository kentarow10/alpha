import React, { useState, useContext } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { createContainer } from 'unstated-next';

import { AuthC } from './auth';
import { TextInput, Button } from 'react-native-paper';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({});

const initialData = {
  email: 'test@test.com',
  password: 'password',
};

const useSignin = (initialState = initialData) => {
  const [signin, setSignin] = useState(initialState);
  const setEmail = (v: string) => {
    setSignin({ ...signin, email: v });
  };
  const setPassword = (v: string) => {
    setSignin({ ...signin, password: v });
  };

  return { signin, setSignin, setEmail, setPassword };
};

export const SigninC = createContainer(useSignin);

const SigninDisplay = () => {
  const signin = SigninC.useContainer();
  const auth = AuthC.useContainer();

  return (
    <View>
      <TextInput
        // style={styles.field}
        label="メールアドレス"
        mode="outlined"
        value={signin.signin.email}
        onChangeText={signin.setEmail}
      />
      <TextInput
        // style={styles.field}
        label="パスワード"
        mode="outlined"
        value={signin.signin.password}
        onChangeText={signin.setPassword}
        secureTextEntry={true}
      />
      <Button
        onPress={() => {
          auth.emailAuth(signin.signin.email, signin.signin.password);
        }}
        mode="contained"
        // style={styles.btnLogin}
      >
        →
      </Button>
    </View>
  );
};

export default () => {
  return (
    <SigninC.Provider>
      <SigninDisplay />
    </SigninC.Provider>
  );
};
