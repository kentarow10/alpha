/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTheme,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
  TextInput,
  ToggleButton,
  DefaultTheme,
} from 'react-native-paper';
import {
  View,
  Button as Bt,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  Picker,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';
import {
  asyncGetAnss,
  PostState,
  asyncChooseImage,
  asyncPost,
  done,
  postInit,
} from '../store/behind/behind';
import { GetUid } from '../store/auth/auth';
import { NavigationContext } from '@react-navigation/native';
import { inputThmSwitch as ITS } from '../components/inputThmSwitch';
import { cls } from '../store/screenMgr/mgr';
import { Header } from '../components/header';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const post = () => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    headerBar: {
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 40,
    },
    wrapper: {
      height: 100,
    },
    btns: {
      height: 20,
      marginLeft: 18,
    },
    bt: {
      height: 40,
      width: 40,
      justifyContent: 'center',
      margin: 6,
      marginTop: 12,
      marginRight: 25,
      color: cls.grn,
      backgroundColor: 'white',
      shadowColor: 'green',
      shadowOpacity: 0.4,
      shadowRadius: 4,
      borderColor: 'white',
      borderRadius: 100,
      shadowOffset: {
        height: 2,
      },
    },
    bt1: {
      height: 40,
      marginTop: 12,
      width: 40,
      justifyContent: 'center',
      margin: 6,
      marginRight: 25,
      color: cls.grn,
      backgroundColor: 'white',
      borderColor: 'white',
      borderRadius: 100,
      shadowColor: 'gray',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {
        height: 2,
      },
    },
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5',
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9',
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
    },
  });
  const dispatch = useDispatch();
  const state = useSelector(PostState);
  const uid = useSelector(GetUid);
  const navigation = useContext(NavigationContext);

  const [thm1, setThm1] = useState('');
  const [thm2, setThm2] = useState('');
  const [thm3, setThm3] = useState('');
  const [bbb, setBbb] = useState({ value: '1' });
  const canSubmit = (): boolean => {
    if (state.url === '') {
      return false;
    }
    if (bbb.value === '3') {
      const c1 = thm1 === '';
      const c2 = thm2 === '';
      const c3 = thm3 === '';

      return !(c1 || c2 || c3);
    } else if (bbb.value === '2') {
      const c1 = thm1 === '';
      const c2 = thm2 === '';

      return !(c1 || c2);
    } else {
      const c1 = thm1 === '';

      return !c1;
    }
  };

  const chgColor = (n: number, order: number): '#00A85A' | 'gray' => {
    if (n === order) {
      return '#00A85A';
    } else {
      return 'gray';
    }
  };

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

  const renderInputField = () => {
    if (Number(bbb.value) === 3) {
      return (
        <View
          style={{ flexDirection: 'row', marginTop: 18, paddingHorizontal: 18 }}
        >
          <View style={styles.bt}>
            <Bt
              title={order.toString()}
              onPress={() => {
                increment();
              }}
              color={cls.grn}
            />
          </View>
          {order === 1 ? (
            <View>
              <TextInput
                label="お題１"
                theme={{
                  ...DefaultTheme,
                  colors: { ...DefaultTheme.colors, primary: '#00A85A' },
                }}
                selectionColor="#00A85A"
                mode="flat"
                multiline={true}
                value={thm1}
                onChangeText={setThm1}
                style={{
                  width: 260,
                  borderColor: '#00A85A',
                  paddingHorizontal: 16,
                }}
              />
            </View>
          ) : order === 2 ? (
            <View>
              <TextInput
                label="お題２"
                theme={{
                  ...DefaultTheme,
                  colors: { ...DefaultTheme.colors, primary: '#00A85A' },
                }}
                selectionColor="#00A85A"
                mode="flat"
                multiline={true}
                value={thm2}
                onChangeText={setThm2}
                style={{
                  width: 260,
                  borderColor: '#00A85A',
                  paddingHorizontal: 16,
                }}
              />
            </View>
          ) : (
            <View>
              <TextInput
                theme={{
                  ...DefaultTheme,
                  colors: { ...DefaultTheme.colors, primary: '#00A85A' },
                }}
                selectionColor="#00A85A"
                label="お題３"
                mode="flat"
                multiline={true}
                value={thm3}
                onChangeText={setThm3}
                style={{
                  width: 260,
                  borderColor: '#00A85A',
                  paddingHorizontal: 16,
                }}
              />
            </View>
          )}
        </View>
      );
    } else if (Number(bbb.value) === 2) {
      return (
        <View
          style={{ flexDirection: 'row', marginTop: 18, paddingHorizontal: 18 }}
        >
          <View style={styles.bt}>
            <Bt
              title={order === 3 ? '2' : order.toString()}
              onPress={() => {
                toggle();
              }}
              color={cls.grn}
            />
          </View>
          {order === 1 ? (
            <View>
              <TextInput
                label="お題１"
                theme={{
                  ...DefaultTheme,
                  colors: { ...DefaultTheme.colors, primary: '#00A85A' },
                }}
                selectionColor="#00A85A"
                mode="flat"
                multiline={true}
                value={thm1}
                onChangeText={setThm1}
                style={{
                  width: 260,
                  borderColor: '#00A85A',
                  paddingHorizontal: 16,
                }}
              />
            </View>
          ) : (
            <View>
              <TextInput
                label="お題２"
                theme={{
                  ...DefaultTheme,
                  colors: { ...DefaultTheme.colors, primary: '#00A85A' },
                }}
                selectionColor="#00A85A"
                mode="flat"
                multiline={true}
                value={thm2}
                onChangeText={setThm2}
                style={{
                  width: 260,
                  borderColor: '#00A85A',
                  paddingHorizontal: 16,
                }}
              />
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 18,
            paddingHorizontal: 18,
          }}
        >
          <View style={styles.bt1}>
            <Bt title="1" onPress={() => {}} color={cls.grn} />
          </View>
          <View>
            <TextInput
              label="お題１"
              theme={{
                ...DefaultTheme,
                colors: { ...DefaultTheme.colors, primary: '#00A85A' },
              }}
              selectionColor="#00A85A"
              mode="flat"
              multiline={true}
              value={thm1}
              onChangeText={setThm1}
              style={{
                width: 260,
                borderColor: '#00A85A',
                paddingHorizontal: 16,
              }}
            />
          </View>
        </View>
      );
    }
  };

  const [mock, setMock] = useState(false);
  const scrlRef = useRef(null);

  const _keyboardWillShow = () => {
    setMock(true);
  };

  const _keyboardDidShow = () => {
    if (scrlRef) {
      scrlRef.current.scrollTo({ x: 0, y: 280, animation: true });
    }
  };

  const _keyboardDidHide = () => {
    scrlRef.current.scrollTo({ x: 0, y: 140, animation: true });
    setTimeout(() => {
      setMock(false);
    }, 0);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
    // willHideでバグる
    // Keyboard.addListener('keyboardWillHide', _keyboardWillHide);
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.addListener('keyboardWillShow', _keyboardWillShow);
      //   Keyboard.addListener('keyboardWillHide', _keyboardWillHide);
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setThm1('');
      setThm2('');
      setThm3('');
      setBbb({ value: '1' });
      dispatch(postInit({}));
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (state.isDone) {
      console.log('done');
      navigation.navigate('PROFILE');
    }
  }, [state.isDone]);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Header mode="back" />
      <ScrollView ref={scrlRef}>
        <Card>
          {state.url === '' ? (
            <>
              <View
                style={{
                  width: W,
                  height: W,
                  backgroundColor: '#e5e5e5',
                  padding: 100,
                  justifyContent: 'center',
                }}
              >
                <Button
                  mode="contained"
                  style={{ backgroundColor: '#00A85A' }}
                  onPress={() => {
                    dispatch(asyncChooseImage());
                  }}
                >
                  画像を選択
                </Button>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  dispatch(asyncChooseImage());
                }}
              >
                <Image
                  source={{ uri: state.url }}
                  resizeMode="contain"
                  style={{ width: W, height: W, backgroundColor: 'black' }}
                />
              </TouchableOpacity>
            </>
          )}
        </Card>
        <View
          style={{ flexDirection: 'row', marginTop: 9, paddingHorizontal: 18 }}
        >
          <Text
            style={{
              paddingTop: 8,
              fontSize: 14,
              fontWeight: '400',
              textAlignVertical: 'bottom',
              // fontFamily: 'tegaki',
            }}
          >
            お題の数を選んでください
          </Text>
          <ToggleButton.Row
            style={styles.btns}
            onValueChange={value => setBbb({ value })}
            value={bbb.value}
          >
            <ToggleButton
              icon="numeric-1"
              value="1"
              size={28}
              color={chgColor(1, Number(bbb.value))}
              style={{
                height: 28,
                width: 28,
                marginHorizontal: 7,
                backgroundColor: 'white',
                borderWidth: 0,
              }}
            />
            <ToggleButton
              icon="numeric-2"
              value="2"
              size={28}
              color={chgColor(2, Number(bbb.value))}
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
              size={28}
              color={chgColor(3, Number(bbb.value))}
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
        {renderInputField()}
        <Button
          style={{
            marginTop: 18,
          }}
          labelStyle={{
            color: canSubmit() ? cls.grn : 'gray',
          }}
          disabled={!canSubmit()}
          onPress={() => {
            dispatch(
              asyncPost(
                uid,
                state.url,
                state.width,
                state.height,
                state.imageName,
                thm1,
                thm2,
                thm3,
                Number(bbb.value),
              ),
            );
          }}
        >
          投稿！
        </Button>
        <View style={{ height: 36, backgroundColor: 'white' }}></View>
        {mock ? (
          <View style={{ height: 280, backgroundColor: 'white' }}></View>
        ) : (
          <></>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default post;
