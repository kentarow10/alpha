import * as React from 'react';
import {
  createNavigatorFactory,
  useNavigationBuilder,
  DefaultNavigatorOptions,
  DrawerNavigationState,
  DrawerRouterOptions,
  DrawerRouter,
} from '@react-navigation/native';

import DrawerView from './NavView';
import {
  DrawerNavigationOptions,
  DrawerNavigationConfig,
  DrawerNavigationEventMap,
} from '@react-navigation/drawer/src/types';
import { MyDrawerNavigationOptions } from './types';

type Props = DefaultNavigatorOptions<MyDrawerNavigationOptions> &
  DrawerRouterOptions &
  DrawerNavigationConfig;

function DrawerNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    DrawerNavigationState,
    DrawerRouterOptions,
    MyDrawerNavigationOptions,
    DrawerNavigationEventMap
  >(DrawerRouter, {
    initialRouteName,
    backBehavior,
    children,
    screenOptions,
  });

  // console.log(state);
  // console.log(descriptors);
  // console.log(navigation);
  // console.log(children);

  return (
    <DrawerView
      {...rest}
      state={state}
      descriptors={descriptors}
      navigation={navigation}
    />
  );
}

const MyNavCreator = createNavigatorFactory<
  MyDrawerNavigationOptions,
  typeof DrawerNavigator
>(DrawerNavigator);

// const MyNav = MyNavCreator();

export default MyNavCreator;
