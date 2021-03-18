import { SET_INDICES, SET_TRADES } from "../action/marketsummary";

const initialState = {
  items: [],
};

const marketsummaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INDICES:
      return { items: action.indices };
    case SET_TRADES:
      return { items: action.trades };
  }
  return state;
};

export default marketsummaryReducer;
