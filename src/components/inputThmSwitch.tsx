/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useTheme, Button, TextInput } from 'react-native-paper';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

type Props = {
  numThm: number;
  thm1: string;
  thm2: string;
  thm3: string;
  setThm1: (text: string) => void;
  setThm2: (text: string) => void;
  setThm3: (text: string) => void;
};

export const inputThmSwitch = (props: Props) => {
  const [order, setOrder] = useState(1);
  const increment = () => {
    if (order === 3) {
      setOrder(1);
    } else {
      const next = order + 1;
      setOrder(next);
    }
  };
  const toggle = () => {
    if (order === 1) {
      setOrder(2);
    } else {
      setOrder(1);
    }
  };

  if (props.numThm === 3) {
    return (
      <View>
        <Button
          onPress={() => {
            increment();
          }}
        >
          {order}
        </Button>
        {order === 1 ? (
          <View>
            <TextInput
              label="お題１"
              mode="outlined"
              value={props.thm1}
              onChangeText={props.setThm1}
            />
          </View>
        ) : order === 2 ? (
          <View>
            <TextInput
              label="お題２"
              mode="outlined"
              value={props.thm2}
              onChangeText={props.setThm2}
            />
          </View>
        ) : (
          <View>
            <TextInput
              label="お題３"
              mode="outlined"
              value={props.thm3}
              onChangeText={props.setThm3}
            />
          </View>
        )}
      </View>
    );
  } else if (props.numThm === 2) {
    return (
      <View>
        <Button
          onPress={() => {
            toggle();
          }}
        >
          {order === 3 ? 2 : order}
        </Button>
        {order === 1 ? (
          <View>
            <TextInput
              label="お題１"
              mode="outlined"
              value={props.thm1}
              onChangeText={props.setThm1}
            />
          </View>
        ) : (
          <View>
            <TextInput
              label="お題２"
              mode="outlined"
              value={props.thm2}
              onChangeText={props.setThm2}
            />
          </View>
        )}
      </View>
    );
  } else {
    return (
      <View>
        <Button>1</Button>
        <View>
          <TextInput
            label="お題１"
            mode="outlined"
            value={props.thm1}
            onChangeText={props.setThm1}
          />
        </View>
      </View>
    );
  }
};
