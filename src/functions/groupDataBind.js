var checkLength = function (obj) {
    if (Object.keys(obj).length) {
        return true;
    }
    return false;
};


var zoneDataBind = function (data) {
    const group_zone = {
        name: data.name,
        description: data.description,
        parent_id: data.pid ? +data.pid : null,
        antipass_backs: {
            type: data.type,
            enable_timer: data.enable_timer,
            time: data.time,
            time_type: data.time_type,
          },

        apb_reset_timer: data.apb_reset_timer
            ? checkLength(data.apb_reset_timer)
                ? JSON.stringify(data.apb_reset_timer)
                : null
            : null,
        people_limits_min: data.people_limits_min
            ? checkLength(data.people_limits_min)
                ? JSON.stringify(data.people_limits_min)
                : null
            : null,
        people_limits_max: data.people_limits_max
            ? checkLength(data.people_limits_max)
                ? JSON.stringify(data.people_limits_max)
                : null
            : null,
    };


    return group_zone
}


export { zoneDataBind };

