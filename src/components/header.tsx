/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext } from 'react';
import * as Font from 'expo-font';
import { useTheme, Button, TextInput, Avatar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  Platform,
  Button as Bt,
} from 'react-native';
import posted from '../behind/posted';
import { NavigationContext } from '@react-navigation/native';
import { cls } from '../store/screenMgr/mgr';
import { useSelector } from 'react-redux';
import { GetAllMe } from '../store/me/me';
import { TouchableOpacity } from 'react-native-gesture-handler';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

type Props = {
  mode: 'back' | 'me';
};

export const Header = (props: Props) => {
  const navigation = useContext(NavigationContext);
  const me = useSelector(GetAllMe);
  const showBackBtn =
    Platform.OS === 'ios' && props.mode === 'back' ? true : false;

  const styles = StyleSheet.create({
    headerBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      paddingTop: 10,
      height: 50,
    },
    btn: {
      width: 32,
      height: 28,
      // marginTop: 4,
      paddingTop: 1,
      marginHorizontal: 4,
      // backgroundColor: '#ccc',
      borderColor: '#DDDDDD',
      borderWidth: 0.4,
      borderRadius: 440,
      justifyContent: 'center',
      alignItems: 'center',
      // shadowColor: 'black',
      // shadowOffset: {
      //   width: 1,
      //   height: 6,
      // },
      // shadowRadius: 2,
      // shadowOpacity: 1,
    },
  });

  return (
    <>
      <View style={styles.headerBar}>
        <View style={{ marginLeft: 16, width: 64 }}>
          {showBackBtn ? (
            <>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <AntDesign name="back" size={20} color={cls.grn} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.toggleDrawer();
                  }}
                >
                  <Avatar.Image size={30} source={{ uri: me.iconPath }} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <View>
          <Text
            style={{
              // marginTop: 3,
              color: '#00A85A',
              fontSize: 26,
              textAlign: 'center',
              fontFamily: 'myfont',
            }}
          >
            グラピィ
          </Text>
        </View>
        <View style={{ marginRight: 12, width: 64 }}></View>
      </View>
    </>
  );
};
