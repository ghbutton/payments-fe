import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import TwoFactorAuthScreen from '../screens/TwoFactorAuthScreen';

import {StateProvider, Store} from './Store';
const Stack = createStackNavigator();


export default function Navigator() {
  const {state, dispatch} = useContext(Store);
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
          <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="TwoFactorAuthScreen" component={TwoFactorAuthScreen} />
          </Stack.Navigator>
        );
    }
  };

  return navigator(sessionState);
}
