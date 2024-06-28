/*=========================================================================================
  File Name: moduleEmail.js
  Description: Email Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import state from './moduleAccessPointGroupState.js'
import mutations from './moduleAccessPointGroupMutations.js'
import actions from './moduleAccessPointActions.js'

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
}
