import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { State, TapGestureHandler } from 'react-native-gesture-handler';

const {
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
    borderRadius: 50,
  },
});

const runBall = (clock, gestureState) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    duration: 300,
    toValue: new Value(-1),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(eq(gestureState, State.END), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    interpolate(state.position, {
      inputRange: [0, 1],
      outputRange: [0, 200],
      extrapolate: Extrapolate.CLAMP,
    }),
  ]);
};

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.gestureState = new Value(0);
    this._transX = runBall(new Clock(), this.gestureState);
    this._config = {
      duration: 5000,
      toValue: 180,
      easing: Easing.inOut(Easing.ease),
    };
    this._config2 = {
      duration: 500,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };
    this._anim = timing(this._transX, this._config);
    this._anim2 = timing(this._transX, this._config2);
    this._anim3 = event([
      {
        nativeEvent: { state: this.gestureState },
      },
    ]);
  }

  render() {
    return (
      <View style={styles.container}>
        <TapGestureHandler onHandlerStateChange={this._anim3}>
          <Animated.View
            style={[styles.box, { transform: [{ translateX: this._transX }] }]}
          />
        </TapGestureHandler>
      </View>
    );
  }
}
