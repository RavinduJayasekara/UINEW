import { SET_CLIENTS } from "../action/loadingclients";

const initialState = {
  allClients: [],
};

const loadingclientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLIENTS:
      return {
        allClients: action.clients,
      };
  }
  return state;
};

export default loadingclientsReducer;
