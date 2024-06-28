const isFormValid = function (cardholder_info) {
  return (
    cardholder_info.first_name &&
    (cardholder_info.access_right ||
      cardholder_info.access_right_inherited) &&
    (cardholder_info.limitations.limitation_inherited ||
      (cardholder_info.limitations.enable_date &&
        cardholder_info.limitations.valid_due &&
        cardholder_info.limitations.valid_from)

      // || (cardholder_info.limitations.pass_counter_enable &&
      //     cardholder_info.limitations.pass_counter_passes) ||
      // (cardholder_info.limitations.first_use_counter_enable &&
      //     cardholder_info.limitations.first_use_counter_days) ||
      // (cardholder_info.limitations.last_use_counter_enable &&
      //     cardholder_info.limitations.last_use_counter_days)

    ) &&
    cardholder_info.cardholder_group
    //  &&
    // (cardholder_info.antipass_backs.antipass_back_inherited ||
    //   (cardholder_info.antipass_backs.type &&
    //     cardholder_info.antipass_backs.time_type))
  )

}


const isFormValidEdit = function (cardholder_info) {
  return (
    cardholder_info.first_name &&
    (cardholder_info.access_right ||
      cardholder_info.access_right_inherited) &&


    (cardholder_info.limitation_inherited ||
      (cardholder_info.limitations.enable_date &&
        cardholder_info.limitations.valid_due &&
        cardholder_info.limitations.valid_from)
      //     ||
      // (cardholder_info.limitations.pass_counter_enable &&
      //     cardholder_info.limitations.pass_counter_passes) ||
      // (cardholder_info.limitations.first_use_counter_enable &&
      //     cardholder_info.limitations.first_use_counter_days) ||
      // (cardholder_info.limitations.last_use_counter_enable &&
      //     cardholder_info.limitations.last_use_counter_days)
    ) &&
    cardholder_info.cardholder_group
    // &&
    // (cardholder_info.antipass_back_inherited ||
    //   (cardholder_info.antipass_backs.type &&
    //     cardholder_info.antipass_backs.time_type))
  );

}

export { isFormValid, isFormValidEdit }
