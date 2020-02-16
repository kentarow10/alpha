import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import { NavigationContainer,useNavigationBuilder,
  TabRouter,
  DrawerRouter,
  TabActions,
  DrawerActions,
  createNavigatorFactory, } from '@react-navigation/native';
  import { createDrawerNavigator } from '@react-navigation/drawer';

const red: React.FC = () =>{
  return(
    <View style={{backgroundColor: "red", flex: 1}}>

    </View>
  )
}
const blue: React.FC = () =>{
  return(
    <View style={{backgroundColor: "blue", height: 300, width: 300}}>

    </View>
  )
}
const black: React.FC = () =>{
  return(
    <View style={{backgroundColor: "black", height: 300, width: 300}}>

    </View>
  )
}

function TabNavigator({
  initialRouteName,
  children,
  screenOptions,
  tabBarStyle,
  contentStyle,
}) {
  const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });
  console.log(TabRouter)
  console.log(children)
  console.log(screenOptions)
  console.log(initialRouteName)
  console.log(state)
  console.log(navigation)
  console.log(descriptors)

  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 1}}>
      <View style={[{ flex: 1 },]}>
        <Button title="draw" onPress={()=>{

        }} />

      </View>
      <View style={[{ flex: 9 }, contentStyle]}>
        {descriptors[state.routes[state.index].key].render()}
      </View>
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
            style={{ flex: 1, backgroundColor: "yellow" }}
          >
            <Text>{descriptors[route.key].options.title || route.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </SafeAreaView>
    </React.Fragment>
  );
}

const createMyTab = createNavigatorFactory(TabNavigator);

const MyTab = createMyTab();

export default function App() {
  return (
    <NavigationContainer>
      <MyTab.Navigator >
        <MyTab.Screen
        name="red"
        component={red} />
        <MyTab.Screen
        name="blue"
        component={blue} />
        <MyTab.Screen
        name="black"
        component={black} />
      </MyTab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
