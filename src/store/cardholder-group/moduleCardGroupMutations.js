/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  SET_GROUPS(state, groups) {
    state.groups = groups
  },
  DELETE_DEPARTMENT(state, id) {
    const deparatmentIndex = state.departments.findIndex((u) => u.id == id)
    state.departments.splice(deparatmentIndex, 1)
  },
  UPDATE_CARD_GROUP(state, group) {
    const productIndex = state.groups.findIndex(
      (p) => p.id == group.id
    );
    Object.assign(state.groups[productIndex], group);
  },
  SET_GROUP(state, groups) {
    state.groups.push(groups)
  },
}
