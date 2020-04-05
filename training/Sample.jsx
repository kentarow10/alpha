import { StyleSheet, View, Text, SafeAreaView, Image } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { State, TapGestureHandler } from 'react-native-gesture-handler';

import React, { useState, useMemo } from 'react';
import { Button, Card } from 'react-native-paper';
import Example from './sample1';
import _ from 'lodash';

const App = () => {
  const [state, setState] = useState({
    app: 0,
    child: 0,
  });

  const countUpApp = () => {
    setState(s => ({
      app: s.app + 1,
      child: s.child,
    }));
  };

  const countUpChild = () => {
    setState(s => ({
      app: s.app,
      child: s.child + 1,
    }));
  };

  const alertChildState = () => {
    alert(state.child);
  };

  console.log('render App');

  return (
    <SafeAreaView>
      <View>
        <Button
          mode="outlined"
          onPress={() => {
            countUpChild();
          }}
        >
          count up child
        </Button>
        <Button
          onPress={() => {
            countUpApp();
          }}
        >
          aaa
        </Button>
        <Text>App: {state.app}</Text>
        <Example2 value={state.child} uri="https://picsum.photos/700" />
      </View>
    </SafeAreaView>
  );
};

// shouldComponentUpdate(nextProps, nextState) {
//     const propsDiff = _.isEqual(nextProps, this.props);
//     const stateDiff = _.isEqual(nextState, this.state);
//     return !(propsDiff && stateDiff);
//   }

export class Example2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps);
    console.log('nextProps');
    console.log(nextState);
    console.log('nextState');

    const propsDiff = _.isEqual(nextProps, this.props);
    const stateDiff = _.isEqual(nextState, this.state);

    return false;
  }

  render() {
    console.log('running!!!!!!');
    console.log(this.props.uri);

    return (
      <View style={{ height: 600, width: 400, backgroundColor: 'red' }}>
        <Image
          source={{ uri: this.props.uri }}
          resizeMode="contain"
          style={{ flex: 1 }}
        />
        {/* <Card>
          <Card.Cover source={{ uri: this.props.uri }} resizeMode="contain" />
          <Card.Cover
            source={{ uri: 'https://i.picsum.photos/id/1082/700/700.jpg' }}
          />
        </Card> */}
      </View>
    );
  }
}

// const MyComponent = props => {
//   console.log('running');

//   return (
//     <View style={{ height: 30, width: 3000, backgroundColor: 'red' }}>
//       <Text>Child: {props.value}</Text>
//     </View>
//   );
// };
// const areEqual = (prevProps, nextProps) => {
//   // prevProps === nextProps
//   return false;
// };
// const Example3 = React.memo(MyComponent, areEqual);

export default App;
