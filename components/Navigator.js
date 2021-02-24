import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AddBankAccountScreen from '../screens/AddBankAccountScreen';
import BankAccountVerificationScreen from '../screens/BankAccountVerificationScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import DepositScreen from '../screens/DepositScreen';
import HomeScreen from '../screens/HomeScreen';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import OutdatedScreen from '../screens/OutdatedScreen';
import PayScreen from '../screens/PayScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import WithdrawalScreen from '../screens/WithdrawalScreen';
import SettingScreen from '../screens/SettingScreen';

import {StateProvider, Context} from './MemoryStore';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Navigator() {
  const {state, dispatch} = useContext(Context);
  const {sessionState} = state;

  const SettingTab = () => (
    <Stack.Navigator
      initialRouteName="SettingScreen"
      screenOptions={screenStyleOptions}>
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{title: 'Setting'}}
      />
    </Stack.Navigator>
  );

  const ironBlue = '#296394';
  const white = '#FFF';

  const screenStyleOptions = {
    headerStyle: {
      backgroundColor: ironBlue,
    },
    headerTintColor: white,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  const PaymentTab = () => (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={screenStyleOptions}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{title: 'Home'}}
      />
      <Stack.Screen
        name="PayScreen"
        component={PayScreen}
        options={{title: 'Pay'}}
      />
      <Stack.Screen
        name="ReceiveScreen"
        component={ReceiveScreen}
        options={{title: 'Receive'}}
      />
      <Stack.Screen
        name="AddBankAccountScreen"
        component={AddBankAccountScreen}
        options={{title: 'Add Bank Account'}}
      />
      <Stack.Screen
        name="BankAccountVerificationScreen"
        component={BankAccountVerificationScreen}
        options={{title: 'Verify Bank Account'}}
      />
      <Stack.Screen
        name="DepositScreen"
        component={DepositScreen}
        options={{title: 'Deposit'}}
      />
      <Stack.Screen
        name="WithdrawalScreen"
        component={WithdrawalScreen}
        options={{title: 'Withdrawal'}}
      />
    </Stack.Navigator>
  );

  const navigator = (sessionState) => {
    switch (sessionState) {
      case 'LOADING':
        return (
          <Stack.Navigator
            initialRouteName="LoadingScreen"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          </Stack.Navigator>
        );
      case 'LOGGED_OUT':
        return (
          <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{
              headerTintColor: white,
              headerStyle: {backgroundColor: ironBlue},
            }}>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{title: 'Login'}}
            />
            <Stack.Screen
              name="CreateAccountScreen"
              component={CreateAccountScreen}
              options={{title: 'Create Account'}}
            />
          </Stack.Navigator>
        );
      case 'LOGGED_IN':
        return (
          <Tab.Navigator
            initialRouteName="PaymentTab"
            tabBarOptions={{
              activeTintColor: ironBlue,
              labelStyle: {fontSize: 14, margin: 0, padding: 0},
            }}>
            <Tab.Screen name="Payments" component={PaymentTab} />
            <Tab.Screen name="Settings" component={SettingTab} />
          </Tab.Navigator>
        );
      case 'OUTDATED':
        return <OutdatedScreen />;
      case 'FATAL_ERROR':
        return null;
    }
  };

  return navigator(sessionState);
}
