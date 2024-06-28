/*=========================================================================================
  File Name: moduleEmailState.js
  Description: Email Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
  schedules: [],
  treeData: [],
  types: [
    {
      id: 1,
      name: " Daily",
    },
    {
      id: 2,
      name: "Weekly",
    },
    {
      id: 3,
      name: "Ordinal",
    },
    {
      id: 4,
      name: "Specific",
    },
    {
      id: 5,
      name: "Flexitime",
    },
  ],
  monitorDataConfig: [
    { name: "Access point", key: "access_point", show: true },
    { name: "Full Name", key: "full_name", show: true },
    { name: "Date Time", key: "date_time", show: true },
    { name: "Event", key: "event", show: true },
    { name: "Event description", key: "event_description", show: false },
    { name: "Direction", key: "direction", show: true },
    { name: "Credential", key: "credential", show: false },
    { name: "Company", key: "copmany", show: false },
    { name: "Group", key: "group", show: false },
    { name: "Access right", key: "access_rigth", show: false },
    { name: "Anti-pass back", key: "antipass_back", show: false },
    { name: "Car model / Color", key: "car_model", show: true },
    { name: "Car LP#", key: "car_lp", show: true },
    { name: "Manual override", key: "manual_override", show: false },
  ],
  monitor2DataConfig: [
    { name: "Access point", key: "access_point", show: true },
    { name: "Full Name", key: "full_name", show: true },
    { name: "Date Time", key: "date_time", show: true },
    { name: "Event", key: "event", show: true },
    { name: "Event description", key: "event_description", show: false },
    { name: "Direction", key: "direction", show: true },
    { name: "Credential", key: "credential", show: false },
    { name: "Company", key: "copmany", show: false },
    { name: "Group", key: "group", show: false },
    { name: "Access right", key: "access_rigth", show: false },
    { name: "Anti-pass back", key: "antipass_back", show: false },
    { name: "Car model / Color", key: "car_model", show: true },
    { name: "Car LP#", key: "car_lp", show: true },
    { name: "Manual override", key: "manual_override", show: false },
  ],
};
