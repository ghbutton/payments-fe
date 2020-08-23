// Store.js
import React, {createContext, useReducer} from 'react';

const loadingState = 'loading';
const loggedInState = 'logged_in';
const loggedOutState = 'logged_out';
const forceUpgradeState = 'force_upgrade';


const initialState = {
  sessionState: "LOADING",
};
const Store = createContext(initialState);
const { Provider } = Store;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case "LOG_IN":
        return {sessionState: "LOGGED_IN"}
      case "LOG_OUT":
        return {sessionState: "LOGGED_OUT"}
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { Store, StateProvider }
