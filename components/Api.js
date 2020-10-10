import RNSimpleCrypto from "react-native-simple-crypto";

//const baseUrl = "http://localhost:4000";
const baseUrl = "http://192.168.5.15:4000";
const loggedOutHeaders = () => ({'Content-Type': 'application/json',})
const loggedInHeaders = (sessionToken) => ({'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionToken}`})

const Api = {
  ping: async () => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/ping`, {headers: loggedOutHeaders()}
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  version: async () => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/version`, {headers: loggedOutHeaders()}
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createOneTimePassword: async () => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/one_time_passwords`, {method: 'POST', headers: loggedOutHeaders()}
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createSession: async (email, password, otpToken) => {
    data = {data: {type: "sessions", attributes: {email, password}, meta: {otp_token: otpToken}}}
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/sessions`, {method: 'POST', body: JSON.stringify(data), headers: loggedOutHeaders(),}
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createToken: async (id, token, timestamp) => {
    const hash = await RNSimpleCrypto.SHA.sha256(`${token}:${timestamp}`);
    data = {data: {type: "session_tokens", attributes: {hash, timestamp}, }}
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/sessions/${id}/session_tokens`, {method: 'POST', body: JSON.stringify(data), headers: loggedOutHeaders(),}
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createUser: async (email, password, otp, otpToken, firstName, lastName) => {
    data = {data: {type: "users", attributes: {email, password, first_name: firstName, last_name: lastName}, relationships: {otp: {type: "otp", id: otp.data.id}}}, meta: {otp_token: otpToken}}
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/users`, {method: 'POST', body: JSON.stringify(data), headers: loggedOutHeaders(),}
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getCurrentUser: async (sessionToken) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/users?current=true`, {method: 'GET', headers: loggedInHeaders(sessionToken), }
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getUserBalance: async (sessionToken, user, currency) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/users/${user.id}/user_balances?currency=${currency}`, {method: 'GET', headers: loggedInHeaders(sessionToken), }
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getCurrentUserTransactionLogs: async (sessionToken, user) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/users/${user.id}/transaction_logs`, {method: 'GET', headers: loggedInHeaders(sessionToken), }
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createPendingUserTransaction: async (sessionToken, currency, amount) => {
    const data = {data: {type: "pending_user_transactions", attributes: {currency, amount} }}
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/pending_user_transactions`, {method: 'POST', body: JSON.stringify(data), headers: loggedInHeaders(sessionToken), }
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  claimPendingUserTransaction: async (sessionToken, id, secret) => {
    const data = {data: {type: "pending_user_transactions", attributes: {status: "claimed"}, meta: {secret}}}

    try {
      let response = await fetch(
        `${baseUrl}/api/v1/pending_user_transactions/${id}`, {method: 'PATCH', body: JSON.stringify(data), headers: loggedInHeaders(sessionToken), }
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  finishPendingUserTransaction: async (sessionToken, id) => {
    const data = {data: {type: "pending_user_transactions", attributes: {status: "finished"}}}

    try {
      let response = await fetch(
        `${baseUrl}/api/v1/pending_user_transactions/${id}`, {method: 'PATCH', body: JSON.stringify(data), headers: loggedInHeaders(sessionToken), }
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
}

export default Api;
