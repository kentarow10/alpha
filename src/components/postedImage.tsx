/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useTheme, Button, TextInput, Avatar } from 'react-native-paper';
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import posted from '../behind/posted';
import { NavigationContext } from '@react-navigation/native';
// import shallowCompare from 'react-addons-shallow-compare';
import { Img } from '../components/Img';
import { Example2 } from '../../training/Sample.jsx';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

type SampleProps = {
  uri: string;
};

class SampleImg extends React.Component<SampleProps> {
  shouldComponentUpdate(nextProps: SampleProps) {
    if (this.props.uri === nextProps.uri) {
      return true;
    } else {
      return true;
    }
  }
  render() {
    console.log('rerender');

    return (
      <Image
        source={{ uri: this.props.uri }}
        resizeMode="contain"
        style={{ flex: 1, backgroundColor: 'black' }}
      />
    );
  }
}

type Props = {
  iconPath?: string;
  handleName?: string;
  accountName?: string;
  uri: string;
};

const PostedImage = React.memo<{ uri: string }>(
  ({ uri }) => {
    console.log('running!');

    return (
      <Image
        source={{ uri: uri }}
        resizeMode="contain"
        style={{ flex: 1, backgroundColor: 'black' }}
      />
    );
  },
  (prevProps, nextProps) => {
    console.log('prevProps.uri');
    console.log(prevProps.uri);
    console.log('nextProps.uri');
    console.log(nextProps.uri);

    return false;
  },
);

export const postedImage = (props: Props) => {
  const styles = StyleSheet.create({
    avatar: {
      marginHorizontal: 10,
      alignSelf: 'center',
    },
    owner: {
      // flex: 0.7,
      flexDirection: 'row',
      height: 75,
    },
    names: {
      padding: 16,
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
            uri:
              'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
          }}
          size={50}
          style={styles.avatar}
        />
        <View style={styles.names}>
          <Text style={{ fontWeight: '400', fontSize: 20 }}>
            ハンドルネーム
          </Text>
          <Text
            style={{
              fontWeight: '300',
              fontSize: 12,
              marginTop: 5,
              margintLeft: 15,
              color: 'gray',
            }}
          >
            account name
          </Text>
        </View>
      </View>
      <View style={{ height: WIDTH, width: WIDTH }}>
        <Example2 uri={URL} />
      </View>
    </>
  );
};
