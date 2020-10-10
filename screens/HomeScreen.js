import React, {useContext, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Button, Text, Title} from 'native-base';
import {get} from "lodash"

import Api from '../components/Api';
import {Context} from '../components/MemoryStore';

export default function HomeScreen({ navigation }) {
  const {state} = useContext(Context);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactionLogs, setTransactionLogs] = useState([]);

  const handlePay = () => navigation.navigate('PayScreen');
  const handleReceive = () => navigation.navigate('ReceiveScreen');

  useEffect(() => {
    const fetch = async () => {
      const users = await Api.getCurrentUser(state.sessionToken);
      if (users && users.data && users.data[0]) {
        setUser(users.data[0]);
        let balances = Api.getUserBalance(state.sessionToken, users.data[0], "USDC");
        let transactionLogs = Api.getCurrentUserTransactionLogs(state.sessionToken, users.data[0])

        balances = await balances;
        transactionLogs = await transactionLogs;

        const balance = get(balances, "data[0]");
        transactionLogs = get(transactionLogs, "data", []);
        if (balance) {
          setBalance(balance);
        }
        if (transactionLogs) {
          setTransactionLogs(transactionLogs);
        }
      }
    }

    fetch();
  }, []);

  return (<>
    {user && (
      <>
        <Text>{`User: ${user.attributes.first_name} ${user.attributes.last_name}`}</Text>
        {balance && (
          <Text>{`Balance: ${balance.attributes.amount / 100}.${balance.attributes.amount % 100}`}</Text>
        )}
        <Button onPress={handlePay}><Text>Pay</Text></Button>
        <Button onPress={handleReceive}><Text>Receive</Text></Button>
        {transactionLogs.length > 0 && (
          <>
            <Text>{`Transaction logs:`}</Text>
            <ScrollView>
              { transactionLogs.map((transactionLog) =>
                (<Text style={{marginLeft: 10}} key={transactionLog.id}>{`- ${transactionLog.attributes.message}`}</Text>)
              )}
            </ScrollView>
          </>
        )}
      </>
    )}
  </>);
}
