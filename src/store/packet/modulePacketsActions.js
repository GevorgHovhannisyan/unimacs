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
  setEmailSearchQuery({ commit }, query) {
    commit("SET_EMAIL_SEARCH_QUERY", query)
  },


  fetchPackets({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`package`, {
        headers: { Authorization: localStorage.token },
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchPacket({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`package/${payload}`, {
        headers: { Authorization: localStorage.token },
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchPacketTypes({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`packageType`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_PACKET_TYPES", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchSettings({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`packageExtraSettings`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_EXTRA_SETTINGS", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createPacket({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post(
        `package`,
        payload,
        {
          headers: { Authorization: localStorage.token },
        }
      )
        .then((response) => {
          // commit("SET_PACKET", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updatePacket({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`package`, {
        ...payload
      },
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('UPDATE_PACKET', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },


  deletePacket({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`package`, { headers: { Authorization: localStorage.token }, data: { id: payload } })
        .then((response) => {
          commit("DELETE_PACKET", payload)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  }





}
