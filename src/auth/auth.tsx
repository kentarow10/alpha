import React, { useState, useContext, createContext, useEffect } from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { createContainer } from 'unstated-next';
import { NavigationContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
// import components
import firebase from '../../firebase/firebase';
import SignInScreen from './signin';
import SignUpScreen from './signup';
import ResetPassword from './resetpass';
import { RootNavigator } from '../home/home';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({});

const initialData = {
  isLoading: true,
  isAuthed: false,
};

const useAuth = (initialState = initialData) => {
  const [auth, setAuth] = useState(initialState);
  const navigation = useContext(NavigationContext);
  const initializeDatabase = (uid: string) => {
    // DBの作成先を出力
    console.log(FileSystem.documentDirectory + 'SQLite/');
    console.log(uid);
    const db = SQLite.openDatabase('alpha_app');

    db.transaction(
      tx => {
        tx.executeSql(
          'create table if not exists users (id integer primary key not null, uid text, username text, iconPath text);',
          null,
          () => {
            console.log('success');
          },
          () => {
            console.log('fail');

            return true;
          },
        );

        tx.executeSql(
          'create table if not exists anss (id integer primary key not null, uid text, postId text, ansId text);',
          null,
          () => {
            console.log('success');
          },
          () => {
            console.log('fail');

            return true;
          },
        );

        tx.executeSql(
          'select * from users where uid = (?)',
          [uid],
          (_, resultSet) => {
            if (resultSet.rows.length === 0) {
              tx.executeSql(
                'insert into users (uid) values (?)',
                [uid],
                () => {
                  console.log('success');
                },
                e => {
                  console.log('fail');
                  console.log(e);

                  return true;
                },
              );
            } else {
              console.log('exists');
            }
          },
        );
      },
      () => {
        console.log('fail all');
      },
      () => {
        console.log('success');
      },
    );
  };
  const setAuthed = (b: string) => {
    let bool = false;
    if (b == 'true') {
      bool = true;
      setAuth({ ...auth, isLoading: false, isAuthed: bool });
    } else {
      setAuth({ ...auth, isLoading: false, isAuthed: bool });
    }
  };
  const emailAuth = (email: string, pass: string) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(response => {
        async () => {
          try {
            await AsyncStorage.setItem('isLogin', 'true');
          } catch (e) {
            console.log(e);
          }
        };
        const user = firebase.auth().currentUser;
        let uid: string;
        if (user != null) {
          uid = user.uid;
          initializeDatabase(uid);
        }
        setAuthed('true');
      })
      .catch(error => {
        alert(error.message);
      });
  };

  return { auth, setAuth, navigation, setAuthed, emailAuth };
};

export const AuthC = createContainer(useAuth);

const SplashScreen = () => (
  <View style={{ backgroundColor: 'red', height: HEIGHT }}></View>
);

const AuthDisplay = () => {
  const auth = AuthC.useContainer();
  const Stack = createStackNavigator();
  useEffect(() => {
    const bootstrapAsync = async () => {
      let isLogin = 'false';

      try {
        isLogin = await AsyncStorage.getItem('isLogin');
        auth.setAuthed(isLogin);
      } catch (e) {
        auth.setAuthed(isLogin);
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <Stack.Navigator headerMode="none">
      {auth.auth.isLoading ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : auth.auth.isAuthed === false ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      ) : (
        <Stack.Screen name="Home" component={RootNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default () => {
  return (
    <AuthC.Provider>
      <AuthDisplay />
    </AuthC.Provider>
  );
};
