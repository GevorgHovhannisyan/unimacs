import moment from "moment";

export const dashboardCardholderValidation = (cardholder_info) => {
  return (
    cardholder_info.first_name &&
    (cardholder_info.access_right || cardholder_info.access_right_inherited) &&
    cardholder_info.cardholder_group &&
    ((cardholder_info.limitations &&
      cardholder_info.limitations.enable_date &&
      cardholder_info.limitations.valid_due &&
      cardholder_info.limitations.valid_from) ||
      // (cardholder_info.limitations.pass_counter_enable &&
      //   cardholder_info.limitations.pass_counter_passes) ||
      // (cardholder_info.limitations.first_use_counter_enable &&
      //   cardholder_info.limitations.first_use_counter_days) ||
      // (cardholder_info.limitations.last_use_counter_enable &&
      //   cardholder_info.limitations.last_use_counter_days) ||
      cardholder_info.limitations.limitation_inherited)
  );
};
export const   flatToObject = (obj, prefix, originalKey) => {

  if (obj.hasOwnProperty(originalKey)) {
    return obj[originalKey];
  }
  let returnObject = {};
  for (const [key, value] of Object.entries(obj)) {

    if (key.startsWith(`${prefix}_`)) {
     
      let newKey = key.replace(`${prefix}_`, '');
      returnObject[newKey] = value;

    }

  }

  
 
  return returnObject;

}
 

export const bindLogs = (event, unique_id) => {
  let time_zone = null;
  if (
    event.access_point &&
    typeof event.access_point === "string" &&
    JSON.parse(event.access_point).time_zone
  ) {
    time_zone = JSON.parse(event.access_point).time_zone;
  }
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
    const local = moment
      .utc(event.date, "YYYY-MM-DD HH:mm:ss")
      .tz(time_zone ? time_zone : time);
    const momentFormat = moment(local, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    correct_date = momentFormat;
  } else {
    correct_date = moment(event.date + " GMT+0000")
      .tz(time_zone ? time_zone : time)
      .format(`YYYY-MM-DD HH:mm:ss`);
  }
  let eventObj = {};
  eventObj.id = unique_id;
  eventObj.date = correct_date;
  eventObj.event_type = event.event_type;
  eventObj.event = event.event;
  eventObj.result = event.result;
  eventObj.event_source = event.event_source;

  if (event.direction.length) {
    const lower = event.direction.toLowerCase();
    eventObj.direction = lower.charAt(0).toUpperCase() + lower.slice(1);
  }


  //  eventObj.full_name = event.cardholder.last_name
  //       ? event.cardholder.first_name + " " + event.cardholder.last_name
  //       : event.cardholder.first_name;

  let cardholder = flatToObject(event, 'cardholder', 'cardholder');
  let credential = flatToObject(event, 'credential', 'credential');
  let access_right = flatToObject(event, 'access_right','access_right');
  let access_point = flatToObject(event, 'access_point', 'access_point');

 


  if (cardholder) {

    event.cardholder =
      typeof cardholder == "string"
        ? JSON.parse(cardholder)
        : cardholder;

 


    eventObj.full_name = event.cardholder.last_name
      ? event.cardholder.first_name + " " + event.cardholder.last_name
      : event.cardholder.first_name;

    eventObj.first_name = event.cardholder.first_name
    eventObj.last_name = event.cardholder.last_name
    // eventObj.full_name = event.cardholder.last_name
    //   ? event.cardholder.first_name + " " + event.cardholder.last_name
    //   : event.cardholder.first_name;

    if (event.cardholder.email) {
      eventObj.email = event.cardholder.email;
    }
    if (event.cardholder.status) {
      eventObj.status = event.cardholder.status;
    }

    if (event.cardholder.company_name) {
      eventObj.company_name = event.cardholder.company_name;
    }

    if (event.cardholder.phone) {
      eventObj.phone = event.cardholder.phone;
    }

    if (event.cardholder.family_name) {
      eventObj.family_name = event.cardholder.family_name;
    }
    if (event.cardholder.cardholder_groups) {
      eventObj.cardholder_groups_name = event.cardholder.cardholder_groups.name;
    }
    if (event.cardholder.limitations && event.cardholder.limitations.valid_due) {
      eventObj.valid_due = event.cardholder.limitations.valid_due;
    }
    if (event.cardholder.antipass_backs) {
      eventObj.antipass_backss = event.cardholder.antipass_backs;
    }

    eventObj.cardholder = {};
    if (event.cardholder.avatar) {
      eventObj.cardholder.avatar = event.cardholder.avatar;
    }

    if (event.cardholder.car_infos) {
      eventObj.cardholder.car_infos = event.cardholder.car_infos;
    }
    eventObj.cardholder.full_name = event.cardholder.last_name
      ? event.cardholder.first_name + " " + event.cardholder.last_name
      : event.cardholder.first_name;
  }

  if (credential) {
    event.credential =
      typeof credential == "string"
        ? JSON.parse(credential)
        : credential;

    eventObj.credential_saved = event.credential;

    const code = event.credential.code ? event.credential.code : null;
    if (code) {
      const hex_code = code.replace(/ /g, "");
      const code_ = BigInt("0x" + hex_code).toString();

      eventObj.credential = `${event.credential.type || "rfid"} ( ${code_} )`;
    } else {
      eventObj.credential = event.credential.type;
    }
  }

  if (access_right) {

    event.access_right =
      typeof access_right == "string"
        ? JSON.parse(access_right)
        : access_right;


    eventObj.access_right = event.access_right.name;
    eventObj.access_right_id = event.access_right.id;
  }
  if (access_point) {
    event.access_point =
      typeof access_point == "string"
        ? JSON.parse(access_point)
        : access_point;

    eventObj.access_point = event.access_point.name;
    eventObj.access_point_id = event.access_point.id;
  } else {
    eventObj.access_point_id = null;
  }

  return eventObj;
};

