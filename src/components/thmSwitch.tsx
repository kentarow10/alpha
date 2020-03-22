/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useTheme, Button } from 'react-native-paper';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

type Props = {
  thm: string[];
  order: number;
  setOrder: (num: number) => void;
};

export const thmSwitch = (props: Props) => {
  const num = props.thm.length;
  const increment = () => {
    if (props.order === 3) {
      props.setOrder(1);
    } else {
      const next = props.order + 1;
      props.setOrder(next);
    }
  };
  const toggle = () => {
    if (props.order === 2) {
      props.setOrder(1);
    } else {
      props.setOrder(2);
    }
  };

  if (num === 3) {
    return (
      <View>
        <Button
          onPress={() => {
            increment();
          }}
        >
          {props.order}
        </Button>
        <Text>{props.thm[props.order - 1]}</Text>
      </View>
    );
  } else if (num === 2) {
    return (
      <View>
        <Button
          onPress={() => {
            toggle();
          }}
        >
          {props.order}
        </Button>
        <Text>{props.thm[props.order - 1]}</Text>
      </View>
    );
  } else {
    return (
      <View>
        <Button>{props.order}</Button>
        <Text>{props.thm[props.order - 1]}</Text>
      </View>
    );
  }
};
