/*=========================================================================================
  File Name: moduleEmail.js
  Description: Email Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import state from './moduleReportState.js'
import mutations from './moduleReportMutations.js'
import actions from './moduleReportActions.js'

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
}
