/*=========================================================================================
  File Name: moduleEmailState.js
  Description: Email Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  reports: {
    count: 0,
    data: []
  },
  access_points: [],
  cardholders: [],
  event_list: [],
  period: null,
  active_period: null,
  saveLogs: [],
  template: {},
  editedReport: null,
  edit_event_list: [],
  edit_cardholders: [],
  edit_access_points: [],
  edit_template: null,

  event_show_selected: false,
  event_types: [],
  event_type: null,
  ap_show_selected: false,
  loc_zone: null,
  loc_zones: [],
  card_show_selected: false,
  group: null,
  groups: [],
  edit_event_show_selected: false,
  edit_event_types: [],
  edit_event_type: null,
  edit_ap_show_selected: false,
  edit_loc_zone: null,
  edit_loc_zones: [],
  edit_card_show_selected: false,
  edit_group: null,
  edit_groups: [],
  access_points_selecteds: []
}
