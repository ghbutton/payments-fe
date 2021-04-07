import React, {useCallback, useContext, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Button, Content, Text} from 'native-base';
import {get} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';
import {PlaidLink, LinkSuccess, LinkExit} from 'react-native-plaid-link-sdk';

import Api from '../components/Api';
import {Context} from '../components/MemoryStore';

export default function AddBankAccountScreen({navigation}) {
  const {state} = useContext(Context);
  const [plaidAuthorization, setPlaidAuthorization] = useState(null);
  const [achAccounts, setAchAccounts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        const authorization = await Api.createPlaidAuthorization(
          state.sessionToken,
        );
        if (authorization) {
          setPlaidAuthorization(authorization);
        }
      };
      fetch();
    }, [state.sessionToken]),
  );

  const selectAchAccount = (item) => {
    return async () => {
      const response = await Api.createBankAccountFromPlaid(
        state.sessionToken,
        plaidAuthorization.data.id,
        item.plaid_account_id,
      );
      if (get(response, 'data.id')) {
        navigation.goBack();
      }
    };
  };

  const PlaidLinkContent = () => (
    <PlaidLink
      tokenConfig={{
        token: plaidAuthorization.data.attributes.link_token,
      }}
      onSuccess={async (success: LinkSuccess) => {
        const authorization = await Api.updatePlaidPublicToken(
          state.sessionToken,
          plaidAuthorization.data.id,
          success.publicToken,
        );
        const ach_accounts = get(authorization, 'meta.ach_accounts');
        if (ach_accounts) {
          setAchAccounts(ach_accounts);
        }
      }}
      onExit={(exit: LinkExit) => {
        console.log(exit);
      }}>
      <Text>Use Plaid</Text>
    </PlaidLink>
  );

  const AccountSelectorContent = () => (
    <FlatList
      data={achAccounts}
      renderItem={({item}) => (
        <View style={{paddingBottom: 15}}>
          <Text>{item.name}</Text>
          <Text>{item.account_number}</Text>
          <Button block primary onPress={selectAchAccount(item)}>
            <Text>Use account</Text>
          </Button>
        </View>
      )}
    />
  );

  return (
    <Content padder>
      {achAccounts.length === 0
        ? plaidAuthorization && PlaidLinkContent()
        : AccountSelectorContent()}
    </Content>
  );
}
