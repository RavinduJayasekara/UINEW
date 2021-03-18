import { PASSWORD_CHANGE } from "../action/passwordChange";

const initialState = {
  response: {},
};

const passwordChangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case PASSWORD_CHANGE:
      return { response: action.dataSet };
  }
  return state;
};

export default passwordChangeReducer;
