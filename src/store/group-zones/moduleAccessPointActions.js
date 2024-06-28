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
  fetchAccessPointGroups({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`accessPointGroup`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('SET_ACCESS_POINT_GROUPS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchAccessPointGroup({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`accessPointGroup/${id}`, {
        headers: { Authorization: localStorage.token }
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchAccessZones({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`accessPointZone`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_ZONES", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchAccessZone({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`accessPointZone/${id}`, {
        headers: { Authorization: localStorage.token }
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createAccessGroup({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `accessPointGroup`,
          payload,
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {
          commit('SET_ACCESS_POINT_GROUP', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createAccessZone({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `accessPointZone`,
          payload,
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {
          commit('CHANGE_ID', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateAccessZone({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`accessPointZone`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateAccessGroup({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`accessPointGroup`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('UPDATE_ACCESS_POINT_GROUP', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteZone({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`accessPointZone`, { headers: { Authorization: localStorage.token }, data: { id: payload } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteAccessPointGroup({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`accessPointGroup`, { headers: { Authorization: localStorage.token }, data: { id: payload } })
        .then((response) => {
          commit("DELETE_ACCESS_POINT_GROUP", payload)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },




}
