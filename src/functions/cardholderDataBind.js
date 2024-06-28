import moment from "moment";

const createDataBind = function (cardholder_info) {
  if (cardholder_info.credentials && cardholder_info.credentials.length) {
    cardholder_info.credentials.forEach((credential) => {
      delete credential.id;
    });
  }

  cardholder_info.status = cardholder_info.status ? "active" : "inactive";

  const binded = {
    ...cardholder_info,



    // time_attendance_inherited: cardholder_info.time_attendance_inherited,
    // time_attendance: cardholder_info.time_attendance,
    time_attendance: null,
    // antipass_back_inherited:
    //   cardholder_info.antipass_backs.antipass_back_inherited,
    // enable_antipass_back: cardholder_info.antipass_backs.enable_antipass_back,
    antipass_backs: null,
    car_infos: cardholder_info.car_infos,
    user_account: cardholder_info.user_account,
    extra_features: null,
    // extra_features:
    //   cardholder_info.extra_features &&
    //   Object.keys(cardholder_info.extra_features).length
    //     ? JSON.stringify(cardholder_info.extra_features)
    //     : null,

    cardholder_group: cardholder_info.cardholder_group,

    limitation_inherited: cardholder_info.limitations.limitation_inherited
      ? cardholder_info.limitations.limitation_inherited
      : false,

    access_right_inherited: cardholder_info.access_right_inherited
      ? cardholder_info.access_right_inherited
      : false,
    access_right: cardholder_info.access_right,
    credentials: cardholder_info.credentials,
    enable_create_guest: cardholder_info.enable_create_guest,
    guest_count: cardholder_info.guest_count,
  };

  if (cardholder_info.limitations) {
    binded.limitations = {
      enable_date: cardholder_info.limitations.enable_date || false,
      // "valid_from": cardholder_info.limitations.enable_date && cardholder_info.limitations.valid_from ? cardholder_info.limitations.valid_from : null,
      // "valid_due": cardholder_info.limitations.enable_date && cardholder_info.limitations.valid_due ? cardholder_info.limitations.valid_due : null,
      // pass_counter_enable:
      //   cardholder_info.limitations.pass_counter_enable || false,
      // pass_counter_passes:
      //   cardholder_info.limitations.pass_counter_enable &&
      //   cardholder_info.limitations.pass_counter_passes
      //     ? cardholder_info.limitations.pass_counter_passes
      //     : null,
      // pass_counter_current:
      //   cardholder_info.limitations.pass_counter_enable &&
      //   cardholder_info.limitations.pass_counter_current
      //     ? cardholder_info.limitations.pass_counter_current
      //     : null,
      // first_use_counter_enable:
      //   cardholder_info.limitations.first_use_counter_enable || false,
      // first_use_counter_days:
      //   cardholder_info.limitations.first_use_counter_enable &&
      //   cardholder_info.limitations.first_use_counter_days
      //     ? cardholder_info.limitations.first_use_counter_days
      //     : null,
      // first_use_counter_current:
      //   cardholder_info.limitations.first_use_counter_enable &&
      //   cardholder_info.limitations.first_use_counter_current
      //     ? cardholder_info.limitations.first_use_counter_current
      //     : null,
      // last_use_counter_enable:
      //   cardholder_info.limitations.last_use_counter_enable || false,
      // last_use_counter_days:
      //   cardholder_info.limitations.last_use_counter_enable &&
      //   cardholder_info.limitations.last_use_counter_days
      //     ? cardholder_info.limitations.last_use_counter_days
      //     : null,
      // last_use_counter_current:
      //   cardholder_info.limitations.last_use_counter_enable &&
      //   cardholder_info.limitations.last_use_counter_current
      //     ? cardholder_info.limitations.last_use_counter_current
      //     : null,
    };

    //          new

    if (cardholder_info.limitations.enable_date) {
      if (cardholder_info.limitations.valid_from) {
        const from = cardholder_info.limitations.valid_from;
        const due = cardholder_info.limitations.valid_due;

        const valid_from = getTime(from);
        const valid_due = getTime(due);



        // const valid_from = moment(from).utcOffset(0).format(`YYYY-MM-DD HH:mm`);
        // const valid_due = moment(due).utcOffset(0).format(`YYYY-MM-DD HH:mm`);
        binded.limitations.valid_from = valid_from;
        binded.limitations.valid_due = valid_due;
      }
    }
  }

  return binded;
};

