import AsyncStorage from '@react-native-community/async-storage';

export default DiskStore = {
  setData: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.log("ERROR", error)
      // Error saving data
    }
  },
  getData: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value != null) {
        return JSON.parse(value);
      } else {
        return null;
      }
    } catch (error) {
      console.log("ERROR", error);
      // Error saving data
    }
  },
  removeData: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log("ERROR", error);
    }
  }
}

