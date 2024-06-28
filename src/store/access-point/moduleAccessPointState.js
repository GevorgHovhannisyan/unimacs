/*=========================================================================================
  File Name: moduleEmailState.js
  Description: Email Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
  edit_acu_data: {},

  edit_active_reader: null,
  edit_active_point: null,
  active_device: null,
  acu_data: {
    name: null,
    description: null,
    model: null,
    elevator_mode: false,
    time: {
      enable_daylight_saving_time: false,
      timezone_from_facility: false,
      time_zone: null,
      time_zone_unix: null,
      daylight_saving_time_from_user_account: false,
    },
    access_points: {},
  },
  resources: {},
  active_reader: null,
  active_point: null,

  acu_edit_tree: [],

  acuCreateTree: [
    {
      id: 1,
      name: "ACU",
      parent_id: null,
      item_type: "acu",
      expanded: true,
    },
    {
      id: 3,
      name: "Access Points",
      parent_id: 1,
      item_type: "access_point",
      expanded: true,
    },
  ],

  res_types: {
    Door_sensor: true,
    Exit_button: true,
    Loop_sensor: true,
    Fire_Alarm_in: true,
    Open_button: true,
    Turnstile_ready: true,
    Pass_control: true,
    Entry_button: true,
    Alarm_out: true,
    Lock: true,
    Entry_relay: true,
    Exit_relay: true,
    Block_Turnstile: true,
    Emergency_open: true,
    Open_relay: true,
  },
  acu: [],
  acu_count: 0,
  point_count: 0,
  access_points: [],
  access_points_count: 0,
  access_point_headers: [
    { name: "#", key: "id" },
    { name: "Name", key: "name" },
    { name: "ACU Name", key: "acu_name" },
    { name: "Type", key: "type" },
    { name: "Main Building", key: "building" },
    { name: "Status", key: "status" },
    { name: "Mode", key: "mode" },
  ],
  acu_headers: [
    { name: "#", key: "id" },
    { name: "ACU S/N", key: "acu_name" },
    { name: "Model", key: "model" },
    { name: "Name", key: "name" },
    { name: "Status", key: "status" },
    { name: "IP Address", key: "ip_address" },
    { name: "Cloud status", key: "cloud_status" },
  ],
  time_types: [
    {
      id: "minutes",
      label: "Minutes",
    },
    {
      id: "seconds",
      label: "Seconds",
    },
  ],
  group: [
    {
      id: "1",
      label: "Common Doors1",
    },
    {
      id: "2",
      label: "Common Doors2",
    },
  ],
  points_types: [],
  acu_types: [
    {
      id: 1,
      label: "LRM-2CRS",
    },
    {
      id: 2,
      label: "MRL-7CRS",
    },
  ],
  resource_modes: [
    {
      id: false,
      label: "Disable",
    },
    {
      id: true,
      label: "Enable",
    },
  ],
  acu_models: [],
  acu_model: {},
  connection_types: [
    { label: "Ethernet", id: "ethernet" },
    { label: "Wi-Fi", id: "wi-fi" },
  ],
  updateTypes: [{ label: "Update", id: "update" }],
  interface_types: [
    {
      id: 0,
      label: "Wiegand 4bit",
    },
    {
      id: 1,
      label: "Wiegand 8bit",
    },
    {
      id: 2,
      label: "Wiegand 26bit",
    },
    {
      id: 3,
      label: "Wiegand 34bit",
    },
    {
      id: 4,
      label: "Wiegand 37bit",
    },
    {
      id: 5,
      label: "Wiegand 40bit",
    },
    {
      id: 6,
      label: "Wiegand 42bit",
    },
    {
      id: -1,
      label: "OSDP",
    },
  ],
  reader_modes: [
    {
      id: 0,
      label: "input",
    },
    // {
    //   "id": 1,
    //   "label": "output"
    // },
    // {
    //   "id": 2,
    //   "label": "WiBus"
    // }
  ],
  directions: [
    {
      id: 0,
      label: "entry",
    },
    {
      id: 1,
      label: "exit",
    },
  ],
  baud_rates: [
    {
      id: 2400,
      label: 2400,
    },
    {
      id: 9600,
      label: 9600,
    },
    {
      id: 19200,
      label: 19200,
    },
    {
      id: 28800,
      label: 28800,
    },
    {
      id: 38400,
      label: 38400,
    },
    {
      id: 57600,
      label: 57600,
    },
  ],
  osdp_addresses: [
    {
      id: 1,
      label: "entry",
    },
    {
      id: 0,
      label: "exit",
    },
  ],
  card_data_format_flags: [
    {
      id: -1,
      label: "Data 1/Data 0",
    },
    {
      id: 0,
      label: "ABA",
    },
    {
      id: 1,
      label: "2000 bit binary",
    },
    {
      id: 2,
      label: "RAW format",
    },
  ],
  keypad_modes: [
    {
      id: -1,
      label: "No Keypad Decoding Defined",
    },
    {
      id: 0,
      label: "4-bit burst",
    },
    {
      id: 1,
      label: "8-bit burst",
    },
    {
      id: 2,
      label: "26-bit burst",
    },
  ],
  configurations: [
    {
      id: 0,
      label: "Single reader",
    },
    {
      id: 1,
      label: "Multi readers",
    },
  ],
  led_modes: [
    {
      id: null,
      label: "LedMode1",
    },
    {
      id: null,
      label: "LedMode2",
    },
    {
      id: null,
      label: "LedMode3",
    },
    {
      id: null,
      label: "LedMode4",
    },
  ],
  offline_modes: [
    {
      id: 0,
      label: "Locked",
    },
    {
      id: 1,
      label: "Unlocked",
    },
  ],
  componentsources: [
    {
      id: 0,
      label: "close",
    },
    {
      id: 1,
      label: "open",
    },
    {
      id: 2,
      label: "change",
    },
  ],
  conditions: [
    {
      id: 0,
      label: "close",
    },
    {
      id: 1,
      label: "open",
    },
    {
      id: 2,
      label: "change",
    },
  ],
  trigger_output_if_door_ajars: [
    {
      id: 0,
      label: "close",
    },
    {
      id: 1,
      label: "open",
    },
    {
      id: 2,
      label: "change",
    },
  ],
  trigger_output_if_door_forced_opens: [
    {
      id: 0,
      label: "close",
    },
    {
      id: 1,
      label: "open",
    },
    {
      id: 2,
      label: "change",
    },
  ],
  relay_modes: [
    {
      id: 0,
      label: "trigger",
    },
    {
      id: 1,
      label: "impulse",
    },
  ],
  lock_types: [
    {
      id: 0,
      label: "NO",
    },
    {
      id: 1,
      label: "NC",
    },
  ],
  reader_types: {
    Door_sensor: "inputs",
    Exit_button: "inputs",
    Loop_sensor: "inputs",
    Open_button: "inputs",
    Fire_Alarm_in: "inputs",
    Turnstile_ready: "inputs",
    Pass_control: "inputs",
    Entry_button: "inputs",
    Alarm_out: "outputs",
    Lock: "outputs",
    Entry_relay: "outputs",
    Exit_relay: "outputs",
    Block_Turnstile: "outputs",
    Emergency_open: "outputs",
    Open_relay: "outputs",
    FACE: "readers",
    FINGER: "readers",
    KEYPAD: "readers",
    RFID: "readers",
  },
  readers_types: [
    { id: 0, label: "RFID" },
    { id: 1, label: "KEYPAD" },
    { id: 2, label: "FINGER" },
    { id: 3, label: "FACE" },
  ],
};
