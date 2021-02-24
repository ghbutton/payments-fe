import React, {useContext, useCallback, useState} from 'react';
import { Alert, } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {Button, Content, Text, View} from 'native-base';
import {get} from "lodash"

import Api from '../components/Api';
import DiskStore from '../components/DiskStore';
import {Context} from '../components/MemoryStore';

export default function HomeScreen({ navigation }) {
  const {state, dispatch} = useContext(Context);
  const [user, setUser] = useState(null);

  const logOut = async () => {
    await DiskStore.clearAllData();
    dispatch({type: "LOG_OUT"});
  }

  const handleLogOut = () => {
    Alert.alert(
      'Log out',
      'Do you want to log out from this device?',
      [
        {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
        {text: 'YES', onPress: logOut},
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        const users = await Api.getCurrentUser(state.sessionToken);
        if (users && users.data && users.data[0]) {
          setUser(users.data[0]);
        }
      }
      fetch();
    }, [])
  );

  return (<>
    {user && (
      <Content padder>
        <Text>{`User: ${user.attributes.first_name} ${user.attributes.last_name}`}</Text>
        <Text>{`Email: ${user.attributes.email}`}</Text>
        <View style={{paddingTop: 15}}>
          <Button onPress={handleLogOut} block danger><Text>Device Log Out</Text></Button>
        </View>
      </Content>
    )}
  </>);
}
