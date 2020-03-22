/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useTheme, Button as Btn } from 'react-native-paper';
import { View, Text, Dimensions, StyleSheet, Button } from 'react-native';

type Props = {
  thm: string[];
  order: number;
  setOrder: (num: number) => void;
};

const chgColor = (n: number): 'blue' | 'orange' | 'pink' => {
  if (n === 1) {
    return 'blue';
  } else if (n === 2) {
    return 'orange';
  } else {
    return 'pink';
  }
};

export const thmSwitch = (props: Props) => {
  const styles = StyleSheet.create({
    area: {
      flexDirection: 'row',
    },
    btn_: {
      flex: 1,
      height: 100,
      padding: 10,
    },
    thm_: {
      flex: 7,
      height: 100,
      padding: 15,
    },
    btn: {
      backgroundColor: 'white',
      borderRadius: 30,
      shadowColor: chgColor(props.order),
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowRadius: 15,
      shadowOpacity: 0.2,
    },
    btn1: {
      borderRadius: 30,
    },
    thm: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
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
      <View style={styles.area}>
        <View style={styles.btn_}>
          <View style={styles.btn}>
            <Button
              title={props.order.toString()}
              onPress={() => {
                increment();
              }}
              color={chgColor(props.order)}
            />
          </View>
        </View>
        <View style={styles.thm_}>
          <Text style={styles.thm}>{props.thm[props.order - 1]}</Text>
        </View>
      </View>
    );
  } else if (num === 2) {
    return (
      <View style={styles.area}>
        <View style={styles.btn_}>
          <View style={styles.btn}>
            <Button
              title={props.order.toString()}
              onPress={() => {
                toggle();
              }}
              color={chgColor(props.order)}
            />
          </View>
        </View>
        <View style={styles.thm_}>
          <Text style={styles.thm}>{props.thm[props.order - 1]}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.area}>
        <View style={styles.btn_}>
          <View style={styles.btn1}>
            <Button
              title={props.order.toString()}
              onPress={() => {}}
              color="blue"
            />
          </View>
        </View>
        <View style={styles.thm_}>
          <Text style={styles.thm}>{props.thm[props.order - 1]}</Text>
        </View>
      </View>
    );
  }
};
