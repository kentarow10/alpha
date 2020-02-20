import React from 'react';
import { View, SafeAreaView, Animated } from 'react-native';
import {
  TapGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler';
import Ball from './Ball.jsx';

const train1: React.FC = () => {
  return (
    <React.Fragment>
      <Animated.View
        style={{
          backgroundColor: 'red',
          height: 100,
          width: 300,
        }}
      ></Animated.View>
      <Ball />
    </React.Fragment>
  );
};

export default train1;
