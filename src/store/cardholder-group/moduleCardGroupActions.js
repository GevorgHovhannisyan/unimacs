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
  fetchCardHolderGroups({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`cardholderGroup`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('SET_GROUPS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchCardGroup({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`cardholderGroup/${id}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchRelations({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`cardholderGroup/relations/${id}?page_items_count=5000`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createCardGroup({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `cardholderGroup`,
          payload,
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {
          commit('SET_GROUP', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  updateCardGroup({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`cardholderGroup`, payload,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('UPDATE_CARD_GROUP', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  deleteCardGroup({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`cardholderGroup`, { headers: { Authorization: localStorage.token }, data: { id: payload } })
        .then((response) => {
          // commit("DELETE_DEPARTMENT", payload)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
}
