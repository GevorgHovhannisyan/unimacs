/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  SET_EMAIL_SEARCH_QUERY(state, query) {
    state.mailSearchQuery = query
  },
  SET_TRANS(state, trans) {
    state.trans = trans
  },
  SET_LANGUAGE(state, language) {
    state.languages = language
  },
  DELETE_TRANS(state, id) {
    const userIndex = state.trans.findIndex((u) => u.id == id)
    state.trans.splice(userIndex, 1)
  },
  SET_MAILS(state, mails) {
    state.mails = mails
  },
}
