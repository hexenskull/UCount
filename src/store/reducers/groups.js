import { SET_GROUP } from "../actions/actionTypes";

const initialState = {
  selectedGroup: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUP:
      return {
        ...state,
        selectedGroup: action.selectedGroup
      };
    default:
      return state;
  }
};

export default reducer;
