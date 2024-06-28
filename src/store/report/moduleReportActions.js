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
  fetchEvents({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`standardReport/eventList`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          let index = 1;
          let options = [];

          const events_list = res.data;
          let events_arr = [];
          for (const i in events_list) {
            for (const key in events_list[i].events) {
              const item = events_list[i].events[key];
              let event = {};
              event.id = key;
              event.count = index;
              event.event_type = events_list[i].name;
              event.event = item.event;
              event.event_source = item.source_entity;
              event.selected = false;
              events_arr.push(event);
              index++;
            }
          }

          if (Object.keys(events_list).length) {
            const event = events_list;
            for (const key in event) {
              options.push({ label: event[key].name, id: event[key].name });
            }
          }
          commit("SET_EVENT_LIST", { events: events_arr, types: options });
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  fetch_EDIT_Events({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`standardReport/eventList`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          let index = 1;
          const events_list = res.data;
          let options = [];
          let events_arr = [];
          for (const i in events_list) {
            for (const key in events_list[i].events) {
              const item = events_list[i].events[key];
              let event = {};
              event.id = key;
              event.count = index;
              event.event_type = events_list[i].name;
              event.event = item.event;
              event.event_source = item.source_entity;
              event.selected = false;
              events_arr.push(event);
              index++;
            }
          }

          if (Object.keys(events_list).length) {
            const event = events_list;
            for (const key in event) {
              options.push({ label: event[key].name, id: event[key].name });
            }
          }
          commit("EDIT_SET_EVENT_LIST", { events: events_arr, types: options });
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchPoints({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`accessPoint`, { headers: { Authorization: localStorage.token } })
        .then((res) => {
          let acc_array = [];

          const access_points = res.data;

          if (access_points.length) {
            access_points.forEach((point, index) => {
              const acc_point = {};
              acc_point.count = index + 1;
              acc_point.id = point.id;
              acc_point.access_point = point.name;
              if (point.access_point_zone)
                acc_point.location_zone = point.access_point_zones
                  ? point.access_point_zones.name
                  : "";
              if (point.acu) acc_point.acu_name = point.acus.name;
              acc_point.type = point.type;
              if (point.access_point_group)
                acc_point.groups = point.access_point_groups
                  ? point.access_point_groups.name
                  : "";
              acc_point.status = point.status;
              acc_point.mode = point.mode;
              if ("door_state" in point)
                acc_point.door_status = point.door_state;
              acc_point.selected = false;

              if (point.readers && point.readers.length) {
                const dir_object = point.readers[0];

                if ("direction" in dir_object) {
                  if (dir_object.direction === 1) {
                    acc_point.location_zone = dir_object.came_to_zones
                      ? dir_object.came_to_zones.name
                      : "No location zone";
                  } else if (dir_object.direction === 0) {
                    acc_point.location_zone = dir_object.leaving_zones
                      ? dir_object.leaving_zones.name
                      : "No leaving zone";
                  }
                }
              } else {
                acc_point.location_zone = "No readers";
              }

              acc_array.push(acc_point);
            });
          }
          commit("SET_POINT_LIST", acc_array);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchEditPoints({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`accessPoint`, { headers: { Authorization: localStorage.token } })
        .then((res) => {
          let acc_array = [];

          const access_points = res.data;

          if (access_points.length) {
            access_points.forEach((point, index) => {
              const acc_point = {};
              acc_point.count = index + 1;
              acc_point.id = point.id;
              acc_point.access_point = point.name;
              if (point.access_point_zone)
                acc_point.location_zone = point.access_point_zones
                  ? point.access_point_zones.name
                  : "";
              acc_point.acu_name =
                point.acu && point.acus ? point.acus.name : "";
              acc_point.type = point.type;
              if (point.access_point_group)
                acc_point.groups = point.access_point_groups
                  ? point.access_point_groups.name
                  : "";
              acc_point.status = point.status;
              acc_point.mode = point.mode;
              if (point.access_point_zone)
                acc_point.location = point.access_point_zones
                  ? point.access_point_zones.name
                  : "";
              if ("door_state" in point)
                acc_point.door_status = point.door_state;
              acc_point.selected = false;

              if (point.readers && point.readers.length) {
                const dir_object = point.readers[0];

                if ("direction" in dir_object) {
                  if (dir_object.direction === 1) {
                    acc_point.location_zone = dir_object.came_to_zones
                      ? dir_object.came_to_zones.name
                      : "No location zone";
                  } else if (dir_object.direction === 0) {
                    acc_point.location_zone = dir_object.leaving_zones
                      ? dir_object.leaving_zones.name
                      : "No leaving zone";
                  }
                }
              } else {
                acc_point.location_zone = "No readers";
              }

              acc_array.push(acc_point);
            });
          }
          commit("EDIT_SET_POINT_LIST", acc_array);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchCards({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`cardholder?page=1&page_items_count=5000`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          const cardholders = res.data.data ? res.data.data : res.data;
          let arr = [];
          if (cardholders.length) {
            cardholders.forEach((card, index) => {
              const holder = {};
              holder.count = index + 1;
              holder.id = card.id;
              holder.full_name = card.last_name
                ? card.first_name + " " + card.last_name
                : card.first_name;
              if (card.cardholder_group)
                holder.group = card.cardholder_groups.name;
              holder.company = card.company_name;
              holder.position = card.position ? card.position : " ";
              if (card.access_right)
                holder.access_right = card.access_rights.name;
              holder.status = card.status;
              holder.selected = false;
              arr.push(holder);
            });
          }
          commit("SET_CARDS_LIST", arr);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchEditCards({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`cardholder?page=1&page_items_count=5000`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          const cardholders = res.data.data ? res.data.data : res.data;
          let arr = [];
          if (cardholders.length) {
            cardholders.forEach((card, index) => {
              const holder = {};
              holder.count = index + 1;
              holder.id = card.id;
              holder.full_name = card.last_name
                ? card.first_name + " " + card.last_name
                : card.first_name;
              if (card.cardholder_group)
                holder.group = card.cardholder_groups.name;
              holder.company = card.company_name;
              holder.position = card.position ? card.position : " ";
              if (card.access_right)
                holder.access_right = card.access_rights.name;
              holder.status = card.status;
              holder.selected = false;
              arr.push(holder);
            });
          }
          commit("EDIT_SET_CARDS_LIST", arr);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  fetchReports({ commit }, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`standardReport`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((response) => {
          commit("SET_REPORTS", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  SAVE_REPORT({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(`/standardReport`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          const item = { ...response.data };
          commit("SET_REPORT", item);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchReport({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`standardReport/${payload}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          let item = response.data;
          if (item.events) {
            item.events = JSON.parse(item.events);
          }

          if (item.cardholders) {
            item.cardholders = JSON.parse(item.cardholders);
          }
          if (item.access_points) {
            item.access_points = JSON.parse(item.access_points);
          }
          if (item.period) {
            item.period = JSON.parse(item.period);
          }
          commit("SET_EDITED_REPORT", item);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateReport({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .put(`standardReport`, payload, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          commit("UPDATE_REPORT", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  deleteReport({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`standardReport`, {
          headers: { Authorization: localStorage.token },
          data: { id: payload },
        })
        .then((response) => {
          commit("DELETE_REPORT", payload);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  checkVideoResource({ commit }, { camera, params }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`camera-device/playbackstream/${camera}`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  checkLiveStream({ commit }, camera_id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`camera-set/livestream/${camera_id}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  downloadVideoResource({ commit }, { url, params }) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
