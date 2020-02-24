/* eslint-disable no-undef */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { State, PanGestureHandler } from 'react-native-gesture-handler';

const {
  add,
  cond,
  eq,
  set,
  neq,
  and,
  Value,
  event,
  Clock,
  startClock,
  stopClock,
  timing,
  block,
  interpolate,
  Extrapolate,
} = Animated;
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: height,
    // width: width,
    justifyContent: 'center',
    backgroundColor: 'orange',
    padding: 8,
    // zIndex: -1,
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'purple',
    borderRadius: 50,
  },
});

export default class Example extends React.Component {
  constructor() {
    super();
    this._transX = new Value(0);
    this._transY = new Value(0);
    this._panHandler = Animated.event(
      [{ nativeEvent: { x: this._transX, y: this._transY } }],
      {
        useNativeDriver: true,
      },
    );
  }

  render() {
    return (
      <PanGestureHandler onGestureEvent={this._panHandler}>
        <Animated.View style={styles.container}>
          <Animated.View
            style={[
              styles.box,
              {
                transform: [
                  {
                    translateX: this._transX,
                    translateY: this._transY,
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
