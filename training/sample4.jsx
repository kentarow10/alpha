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

const { width, height } = Dimensions.get('window');

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

const circleRadius = 30;
export default class Circle extends React.Component {
  _touchX = new Animated.Value(width / 2 - circleRadius);
  _onPanGestureEvent = Animated.event([{ nativeEvent: { x: this._touchX } }], {
    useNativeDriver: true,
  });
  render() {
    return (
      <PanGestureHandler onGestureEvent={this._onPanGestureEvent}>
        <Animated.View
          style={{
            height: 150,
            justifyContent: 'center',
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: '#42a5f5',
                borderRadius: circleRadius,
                height: circleRadius * 2,
                width: circleRadius * 2,
              },
              {
                transform: [
                  {
                    translateX: Animated.add(
                      this._touchX,
                      new Animated.Value(0),
                      //   new Animated.Value(-circleRadius),
                    ),
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
