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

const styles = StyleSheet.create({
    content: {
      flex: 1,
    },
    tabBarStyle:{
        height: 70,
        position: "absolute",
        bottom: 0,
  }
  });

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
}: Props) {
  const [loaded, setLoaded] = React.useState([state.index]);
  const [drawerWidth, setDrawerWidth] = React.useState(() =>
    getDefaultDrawerWidth(Dimensions.get('window'))
  );

  // パンなgesturehandlerDOMのRef
  const drawerGestureRef = React.useRef<PanGestureHandler>(null);

  const { colors } = useTheme();

  // findで先頭取得している？先頭が現在の状態で、それのタイプがdrawerなら開いている、ということ
  const isDrawerOpen = Boolean(state.history.find(it => it.type === 'drawer'));

  //
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

  //
  React.useEffect(() => {
    if (isDrawerOpen) {
      navigation.emit({ type: 'drawerOpen' });
    } else {
      navigation.emit({ type: 'drawerClose' });
    }
  }, [isDrawerOpen, navigation]);

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
          progress: progress,
          state: state,
          navigation: navigation,
          descriptors: descriptors,
        })}
      </DrawerPositionContext.Provider>
    );
  };

  const tabList = state.routes.filter(route=>descriptors[route.key].options.inTab === true)

  const renderContent = () => {
    return (
      <ScreenContainer style={styles.content}>

        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const { unmountOnBlur } = descriptor.options;
          const isFocused = state.index === index;
          console.log(index);
          console.log('isFocused:'+isFocused);

          if (unmountOnBlur && !isFocused) {
            console.log("return 1")
            return null;
          }

          if (lazy && !loaded.includes(index) && !isFocused) {
            // Don't render a screen if we've never navigated to it
            console.log("return 2")
            return null;
          }

          return (
            // <SafeAreaView>
            <ResourceSavingScene
              key={route.key}
              style={[StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }]}
              isVisible={isFocused}
            >
              {/* <SafeAreaView> */}
              {descriptor.render()}
              <View style={[{ flexDirection: 'row', backgroundColor: "blue", borderTopWidth: 2, borderTopColor:"#f0f0f0" }, styles.tabBarStyle]}>
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
                  <View style={{flexDirection: 'row', justifyContent: "center", marginTop: 9}}>
                  <MaterialCommunityIcons
                    name={
                      descriptors[route.key].options.icon != undefined
                        ? descriptors[route.key].options.icon.name
                        : 'account-outline'
                    }
                    color={colors.text}
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
              {/* </SafeAreaView> */}
            </ResourceSavingScene>
            // </SafeAreaView>
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


