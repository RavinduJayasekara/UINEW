import {
  SET_GAINERS,
  SET_LOSERS,
  SET_TURN_OVER,
  SET_SHARE_VOLUME,
} from "../action/topStocks";

const initialState = {
  securitiesGainer: [],
  securitiesLoser: [],
  securitiesTurnOver: [],
  securitiesShareVolume: [],
};

const topStocksReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GAINERS:
      return {
        ...state,
        securitiesGainer: action.gainers,
      };
    case SET_LOSERS:
      return {
        ...state,

        securitiesLoser: action.losers,
      };
    case SET_TURN_OVER:
      return {
        ...state,
        securitiesTurnOver: action.turnOver,
      };
    case SET_SHARE_VOLUME:
      return {
        ...state,
        securitiesShareVolume: action.shareVolume,
      };
  }
  return state;
};

export default topStocksReducer;
