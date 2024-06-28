/*=========================================================================================
  File Name: moduleEmailState.js
  Description: Email Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  edit_auto_task: {},
  auto_tasks: [],
  conditions: [],
  edit_conditions: [],

  set_conds: false,
  task_data: {
    name: null,
    access_point: null,
    acu: null,
    reaction_access_points: [],
    reaction: null,
    reaction_type: null,
    conditions: {},
    condition: null,
    enable: false
  },
  controllers: [],
  controller: null,
  commands: {},
  events: {},
  access_points: [],

  condition: null
}
