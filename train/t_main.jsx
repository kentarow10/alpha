import React from 'react';

import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Animated, { Easing } from 'react-native-reanimated';
import {
  TapGestureHandler,
  State,
  TouchableOpacity,
} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    transform: [{ translateY: this.bgY }],
  },
  signinBtn: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
  },
});

const { width, height } = Dimensions.get('window');
const {
  event,
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block,
  eq,
  interpolate,
  Extrapolate,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        set(config.toValue, dest),
      ],
      [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ],
    ),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // we made the block return the updated position
    state.position,
  ]);
}

// class Main extends React.Component {
//   constructor() {
//     super();

//     this.buttonOpacity = new Value(1);

//     this.onStateChage = event([
//       {
//         nativeEvent: state =>
//           block([
//             cond(eq(state, State.END)),
//             set(this.buttonOpacity, runTiming(new Clock(), 1, 0)),
//           ]),
//       },
//     ]);

//     this.wrap = event => {
//       if (event.nativeEvent.state == 5) {
//         console.log('called');
//         console.log(this.buttonOpacity.toString());
//         // this.onStateChage;
//         set(this.buttonOpacity, 0);
//         // set(this.buttonOpacity, runTiming(new Clock(), 1, 0));
//         console.log('called');
//       }
//     };

//     this.buttonY = interpolate(this.buttonOpacity, {
//       inputRange: [0, 1],
//       outputRange: [100, 0],
//       extrapolate: Extrapolate.CLAMP,
//     });

//     this.bgY = interpolate(this.buttonOpacity, {
//       inputRange: [0, 1],
//       outputRange: [-height / 3, 0],
//       extrapolate: Extrapolate.CLAMP,
//     });
//   }

//   // componentDidMount() {
//   //   console.log(this.buttonOpacity);
//   // }

//   render() {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: 'white',
//           justifyContent: 'flex-end',
//         }}
//       >
//         <Animated.View
//           style={{
//             ...StyleSheet.absoluteFill,
//             transform: [{ translateY: this.bgY }],
//           }}
//         >
//           <Image
//             source={require('../assets/aaa.jpg')}
//             style={{ flex: 1, height: null, width: null }}
//           />
//         </Animated.View>
//         <View style={{ height: height / 3 }}>
//           {/* <TapGestureHandler onHandlerStateChange={this.wrap}> */}
//           <TouchableOpacity
//             onPress={() => {
//               set(
//                 this.buttonOpacity,
//                 runTiming(new Clock(), new Value(1), new Value(0)),
//               );
//             }}
//           >
//             <Animated.View
//               style={{
//                 ...styles.signinBtn,
//                 opacity: this.buttonOpacity,
//                 transform: [{ translateY: this.buttonY }],
//               }}
//             >
//               <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
//             </Animated.View>
//           </TouchableOpacity>
//           {/* </TapGestureHandler> */}

//           <Animated.View
//             style={{
//               ...styles.signinBtn,
//               transform: [{ translateY: this.buttonY }],
//             }}
//           >
//             <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
//               SIGN IN WITH FACEBOOK
//             </Text>
//           </Animated.View>
//         </View>
//       </View>
//     );
//   }
// }

import MyNavCreator from './MyNav/mynav_parent';
import { NavigationContainer } from '@react-navigation/native';

const Sample1 = () => {
  return (
    <View style={{ backgroundColor: 'orange', width: 300, height: 300 }}></View>
  );
};
const Sample2 = () => {
  return (
    <View style={{ backgroundColor: 'red', width: 300, height: 300 }}></View>
  );
};
const Sample3 = () => {
  return (
    <View style={{ backgroundColor: 'green', width: 300, height: 300 }}></View>
  );
};

const Main2 = () => {
  const MyNav = MyNavCreator();

  return (
    <NavigationContainer>
      <MyNav.Navigator>
        <MyNav.Screen name="3" component={Sample3} />
        <MyNav.Screen name="sample1" component={Sample1} />
        <MyNav.Screen name="two" component={Sample2} />
      </MyNav.Navigator>
    </NavigationContainer>
  );
};

export default Main2;
