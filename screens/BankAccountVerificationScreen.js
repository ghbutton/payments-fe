import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Form, Item, Input, Label, Text} from 'native-base';
import {get} from 'lodash';

import Api from '../components/Api';
import Money from '../components/Money';
import {Context} from '../components/MemoryStore';

export default function BankAccountVerificationScreen({route, navigation}) {
  const {state} = useContext(Context);
  const {bankAccountVerification} = route.params;

  const [amount1, setAmount1] = useState(0);
  const [amount2, setAmount2] = useState(0);
  const currency = 'USDC';

  const handleAmount1Change = (value) => {
    setAmount1(parseInt(value, 10));
  };

  const handleAmount2Change = (value) => {
    setAmount2(parseInt(value, 10));
  };

  const handleVerification = async () => {
    const response = await Api.verifyBankAccount(
      state.sessionToken,
      bankAccountVerification.id,
      amount1,
      amount2,
    );
    console.log(response);
    if (get(response, 'data.id')) {
      navigation.goBack();
    }
  };

  return (
    <View>
      <Form>
        <Item>
          <Label>Amount #1</Label>
          <Input
            keyboardType="numeric"
            placeholder="0"
            onChangeText={handleAmount1Change}
          />
        </Item>
        <Item>
          <Label>Amount #2</Label>
          <Input
            keyboardType="numeric"
            placeholder="0"
            onChangeText={handleAmount2Change}
          />
        </Item>
        <Button block primary onPress={handleVerification}>
          <Text>Verify</Text>
        </Button>
      </Form>
    </View>
  );
}
