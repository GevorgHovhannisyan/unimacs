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
  fetchCompanies({ commit }, params) {
    return new Promise((resolve, reject) => {

      axios.get(`company`, { headers: { Authorization: localStorage.token }, params })
        .then((response) => {
          commit("SET_COMPANIES", response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createDocument({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `company/document`,
          payload,
          { headers: { Authorization: localStorage.token }, }
        )
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchCompany({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`company/${id}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateCompany({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`company`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('UPDATE_COMPANY', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateCompanyName({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`company`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteDocument({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.delete(`company/document`, { headers: { Authorization: localStorage.token }, data: { id: id } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteCompany({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.delete(`company`, { headers: { Authorization: localStorage.token }, data: { id: id } })
        .then((response) => {
          commit("DELETE_COMPANY", id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  }
}
