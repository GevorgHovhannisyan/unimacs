/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import axios from "axios";
import moment from "moment";

export default {
  SET_MAIN(state, data) {
    if (Object.keys(data).length) {
      for (const key in data) {
        if (key in state.acu_data) {
          state.acu_data[key] = data[key];
        }
      }
    }
  },
  UPDATE_ACU_STATUS(state, data) {
    const find_acu = state.acu.findIndex((a) => a.id == data);
    state.acu[find_acu].status = "active";
  },
  UPDATE_MAIN(state, data) {
    for (const key in data) {
      if (key in state.edit_acu_data) {
        state.edit_acu_data[key] = data[key];
      }
    }
  },
  SET_TIME(state, data) {
    state.acu_data.time = { ...data.data };
  },
  UPDATE_TIME(state, data) {
    state.edit_acu_data.time = { ...data.data };
  },
  UPDATE_NETWORK(state, data) {
    if (!state.edit_acu_data.network) {
      state.edit_acu_data.network = {};
    }
    for (const i in data) {
      state.edit_acu_data.network[i] = data[i];
    }
  },
  UPDATE_INTERFACE(state, data) {
    if (Object.keys(data).length) {
      if (!state.edit_acu_data.interface) {
        state.edit_acu_data.interface = {};
      }

      for (const i in data) {
        state.edit_acu_data.interface[i] = data[i];
      }
    }
  },
  SET_POINT(state, data) {
    state.acu_data.access_points[data.id] = data;
    state.acu_data.access_points[data.id].readers = {};
  },
  SET_EDIT_POINT(state, data) {
    if (!state.edit_acu_data.new_access_points) {
      state.edit_acu_data.new_access_points = {};
      state.edit_acu_data.new_access_points[data.id] = data;
      state.edit_acu_data.new_access_points[data.id].readers = {};
    } else {
      state.edit_acu_data.new_access_points[data.id] = data;
      state.edit_acu_data.new_access_points[data.id].readers = {};
    }
  },
  SET_POINT_DATA(state, data) {
    const item = data.data;
    const name = data.name;

    if (Object.keys(item).length) {
      for (const key in item) {
        state.acu_data.access_points[name][key] = item[key];
      }
    }
  },
  SET_EDIT_POINT_DATA(state, data) {
    const item = data.data;
    const name = data.name;
    if (Object.keys(item).length) {
      if (Number.isInteger(+name)) {
        let find = state.edit_acu_data.access_points.find((a) => a.id == +name);
        for (const key in item) {
          if (key in find) {
            find[key] = item[key];
          }
        }
      } else {
        for (const key in item) {
          state.edit_acu_data.new_access_points[name][key] = item[key];
        }
      }
    }
  },
  SET_READER(state, reader) {
    state.acu_data.access_points[state.active_point].readers[reader.id] =
      reader;
  },
  SET_EDIT_READER(state, reader_data) {
    if (Number.isInteger(+state.edit_active_point)) {
      let access_point;
      access_point = state.edit_acu_data.access_points.find(
        (a) => a.id == +state.edit_active_point
      );
      if (!access_point.new_readers) {
        access_point.new_readers = {};
        access_point.new_readers[reader_data.id] = reader_data;
      } else {
        access_point.new_readers[reader_data.id] = reader_data;
      }
    } else {
      state.edit_acu_data.new_access_points[state.edit_active_point].readers[
        reader_data.id
      ] = reader_data;
    }
  },
  SET_READER_DATA(state, data) {
    state.acu_data.access_points[state.active_point].readers[
      state.active_reader
    ].reader_info = data.data;
  },
  CHANGE_ACTIVE_DEVICE(state, id) {
    state.active_device = id;
  },
  ADD_DEVICE(state, data) {
    if (!state.edit_acu_data.new_ext_device) {
      state.edit_acu_data.new_ext_device = {};
      state.edit_acu_data.new_ext_device[data.id] = data;
    } else {
      state.edit_acu_data.new_ext_device[data.id] = data;
    }
  },
  UPDATE_DEVICE(state, payload) {
    let ext_device;

    if (!payload.message) {
      ext_device = state.edit_acu_data.ext_devices.find(
        (a) => a.id == payload.id
      );
      ext_device = payload;
    }
  },
  SET_DEVICE_INFO(state, data) {
    let active_dev;

    if (state.active_device.includes("ext_")) {
      active_dev = +state.active_device.split("_", 2)[1];
    }
    let new_device = state.edit_acu_data.new_ext_device;

    let ext_device;

    if (Number.isInteger(+active_dev)) {
      ext_device = state.edit_acu_data.ext_devices.find(
        (a) => a.id == +active_dev
      );
      for (const i in data) {
        ext_device[i] = data[i];
      }
    } else {
      if (
        new_device[state.active_device] &&
        !new_device[state.active_device].deleted
      ) {
        for (const i in data) {
          state.edit_acu_data.new_ext_device[state.active_device][i] = data[i];
        }
      } else if (
        new_device[state.active_device] &&
        new_device[state.active_device].deleted
      ) {
        ext_device = state.edit_acu_data.ext_devices.find(
          (a) => a.save_id == data.save_id
        );
        for (const i in data) {
          if (i !== "id") {
            ext_device[i] = data[i];
          }
        }
      }
    }
  },
  SAVE_DEVICES(state, device) {
    device.save_id = state.active_device;

    let acu_state = state.edit_acu_data;

    if (acu_state.new_ext_device[state.active_device]) {
      acu_state.new_ext_device[state.active_device].deleted = true;
      acu_state.ext_devices.push(device);
    }
  },
  SET_EDIT_READER_DATA(state, item) {
    let data = item.data;
    let access_point;
    let reader;
    let model = state.edit_acu_data.model;
    let elevator_mode = state.edit_acu_data.elevator_mode;
    if (
      (model == "Icon" || model == "Icon-PRO") &&
      elevator_mode &&
      !state.edit_active_point
    ) {
      state.edit_acu_data.readers = data;
    } else {
      if (Number.isInteger(+state.edit_active_point)) {
        access_point = state.edit_acu_data.access_points.find(
          (a) => a.id == state.edit_active_point
        );
        if (Number.isInteger(+data.id)) {
          reader = access_point.readers.find((r) => r.id == +data.id);
          for (const key in data) {
            reader[key] = data[key];
          }
        } else if (state.res_types[state.edit_active_reader.split("-", 2)[1]]) {
          if (data.impulse_time) data.impulse_time = +data.impulse_time;
          reader = access_point.resources[
            state.edit_active_reader.split("-", 2)[1]
          ] = data;
        } else {
          if (data.impulse_time) data.impulse_time = +data.impulse_time;

          reader = access_point.new_readers[data.id];
          if (!reader.reader_info) {
            reader.reader_info = {};
          }
          reader.reader_info = data;
        }
      } else {
        access_point =
          state.edit_acu_data.new_access_points[state.edit_active_point];
        if (data.impulse_time) data.impulse_time = +data.impulse_time;

        reader = access_point.readers[state.edit_active_reader];
        if (reader.reader_info) {
          reader.reader_info = data;
        } else {
          reader.reader_info = {};
          reader.reader_info = data;
        }
      }
    }
  },
  CHANGE_ACTIVE_POINT(state, active_point) {
    state.active_point = active_point;
  },
  CHANGE_EDIT_ACTIVE_POINT(state, active_point) {
    state.edit_active_point = active_point;
  },
  CHANGE_ACTIVE_READER(state, active_reader) {
    state.active_reader = active_reader;
  },
  CHANGE_EDIT_ACTIVE_READER(state, active_reader) {
    state.edit_active_reader = active_reader;
  },
  SET_ACCESS_POINTS_PAGING(state, count) {
    state.access_points_count = +count;
  },
  SET_ACCESS_POINTS(state, { points, params, counts }) {
    let arr = [];
    if (points.length) {
      let count = 0;
      if (params && params.page > 1) {
        count =
          counts -
          params.page * params.page_items_count +
          params.page_items_count;
      } else {
        count = counts;
      }

      points.forEach((item, index) => {
        if (item.access_point_groups) {
          item.group = item.access_point_groups.name;
        }
        if (item.acus) {
          item.acu_status = item.acus.cloud_status;
          item.acu_name = item.acus.name;

          if (
            item.acus.cloud_status == "offline" &&
            item.acus.status == "active"
          ) {
            item.disabled = true;
          }
        }

        item.count = count;
        arr.push(item);
        count--;
      });
    }
    state.access_points = arr;
  },

  SET_RESOURCE(state, resource) {
    state.resources = resource;
  },
  // SET_DEVICE_DATA(state, resource) {
  //   state.resources = resource
  // },
  SET_EDIT_ACU_DATA(state, edit_data) {
    let data = edit_data;
    const reader_type = {
      0: "RFID",
      1: "KEYPAD",
      2: "FINGER",
      3: "FACE",
    };

    let treeArr = [];

    treeArr.push(
      {
        id: `acu_${data.id}`,
        name: data.name,
        parent_id: null,
        item_type: "acu",
        expanded: true,
      },
      {
        id: "ext_device",
        name: "Extension Devices",
        parent_id: `acu_${data.id}`,
        hasAttribute: { class: "device" },
        expanded: true,
        item_type: "ext_device",
      },
      {
        id: "access_point",
        name: "Access Points",
        parent_id: `acu_${data.id}`,
        item_type: "access_point",
        hasAttribute: { class: "access_point" },
        expanded: true,
      }
    );

    let model = data.model;
    let elevator_mode = data.elevator_mode;

    if (
      (model == "Icon" || model == "Icon-PRO") &&
      elevator_mode &&
      data.readers
    ) {
      const floor_reader = {
        id: data.reader,
        name: reader_type[data.readers.type],
        parent_id: `acu_${data.id}`,
        item_type: "readers",
        // hasAttribute: { class: "delete" },
      };
      treeArr.push(floor_reader);

      if (
        data.readers &&
        data.readers.osdp_data &&
        data.readers.osdp_data !== "null"
      ) {
        data.readers = {
          ...JSON.parse(data.readers.osdp_data),
          ...data.readers,
        };
      }
    }
    if (data.access_points.length) {
      for (let i = 0; i < data.access_points.length; i++) {
        if (
          data.access_points[i].readers &&
          data.access_points[i].readers.length
        ) {
          for (let j = 0; j < data.access_points[i].readers.length; j++) {
            if (data.access_points[i].readers[j].osdp_data) {
              let osdp_data = JSON.parse(
                data.access_points[i].readers[j].osdp_data
              );
              data.access_points[i].readers[j] = {
                ...data.access_points[i].readers[j],
                ...osdp_data,
              };
            }
          }
        }
      }
    }
    if (data.time) {
      data.time = JSON.parse(data.time);
    }

    if (data.access_points && data.access_points.length) {
      let access_points = data.access_points;
      let acc_point_class = "resource delete";

      // if ((model == "Icon" || model == "Icon-PRO") && elevator_mode) {
      //   acc_point_class = 'delete'
      // }

      access_points.forEach((point) => {
        treeArr.push({
          id: `ap_${point.id}`,
          name: point.name,
          info: point,
          parent_id: "access_point",
          hasAttribute: { class: acc_point_class },
          expanded: true,
          item_type: "access_point_inner",
        });
        if (point.readers.length) {
          point.readers.forEach((reader) => {
            treeArr.push({
              id: reader.id,
              info: reader,
              name: reader_type[reader.type],
              parent_id: `ap_${point.id}`,
              hasAttribute: { class: "delete" },
              expanded: true,
              item_type: "readers",
            });
          });
        }
        if (point.resources) {
          point.resources = JSON.parse(point.resources);
          for (const key in point.resources) {
            treeArr.push({
              id: `${point.id}-${key}`,
              info: point.resources[key],
              name: key,
              type: "resources",
              parent_id: `ap_${point.id}`,
              hasAttribute: { class: "delete" },
              expanded: true,
              item_type: "readers",
            });
          }
        }
      });
    }

    if (data.ext_devices.length) {
      data.ext_devices.forEach((ext_device) => {
        treeArr.push({
          id: "ext_" + ext_device.id,
          name: ext_device.name,
          hasAttribute: { class: "delete" },
          expanded: true,
          info: ext_device,
          parent_id: "ext_device",
          item_type: "relay_boards",
        });
      });
    }
    state.acu_edit_tree = treeArr;
    state.edit_acu_data = data;

    if (state.edit_acu_data.interface) {
      state.edit_acu_data.interface = JSON.parse(state.edit_acu_data.interface);
    }

    if (state.edit_acu_data.network) {
      state.edit_acu_data.network = JSON.parse(state.edit_acu_data.network);
    }
  },
  DELETE_TREE_ITEM(state, item) {
    if (item.item_type == "access_point_inner") {
      delete state.acu_data.access_points[item.id];
    } else if (item.item_type == "readers") {
      delete state.acu_data.access_points[state.active_point].readers[item.id];
    }
  },
  DELETE_EDIT_READER(state, item) {
    let access_points = state.edit_acu_data.access_points.find(
      (a) => a.id == item.access_point
    );
    let readerIndex = access_points.readers.findIndex((r) => r.id == item.id);
    access_points.readers[readerIndex].deleted = true;
  },
  DELETE_EDIT_EXT_DEVICE(state, item) {
    let ext_device_index = state.edit_acu_data.ext_devices.findIndex(
      (a) => a.id == +item.id
    );
    state.edit_acu_data.ext_devices.splice(ext_device_index, 1);
  },
  DELETE_EDIT_TREE_ITEM(state, item) {
    let access_point;
    let reader;

    if (item.item_type == "relay_boards") {
      let active_dev;

      if (item.id.includes("ext_")) {
        active_dev = +item.id.split("_", 2)[1];
      }

      if (Number.isInteger(+active_dev)) {
        axios
          .delete(`${process.env.VUE_APP_BACK}/extDevice`, {
            headers: { Authorization: localStorage.token },
            data: { id: +active_dev },
          })
          .then((res) => {
            if (res.data.message == "success") {
              let ext_device_index = state.edit_acu_data.ext_devices.findIndex(
                (a) => a.id == +active_dev
              );
              state.edit_acu_data.ext_devices.splice(ext_device_index, 1);
            }
          });
      } else if (state.edit_acu_data.new_ext_device[item.id].deleted) {
        let ext_device = state.edit_acu_data.ext_devices.find(
          (a) => a.save_id == item.id
        );
        axios
          .delete(`${process.env.VUE_APP_BACK}/extDevice`, {
            headers: { Authorization: localStorage.token },
            data: { id: ext_device.id },
          })
          .then((res) => {
            if (res.data.message == "success") {
              let ext_device_index = state.edit_acu_data.ext_devices.findIndex(
                (a) => a.id == ext_device.id
              );
              state.edit_acu_data.ext_devices.splice(ext_device_index, 1);
            }
          });
      } else {
        delete state.edit_acu_data.new_ext_device[item.id];
      }
    } else {
      if (Number.isInteger(+state.edit_active_point)) {
        access_point = state.edit_acu_data.access_points.find(
          (a) => a.id == +state.edit_active_point
        );
        if (item.item_type == "readers") {
          if (Number.isInteger(+item.id)) {
            axios
              .delete(`${process.env.VUE_APP_BACK}/accessPoint/reader`, {
                headers: { Authorization: localStorage.token },
                data: { id: +item.id },
              })
              .then((res) => {
                if (res.data.message == "success") {
                  let readerIndex = access_point.readers.findIndex(
                    (r) => r.id == +item.id
                  );
                  access_point.readers[readerIndex].deleted = true;
                }
              });
          } else if (state.res_types[item.id.split("-", 2)[1]]) {
            if (access_point.resources[item.id.split("-", 2)[1]]) {
              delete access_point.resources[item.id.split("-", 2)[1]];
            } else {
              delete access_point.new_readers[item.id];
            }
          } else {
            delete access_point.new_readers[item.id];
          }
        } else if (item.item_type == "access_point_inner") {
          axios
            .delete(`${process.env.VUE_APP_BACK}/accessPoint`, {
              headers: { Authorization: localStorage.token },
              data: { id: +item.id },
            })
            .then((res) => {
              // if (res.data.message == 'success') {
              let access_point_index =
                state.edit_acu_data.access_points.findIndex(
                  (a) => a.id == +item.id
                );
              state.edit_acu_data.access_points.splice(access_point_index, 1);
              // }
            });
        }
      } else {
        access_point = state.edit_acu_data.new_access_points;
        if (item.item_type == "access_point_inner") {
          delete state.edit_acu_data.new_access_points[item.id];
        } else if (item.item_type == "readers") {
          delete state.edit_acu_data.new_access_points[state.edit_active_point]
            .readers[item.id];
        }
      }
    }
  },

  RESET_TREE(state) {
    state.acu_data = {
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
    };
    state.active_reader = null;
    state.active_point = null;
  },
  SET_ACU_PAGING(state, count) {
    state.acu_count = +count;
  },
  SET_ACUS(state, { acus, params, counts }) {
    let acu_arr = [];
    if (acus.length) {
      let count = 0;
      if (params && params.page > 1) {
        count =
          counts -
          params.page * params.page_items_count +
          params.page_items_count;
      } else {
        count = counts;
      }
      const filterHiddens = acus.filter(
        (acu) => acu.cloud_status === "offline" && acu.status === "pending"
      );

      if (filterHiddens && filterHiddens.length) {
        count -= filterHiddens.length;
      }

      acus.forEach((acu) => {
        if (acu.network && JSON.parse(acu.network)) {
          acu.ip_address = JSON.parse(acu.network).ip_address
            ? JSON.parse(acu.network).ip_address
            : null;
          acu.connection_type = JSON.parse(acu.network).connection_type
            ? JSON.parse(acu.network).connection_type
            : null;
        }
        if (acu.acu_statuses) {
          acu.last_online = acu.acu_statuses.timestamp
            ? moment(new Date(+acu.acu_statuses.timestamp)).format(
                "YYYY-MM-DD HH:mm"
              )
            : null;
        }

        if (acu.registration_date) {
          acu.registration_date = moment(acu.registration_date).format(
            "YYYY-MM-DD HH:mm"
          );
        }

        if (acu.cloud_status == "offline" && acu.status == "active") {
          acu.disabled = true;
        }

        if (acu.cloud_status === "offline" && acu.status === "pending") {
        } else {
          acu.count = count;
          acu_arr.push(acu);
          count--;
        }
      });
    }
    state.acu = acu_arr;
  },
  SET_ACU(state, acu) {
    state.acu.unshift(acu);

    let acu_arr = [];
    state.acu.forEach((acus, index) => {
      acus.count = index + 1;

      acu_arr.push(acus);
    });

    state.cardholders = acu_arr;
  },
  SET_ACU_MODELS(state, models) {
    state.acu_model = models;
    state.acu_models = [];
    if (Object.keys(models).length) {
      Object.keys(models.controllers).forEach((model) => {
        state.acu_models.push({ label: model });
      });
    }
  },

  SET_ACCESS_POINT_TYPES(state, types) {
    state.points_types = [];
    if (types.length) {
      types.forEach((type) => {
        state.points_types.push({
          id: type,
          label: type.charAt(0).toUpperCase() + type.slice(1),
        });
      });
    }
  },

  DELETE_ACU(state, id) {
    const acuIndex = state.acu.findIndex((u) => u.id == id);
    state.acu.splice(acuIndex, 1);

    if (state.acu.length) {
      let count = state.acu.length;
      state.acu.forEach((acu, index) => {
        acu.count = count;
        count--;
      });
    }
  },

  DELETE_ACCESS_POINT(state, id) {
    const acuIndex = state.access_points.findIndex((u) => u.id == id);
    state.access_points.splice(acuIndex, 1);

    if (state.access_points.length) {
      let count = state.access_points.length;

      state.access_points.forEach((acu, index) => {
        acu.count = count;
        count--;
      });
    }
  },
  UPDATE_ACU(state, acu) {
    const productIndex = state.acu.findIndex((p) => p.id == acu.id);
    Object.assign(state.acu[productIndex], acu);
  },
  CHANGE_ACU_STATUS(state, data) {
    const productIndex = state.acu.findIndex((p) => p.id == data.acu.id);
    state.acu[productIndex].status = data.acu.status;

    const rightIndex = state.acu.findIndex((u) => u.id == data.pending_acu);
    state.acu.splice(rightIndex, 1);

    if (state.acu.length) {
      state.acu.forEach((acu, index) => {
        acu.count = index + 1;
      });
    }
  },
};
