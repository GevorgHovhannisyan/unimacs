/*=========================================================================================
  File Name: moduleEmail.js
  Description: Email Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import state from './moduleAutoTaskState.js'
import mutations from './moduleAutoTaskMutations.js'
import actions from './moduleAutoTaskActions.js'

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
}
