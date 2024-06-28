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
  // Fetch emails
  fetchAccessPoint({ commit }, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`accessPoint`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((response) => {
          const points = response.data.data || response.data;
          commit("SET_ACCESS_POINTS", {
            points,
            params,
            counts: response.data.count,
          });
          if (response.data.count) {
            commit("SET_ACCESS_POINTS_PAGING", response.data.count);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  pasteACU({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`acu/copy`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("SET_ACU", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchAccessPointGroup({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`accessPointGroup`, {
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
  fetchAccessPointCardholder({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`accessPoint/cardholders`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          // commit('SET_ACCESS_POINTS', response.data)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchACUs({ commit }, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`acu`, { headers: { Authorization: localStorage.token }, params })
        .then((response) => {
          const acus = response.data.data || response.data;
          const counts = response.data.count;
          commit("SET_ACUS", { acus, params, counts });
          if (counts) {
            commit("SET_ACU_PAGING", counts);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchAcuModels({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`acu/models`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_ACU_MODELS", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchAttachHardware({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`acu/attach/hardware`, {
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
  fetchACU({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`acu/${id}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_EDIT_ACU_DATA", response.data);

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchAccessPointTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`accessPoint/types`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("SET_ACCESS_POINT_TYPES", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getDeviceData({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`acu/models`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          // commit('SET_DEVICE_DATA', response.data)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  addDevices({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`extDevice`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("SAVE_DEVICES", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  activateACU({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `acu/activate/hardware`,
          { hardware: payload },
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {
          if (response.data && response.data.message) {
            commit("UPDATE_ACU_STATUS", payload);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateDevices({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .put(`extDevice`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("UPDATE_DEVICE", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getAccessPoint({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`accessPoint/${id}`, {
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
  fetchResource({ commit }, type) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/accessPoint/resources/${type}`, {
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
  createACU({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`acu`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("SET_ACU", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  createAccessPoint({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`accessPoint`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("CREATE_ACCESS_POINT", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateACU({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .put(`acu`, payload, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("UPDATE_ACU", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  sendAttachedHardware({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`/acu/attach/hardware`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("CHANGE_ACU_STATUS", {
            acu: response.data,
            pending_acu: payload.attached_hardware,
          });

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  deleteACU({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`acu`, {
          headers: { Authorization: localStorage.token },
          data: { id: payload.id },
        })
        .then((response) => {
          commit("DELETE_ACU", payload.id);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deleteAccessPoint({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`accessPoint`, {
          headers: { Authorization: localStorage.token },
          data: { id: payload.id },
        })
        .then((response) => {
          commit("DELETE_ACCESS_POINT", payload.id);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deactivateAcu({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`acu/deactivate`, {
          headers: { Authorization: localStorage.token },
          data: { id: payload.id },
        })
        .then((response) => {
          commit("DELETE_ACU", payload.id);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  acuAction({ commit }, { acu, name }) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `acu/maintain`,
          { acu: acu.id, name },
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {
          if (name === "reset_to_factory" || name === "reset") {
            commit("DELETE_ACU", acu.id);
          }

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
