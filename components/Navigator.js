import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import HomeScreen from '../screens/HomeScreen';

import {StateProvider, Context} from './MemoryStore';
const Stack = createStackNavigator();


export default function Navigator() {
  const {state, dispatch} = useContext(Context);
  const {sessionState} = state;

  const navigator = (sessionState) => {
    switch (sessionState) {
      case "LOADING":
        return (
          <Stack.Navigator
            initialRouteName="LoadingScreen"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          </Stack.Navigator>
        );
      case "LOGGED_OUT":
        return (
          <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="CreateAccountScreen" component={CreateAccountScreen} />
          </Stack.Navigator>
        );
      case "LOGGED_IN":
        return (
          <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: "Home" }} />
          </Stack.Navigator>
        );
    }
  };

  return navigator(sessionState);
}
