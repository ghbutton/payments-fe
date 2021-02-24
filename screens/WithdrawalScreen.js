import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Content, Form, Item, Input, Label, Text} from 'native-base';
import {get} from 'lodash';

import Api from '../components/Api';
import Money from '../components/Money';
import {Context} from '../components/MemoryStore';

export default function WithdrawalScreen({route, navigation}) {
  const {state} = useContext(Context);
  const {bankAccount} = route.params;
  const currency = 'USDC';

  const [amount, setAmount] = useState(0);

  const handleAmountChange = (value) => {
    setAmount(Money.decimalAmount(value, currency));
  };

  const handleWithdrawal = async () => {
    const response = await Api.createBankTransaction(
      state.sessionToken,
      bankAccount.id,
      currency,
      amount,
      'withdrawal',
    );
    if (get(response, 'data.id')) {
      navigation.goBack();
    }
  };

  return (
    <Content padder>
      <Form>
        <Item>
          <Label>Amount</Label>
          <Input
            keyboardType="numeric"
            placeholder="0"
            onChangeText={handleAmountChange}
          />
        </Item>
        <Button block primary onPress={handleWithdrawal}>
          <Text>Withdrawal</Text>
        </Button>
      </Form>
    </Content>
  );
}
