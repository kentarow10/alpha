/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useContext, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Font from 'expo-font';
import {
  useTheme,
  Button,
  Avatar,
  FAB,
  Portal,
  Provider,
  Divider,
  Modal,
} from 'react-native-paper';
import {
  View,
  Button as Bt,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  NavigationContext,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { PostedParams, NavigationParamList } from '../store/types';
import { postedImage as PostedImage } from '../components/postedImage';
import { Header } from '../components/header';
import Posted from './posted';
import { Answer } from './answer';
import { Detail } from './detail';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const useNav = () => {
  const [navState, setNavState] = useState('POSTED');
  const goAnswer = (): void => {
    setNavState('ANSWER');
  };
  const goDetail = (): void => {
    setNavState('DETAIL');
  };
  const goPosted = (): void => {
    setNavState('POSTED');
  };

  return [navState, goAnswer, goDetail, goPosted];
};

const flame = () => {
  const navigation = useContext(NavigationContext);
  const route = useRoute<RouteProp<NavigationParamList, 'FLAME'>>();
  const prm = route.params;
  const [showModal, setModal] = useState(false);
  const scrl = useRef(null);
  const [close, setClose] = useState(false);
  const [navState, setNavState] = useState('POSTED');
  const goAnswer = (): void => {
    setNavState('ANSWER');
  };
  const goDetail = (): void => {
    setNavState('DETAIL');
  };
  const goPosted = (): void => {
    setNavState('POSTED');
  };
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <React.Fragment>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      > */}
      <SafeAreaView style={{ height: HEIGHT }}>
        <Header mode="back" />
        <Divider />
        {/* <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 0.5 }}
          keyboardVerticalOffset={800}
        > */}
        <ScrollView
          ref={scrl}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              console.log('closing...');
              setClose(true);
            } else {
              setClose(false);
            }
          }}
          scrollEventThrottle={400}
        >
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white' }}>
              <PostedImage uri={prm.uri} />
              {navState === 'POSTED' ? (
                <Posted
                  postDoc={prm.postDoc}
                  uri={prm.uri}
                  width={prm.width}
                  height={prm.height}
                  owner={prm.owner}
                  thms={prm.thms}
                  createdAt={prm.postedAt}
                  close={close}
                  setModal={setModal}
                  goAnswer={goAnswer}
                  goDetail={goDetail}
                />
              ) : navState === 'ANSWER' ? (
                <Answer scrlRef={scrl} goPosted={goPosted} />
              ) : (
                <Detail scrlRef={scrl} goPosted={goPosted} />
              )}
            </View>
            <View style={{ height: 37 }}></View>
          </View>

          <Provider>
            <Portal>
              <Modal
                visible={showModal}
                onDismiss={() => {
                  setModal(false);
                }}
              >
                <View
                  style={{ height: 300, width: 300, backgroundColor: 'red' }}
                >
                  <Text>Example Modal</Text>
                </View>
              </Modal>
            </Portal>
          </Provider>
        </ScrollView>
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
      {/* </KeyboardAvoidingView> */}
    </React.Fragment>
  );
};

export default flame;
