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
  fetchAccountGroups({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`accountGroup`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_GROUPS", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchAccountGroup({ commit }, item) {
    return new Promise((resolve, reject) => {
      axios.get(`accountGroup/${item}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          // commit("SET_GROUPS", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateGroup({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`accountGroup`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createGroup({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post(
        `accountGroup`,
        payload,
        {
          headers: { Authorization: localStorage.token },
        }
      )
        .then((response) => {
          commit("SET_GROUP", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteGroups({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.delete(`accountGroup`, { headers: { Authorization: localStorage.token }, data: { id: id } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },




}
