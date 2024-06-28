const createCardholder = function (cardholder_info) {

  if (cardholder_info.credentials && cardholder_info.credentials.length) {
    cardholder_info.credentials.forEach((credential) => {
      delete credential.id;
    });
  }

  cardholder_info.status = cardholder_info.status ? "active" : "inactive";


  const saveObject = {
    ...cardholder_info,

    // time_attendance_inherited: cardholder_info.time_attendance_inherited,
    // time_attendance: cardholder_info.time_attendance,
    time_attendance: null,

    // antipass_back_inherited: cardholder_info.antipass_backs
    //     .antipass_back_inherited
    //     ? cardholder_info.antipass_backs.antipass_back_inherited
    //     : false,

    // antipass_backs: { ...cardholder_info.antipass_backs },
    antipass_backs: null,
    car_infos: /*null*/ cardholder_info.car_infos,

    // extra_features: Object.keys(cardholder_info.extra_features).length
    //     ? JSON.stringify(cardholder_info.extra_features)
    //     : null,
    extra_features: null,
    cardholder_group: cardholder_info.cardholder_group,

    limitation_inherited: cardholder_info.limitations.limitation_inherited
      ? cardholder_info.limitations.limitation_inherited
      : false,
    limitations: { ...cardholder_info.limitations },

    access_right_inherited: cardholder_info.access_right_inherited
      ? cardholder_info.access_right_inherited
      : false,
    access_right: cardholder_info.access_right,
    credentials: cardholder_info.credentials,
  };


  return saveObject


}

const editCardholder = function (cardholder) {

  if (cardholder.credentials && cardholder.credentials.length) {
    cardholder.credentials.forEach((credential) => {
      if (credential.new_cr) delete credential.id;
    });
  }

  const saveObject = {
    id: cardholder.id,
    email: cardholder.email,
    avatar: cardholder.avatar,
    user_account: cardholder.user_account,
    first_name: cardholder.first_name,
    last_name: cardholder.last_name,
    family_name: cardholder.family_name,
    phone: cardholder.phone,
    company_name: cardholder.company_name,
    status: cardholder.status ? "active" : "inactive",
    extra_features: null,
    // extra_features: Object.keys(cardholder.extra_features).length
    //     ? JSON.stringify(cardholder.extra_features)
    //     : null,
    cardholder_group: cardholder.cardholder_group,
    car_infos: cardholder.car_infos,
    limitations: cardholder.limitations,
    limitation_inherited: cardholder.limitation_inherited,
    // antipass_back_inherited: cardholder.antipass_back_inherited,
    // antipass_backs: cardholder.antipass_backs,
    antipass_backs: null,
    // time_attendance_inherited: cardholder.time_attendance_inherited,
    // time_attendance: cardholder.time_attendance,
    time_attendance: null,

    access_right_inherited: cardholder.access_right_inherited,
    access_right: cardholder.access_right,
    credentials: cardholder.credentials,
  };
  return saveObject

}


export { createCardholder, editCardholder }
