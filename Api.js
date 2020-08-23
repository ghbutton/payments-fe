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
