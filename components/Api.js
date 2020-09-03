const baseUrl = "http://localhost:4000";

const Api = {
  ping: async () => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/ping`
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  version: async () => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/version`
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  createOneTimePassword: async () => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/one_time_passwords`, {method: 'POST'}
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
        `${baseUrl}/api/v1/sessions`, {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'},}
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
        `${baseUrl}/api/v1/users`, {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'},}
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getUserByEmailAndPassword: async (email, password) => {
    try {
      let response = await fetch(
        `${baseUrl}/api/v1/users?email=${email}&password=${password}`
      );
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
}

export default Api;
