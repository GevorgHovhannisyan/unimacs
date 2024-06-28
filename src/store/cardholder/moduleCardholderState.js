/*=========================================================================================
  File Name: moduleEmailState.js
  Description: Email Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
  cardholders: {
    count: 0,
    data: []
  },
  guests: [],
  checked_cardholders: {},
  cardholder_info: {
    avatar: null,
    email: null,
    first_name: null,
    last_name: null,
    family_name: null,
    company_name: null,
    phone: null,
    status: false,
    user_account: false,
    cardholder_group: null,
    antipass_backs: {
      antipass_back_inherited: false,
      enable_antipass_back: false
    },

    time_attendance_inherited: false,
    time_attendance: null,
    access_right_inherited: false,
    access_right: null,

    extra_features: {
      time: null,

      type: null,
      time_type: null
    },
    car_infos: {
      model: null,
      color: null,
      lp_number: null,
      car_credential: null,
      car_event: false
    },
    limitations: {
      limitation_inherited: false,
      enable_date: false,
      valid_from: null,
      valid_due: null,
      // pass_counter_enable: false,
      // pass_counter_passes: 0,
      // pass_counter_current: 0,
      // first_use_counter_enable: false,
      // first_use_counter_days: 0,
      // first_use_counter_current: 0,
      // last_use_counter_enable: false,
      // last_use_counter_days: 0,
      // last_use_counter_current: 0
    },
    credentials: []
  },
  edit_cardholder_info: {},
  cardholder_table_headers: [
    {
      headerName: "#",
      field: "count",
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerCheckboxSelection: true,
      width: 175,
      show: true
    },
    {
      headerName: "Name",
      field: "name",
      filter: true,
      width: 175,
      show: true
    },
    {
      headerName: "Group",
      field: "group",
      filter: true,
      width: 150,
      show: true
    },
    {
      headerName: "Email",
      field: "email",
      filter: true,
      width: 250,
      show: true
      //   pinned: "left"
    },
    {
      headerName: "Company",
      field: "company",
      filter: true,
      width: 250,
      show: true
    },

    {
      headerName: "Access Right",
      field: "access_right",
      filter: true,
      width: 150,
      show: true
    },
    {
      headerName: "Status",
      field: "status",
      filter: true,
      width: 125,
      show: true
    },
    {
      headerName: "Phone",
      field: "phone",
      filter: true,
      width: 125,
      show: true
    },
    {
      headerName: "Anti-passback",
      field: "antipass_back",
      filter: true,
      width: 125,
      show: true
    }
  ]
};
