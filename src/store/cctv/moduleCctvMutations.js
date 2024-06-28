/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
  SET_DEVICES(state, devices) {
    state.devices = devices;
  },
  SET_CAMERAS(state, cameras) {
    let camera_list = [];
    if (cameras.length) {
      camera_list = cameras.map((cam, index) => {
        cam.count = index + 1;
        cam.selected = false;
        if (cam.address_info && typeof cam.address_info === "string") {
          const address_info = JSON.parse(cam.address_info);
          cam.connection_type = address_info.Address;
          cam.port = address_info.Port;
        }
        if (cam.camera_device) {
          cam.device_type_name = cam.camera_devices.name;
        }
        return cam;
      });
    }
    state.cameras = camera_list;
  },
  SET_ALL_CAMERAS(state, all_cameras) {
    state.all_cameras = all_cameras;
  },
  SET_SETS(state, sets) {
    state.sets = sets;
  },
  SET_ACCESS_POINT_CAMSETS(state, sets) {
    state.accessPointCamSets = sets;
  },
  SET_EDIT_DATA(state, edit_set_data) {
    if (
      edit_set_data &&
      edit_set_data.camera_set_cameras &&
      edit_set_data.camera_set_cameras.length
    ) {
      edit_set_data.camera_set_cameras.map((cam) => {
        cam.device_type_name = cam.cameras.camera_devices.name;

        if (
          cam.cameras.address_info &&
          typeof cam.cameras.address_info === "string"
        ) {
          const address_info = JSON.parse(cam.cameras.address_info);
          cam.connection_type = address_info.Address;
          cam.port = address_info.Port;
        }
        cam.id = cam.cameras.id;
        cam.camera_device = cam.cameras.camera_device;
        cam.camera_devices = cam.cameras.camera_devices;
        cam.service_id = cam.cameras.service_id;
        cam.name = cam.cameras.name;

        return cam;
      });
    }

    state.edit_set_data = edit_set_data;
  },
  SET_SELECTED_CAMERAS(state, cameras) {
    state.cctv_selected_cameras = cameras;
  },
  APPEND_CAMERAS(state, cameras) {
    const cams = [...state.cameras]
    const hiddenCams = cameras;

    state.cameras = hiddenCams.concat(cams);
  },
  REMOVE_CAMERA_CCTV(state, id) {
    const index = state.cameras.findIndex(c => c.id === id);

    if(index !== -1) {
      state.cameras.splice(index, 1);
    }
  },
};
