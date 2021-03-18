import Links from "../../Links/Links";

export const SET_TRADES = "SET_TRADES";
export const SET_INDICES = "SET_INDICES";

export const fetchIndices = (date) => {
  return async (dispatch) => {
    const usableDate = date.split("-");

    try {
      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getMarketIndexSummary&format=json&tradeDate=" +
          usableDate[1] +
          "%2F" +
          usableDate[2] +
          "%2F" +
          usableDate[0]
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      dispatch({ type: SET_INDICES, indices: object.data.index });
    } catch (error) {
      throw error;
    }
  };
};

export const fetchTrades = (date) => {
  return async (dispatch) => {
    const usableDate = date.split("-");
    try {
      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getTradeSummary&format=json&tradeDate=" +
          usableDate[1] +
          "%2F" +
          usableDate[2] +
          "%2F" +
          usableDate[0] +
          "&board=ALL"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      dispatch({ type: SET_TRADES, trades: object.data.watch });
    } catch (error) {
      throw error;
    }
  };
};