export const socketLog = (socketInfo, u_id) => {





  let data = JSON.parse(JSON.stringify(socketInfo));


  let cardholder = flatToObject(data, 'cardholder','cardholder');
  let credential = flatToObject(data, 'credential','credential');
  let access_right = flatToObject(data, 'access_right','access_right');
  let access_point = flatToObject(data, 'access_point','access_rights');


  let time_zone = null;
  if (access_point) {
    time_zone = access_point.time_zone;
  }

  const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var isFirefox = typeof InstallTrigger !== "undefined";
  let correct_date;
  const date = new Date(data.date * 1000);
  const time_z = time_zone ? time_zone : time;

  var isSafari =
    navigator.vendor &&
    navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("CriOS") == -1 &&
    navigator.userAgent.indexOf("FxiOS") == -1;

  if (isFirefox || isSafari) {
    const momentFormat = moment.tz(date, time_z).format("YYYY-MM-DD HH:mm:ss");
    correct_date = momentFormat;
  } else {
    correct_date = moment(date).tz(time_z).format(`YYYY-MM-DD HH:mm:ss`);
  }
  data.date = correct_date; // new
  let eventObj = {};
  eventObj.id = u_id;
  eventObj.date = correct_date;
  eventObj.event_type = data.event_type;
  eventObj.event = data.event;
  eventObj.result = data.result;

  if (data.direction && data.direction.length) {
    const lower = data.direction.toLowerCase();
    eventObj.direction = lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  eventObj.event_source = data.event_source;


 



  if (cardholder) {

    eventObj.full_name = cardholder.last_name
      ? cardholder.first_name + " " + cardholder.last_name
      : cardholder.first_name;
    eventObj.email = cardholder.email;
    eventObj.status = cardholder.status;
    eventObj.phone = cardholder.phone;
    if (cardholder.company_name) {
      eventObj.company_name = cardholder.company_name;
    }
    // eventObj.first_name = cardholder.first_name
    // eventObj.last_name = cardholder.last_name || ''
  }

  if (credential) {
    eventObj.credential_saved = credential;
    eventObj.credential = credential.type;
    if (credential.code) {
      const hex_code = credential.code.replace(/ /g, "");
      const code_ = BigInt("0x" + hex_code).toString();

      eventObj.credential = `${credential.type || "rfid"} (${code_})`;
    } else {
      eventObj.credential = credential.type;
    }
  }

  if (access_right) {
    eventObj.access_right = access_right.name;
  }
  if (access_point) {
    eventObj.access_point = access_point.name;
  }

  if (data.access_point) {
    if (
      localStorage.activity_settings &&
      JSON.parse(localStorage.activity_settings).length
    ) {
      let items = JSON.parse(localStorage.activity_settings);

      if (!items.find((i) => i.id == data.access_point)) {
        items.push({
          id: data.access_point,
          name: access_point.name,
          selected: true,
        });
      }

      localStorage.activity_settings = JSON.stringify(items);
    }
  }


  return { eventObj, socketData: data };
};

export const accessPointsDataBind = (data, itemsPerPageStatus) => {
  let totalPage = 0;
  const sum = data.count % itemsPerPageStatus;
  if (!sum) {
    totalPage = Math.floor(data.count / itemsPerPageStatus);
  } else {
    totalPage = Math.floor(data.count / itemsPerPageStatus) + 1;
  }

  if (data && data.data.length) {
    data.data.forEach((point) => {
      if (point.last_activity) {
        const data = JSON.parse(point.last_activity);

        let time_zone = null;
        if (data && data.time_zone) {
          time_zone = data.time_zone;
        }

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
          const local = moment
            .utc(data.date * 1000, "YYYY-MM-DD HH:mm:ss")
            .tz(time_zone ? time_zone : time);
          const momentFormat = moment(local, "YYYY-MM-DD HH:mm:ss").format(
            "YYYY-MM-DD HH:mm:ss"
          );
          correct_date = momentFormat;
        } else {
          correct_date = moment(data.date * 1000)
            .tz(time_zone ? time_zone : time)
            .format(`YYYY-MM-DD HH:mm:ss`);
        }

        const event = data.event;
        const user = data.cardholder ? " / " + data.cardholder.first_name : "";
        point.last_activity = correct_date + " / " + event + user;
      }
      if (point.acus) {
        point.cloud_status = point.acus.cloud_status;
      }
    });
  }

  return { totalPage, pointData: data };
};

