// Store.js
// https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/
import React, {createContext, useReducer} from 'react';

const loadingState = 'loading';
const loggedInState = 'logged_in';
const loggedOutState = 'logged_out';
const forceUpgradeState = 'force_upgrade';


const initialState = {
  sessionState: "LOADING",
  sessionToken: undefined,
};
const Context = createContext(initialState);
const { Provider } = Context;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case "LOG_IN":
        return {sessionState: "LOGGED_IN", sessionToken: action.token}
      case "LOG_OUT":
        return {sessionState: "LOGGED_OUT", sessionToken: undefined}
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { Context, StateProvider }
