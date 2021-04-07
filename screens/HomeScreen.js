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
    return () => navigation.navigate('BankWithdrawalScreen', {bankAccount});
  };
  const handleBankDeposit = (bankAccount) => {
    return () => navigation.navigate('BankDepositScreen', {bankAccount});
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
          let getTransactionLogs = Api.getCurrentUserTransactionLogs(
            state.sessionToken,
            users.data[0],
          );
          let getBankAccounts = Api.getBankAccounts(state.sessionToken);
          let getPendingBankAccountVerifications = Api.getPendingBankAccountVerifications(
            state.sessionToken,
          );

          balances = await balances;
          getTransactionLogs = await getTransactionLogs;
          getBankAccounts = await getBankAccounts;
          getPendingBankAccountVerifications = await getPendingBankAccountVerifications;

          const getBalance = get(balances, 'data[0]');
          getTransactionLogs = get(getTransactionLogs, 'data', []);
          getBankAccounts = get(getBankAccounts, 'data', []);
          getPendingBankAccountVerifications = get(
            getPendingBankAccountVerifications,
            'data',
          );

          if (getBalance) {
            setBalance(getBalance);
          }
          if (getTransactionLogs) {
            setTransactionLogs(getTransactionLogs);
          }
          if (getPendingBankAccountVerifications) {
            setPendingBankAccountVerifications(
              getPendingBankAccountVerifications,
            );
          }

          if (getBankAccounts) {
            let currentPendingTransactions = {};

            for (const index in getBankAccounts) {
              const bankAccount = getBankAccounts[index];
              let bankTransactions = await Api.getPendingBankTransactions(
                state.sessionToken,
                bankAccount.id,
              );

              currentPendingTransactions[bankAccount.id] =
                bankTransactions.data;
            }
            setBankAccounts(getBankAccounts);

            setPendingBankTransactions(currentPendingTransactions);
          }
        }
      };
      fetch();
    }, [state.sessionToken]),
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
                        <Text>Bank Withdrawal</Text>
                      </Button>
                    </View>
                    <View style={{paddingTop: 15}}>
                      <Button
                        block
                        primary
                        style={{}}
                        onPress={handleBankDeposit(bankAccount)}>
                        <Text>Bank Deposit</Text>
                      </Button>
                    </View>
                    {pendingBankTransactions[bankAccount.id] &&
                    pendingBankTransactions[bankAccount.id].length > 0 ? (
                      <View style={{paddingTop: 15}}>
                        <Text>Pending Transactions:</Text>
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
                      </View>
                    ) : null}
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
