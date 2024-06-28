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
  fetchDepartments({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`department`, { headers: { Authorization: localStorage.token } })
        .then((response) => {

          commit("SET_DEPARTMENT", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createDepartment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `department`,
          { ...payload },
          { headers: { Authorization: localStorage.token }, }
        )
        .then((response) => {
          commit('ADD_DEPARTMENT', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateDepartment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`department`, {
        id: payload.id,
        name: payload.name,
        status: payload.status
      },
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('UPDATE_DEPARTMENT', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  deleteDepartment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`department`, { headers: { Authorization: localStorage.token }, data: { id: payload } })
        .then((response) => {
          commit("DELETE_DEPARTMENT", payload)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
}
