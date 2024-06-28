/*=========================================================================================
  File Name: moduleEmailActions.js
  Description: Email Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "@/axios.js";

export default {
  fetchCctvDevices({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`camera-device`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("SET_DEVICES", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchCctvSets({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`camera-set`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("SET_SETS", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchCameras({ commit }, payload) {
    const headers = {
      headers: { Authorization: localStorage.token },
    };
    if (payload && payload.params) {
      headers.params = payload.params;
    }

    if (payload && "hidden" in payload) {
      if (headers.params) {
        headers.params.hidden = payload.hidden;
      }
    }
    return new Promise((resolve, reject) => {
      axios
        .get(`camera`, headers)
        .then((response) => {
          if (payload && payload.isSet) {
            commit("SET_ALL_CAMERAS", response.data);
          } else {
            commit("SET_CAMERAS", response.data);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchCamerasAccessPoint({ commit }, id) {
    const headers = {
      headers: { Authorization: localStorage.token },
    };

    return new Promise((resolve, reject) => {
      axios
        .get(`camera/accessPoint/${id}`, headers)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchSet({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`camera-set/${id}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("SET_EDIT_DATA", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchAccessPointCameraSets({ commit }, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`accessPoint/cameraSets`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("SET_ACCESS_POINT_CAMSETS", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchAccessPointCameras({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`camera/accessPoint/${id}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  createCctvDevice({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `camera-device`,
          { ...payload },
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  createCctvSet({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `camera-set`,
          { ...payload },
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateDevice({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .put(`camera-device`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  updateSet({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .put(`camera-set`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateCamera({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .put(`camera`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  hideCameras({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .put(`camera/hidden`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  deleteCctvDevice({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`camera-device/${payload}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deleteCctvSet({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`camera-set/${payload}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deleteCamera({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`camera/${payload}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  testConnection({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `camera-device/test`,
          { ...payload },
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
