import React, { useState, useContext } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { createContainer } from 'unstated-next';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({});

const initialData = {};

const useSignup = (initialState = initialData) => {
  const [signup, setSignup] = useState(initialState);

  return { signup, setSignup };
};

export const SignupC = createContainer(useSignup);

const SignupDisplay = () => {
  const signup = SignupC.useContainer();

  return <View></View>;
};

export default () => {
  return (
    <SignupC.Provider>
      <SignupDisplay />
    </SignupC.Provider>
  );
};
