/*=========================================================================================
  File Name: moduleEmail.js
  Description: Email Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import state from './moduleDepartmentState.js'
import mutations from './moduleDepartmentMutations.js'
import actions from './moduleDepartmentActions.js'

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
}
