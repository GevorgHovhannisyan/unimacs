export default {
  SET_ZONES(state, zones) {
    state.zones = []
    let arr = []
    if (zones.length) {
      zones.forEach(zone => {

        if (!zone.antipass_back) {
          zone.antipass_backs = {
            type: 'disable',
            enable_timer: false,
            time: 0,
            time_type: "minutes",
          };
        }

        if (zone.apb_reset_timer && typeof zone.apb_reset_timer == 'string') {
          zone.apb_reset_timer = JSON.parse(zone.apb_reset_timer)
        }
        if (zone.people_limits_max && typeof zone.people_limits_max == 'string') {
          zone.people_limits_max = JSON.parse(zone.people_limits_max)
        }
        if (zone.people_limits_min && typeof zone.people_limits_min == 'string') {
          zone.people_limits_min = JSON.parse(zone.people_limits_min)
        }
        arr.push(zone)
      });
    }

    state.zones = arr;
  },
  SET_ZONE(state, zone) {
    let default_extra = {
      "antipass_backs": {
        "type": 'disable',
        "enable_timer": false,
        "time": 0,
        "time_type": "minutes"
      },
      apb_reset_timer: {
        enable: false,
        time: null,
        unit: "seconds",
      },
      people_limits_min: {
        enable: false,
        time: null,
      },
      people_limits_max: {
        enable: false,
        time: null,
      },
    }

    if (zone.pid) {
      zone.parent_id = zone.pid
    }
    state.zones.push({ ...zone, ...default_extra });
  },
  CHANGE_ID(state, zone) {
    const index = state.zones.findIndex(z => z.id == state.active_zone)
    state.zones[index].id = zone.id;
  },
  DEL_ZONE(state, id) {
    const index = state.zones.findIndex(z => z.id == +id)
    state.zones.splice(index, 1)
  },
  SET_ACTIVE_ZONES(state, zone) {
    state.active_zone = zone
  },
  SET_ZONE_INFO(state, info) {
    const index = state.zones.findIndex(z => z.id == state.active_zone)

    if (info.apb_reset_timer && typeof info.apb_reset_timer == 'string') {
      info.apb_reset_timer = JSON.parse(info.apb_reset_timer)
    }
    if (info.people_limits_max && typeof info.people_limits_max == 'string') {
      info.people_limits_max = JSON.parse(info.people_limits_max)
    }
    if (info.people_limits_min && typeof info.people_limits_min == 'string') {
      info.people_limits_min = JSON.parse(info.people_limits_min)
    }

    state.zones[index] = { ...state.zones[index], ...info }
  },
  SET_TREE_ITEM(state, zone) {
    state.treeData.push(zone)
  },
  SET_ACCESS_POINT_GROUPS(state, groups) {
    state.groups = groups
  },
  SET_ACCESS_POINT_GROUP(state, group) {
    state.groups.push(group)
  },
  DELETE_ACCESS_POINT_GROUP(state, id) {
    const deparatmentIndex = state.groups.findIndex((u) => u.id == id)
    state.groups.splice(deparatmentIndex, 1)
  },
  UPDATE_ACCESS_POINT_GROUP(state, group) {
    const productIndex = state.groups.findIndex(
      (p) => p.id == group.id
    );
    state.groups[productIndex] = {...group}
    // Object.assign(state.groups[productIndex], group);
  },

}