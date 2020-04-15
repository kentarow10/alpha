/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext } from 'react';
import * as Font from 'expo-font';
import { useTheme, Button, TextInput, Avatar } from 'react-native-paper';
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
import { asyncGetFont, cls } from '../store/screenMgr/mgr';
import { useSelector } from 'react-redux';
import { GetAllMe } from '../store/me/me';

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
      height: 40,
    },
    btn: {
      width: 64,
      marginHorizontal: 4,
    },
  });
  useEffect(() => {
    // asyncGetFont();
  }, []);

  return (
    <>
      <View style={styles.headerBar}>
        <View style={{ marginLeft: 12, width: 64 }}>
          {showBackBtn ? (
            <>
              <Button
                // icon="arrow-left"
                style={styles.btn}
                labelStyle={{ color: cls.grn, marginHorizontal: 2 }}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                もどる
              </Button>
            </>
          ) : (
            <>
              <View>
                <Avatar.Image size={30} source={{ uri: me.iconPath }} />
              </View>
            </>
          )}
        </View>
        <View>
          <Text
            style={{
              marginTop: 3,
              color: '#00A85A',
              fontSize: 22,
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
