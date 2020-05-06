/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {
  useTheme,
  Button as Btn,
  Divider,
  ToggleButton,
} from 'react-native-paper';
import { View, Text, Dimensions, StyleSheet, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import posted from '../behind/posted';
import { timeExpress } from '../helper';

type Props = {
  thm: string[];
  order: number;
  postAt: firebase.firestore.Timestamp;
  numNice: number;
  setOrder: (num: number) => void;
  setModal?: (show: boolean) => void;
  inAns?: boolean;
};

const chgColor = (n: number, order: number): '#00A85A' | 'gray' => {
  if (n === order) {
    return '#00A85A';
  } else {
    return 'gray';
  }
};

export const thmSwitch = (props: Props) => {
  const styles = StyleSheet.create({
    area: {
      paddingVertical: 20,
      paddingHorizontal: 40,
    },
    upper: {
      // flexDirection: 'row',
      padding: 3,
      // alignItems: 'flex-end',
    },
    secondRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // alignItems: 'stretch',
      height: 30,
      padding: 1,
    },
    btn_: {
      flex: 1,
      height: 80,
      padding: 10,
      flexDirection: 'column',
    },
    thm_: {
      flex: 7,
      height: 80,
      padding: 15,
    },
    btns: {
      height: 20,
    },
    btn: {
      backgroundColor: 'white',
      marginTop: 10,
      borderRadius: 10,
      // shadowColor: chgColor(props.order),
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 8,
      shadowOpacity: 0.2,
    },
    btn1: {
      borderRadius: 30,
    },
    odai: {
      marginTop: 4,
      fontSize: 16,
      fontWeight: '300',
      textAlign: 'center',
      // color: chgColor(props.order),
    },
    thm: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  const num = props.thm.length;

  if (num === 3) {
    return (
      <>
        <View style={styles.upper}>
          <Text style={{ color: 'gray', textAlign: 'right', fontSize: 12 }}>
            {timeExpress(props.postAt)}
          </Text>
          {/* <Text>{props.numNice}人の良いね</Text> */}
        </View>
        <Divider />
        <View style={styles.secondRow}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontWeight: '500',
                // color: 'gray',
                marginLeft: 10,
                marginRight: 10,
                marginTop: 8,
              }}
            >
              お題
            </Text>
            <ToggleButton.Row
              style={styles.btns}
              onValueChange={value => {
                if (value === null) {
                  console.log(value);
                } else {
                  props.setOrder(Number(value));
                }
              }}
              value={props.order.toString()}
            >
              <ToggleButton
                icon="numeric-1"
                value="1"
                size={22}
                color={chgColor(1, props.order)}
                style={{
                  height: 28,
                  width: 28,
                  backgroundColor: 'white',
                  marginHorizontal: 7,
                  borderWidth: 0,
                }}
              />
              <ToggleButton
                icon="numeric-2"
                value="2"
                size={22}
                color={chgColor(2, props.order)}
                style={{
                  height: 28,
                  width: 28,
                  marginHorizontal: 7,
                  backgroundColor: 'white',
                  borderWidth: 0,
                }}
              />
              <ToggleButton
                icon="numeric-3"
                value="3"
                size={22}
                color={chgColor(3, props.order)}
                style={{
                  height: 28,
                  width: 28,
                  marginHorizontal: 7,
                  backgroundColor: 'white',
                  borderWidth: 0,
                }}
              />
            </ToggleButton.Row>
          </View>
          {props.inAns ? (
            <></>
          ) : props.numNice === 0 ? (
            <></>
          ) : (
            <TouchableOpacity
              onPress={() => {
                props.setModal(true);
              }}
            >
              <Text
                style={{
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: 12,
                  color: 'gray',
                  marginTop: 6,
                  marginRight: 12,
                }}
              >
                {props.numNice}人がいいねと言っています
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Divider />
        <View style={styles.area}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            {props.thm[props.order - 1]}
          </Text>
        </View>
      </>
    );
  } else if (num === 2) {
    return (
      <>
        <View style={styles.upper}>
          <Text style={{ color: 'gray', textAlign: 'right', fontSize: 12 }}>
            {timeExpress(props.postAt)}
          </Text>
          {/* <Text>{props.numNice}人の良いね</Text> */}
        </View>
        <Divider />
        <View style={styles.secondRow}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontWeight: '500',
                // color: 'gray',
                marginLeft: 10,
                marginRight: 10,
                marginTop: 8,
              }}
            >
              お題
            </Text>
            <ToggleButton.Row
              style={styles.btns}
              onValueChange={value => {
                if (value === null) {
                  console.log(value);
                } else {
                  props.setOrder(Number(value));
                }
              }}
              value={props.order.toString()}
            >
              <ToggleButton
                icon="numeric-1"
                value="1"
                size={22}
                color={chgColor(1, props.order)}
                style={{
                  height: 28,
                  width: 28,
                  backgroundColor: 'white',
                  marginHorizontal: 7,
                  borderWidth: 0,
                }}
              />
              <ToggleButton
                icon="numeric-2"
                value="2"
                size={22}
                color={chgColor(2, props.order)}
                style={{
                  height: 28,
                  width: 28,
                  marginHorizontal: 7,
                  backgroundColor: 'white',
                  borderWidth: 0,
                }}
              />
            </ToggleButton.Row>
          </View>
          {props.inAns ? (
            <></>
          ) : props.numNice === 0 ? (
            <></>
          ) : (
            <TouchableOpacity
              onPress={() => {
                props.setModal(true);
              }}
            >
              <Text
                style={{
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: 12,
                  color: 'gray',
                  marginTop: 6,
                  marginRight: 12,
                }}
              >
                {props.numNice}人がいいねと言っています
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Divider />
        <View style={styles.area}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            {props.thm[props.order - 1]}
          </Text>
        </View>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.upper}>
          <Text style={{ color: 'gray', textAlign: 'right', fontSize: 12 }}>
            {timeExpress(props.postAt)}
          </Text>
          {/* <Text>{props.numNice}人の良いね</Text> */}
        </View>
        <Divider />
        <View style={styles.secondRow}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontWeight: '500',
                // color: 'gray',
                marginLeft: 10,
                marginRight: 10,
                marginTop: 8,
              }}
            >
              お題
            </Text>
            <ToggleButton.Row
              style={styles.btns}
              onValueChange={value => {
                if (value === null) {
                  console.log(value);
                } else {
                  props.setOrder(Number(value));
                }
              }}
              value={props.order.toString()}
            >
              <ToggleButton
                icon="numeric-1"
                value="1"
                size={22}
                color={chgColor(1, props.order)}
                style={{
                  height: 28,
                  width: 28,
                  backgroundColor: 'white',
                  marginHorizontal: 7,
                  borderWidth: 0,
                }}
              />
            </ToggleButton.Row>
          </View>
          {props.inAns ? (
            <></>
          ) : props.numNice === 0 ? (
            <></>
          ) : (
            <TouchableOpacity
              onPress={() => {
                props.setModal(true);
              }}
            >
              <Text
                style={{
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: 12,
                  color: 'gray',
                  marginTop: 6,
                  marginRight: 12,
                }}
              >
                {props.numNice}人がいいねと言っています
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Divider />
        <View style={styles.area}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            {props.thm[props.order - 1]}
          </Text>
        </View>
      </>
    );
  }
};
