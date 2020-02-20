import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from 'react-native';
import {
  NavigationContainer,
  useNavigationBuilder,
  TabRouter,
  DrawerRouter,
  TabActions,
  DrawerActions,
  createNavigatorFactory,
} from '@react-navigation/native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

function MyNavigator({
  initialRouteName,
  children,
  screenOptions,
  tabBarStyle,
  contentStyle,
}) {
  const { state, navigation, descriptors } = useNavigationBuilder(
    DrawerRouter,
    {
      children,
      screenOptions,
      initialRouteName,
    },
  );
  const renderDrawer = () => {
    return (
      <View>
        <Text>I am in the drawer!</Text>
      </View>
    );
  };
  console.log(DrawerRouter);
  console.log(children);
  console.log(screenOptions);
  console.log(initialRouteName);
  console.log(state);
  console.log(navigation);
  console.log(descriptors);

  return (
    <React.Fragment>
      <SafeAreaView style={{ flex: 1 }}>
        <DrawerLayout
          drawerWidth={300}
          drawerType="front"
          drawerBackgroundColor="#ddd"
          //   drawercontentをもらう
          renderNavigationView={renderDrawer}
        >
          {/* ヘッダー */}
          <View style={[{ flex: 1 }]}>
            <Button
              title="draw"
              onPress={() => {
                openDrawer();
              }}
            />
          </View>

          {/* 中身 */}
          <View style={[{ flex: 9 }, contentStyle]}>
            <View>{descriptors[state.routes[state.index].key].render()}</View>
          </View>

          {/* フッター */}
          <View style={[{ flex: 0.8, flexDirection: 'row' }, tabBarStyle]}>
            {state.routes.map(route => (
              <TouchableOpacity
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                  });
                  if (!event.defaultPrevented) {
                    navigation.dispatch({
                      ...TabActions.jumpTo(route.name),
                      target: state.key,
                    });
                  }
                }}
                style={{ flex: 1, backgroundColor: 'yellow' }}
              >
                <Text>
                  {descriptors[route.key].options.title || route.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </DrawerLayout>
      </SafeAreaView>
    </React.Fragment>
  );
}

const createMyNav = createNavigatorFactory(MyNavigator);

export default createMyNav;
