/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  useTheme,
  Button,
  TextInput,
  Avatar,
  Divider,
} from 'react-native-paper';
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import posted from '../behind/posted';
import { NavigationContext } from '@react-navigation/native';
// import shallowCompare from 'react-addons-shallow-compare';
import { Img } from '../components/Img';
import { Example2 } from '../../training/Sample.jsx';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  iconUri?: string;
  userName?: string;
  accountName?: string;
  uri: string;
};

export const postedImage = (props: Props) => {
  const styles = StyleSheet.create({
    avatar: {
      marginLeft: 24,
      marginHorizontal: 10,
      alignSelf: 'center',
      backgroundColor: '#DDDDDD',
    },
    owner: {
      // flex: 0.7,
      flexDirection: 'row',
      height: 75,
    },
    names: {
      padding: 16,
      marginTop: 10,
    },
    text: {
      marginTop: 4,
      color: 'white',
      // fontFamily: 'MyFont',
      fontSize: 12,
      textAlign: 'right',
    },
  });
  const navigation = useContext(NavigationContext);

  const URL = useMemo(() => {
    return props.uri;
  }, [props.uri]);

  return (
    <>
      <View style={styles.owner}>
        <Avatar.Image
          source={{
            uri: props.iconUri,
          }}
          size={50}
          style={styles.avatar}
        />
        <View style={styles.names}>
          <Text style={{ fontSize: 20, fontFamily: 'myfont' }}>
            {props.userName}
          </Text>
        </View>
      </View>
      <Divider />
      <View style={{ height: WIDTH, width: WIDTH }}>
        <Img uri={URL} />
      </View>
      <Divider />
    </>
  );
};
