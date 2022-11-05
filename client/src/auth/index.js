import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from './auth-request-api';

const AuthContext = createContext();
console.log('create AuthContext: ' + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: 'GET_LOGGED_IN',
  LOGIN_USER: 'LOGIN_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  REGISTER_USER: 'REGISTER_USER',
  FAILED_LOGREG: 'FAILED_LOGREG',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    errMsg: '',
  });
  const history = useHistory();

  useEffect(() => {
    auth.getLoggedIn();
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          errMsg: '',
        });
      }
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          errMsg: '',
        });
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: null,
          loggedIn: false,
          errMsg: '',
        });
      }
      case AuthActionType.REGISTER_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          errMsg: '',
        });
      }
      case AuthActionType.FAILED_LOGREG: {
        console.log(payload);
        return setAuth({
          user: null,
          loggedIn: false,
          errMsg: payload.errMsg,
        });
      }
      case AuthActionType.CLEAR_ERRORS: {
        return setAuth({
          user: null,
          loggedIn: false,
          errMsg: '',
        });
      }
      default:
        return auth;
    }
  };

  auth.getLoggedIn = async function () {
    const response = await api.getLoggedIn();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.GET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user,
        },
      });
    }
  };
  auth.clearErrMsg = async function () {
    authReducer({
      type: AuthActionType.CLEAR_ERRORS,
      payload: {},
    });
  };

  auth.registerUser = async function (
    firstName,
    lastName,
    email,
    password,
    passwordVerify
  ) {
    api
      .registerUser(firstName, lastName, email, password, passwordVerify)
      .then((response) => {
        if (response.status === 200) {
          authReducer({
            type: AuthActionType.REGISTER_USER,
            payload: {
              user: response.data.user,
            },
          });
          auth.loginUser(email, passwordVerify);
          //   history.push('/');
        }
      })
      .catch((err) => {
        authReducer({
          type: AuthActionType.FAILED_LOGREG,
          payload: {
            errMsg: err.response.data.errorMessage,
          },
        });
        console.log(auth.errMsg);
      });
  };

  auth.loginUser = async function (email, password) {
    api
      .loginUser(email, password)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          authReducer({
            type: AuthActionType.LOGIN_USER,
            payload: {
              user: response.data.user,
            },
          });
          history.push('/');
        }
      })
      .catch((err) => {
        authReducer({
          type: AuthActionType.FAILED_LOGREG,
          payload: {
            errMsg: err.response.data.errorMessage,
          },
        });
        console.log(auth.errMsg);
      });
  };

  auth.logoutUser = async function () {
    const response = await api.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: null,
      });
      history.push('/');
    }
  };

  auth.getUserInitials = function () {
    let initials = '';
    if (auth.user) {
      initials += auth.user.firstName.charAt(0);
      initials += auth.user.lastName.charAt(0);
    }
    console.log('user initials: ' + initials);
    return initials;
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
