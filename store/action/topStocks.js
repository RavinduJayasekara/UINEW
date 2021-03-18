import Links from "../../Links/Links";
import TopStocks from "../../Links/TopStocks";

export const SET_GAINERS = "SET_GAINERS";
export const SET_LOSERS = "SET_LOSERS";
export const SET_TURN_OVER = "SET_TURN_OVER";
export const SET_SHARE_VOLUME = "SET_SHARE_VOLUME";

export const fetchGainers = () => {
  return async (dispatch) => {
    const response = await fetch(Links.mLink + TopStocks.gainersLink);

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);

    dispatch({
      type: SET_GAINERS,
      gainers: object.data.watch,
    });
  };
};

export const fetchLosers = () => {
  return async (dispatch) => {
    const response = await fetch(Links.mLink + TopStocks.losersLink);

    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);

    dispatch({
      type: SET_LOSERS,
      losers: object.data.watch,
    });
  };
};

export const fetchShareVolume = () => {
  return async (dispatch) => {
    const response = await fetch(Links.mLink + TopStocks.shareVolumeLink);

    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);

    dispatch({
      type: SET_SHARE_VOLUME,
      shareVolume: object.data.watch,
    });
  };
};

export const fetchTurnOver = () => {
  return async (dispatch) => {
    const response = await fetch(Links.mLink + TopStocks.turnOverLink);

    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);

    dispatch({
      type: SET_TURN_OVER,
      turnOver: object.data.watch,
    });
  };
};
