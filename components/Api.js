import RNSimpleCrypto from 'react-native-simple-crypto';

const apiVersion = 1;
//const baseUrl = "http://localhost:4000";
const baseUrl = 'http://192.168.5.15:4000';
const loggedOutHeaders = () => ({
  'Content-Type': 'application/json',
  'Accepts-version': `${apiVersion}`,
});
const loggedInHeaders = (sessionToken) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${sessionToken}`,
  'Accepts-version': `${apiVersion}`,
});

const Api = {
  ping: async () => {
    try {
      let response = await fetch(`${baseUrl}/api/v1/ping`, {
        headers: loggedOutHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  version: async () => {
    try {
      let response = await fetch(`${baseUrl}/api/v1/version`, {
        headers: loggedOutHeaders(),
      });
      return await response;
    } catch (error) {
      console.error(error);
    }
  },
  checkApiVersion: async () => {
    const versionResponse = await Api.version();

    if (versionResponse && versionResponse.status === 200) {
      const json = await versionResponse.json();
      const number = json.attributes.number;

      if (number > apiVersion) {
        return 'outdated';
      } else {
        return 'ok';
      }
    } else {
      // network error
      return 'error';
    }
  },
  createOneTimePassword: async () => {
    try {
      let response = await fetch(`${baseUrl}/api/v1/one_time_passwords`, {
        method: 'POST',
        headers: loggedOutHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createSession: async (email, password) => {
    data = {data: {type: 'sessions', attributes: {email, password}}};
    try {
      let response = await fetch(`${baseUrl}/api/v1/sessions`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: loggedOutHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createToken: async (id, token, timestamp) => {
    const hash = await RNSimpleCrypto.SHA.sha256(`${token}:${timestamp}`);
    data = {data: {type: 'session_tokens', attributes: {hash, timestamp}}};
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/sessions/${id}/session_tokens`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: loggedOutHeaders(),
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  checkSessionToken: async (sessionToken, sessionId) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/sessions/${sessionId}/session_tokens`,
        {method: 'GET', headers: loggedInHeaders(sessionToken)},
      );
      return await response;
    } catch (error) {
      console.error(error);
    }
  },
  createUser: async (email, password, firstName, lastName) => {
    data = {
      data: {
        type: 'users',
        attributes: {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        },
      },
    };
    try {
      let response = await fetch(`${baseUrl}/api/v1/users`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: loggedOutHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createEmailVerification: async (user, email, emailVerification) => {
    data = {
      data: {
        type: 'email_verifications',
        attributes: {unconfirmed_email: email},
      },
      meta: {user_id: user.data.id, token: emailVerification},
    };
    try {
      let response = await fetch(`${baseUrl}/api/v1/email_verifications`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: loggedOutHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getCurrentUser: async (sessionToken) => {
    try {
      let response = await fetch(`${baseUrl}/api/v1/users?current=true`, {
        method: 'GET',
        headers: loggedInHeaders(sessionToken),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getUserBalances: async (sessionToken, user, currency) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/users/${user.id}/user_balances?currency=${currency}`,
        {method: 'GET', headers: loggedInHeaders(sessionToken)},
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getCurrentUserTransactionLogs: async (sessionToken, user) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/users/${user.id}/transaction_logs`,
        {method: 'GET', headers: loggedInHeaders(sessionToken)},
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createPendingUserTransaction: async (sessionToken, currency, amount) => {
    const data = {
      data: {type: 'pending_user_transactions', attributes: {currency, amount}},
    };
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/pending_user_transactions`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: loggedInHeaders(sessionToken),
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  claimPendingUserTransaction: async (sessionToken, id, secret) => {
    const data = {
      data: {
        type: 'pending_user_transactions',
        attributes: {status: 'claimed'},
        meta: {secret},
      },
    };

    try {
      let response = await fetch(
        `${baseUrl}/api/v1/pending_user_transactions/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: loggedInHeaders(sessionToken),
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  finishPendingUserTransaction: async (sessionToken, id) => {
    const data = {
      data: {
        type: 'pending_user_transactions',
        attributes: {status: 'finished'},
      },
    };

    try {
      let response = await fetch(
        `${baseUrl}/api/v1/pending_user_transactions/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: loggedInHeaders(sessionToken),
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  verifyBankAccount: async (
    sessionToken,
    bankAccountVerificationId,
    amount1,
    amount2,
  ) => {
    const data = {
      data: {type: 'bank_accounts', attributes: {}},
      meta: {
        bank_account_verification_id: bankAccountVerificationId,
        amount_1: amount1,
        amount_2: amount2,
      },
    };

    try {
      let response = await fetch(`${baseUrl}/api/v1/bank_accounts`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: loggedInHeaders(sessionToken),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createBankAccountVerification: async (sessionToken, account, routing) => {
    const data = {
      data: {
        type: 'bank_account_verifications',
        attributes: {account_number: account, routing_number: routing},
      },
    };

    try {
      let response = await fetch(
        `${baseUrl}/api/v1/bank_account_verifications`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: loggedInHeaders(sessionToken),
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getPendingBankAccountVerifications: async (sessionToken) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/bank_account_verifications?status=started,sent_to_bank`,
        {method: 'GET', headers: loggedInHeaders(sessionToken)},
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getBankAccounts: async (sessionToken) => {
    try {
      let response = await fetch(`${baseUrl}/api/v1/bank_accounts`, {
        method: 'GET',
        headers: loggedInHeaders(sessionToken),
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createBankTransaction: async (
    sessionToken,
    bankAccountId,
    currency,
    amount,
    type,
  ) => {
    const data = {
      data: {type: 'bank_transactions', attributes: {currency, amount, type}},
    };

    try {
      let response = await fetch(
        `${baseUrl}/api/v1/bank_accounts/${bankAccountId}/bank_transactions`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: loggedInHeaders(sessionToken),
        },
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getPendingBankTransactions: async (sessionToken, bankAccountId) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/bank_accounts/${bankAccountId}/bank_transactions?status=pending`,
        {method: 'GET', headers: loggedInHeaders(sessionToken)},
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
};

export default Api;
