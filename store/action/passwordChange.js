import { Alert } from "react-native";
import Links from "../../Links/Links";

export const PASSWORD_CHANGE = "PASSWORD_CHANGE";

export const passwordChange = (
  username,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  return async (dispatch) => {
    const responsePasswordChange = await fetch(Links.mLink + "client", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=changePassword&format=json&txtUsername=${username}&txtOldPassword=${oldPassword}&txtNewPassword=${newPassword}&txtConfirmPassword=${confirmPassword}&product=Mobile`,
    });

    const resDataChangePassword = await responsePasswordChange.text();

    let replaceStringChangePassword = resDataChangePassword.replace(/'/g, '"');
    let objectChangePassword = JSON.parse(replaceStringChangePassword);

    console.log(objectChangePassword.description);
    console.log(objectChangePassword.data.validation[0]);

    if (
      objectChangePassword.description === "success" &&
      objectChangePassword.data.validation[0] === "true"
    ) {
      Alert.alert("Successfull", "Your Password has changed successfully!");
    }
    dispatch({ type: PASSWORD_CHANGE, dataSet: objectChangePassword });
  };
};
