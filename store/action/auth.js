import Links from "../../Links/Links";

export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const RESTORE_TOKEN = "RESTORE_TOKEN";
import * as loadingClients from "../../store/action/loadingclients";
import * as dropdownsecuritiesActions from "../../store/action/dropdownsecurities";

export const signIn = (username, password) => {
  return async (dispatch) => {
    const response = await fetch(Links.mLink + "login", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=login&format=json&txtUserName=${username}&txtPassword=${password}&product=Mobile`,
    });

    const resData = await response.json();

    console.log(resData);

    if (resData.description === "success") {
      dispatch({ type: SIGN_IN, token: resData, uName: username });
      dispatch(loadingClients.fetchClients());
      dispatch(dropdownsecuritiesActions.fetchDropDownAllSecurities());
    } else {
      dispatch({ type: SIGN_OUT });
    }
  };
};

export const signOut = () => {
  return async (dispatch) => {
    dispatch({ type: SIGN_OUT });
  };
};

export const bootstrapAsync = () => {
  return async (dispatch) => {
    let userToken;

    dispatch({ type: RESTORE_TOKEN, token: userToken });
  };
};
