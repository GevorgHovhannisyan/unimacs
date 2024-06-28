const validateTypesCreate = function (acu_data, active_point, selected_resources) {
    
      const findAcPoint = acu_data.access_points[active_point];

      if (selected_resources.length) {
        selected_resources = selected_resources.filter(
          (r) =>
            r.device == "RFID" ||
            r.device == "KEYPAD" ||
            r.device == "FINGER" ||
            r.device == "FACE"
        );
      }


      if (
        (findAcPoint.readers && Object.keys(findAcPoint.readers).length) ||
        selected_resources.length
      ) {
        return false;
      } else {
        return true
      }
  };

const validateTypes = function (acu_data, active_point, selected_resources) {
  if (Number.isInteger(+active_point)) {
    const findAcPoint = acu_data.access_points.find(
      (a) => a.id == active_point
    );

    let hasPoint = true;
    if (
      findAcPoint.readers.length &&
      findAcPoint.readers.find((r) => !r.deleted)
    ) {
      hasPoint = true;
    } else {
      hasPoint = false;
    }

    if (
      hasPoint ||
      selected_resources.length ||
      (findAcPoint.new_readers && Object.keys(findAcPoint.new_readers).length)
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    const findAcPoint = acu_data.new_access_points[active_point];
    if (
      (findAcPoint.readers && Object.keys(findAcPoint.readers).length) ||
      selected_resources.length
    ) {
      return false;
    }
  }
};

export { validateTypes, validateTypesCreate };
