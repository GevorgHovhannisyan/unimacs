/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  ADD_ACCESS_RIGHT(state, access) {
    state.rights.push(access)
  },
  SET_RELATIONS(state, relations) {
    state.relations = relations
  },
  SET_RIGHTS(state, access) {
    state.rights = access
  },
  DELETE_RIGHT(state, id) {
    const rightIndex = state.rights.findIndex((u) => u.id == id)
    state.rights.splice(rightIndex, 1)
  },
  UPDATE_RIGHT(state, right) {
    const productIndex = state.rights.findIndex(
      (p) => p.id == right.id
    );
    Object.assign(state.rights[productIndex], right);
  },
}
