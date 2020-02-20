/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Animated, { Easing, State } from 'react-native-reanimated';

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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'purple',
    borderRadius: 5,
  },
});

export default class Example extends React.Component {
  constructor() {
    super();
    this._transX = new Value(0);
    this._transY = new Value(0);
    this.offsetX = new Value(0);
    this.offsetY = new Value(0);
  }

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={event([
            {
              nativeEvent: ({ translationX: x, translationY: y, state }) =>
                block([
                  set(this._transX, add(x, offsetX)),
                  set(this._transY, add(y, offsetY)),
                  cond(eq(state, State.END), [
                    set(this.offsetX, add(this.offsetX, x)),
                    set(this.offsetY, add(this.offsetY, y)),
                  ]),
                ]),
            },
          ])}
        >
          <Animated.View
            style={
              (styles.box,
              {
                transform: [
                  { translateX: this._transX, translateY: this._transY },
                ],
              })
            }
          />
        </PanGestureHandler>
      </View>
    );
  }
}
