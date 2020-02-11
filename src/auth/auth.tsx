import React, { useState, useContext, createContext, useEffect } from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { createContainer } from 'unstated-next';
import { NavigationContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from '../../firebase/firebase';
// import components
import SignInScreen from './signin';
import SignUpScreen from './signup';
import ResetPassword from './resetpass';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({});

const initialData = {
  isLoading: true,
  isAuthed: false,
  email: 'test@test.com',
  password: 'password',
};

const useAuth = (initialState = initialData) => {
  const [auth, setAuth] = useState(initialState);
  const navigation = useContext(NavigationContext);
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
        const user = firebase.auth().currentUser;
        let uid: string;
        if (user != null) {
          uid = user.uid;
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

const SplashScreen = () => <View style={{ backgroundColor: 'red' }}></View>;
const HomeScreen = () => <View style={{ backgroundColor: 'blue' }}></View>;

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
    <Stack.Navigator>
      {auth.auth.isLoading ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : auth.auth.isAuthed === false ? (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'Sign in',
            }}
          />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
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