export const detailInformation = (event) => {
  let obj = { ...event };

  if (obj.cardholder) {
    if (obj.cardholder.avatar) {
      const avatar = JSON.parse(obj.cardholder.avatar);
      if (avatar) {
        obj.cardholder.image = `${process.env.VUE_APP_BACK}/${avatar.path}`;
      }
    }

    if (obj.cardholder.car_infos && obj.cardholder.car_infos.avatar) {
      const car_avatar = JSON.parse(obj.cardholder.car_infos.avatar);
      obj.cardholder.car_image = `${process.env.VUE_APP_BACK}/${car_avatar.path}`;
    }

    // obj.first_name = obj.cardholder.first_name
    // obj.last_name = obj.cardholder.last_name || ''

    if (!obj.api) {
      obj.first_name = obj.cardholder.first_name
      obj.last_name = obj.cardholder.last_name || ''
      obj.family_name = obj.cardholder.family_name || ''
      obj.email = obj.cardholder.email || ''
      obj.phone = obj.cardholder.phone || ''
      if (obj.cardholder.company_name) {
        obj.company_name = obj.cardholder.company_name;
      }
      if (obj.cardholder.cardholder_groups) {
        obj.cardholder_groups_name = obj.cardholder.cardholder_groups.name;
      }
    }
  }

  if (typeof obj.credential === 'object') {
    const hex_code = obj.credential.code.replace(/ /g, "");
    const code_ = BigInt("0x" + hex_code).toString();
    obj.credential = `rfid (${code_})`;

  }


  // if (obj.credential) {

  //   if(typeof obj.credential === 'object') {
  // const hex_code = obj.credential.code.replace(/ /g, "");
  // const code_ = BigInt("0x" + hex_code).toString();
  // obj.credential = `rfid (${code_})`;

  //   } else {

  //     obj.credential_saved = obj.credential;
  //     if (obj.credential.code) {
  //       const hex_code = obj.credential.code.replace(/ /g, "");
  //       const code_ = BigInt("0x" + hex_code).toString();

  //       obj.credential = `${obj.credential.type} (${code_})`;
  //     } else {
  //       obj.credential = obj.credential.type;
  //     }
  //   }
  // }



  if (obj.access_right_id) {
    const object = {
      id: obj.access_right_id,
      name: obj.access_right
    }
    obj.access_right = object
  }
  return obj;
};

export const getMonitorConfigs = (settings) => {
  const access_point1 =
    settings &&
      settings.dashboard_settings &&
      settings.dashboard_settings.ap_monitor_1
      ? settings.dashboard_settings.ap_monitor_1.access_point
      : null;

  const access_point2 =
    settings &&
      settings.dashboard_settings &&
      settings.dashboard_settings.ap_monitor_2
      ? settings.dashboard_settings.ap_monitor_2.access_point
      : null;

  const canPlay1 =
    settings &&
      settings.dashboard_settings &&
      settings.dashboard_settings.ap_monitor_1
      ? settings.dashboard_settings.ap_monitor_1.enable_sound
      : false;

  const canPlay2 =
    settings &&
      settings.dashboard_settings &&
      settings.dashboard_settings.ap_monitor_2
      ? settings.dashboard_settings.ap_monitor_2.enable_sound
      : false;

  return { access_point1, access_point2, canPlay1, canPlay2 };
};


export const bindSettings = (settings, logs_limit) => {
  const sets = JSON.parse(JSON.stringify(settings));
  if (!sets) {
    sets = {
      activity_limit: logs_limit
    }
  } else {
    sets.activity_limit = logs_limit
  }

  return sets
}
