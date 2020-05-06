import * as React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  I18nManager,
  Platform,
  ScaledSize,
  BackHandler,
  NativeEventSubscription,
  SafeAreaView,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { ScreenContainer } from 'react-native-screens';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import {
  PanGestureHandler,
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {
  DrawerNavigationState,
  DrawerActions,
  useTheme,
  TabActions,
} from '@react-navigation/native';

import DrawerGestureContext from '@react-navigation/drawer/src/utils/DrawerGestureContext';
import SafeAreaProviderCompat from '@react-navigation/drawer/src/views/SafeAreaProviderCompat';
import ResourceSavingScene from '@react-navigation/drawer/src/views/ResourceSavingScene';
import DrawerContent from '@react-navigation/drawer/src/views/DrawerContent';
import Drawer from '@react-navigation/drawer/src/views/Drawer';
import {
  DrawerDescriptorMap,
  DrawerNavigationConfig,
  DrawerNavigationHelpers,
  DrawerContentComponentProps,
} from '../types';
import DrawerPositionContext from '@react-navigation/drawer/src/utils/DrawerPositionContext';
import { Appbar, Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { mypinModeOff, getNavState } from '../../../store/screenMgr/mgr';

type Props = DrawerNavigationConfig & {
  state: DrawerNavigationState;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

const { width, height } = Dimensions.get('window');

// DrawerWidthを判断
const getDefaultDrawerWidth = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  /*
   * Default drawer width is screen width - header height
   * with a max width of 280 on mobile and 320 on tablet
   * https://material.io/guidelines/patterns/navigation-drawer.html
   */
  const smallerAxisSize = Math.min(height, width);
  const isLandscape = width > height;
  const isTablet = smallerAxisSize >= 600;
  const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
  const maxWidth = isTablet ? 320 : 280;

  return Math.min(smallerAxisSize - appBarHeight, maxWidth);
};

// const GestureHandlerWrapper = GestureHandlerRootView ?? View;
// 多分gesturehandlerを囲む時に使いたい
const GestureHandlerWrapper = GestureHandlerRootView;



/**
 * 本体
 */
export default function DrawerView({
  state,
  navigation,
  descriptors,
  lazy = true,
  drawerContent = (props: DrawerContentComponentProps) => (
    <DrawerContent {...props} />
  ),
  drawerPosition = I18nManager.isRTL ? 'right' : 'left',
  keyboardDismissMode = 'on-drag',
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  drawerType = 'front',
  hideStatusBar = false,
  statusBarAnimation = 'slide',
  drawerContentOptions,
  drawerStyle,
  edgeWidth,
  gestureHandlerProps,
  minSwipeDistance,
  sceneContainerStyle,
  mypinsMode,
}: Props) {
  const [loaded, setLoaded] = React.useState([state.index]);
  const [drawerWidth, setDrawerWidth] = React.useState(() =>
    getDefaultDrawerWidth(Dimensions.get('window'))
  );

  // パンなgesturehandlerDOMのRef
  const drawerGestureRef = React.useRef<PanGestureHandler>(null);

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    content: {
      flex: 1,
    },
    tabBarStyle:{
        height: 56,
        position: "absolute",
        bottom: 0,
        backgroundColor: colors.background,
        // backgroundColor: "white",
  }
  });

  // findで先頭取得している？先頭が現在の状態で、それのタイプがdrawerなら開いている、ということ
  const isDrawerOpen = Boolean(state.history.find(it => it.type === 'drawer'));

  const dispatch = useDispatch();

  const handleDrawerOpen = React.useCallback(() => {
    navigation.dispatch({
      ...DrawerActions.openDrawer(),
      target: state.key,
    });
  }, [navigation, state.key]);

  const handleDrawerClose = React.useCallback(() => {
    navigation.dispatch({
      ...DrawerActions.closeDrawer(),
      target: state.key,
    });
  }, [navigation, state.key]);

  // 画面が変わるたびグローバルなnavStateを更新
  // React.useEffect(() => {
  //   dispatch(getNavState({navState: state}))
  // }, [state.index]);

  React.useEffect(() => {
    if (isDrawerOpen) {
      navigation.emit({ type: 'drawerOpen' });
    } else {
      dispatch(mypinModeOff({}));
      // console.log('kokokokokokokokokokokokokokokoko')
      navigation.emit({ type: 'drawerClose' });
    }
  }, [isDrawerOpen, navigation, state]);

  React.useEffect(() => {
    let subscription: NativeEventSubscription | undefined;

    if (isDrawerOpen) {
      // We only add the subscription when drawer opens
      // This way we can make sure that the subscription is added as late as possible
      // This will make sure that our handler will run first when back button is pressed
      subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleDrawerClose();

        return true;
      });
    }

    return () => subscription?.remove();
  }, [handleDrawerClose, isDrawerOpen, navigation, state.key]);

  const prevCountRef = React.useRef(null);
  React.useEffect(()=>{
    console.log("DOMが更新され,depsの変更を検知したら")
    prevCountRef.current = state.index;
  }, [state.index])
  console.log("ここは当然renderの最中")
  const prevStateKey = prevCountRef.current;
  console.log(prevStateKey)

  React.useEffect(() => {
    const updateWidth = ({ window }: { window: ScaledSize }) => {
      setDrawerWidth(getDefaultDrawerWidth(window));
    };

    Dimensions.addEventListener('change', updateWidth);

    return () => Dimensions.removeEventListener('change', updateWidth);
  }, []);

  if (!loaded.includes(state.index)) {
    setLoaded([...loaded, state.index]);
  }

  const renderNavigationView = ({ progress }: any) => {
    return (
      <DrawerPositionContext.Provider value={drawerPosition}>
        {drawerContent({
          ...drawerContentOptions,
          mypinsMode: mypinsMode,
          progress: progress,
          state: state,
          navigation: navigation,
          descriptors: descriptors,
        })}
      </DrawerPositionContext.Provider>
    );
  };


  const tabList = state.routes.filter(route=>descriptors[route.key].options.inTab === true)
  // console.log(tabList);
  // const focusColor = (): "#DBDBDB"|"#ABE7FF" => {

  // }

  const renderContent = () => {
    return (
      <ScreenContainer style={styles.content}>

        {state.routes.map((route, index) => {
          // console.log('aaaaaaaaaaaaaaaa!!!!!')
          // console.log({route})
          // console.log({index})
          // console.log(state.index)

          // console.log(index);
          // console.log("route.key");
          // console.log(route.key);
          const descriptor = descriptors[route.key];
          // console.log("descriptor");
          // console.log(descriptor)
          const { unmountOnBlur } = descriptor.options;
          // console.log("unmountOnBlur")
          // console.log(unmountOnBlur)
          const isFocused = state.index === index;
          // console.log('isFocused:'+isFocused);
          // if(!descriptor.options.inNav){
            console.log('nav以外')
          console.log({index})
          if (unmountOnBlur && !isFocused && !(state.index === 6) && !(state.index === 8)) {
            console.log("return 1")

            return null;
          }

          if (lazy && !loaded.includes(index) && !isFocused) {
            // Don't render a screen if we've never navigated to it
            console.log("return 2")

            return null;
          }
          // }



          return (
            <ResourceSavingScene
              key={route.key}
              style={[StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }]}
              isVisible={isFocused}
            >

              {descriptor.render()}

              <View style={[{ flexDirection: 'row', borderWidth: 0.2, borderColor: "#EEEEEE" }, styles.tabBarStyle]}>
              {tabList.map(route => (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => {
                  //   const event = navigation.emit({
                  //     type: 'tabPress',
                  //     target: route.key,
                  //     data: {
                  //       isAlreadyFocused: route.key === state.routes[state.index].key,
                  //     },
                  //   });

                  //   if (!event.defaultPrevented) {
                      navigation.dispatch({
                        ...DrawerActions.jumpTo(route.name),
                        target: state.key,
                      });
                  //   }
                  }}
                  style={{ flex: 1, width: width/tabList.length }}
                >
                  <View style={{flexDirection: 'row', justifyContent: "center", marginTop: 9, height: 30}}>
                  <MaterialCommunityIcons
                    name={
                      descriptors[route.key].options.icon != undefined
                        ? descriptors[route.key].options.icon.name
                        : 'account-outline'
                    }
                    color={"#00A85A"}
                    // color={colors.text}
                    size={
                      descriptors[route.key].options.icon.size != undefined
                        ? descriptors[route.key].options.icon.size
                        : 30
                    }
                  />
                  </View>
                </TouchableOpacity>
              ))}
              </View>
            </ResourceSavingScene>
          );
        })}
      </ScreenContainer>
    );
  };

  const activeKey = state.routes[state.index].key;
  const { gestureEnabled } = descriptors[activeKey].options;

  return (
    <GestureHandlerWrapper style={styles.content}>
      <SafeAreaProviderCompat>
        <DrawerGestureContext.Provider value={drawerGestureRef}>
          <Drawer
            open={isDrawerOpen}
            gestureEnabled={gestureEnabled}
            onOpen={handleDrawerOpen}
            onClose={handleDrawerClose}
            onGestureRef={ref => {
              // @ts-ignore
              drawerGestureRef.current = ref;
            }}
            gestureHandlerProps={gestureHandlerProps}
            drawerType={drawerType}
            drawerPosition={drawerPosition}
            sceneContainerStyle={[
              { backgroundColor: colors.background },
              sceneContainerStyle,
            ]}
            drawerStyle={[
              { width: drawerWidth, backgroundColor: colors.card },
              drawerStyle,
            ]}
            overlayStyle={{ backgroundColor: overlayColor }}
            swipeEdgeWidth={edgeWidth}
            swipeDistanceThreshold={minSwipeDistance}
            hideStatusBar={hideStatusBar}
            statusBarAnimation={statusBarAnimation}
            renderDrawerContent={renderNavigationView}
            renderSceneContent={renderContent}
            keyboardDismissMode={keyboardDismissMode}
            drawerPostion={drawerPosition}
          />
        </DrawerGestureContext.Provider>
      </SafeAreaProviderCompat>
    </GestureHandlerWrapper>
  );
}