const updateDataBind = function (cardholder) {
  if (cardholder.credentials && cardholder.credentials.length) {
    cardholder.credentials.forEach((credential) => {
      if (credential.new_cr) delete credential.id;
    });
  }
  const binded = {
    id: cardholder.id,
    email: cardholder.email,
    avatar: cardholder.avatar,
    user_account: cardholder.user_account,
    first_name: cardholder.first_name,
    last_name: cardholder.last_name ? cardholder.last_name : "",
    family_name: cardholder.family_name,
    phone: cardholder.phone,
    company_name: cardholder.company_name,
    status: cardholder.status ? "active" : "inactive",
    extra_features: null,
    // extra_features:
    //   cardholder.extra_features && Object.keys(cardholder.extra_features).length
    //     ? JSON.stringify(cardholder.extra_features)
    //     : null,
    cardholder_group: cardholder.cardholder_group,

    car_infos: cardholder.car_infos,

    limitation_inherited: cardholder.limitation_inherited,

    // antipass_back_inherited: cardholder.antipass_back_inherited,
    // enable_antipass_back: cardholder.enable_antipass_back,
    antipass_backs: null,
    // time_attendance_inherited: cardholder.time_attendance_inherited,
    // time_attendance: cardholder.time_attendance,
    time_attendance: null,

    access_right_inherited: cardholder.access_right_inherited,
    access_right: cardholder.access_right,
    credentials: cardholder.credentials,

    enable_create_guest: cardholder.enable_create_guest,
    guest_count: cardholder.guest_count,
    hasRules: cardholder.hasRules,
  };

  if (cardholder.limitations) {
    binded.limitations = {
      id: cardholder.limitations.id,
      enable_date: cardholder.limitations.enable_date || false,
      // valid_from: cardholder.limitations.enable_date && cardholder.limitations.valid_from ? cardholder.limitations.valid_from : null,
      // valid_due: cardholder.limitations.enable_date && cardholder.limitations.valid_due ? cardholder.limitations.valid_due : null,
      // pass_counter_enable: cardholder.limitations.pass_counter_enable || false,
      // pass_counter_passes:
      //   cardholder.limitations.pass_counter_enable &&
      //   cardholder.limitations.pass_counter_passes
      //     ? cardholder.limitations.pass_counter_passes
      //     : null,
      // pass_counter_current:
      //   cardholder.limitations.pass_counter_enable &&
      //   cardholder.limitations.pass_counter_current
      //     ? cardholder.limitations.pass_counter_current
      //     : null,
      // first_use_counter_enable:
      //   cardholder.limitations.first_use_counter_enable || false,
      // first_use_counter_days:
      //   cardholder.limitations.first_use_counter_enable &&
      //   cardholder.limitations.first_use_counter_days
      //     ? cardholder.limitations.first_use_counter_days
      //     : null,
      // first_use_counter_current:
      //   cardholder.limitations.first_use_counter_enable &&
      //   cardholder.limitations.first_use_counter_current
      //     ? cardholder.limitations.first_use_counter_current
      //     : null,
      // last_use_counter_enable:
      //   cardholder.limitations.last_use_counter_enable || false,
      // last_use_counter_days:
      //   cardholder.limitations.last_use_counter_enable &&
      //   cardholder.limitations.last_use_counter_days
      //     ? cardholder.limitations.last_use_counter_days
      //     : null,
      // last_use_counter_current:
      //   cardholder.limitations.last_use_counter_enable &&
      //   cardholder.limitations.last_use_counter_current
      //     ? cardholder.limitations.last_use_counter_current
      //     : null,
    };

    //          new

    if (cardholder.limitations.enable_date) {
      if (cardholder.limitations.valid_from) {
        const from = cardholder.limitations.valid_from;
        const due = cardholder.limitations.valid_due;


        const valid_from = getTime(from);
        const valid_due = getTime(due);

        // const valid_from = moment(cardholder.limitations.valid_from)
        //   .utcOffset(0)
        //   .format(`YYYY-MM-DD HH:mm`);
        // const valid_due = moment(cardholder.limitations.valid_due)
        //   .utcOffset(0)
        //   .format(`YYYY-MM-DD HH:mm`);
        binded.limitations.valid_from = valid_from;
        binded.limitations.valid_due = valid_due;
      }
    }
  }

  return binded;
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
    correct_date = moment(date).utc(0).format(`YYYY-MM-DD HH:mm:ss`);
  }

  return correct_date;
};

export { updateDataBind, createDataBind };
