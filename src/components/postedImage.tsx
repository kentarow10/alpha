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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { deletePost } from '../store/sampleAction';
import { useDispatch } from 'react-redux';
import { asyncDeletePost, asyncGetMyPosts } from '../store/me/me';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  iconUri?: string;
  userName?: string;
  accountName?: string;
  uri: string;
  postDoc: string;
  deletable: boolean;
  setDModal: (b: boolean) => void;
  uid: string;
};

export const postedImage = (props: Props) => {
  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    avatar: {
      marginLeft: 24,
      marginHorizontal: 10,
      alignSelf: 'center',
      // backgroundColor: '#DDDDDD',
      // flex: 2,
    },
    owner: {
      // flex: 0.7,
      flexDirection: 'row',
      height: 75,
    },
    names: {
      padding: 16,
      marginTop: 10,
      flex: 8,
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
          size={56}
          style={styles.avatar}
        />
        <View style={styles.names}>
          <Text style={{ fontSize: 20, fontFamily: 'myfont' }}>
            {props.userName}
          </Text>
        </View>
        {props.deletable ? (
          <View
            style={{
              width: 10,
              backgroundColor: 'white',
              flex: 0.8,
              marginTop: 2,
              marginRight: 4,
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 2, marginTop: 2 }}
              onPress={() => {
                props.setDModal(true);
                // dispatch(asyncDeletePost(props.postDoc, props.uid));
                // navigation.navigate('PROFILE');
              }}
            >
              <MaterialCommunityIcons
                name="delete-forever-outline"
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </View>
      <Divider />
      <View style={{ height: WIDTH, width: WIDTH }}>
        <Img uri={URL} />
      </View>
      <Divider />
    </>
  );
};
