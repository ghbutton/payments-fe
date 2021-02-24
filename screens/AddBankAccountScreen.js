import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import { Button, Content, Form, Item, Input, Label, Text } from 'native-base';
import { get } from 'lodash';

import Api from '../components/Api';
import {Context} from '../components/MemoryStore';

export default function AddBankAccountScreen({navigation}) {
  const {state} = useContext(Context);

  const [account, setAccount] = useState("");
  const handleAccountChange = (value) => { setAccount(value) }

  const [routing, setRouting] = useState("");
  const handleRoutingChange = (value) => { setRouting(value) }

  const handleAdd = async () => {
    const response = await Api.createBankAccountVerification(state.sessionToken, account, routing)
    const pendingId = get(response, "data.id");
    if(pendingId) {
      navigation.goBack();
    }
  };

  return (
    <Content padder>
      <Form>
        <Item>
          <Label>Account number</Label>
          <Input onChangeText={handleAccountChange} />
        </Item>
        <Item>
          <Label>Routing number</Label>
          <Input onChangeText={handleRoutingChange} />
        </Item>
        <Button block primary onPress={handleAdd}>
          <Text>Add Account</Text>
        </Button>
      </Form>
    </Content>
  )
}
