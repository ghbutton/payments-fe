import React, {useContext, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import {
  Button,
  Content,
  Form,
  Item,
  Input,
  Label,
  Text,
  View,
} from 'native-base';
import {get} from 'lodash';

import Api from '../components/Api';
import Money from '../components/Money';
import {Context} from '../components/MemoryStore';

export default function ReceiveScreen() {
  const {state} = useContext(Context);
  const currency = 'USDC';
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState(0);
  const [secret, setSecret] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  const handleAmountChange = (value) => {
    setAmount(Money.decimalAmount(value, currency));
  };
  const submit = async () => {
    const response = await Api.createPendingUserTransaction(
      state.sessionToken,
      currency,
      amount,
    );
    const attributes = get(response, 'data.attributes');
    const currentPendingId = get(response, 'data.id');

    if (
      attributes &&
      attributes.currency === currency &&
      attributes.status === 'unclaimed' &&
      currentPendingId
    ) {
      setSubmitted(true);
      setAmount(attributes.amount);
      setSecret(attributes.secret);
      setPendingId(currentPendingId);
    }
  };

  const showForm = () => {
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
          <Item>
            <Label>Currency</Label>
            <Input placeholder="USD" disabled />
          </Item>
          <Button block primary onPress={submit}>
            <Text>Ready</Text>
          </Button>
        </Form>
      </Content>
    );
  };
  const showQr = () => {
    return (
      <Content padder>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            flexGrow: 1,
            height: 500,
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 20}}>
              Amount: {Money.fullString(amount, currency)}
            </Text>
          </View>
          <QRCode
            value={`https://www.ironnotice.com/app/receive?currency=${currency}&amount=${amount}&secret=${secret}&pending_id=${pendingId}&version=1`}
            size={300}
            style={{flex: 1}}
          />
        </View>
      </Content>
    );
  };

  return submitted ? showQr() : showForm();
}
