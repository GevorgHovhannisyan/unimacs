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
  fetchScheduleTree({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`schedule/tree`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          // commit("SET_TREE_DATA", response.data)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchSchedules({ commit }, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `schedule`,
          { headers: { Authorization: localStorage.token } , params},
          
        )
        .then((response) => {
          commit("SET_SCHEDULES", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchSchedule({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`schedule/${id}`, {
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
  fetchScheduleRelation({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`schedule/relations/${id}`, {
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
  fetchTimeFrame({ commit }, payload) {
    const query = `schedule_id=${payload.pid}&name=${payload.name}`;
    return new Promise((resolve, reject) => {
      axios
        .get(`schedule/timeframe?${query}`, {
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
  createSchedule({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`schedule`, payload, {
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
  createTimeFrame({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`schedule/timeframe`, payload, {
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
  updateTimeFrame({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .put(`schedule/timeframe`, payload, {
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
  updateScheduleInfo({ commit }, obj) {
    return new Promise((resolve, reject) => {
      axios
        .put(`schedule`, obj, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("UPDATE_SCHEDULE_INFO", response.data);

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  copyPaste({ commit }, obj) {
    return new Promise((resolve, reject) => {
      axios
        .put(`schedule/timeframe/clone`, obj, {
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

  deleteSchedule({ commit }, obj) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`schedule`, {
          headers: { Authorization: localStorage.token },
          data: obj,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deleteTimeFrame({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`schedule/timeframe`, {
          headers: { Authorization: localStorage.token },
          data: { id: id },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deleteTimeFrameByName({ commit }, obj) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`schedule/timeframe`, {
          headers: { Authorization: localStorage.token },
          data: obj,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
