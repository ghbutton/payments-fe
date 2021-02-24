import React, {useContext, useCallback, useState} from 'react';
import {View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Content, Text} from 'native-base';
import {get} from 'lodash';

import Api from '../components/Api';
import Money from '../components/Money';
import {Context} from '../components/MemoryStore';

export default function HomeScreen({navigation}) {
  const {state} = useContext(Context);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [pendingBankTransactions, setPendingBankTransactions] = useState({});
  const [
    pendingBankAccountVerifications,
    setPendingBankAccountVerifications,
  ] = useState([]);

  const handleAddBankAccount = () =>
    navigation.navigate('AddBankAccountScreen');
  const handleBankWithdrawal = (bankAccount) => {
    return () => navigation.navigate('WithdrawalScreen', {bankAccount});
  };
  const handleBankDeposit = (bankAccount) => {
    return () => navigation.navigate('DepositScreen', {bankAccount});
  };
  const handlePay = () => navigation.navigate('PayScreen');
  const handleReceive = () => navigation.navigate('ReceiveScreen');
  const handleBankAccountVerification = (bankAccountVerification) => {
    return () =>
      navigation.navigate('BankAccountVerificationScreen', {
        bankAccountVerification,
      });
  };

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        const users = await Api.getCurrentUser(state.sessionToken);
        if (users && users.data && users.data[0]) {
          setUser(users.data[0]);
          let balances = Api.getUserBalances(
            state.sessionToken,
            users.data[0],
            'USDC',
          );
          let transactionLogs = Api.getCurrentUserTransactionLogs(
            state.sessionToken,
            users.data[0],
          );
          let bankAccounts = Api.getBankAccounts(state.sessionToken);
          let pendingBankAccountVerifications = Api.getPendingBankAccountVerifications(
            state.sessionToken,
          );

          balances = await balances;
          transactionLogs = await transactionLogs;
          bankAccounts = await bankAccounts;
          pendingBankAccountVerifications = await pendingBankAccountVerifications;

          const balance = get(balances, 'data[0]');
          transactionLogs = get(transactionLogs, 'data', []);
          bankAccounts = get(bankAccounts, 'data', []);
          pendingBankAccountVerifications = get(
            pendingBankAccountVerifications,
            'data',
          );

          if (balance) {
            setBalance(balance);
          }
          if (transactionLogs) {
            setTransactionLogs(transactionLogs);
          }
          if (pendingBankAccountVerifications) {
            setPendingBankAccountVerifications(pendingBankAccountVerifications);
          }

          if (bankAccounts) {
            let currentPendingTransactions = {};

            for (const index in bankAccounts) {
              const bankAccount = bankAccounts[index];
              let bankTransactions = await Api.getPendingBankTransactions(
                state.sessionToken,
                bankAccount.id,
              );

              currentPendingTransactions[bankAccount.id] =
                bankTransactions.data;
              setBankAccounts(bankAccounts);
            }

            setPendingBankTransactions(currentPendingTransactions);
          }
        }
      };
      fetch();
    }, []),
  );

  return (
    <Content padder>
      {user && (
        <>
          <View style={{flex: 1}}>
            <Text>{`User: ${user.attributes.first_name} ${user.attributes.last_name}`}</Text>
            {balance && (
              <Text>{`Balance: ${Money.fullString(
                balance.attributes.amount,
                balance.attributes.currency,
              )}`}</Text>
            )}
          </View>

          <View
            style={{flex: 1, paddingTop: 15, justifyContent: 'space-between'}}>
            <Text>User Transactions:</Text>
            <View style={{paddingTop: 15}}>
              <Button block primary onPress={handlePay}>
                <Text>Pay</Text>
              </Button>
            </View>
            <View style={{paddingTop: 15}}>
              <Button block primary onPress={handleReceive}>
                <Text>Receive</Text>
              </Button>
            </View>
          </View>

          <View style={{flex: 1, paddingTop: 15}}>
            <Text>Bank Transactions:</Text>
            {bankAccounts.length > 0 ? (
              <>
                {bankAccounts.map((bankAccount) => (
                  <React.Fragment key={bankAccount.id}>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                      }}>{`- ${bankAccount.attributes.number}`}</Text>
                    <View style={{paddingTop: 15}}>
                      <Button
                        block
                        primary
                        onPress={handleBankWithdrawal(bankAccount)}>
                        <Text>Withdrawal</Text>
                      </Button>
                    </View>
                    <View style={{paddingTop: 15}}>
                      <Button
                        block
                        primary
                        style={{}}
                        onPress={handleBankDeposit(bankAccount)}>
                        <Text>Deposit</Text>
                      </Button>
                    </View>
                    {pendingBankTransactions[bankAccount.id] &&
                    pendingBankTransactions[bankAccount.id].length > 0 ? (
                      <Text>Pending Transactions:</Text>
                    ) : null}
                    {(pendingBankTransactions[bankAccount.id] || []).map(
                      (pendingTransaction) => (
                        <React.Fragment key={pendingTransaction.id}>
                          <Text>{`${
                            pendingTransaction.attributes.type
                          } - ${Money.fullString(
                            pendingTransaction.attributes.amount,
                            pendingTransaction.attributes.currency,
                          )}`}</Text>
                        </React.Fragment>
                      ),
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <View style={{paddingTop: 15}}>
                <Button block success onPress={handleAddBankAccount}>
                  <Text>Add Bank Account</Text>
                </Button>
              </View>
            )}
          </View>

          {pendingBankAccountVerifications.length > 0 && (
            <View style={{flex: 1, paddingTop: 15}}>
              <Text>{'Bank Account Verifications:'}</Text>
              <>
                {pendingBankAccountVerifications.map((verification) => (
                  <React.Fragment key={verification.id}>
                    <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                      <Text
                        style={{
                          marginLeft: 10,
                          flex: 1,
                        }}>{`- ${verification.attributes.number}`}</Text>
                      {verification.attributes.status === 'sent_to_bank' ? (
                        <Button
                          onPress={handleBankAccountVerification(verification)}>
                          <Text>Verify</Text>
                        </Button>
                      ) : (
                        <Button disabled>
                          <Text>Pending</Text>
                        </Button>
                      )}
                    </View>
                  </React.Fragment>
                ))}
              </>
            </View>
          )}

          {transactionLogs.length > 0 && (
            <View style={{paddingTop: 15}}>
              <Text>{'Transaction logs:'}</Text>
              <>
                {transactionLogs.map((transactionLog) => (
                  <Text
                    style={{marginLeft: 10}}
                    key={
                      transactionLog.id
                    }>{`- ${transactionLog.attributes.message}`}</Text>
                ))}
              </>
            </View>
          )}
        </>
      )}
    </Content>
  );
}
