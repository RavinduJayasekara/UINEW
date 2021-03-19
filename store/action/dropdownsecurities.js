import Links from "../../Links/Links";
import Watch from "../../Links/Watch";

export const GET_ALL_SECURITIES = "GET_ALL_SECURITIES";
export const GET_JUST_SEC = "GET_JUST_SEC";
export const GET_ALL_FAVOURITES = "GET_ALL_FAVOURITES";

export const fetchDropDownAllSecurities = () => {
  return async (dispatch) => {
    const response = await fetch(Links.mLink + Watch.fullWatch);
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);

    const allSecurities = object.data.watch;

    dispatch({
      type: GET_ALL_SECURITIES,
      allSecurities: allSecurities,
    });
  };
};

export const fetchAllSec = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(Links.mLink + Watch.allSecurityLink);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();
      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      dispatch({
        type: GET_JUST_SEC,
        justSec: object.data.items,
      });
    } catch (err) {
      console.log(err);
      // throw err;
    }
  };
};

export const favSecs = (watchIdUser) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        Links.mLink +
          "watch?action=userWatch&format=json&size=10&exchange=CSE&bookDefId=1&watchId=" +
          watchIdUser +
          "&lastUpdatedId=0"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      dispatch({ type: GET_ALL_FAVOURITES, favs: object.data.watch });
    } catch (err) {
      console.log(err);
    }
  };
};
