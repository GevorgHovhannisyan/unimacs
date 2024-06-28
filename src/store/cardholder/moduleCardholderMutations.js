/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvents
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import moment from "moment";

export default {
  SET_CARDHOLDER_INFO(state, cardholder) {
    for (const key in cardholder) {
      if(key !== "cardholder_group") state.cardholder_info[key] = cardholder[key];
    }
  },
  SET_CAR_INFO(state, car) {
    state.cardholder_info.car_infos = car;
  },
  SET_PARENT_GROUP_INHERIT(state, id) {
    state.cardholder_info.cardholder_group = id;
  },
  SET_EDIT_CAR__INFO(state, car) {
    state.edit_cardholder_info.car_infos = car;
  },
  SET_ANTIPASS_INFO(state, antipass_back) {
    state.cardholder_info.antipass_backs = antipass_back;
  },
  SET_TIME_ATTEND_INFO(state, time_attendance) {
    if (!Object.keys(time_attendance).length) {
      state.cardholder_info.time_attendance_inherited = false;
      state.cardholder_info.time_attendance = null;
    } else {
      if ("time_attendance_inherited" in time_attendance) {
        state.cardholder_info.time_attendance_inherited =
          time_attendance.time_attendance_inherited;
      } else {
        state.cardholder_info.time_attendance_inherited = false;
      }
      state.cardholder_info.time_attendance = time_attendance.time_attendance;
    }
  },
  SET_ACCESS_RIGHT_INFO(state, access_right) {
    if (!Object.keys(access_right).length) {
      state.cardholder_info.access_right_inherited = false;
      state.cardholder_info.access_right = null;
    } else {
      if ("access_right_inherited" in access_right) {
        state.cardholder_info.access_right_inherited =
          access_right.access_right_inherited;
      } else {
        state.cardholder_info.access_right_inherited = false;
      }

      if (!access_right.access_right) {
        state.cardholder_info.access_right = null;
      } else {
        state.cardholder_info.access_right = access_right.access_right;
      }
    }

    state.cardholder_info.hasRules = access_right.hasRules;
  },
  SET_EXTRA_FEATURES_INFO(state, features) {
    state.cardholder_info.extra_features.type = features.type;
    state.cardholder_info.extra_features.time_type = features.time_type;
    state.cardholder_info.extra_features.time = features.time;
  },
  SET_CREDENTIAL_INFO(state, credential) {
    state.cardholder_info.credentials = credential;
  },
  SET_GROUP_INFO(state, group) {
    state.cardholder_info.cardholder_group = group.cardholder_group;
  },
  SET_LIMITATION_DATA(state, limitation) {
    if (!Object.keys(limitation).length) {
      state.cardholder_info.limitations.limitation_inherited = false;
      state.cardholder_info.limitations = {};
    } else {
      if ("limitation_inherited" in limitation) {
        state.cardholder_info.limitations.limitation_inherited =
          limitation.limitation_inherited;
      } else {
        state.cardholder_info.limitations.limitation_inherited = false;
      }
      state.cardholder_info.limitations = limitation;
    }
  },
  SET_EDIT_DATA(state, edit_data) {
    state.edit_cardholder_info = {};
    if (edit_data.extra_features) {
      edit_data.extra_features = JSON.parse(edit_data.extra_features);
    }

    if (edit_data.avatar) {
      edit_data.avatar = JSON.parse(edit_data.avatar);
    }

    if (edit_data.status) {
      edit_data.status = edit_data.status == "active" ? true : false;
      edit_data.save_status = edit_data.status;
    }

    if (
      edit_data.limitations &&
      edit_data.limitations &&
      edit_data.limitations.valid_due &&
      edit_data.limitations.valid_from
    ) {

      const due = getTime(edit_data.limitations.valid_due)
      const from = getTime(edit_data.limitations.valid_from)



      edit_data.limitations.valid_due = due
      edit_data.limitations.valid_from = from
    }

    if (edit_data.credentials) {
      state.edit_cardholder_info.credentials = edit_data.credentials;
    }

    state.edit_cardholder_info = { ...edit_data };
  },
  SET_EDIT_CARDHOLDER_INFO(state, cardholder) {
    for (const key in cardholder) {
      state.edit_cardholder_info[key] = cardholder[key];
    }
  },
  SET_EDIT_CARDHOLDER_GUEST(state, guest) {
    state.edit_cardholder_info = { ...state.edit_cardholder_info, ...guest };
  },
  SET_CARDHOLDER_GUEST(state, guest) {
    state.cardholder_info = { ...state.cardholder_info, ...guest };
  },
  SET_EDIT_CREDENTIAL_INFO(state, credential) {
    state.edit_cardholder_info.credentials = credential;
  },
  SET_EDIT_EXTRA_FEATURES_INFO(state, features) {
    state.edit_cardholder_info.extra_features.type = features.type;
    state.edit_cardholder_info.extra_features.time_type = features.time_type;
    state.edit_cardholder_info.extra_features.time = features.time;
  },
  SET_EDIT_TIME_ATTEND_INFO(state, time_attendance) {
    if (!Object.keys(time_attendance).length) {
      state.edit_cardholder_info.time_attendance_inherited = false;
      state.edit_cardholder_info.time_attendance = null;
      state.edit_cardholder_info.time_attendances = null;
    } else {
      if ("time_attendance_inherited" in time_attendance) {
        state.edit_cardholder_info.time_attendance_inherited =
          time_attendance.time_attendance_inherited;
      } else {
        state.edit_cardholder_info.time_attendance_inherited = false;
      }
      state.edit_cardholder_info.time_attendance =
        time_attendance.time_attendance;
    }
  },
  SET_EDIT_ACCESS_RIGHT_INFO(state, access_right) {
    if (!Object.keys(access_right).length) {
      state.edit_cardholder_info.access_right_inherited = false;
      state.edit_cardholder_info.access_right = null;
      state.edit_cardholder_info.access_rights = null;
    } else {
      if ("access_right_inherited" in access_right) {
        state.edit_cardholder_info.access_right_inherited =
          access_right.access_right_inherited;
      } else {
        state.edit_cardholder_info.access_right_inherited = false;
      }

      if (!access_right.access_right) {
        state.edit_cardholder_info.access_right = null;
      } else {
        state.edit_cardholder_info.access_right = access_right.access_right;
      }
    }

    state.edit_cardholder_info.hasRules = access_right.hasRules;
  },
  SET_EDIT_ANTIPASS_INFO(state, antipass_back) {
    state.edit_cardholder_info = {
      ...state.edit_cardholder_info,
      ...antipass_back,
    };
  },
  SET_EDIT_LIMITATION_DATA(state, limitation) {
    if ("limitation_inherited" in limitation) {
      state.edit_cardholder_info.limitation_inherited =
        limitation.limitation_inherited;
    } else {
      state.edit_cardholder_info.limitation_inherited = false;
    }
    state.edit_cardholder_info.limitations = limitation;
  },
  SET_EDIT_GROUP_INFO(state, group) {
    state.edit_cardholder_info.cardholder_group = group.cardholder_group;
  },
  RESET_ANTIPASS_INFO(state) {
    state.cardholder_info.antipass_backs = {
      antipass_back_inherited: false,
      enable_antipass_back: false,
    };
  },
  RESET_EDIT_ANTIPASS_INFO(state) {
    state.edit_cardholder_info.antipass_backs = null;
    state.edit_cardholder_info.antipass_back = null;
    state.edit_cardholder_info.antipass_back_inherited = null;
  },
  SET_CREDENTIAL_CODE(state, credential) {
    let credentials = state.edit_cardholder_info
      ? state.edit_cardholder_info.credentials
      : [];

    if (credentials.length) {
      if (credential.mode === "automatic") {
        let find_credential = credentials.find(
          (c) =>
            c.id === credential.id && c.access_point == credential.access_point
        );
        if (find_credential) {
          find_credential.code = credential.code;
        }
      }
    }
  },
  CHANGE_GROUP(state, { ids, card_group }) {
    ids.forEach((id) => {
      const index = state.cardholders.data.findIndex((c) => c.id == id);
      state.cardholders.data[index].group = card_group;
    });
  },
  SET_CARDHOLDER(state, { cardholderss, params }) {
    let card_arr = [];

    let data = {};

    if (cardholderss.count) {
      data.data = cardholderss.data;
      data.count = cardholderss.count;
    } else {
      data.data = cardholderss;
      data.count = cardholderss.length;
    }
    let count = 0;
    if (params.page > 1) {
      count =
        data.count -
        params.page * params.page_items_count +
        params.page_items_count;
    } else {
      count = data.count;
    }

    data.data.forEach((cardholder, index) => {
      cardholder.count = count;
      count--;
      cardholder.selected = false;
      cardholder.name =
        cardholder.first_name +
        `${cardholder.last_name ? " " + cardholder.last_name : ""}`;
      cardholder.access_right = cardholder.access_right
        ? cardholder.access_rights.name
        : null;
      cardholder.antipass_back = cardholder.antipass_back
        ? cardholder.antipass_backs.type
        : null;
      cardholder.group = cardholder.cardholder_group
        ? cardholder.cardholder_groups.name
        : null;
      cardholder.status = cardholder.status;
      cardholder.company = cardholder.company_name;
      if (state.checked_cardholders[cardholder.id]) {
        cardholder.selected = true;
      }
      card_arr.push(cardholder);
    });
    state.cardholders = data;
  },
  UPDATE_CARD_STATUS(state, { status, ids }) {
    ids.forEach((id) => {
      const index = state.cardholders.data.findIndex((c) => c.id == id);
      state.cardholders.data[index].status = status;
    });
  },

  SET_ALL_CHECKED(state, obj) {
    state.cardholders.data.map(function (x) {
      x.selected = obj.event;
      state.checked_cardholders[x.id] = obj.event;
    });
  },
  CHECK_ITEM(state, { event, item }) {
    let find = state.cardholders.data.find((a) => a.id == item.id);
    if (find) {
      find.selected = event;
    }

    state.checked_cardholders[find.id] = event;
  },
  SET_CARD(state, { cardholder, params }) {
    cardholder.selected = false;
    cardholder.name =
      cardholder.first_name +
      `${cardholder.last_name ? " " + cardholder.last_name : ""}`;
    cardholder.access_right = cardholder.access_right
      ? cardholder.access_rights.name
      : null;
    cardholder.antipass_back = cardholder.antipass_back
      ? cardholder.antipass_backs.type
      : null;
    cardholder.group = cardholder.cardholder_group
      ? cardholder.cardholder_groups.name
      : null;
    cardholder.status = cardholder.status;
    cardholder.company = cardholder.company_name;
    state.cardholders.data.unshift(cardholder);

    let card_arr = [];

    state.cardholders.data.forEach((cardholder, index) => {
      cardholder.count = index + 1;

      card_arr.push(cardholder);
    });

    state.cardholders.data = card_arr;
  },
  UPDATE_CARD(state, cardholder) {
    const productIndex = state.cardholders.data.findIndex(
      (p) => p.id == cardholder.id
    );
    state.cardholders.data[productIndex].selected = false;
    state.cardholders.data[productIndex].name =
      cardholder.first_name +
      `${cardholder.last_name ? " " + cardholder.last_name : ""}`;
    state.cardholders.data[productIndex].access_right = cardholder.access_right
      ? cardholder.access_rights.name
      : null;
    state.cardholders.data[productIndex].antipass_back =
      cardholder.antipass_back ? cardholder.antipass_backs.type : null;
    state.cardholders.data[productIndex].group = cardholder.cardholder_group
      ? cardholder.cardholder_groups.name
      : null;
    state.cardholders.data[productIndex].status = cardholder.status;
    state.cardholders.data[productIndex].company = cardholder.company_name;
  },
  DELETE_CARDHOLDER_MANY(state, ids) {
    ids.forEach((id) => {
      const index = state.cardholders.data.findIndex((u) => u.id == id);
      state.cardholders.data.splice(index, 1);
    });
    if (state.cardholders.data.length) {
      let card_arr = [];
      state.cardholders.data.forEach((cardholder, index) => {
        cardholder.count = index + 1;

        card_arr.push(cardholder);
      });
      state.cardholders.data = card_arr;
    }
  },
  DELETE_CARDHOLDER(state, id) {
    const rightIndex = state.cardholders.data.findIndex((u) => u.id == id);
    state.cardholders.data.splice(rightIndex, 1);
    if (state.cardholders.data.length) {
      let card_arr = [];

      state.cardholders.data.forEach((cardholder, index) => {
        cardholder.count = index + 1;

        card_arr.push(cardholder);
      });

      state.cardholders.data = card_arr;
    }
  },
  SET_ALL_INHERIT(state) {
    state.cardholder_info.time_attendance_inherited = true;
    state.cardholder_info.access_right_inherited = true;
    state.cardholder_info.antipass_backs.antipass_back_inherited = true;
    state.cardholder_info.limitations.limitation_inherited = true;
  },
  SET_ALL_EDIT_INHERIT(state) {
    state.edit_cardholder_info.time_attendance_inherited = true;
    state.edit_cardholder_info.access_right_inherited = true;
    state.edit_cardholder_info.antipass_backs.antipass_back_inherited = true;
    state.edit_cardholder_info.limitations.limitation_inherited = true;
  },
  UNCHECK_INHERIT(state) {
    state.cardholder_info.time_attendance_inherited = false;
    state.cardholder_info.access_right_inherited = false;

    state.cardholder_info.access_right = null;
    state.cardholder_info.time_attendance = null;
    state.cardholder_info.antipass_backs = {
      antipass_back_inherited: false,
      enable_antipass_back: false,
    };
    state.cardholder_info.limitations = {
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
      // last_use_counter_current: 0,
    };
  },
  RESET_CARD_INFO(state) {
    state.cardholder_info = {
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
        enable_antipass_back: false,
      },

      time_attendance_inherited: false,
      time_attendance: null,
      access_right_inherited: false,
      access_right: null,

      extra_features: {
        time: null,

        type: null,
        time_type: null,
      },
      car_infos: {
        model: null,
        color: null,
        lp_number: null,
        car_credential: null,
        car_event: false,
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
        // last_use_counter_current: 0,
      },
      credentials: [],
    };
  },
  SET_GUESTS(state, guests) {
    const guest_arr = [];
    if (guests.length) {
      guests.forEach((guest, index) => {
        guest.count = index + 1;
        guest_arr.push(guest);
      });
    }
    state.guests = guest_arr;
  },
  SET_GUEST(state, guest) {
    state.guests.push(guest);

    const guest_arr = [];
    if (state.guests.length) {
      state.guests.forEach((guest, index) => {
        guest.count = index + 1;
        guest_arr.push(guest);
      });
    }
    state.guests = guest_arr;
  },
  UPDATE_GUEST(state, guest) {
    const guest_index = state.guests.findIndex((u) => u.id == guest.id);
    state.guests[guest_index] = guest;

    let guest_arr = [];

    state.guests.forEach((guest, index) => {
      guest.count = index + 1;

      guest_arr.push(guest);
    });

    state.guests = guest_arr;
  },
  DELETE_GUEST(state, id) {
    const rightIndex = state.guests.findIndex((u) => u.id == id);
    state.guests.splice(rightIndex, 1);
    if (state.guests.length) {
      let guest_arr = [];

      state.guests.forEach((guest, index) => {
        guest.count = index + 1;

        guest_arr.push(guest);
      });

      state.guests = guest_arr;
    }
  },
};

const getTime = (date) => {
  const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var isFirefox = typeof InstallTrigger !== "undefined";
  var isSafari =
    navigator.vendor &&
    navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("CriOS") == -1 &&
    navigator.userAgent.indexOf("FxiOS") == -1;

  var is_OSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

  let correct_date;
  if (isFirefox || isSafari || is_OSX) {
    const local = moment.utc(date, "YYYY-MM-DD HH:mm:ss").tz(time);
    const momentFormat = moment(local, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    correct_date = momentFormat;
  } else {
    correct_date = moment(date).tz(time).format(`YYYY-MM-DD HH:mm:ss`);
  }

  return correct_date;
};
