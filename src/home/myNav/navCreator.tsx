import * as React from 'react';
import {
  createNavigatorFactory,
  useNavigationBuilder,
  DefaultNavigatorOptions,
  DrawerNavigationState,
  DrawerRouterOptions,
  DrawerRouter,
} from '@react-navigation/native';

import DrawerView from './view/tabAndDrawer';
import {
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

export default MyNavCreator;
