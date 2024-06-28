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
  fetchTypes({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`packageType`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit("SET_TYPE", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `packageType`,
          { ...payload },
          { headers: { Authorization: localStorage.token }, }
        )
        .then((response) => {
          commit('ADD_TYPE', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  updateType({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`packageType`, {
        ...payload
      },
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('UPDATE_TYPE', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteDepartment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`packageType`, { headers: { Authorization: localStorage.token }, data: { id: payload } })
        .then((response) => {
          commit("DELETE_DEPARTMENT", payload)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
}
