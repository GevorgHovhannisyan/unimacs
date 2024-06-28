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
  // Fetch emails
  fetchAccessPoint({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`accessPoint`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  fetchRights({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`accessRight`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_RIGHTS", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchRight({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`accessRight/${id}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchRelations({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`accessRight/relations/${id}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_RELATIONS", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createRight({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `accessRight`,
          payload,
          { headers: { Authorization: localStorage.token }, }
        )
        .then((response) => {
          commit('ADD_ACCESS_RIGHT', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  addAccessRule({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `accessRight/accessRule`,
          payload,
          { headers: { Authorization: localStorage.token }, }
        )
        .then((response) => {
          // commit('SET_ACCESS_RULE', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateRight({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`accessRight`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('UPDATE_RIGHT', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  editAccessRule({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`accessRight/accessRule`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteRight({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`accessRight`, { headers: { Authorization: localStorage.token }, data: { id: payload.id } })
        .then((response) => {
          commit('DELETE_RIGHT', payload.id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteRule({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`accessRight/accessRule`, { headers: { Authorization: localStorage.token }, data: { id: payload.id } })
        .then((response) => {

          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  }
}
