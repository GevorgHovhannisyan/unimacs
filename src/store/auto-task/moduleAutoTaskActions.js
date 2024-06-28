/*=========================================================================================
  File Name: moduleEmailActions.js
  Description: Email Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "@/axios.js"

export default {
  fetchAutoTask({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`autoTaskSchedule/${id}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('SET_AUTO_TASK', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchAutoTasks({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`autoTaskSchedule`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('SET_AUTO_TASKS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchControllers({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`acu?status=active`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('SET_CONTROLLERS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchController({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`acu/${id}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('SET_CONTROLLER', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchEventCommands({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`autoTaskSchedule/commands`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('SET_EVENTS_COMMANDS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  addAutoTask({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `autoTaskSchedule`,
          payload,
          { headers: { Authorization: localStorage.token }, }
        )
        .then((response) => {
          // commit('ADD_ACCESS_RIGHT', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateAutoTask({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`autoTaskSchedule`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  

  deleteAutoTask({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`autoTaskSchedule`, { headers: { Authorization: localStorage.token }, data: { id: payload.id } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
}
