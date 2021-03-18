import { RESTORE_TOKEN, SIGN_IN, SIGN_OUT } from "../action/auth";

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  watchId: "",
  brokerCode: "",
  username: ""
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_TOKEN:
      return {
        ...state,
        userToken: null,
        isLoading: false,
      };
    case SIGN_IN:
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
        watchId: action.token.watchID,
        brokerCode: action.token.broker_code,
        username: action.uName
      };
    case SIGN_OUT:
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
  }
  return state;
};

export default authReducer;
