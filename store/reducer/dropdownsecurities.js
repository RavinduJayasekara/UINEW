import {
  GET_ALL_SECURITIES,
  GET_ALL_FAVOURITES,
  GET_JUST_SEC,
} from "../action/dropdownsecurities";

const initialState = {
  securityDetails: [],
  favourites: [],
  justSecurities: [],
};

const dropdownSecuritiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SECURITIES:
      return {
        ...state,
        securityDetails: action.allSecurities,
      };
    case GET_ALL_FAVOURITES:
      return {
        ...state,
        favourites: action.favs,
      };
    case GET_JUST_SEC:
      return {
        ...state,
        justSecurities: action.justSec,
      };
  }
  return state;
};

export default dropdownSecuritiesReducer;
