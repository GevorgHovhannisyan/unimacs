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

  // Fetch emails
  fetchTrans({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`translations`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_TRANS", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createTrans({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`translations`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_TRANS", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteTrans({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`translations`, { headers: { Authorization: localStorage.token }, data: { id: payload } })
        .then((response) => {
          commit("SET_LANGUAGE", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },




}
