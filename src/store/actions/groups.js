import { SET_GROUP } from "./actionTypes";
// import { setGroup } from "./index";

export const setGroup = groupName => {
  return {
    type: SET_GROUP,
    selectedGroup: groupName
  };
};
