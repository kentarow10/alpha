import React, { useState, useContext } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { createContainer } from 'unstated-next';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({});

const initialData = {};

const useResetpass = (initialState = initialData) => {
  const [resetpass, setResetpass] = useState(initialState);

  return { resetpass, setResetpass };
};

export const ResetpassC = createContainer(useResetpass);

const ResetpassDisplay = () => {
  const resetpass = ResetpassC.useContainer();

  return <View></View>;
};

export default () => {
  return (
    <ResetpassC.Provider>
      <ResetpassDisplay />
    </ResetpassC.Provider>
  );
};
