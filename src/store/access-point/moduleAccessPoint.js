/*=========================================================================================
  File Name: moduleEmail.js
  Description: Email Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import state from './moduleAccessPointState.js'
import mutations from './moduleAccessPointMutations.js'
import actions from './moduleAccessPointActions.js'
import getters from './moduleAccessPointGetters.js'

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  getters: getters,
  actions: actions,
}
