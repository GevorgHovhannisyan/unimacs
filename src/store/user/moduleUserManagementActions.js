/*=========================================================================================
  File Name: moduleCalendarActions.js
  Description: Calendar Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "@/axios.js"

export default {
  fetchUsers({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`account`, {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then((response) => {
          commit('SET_ALL', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      axios.get(`account/${userId}`, {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchUserRole({ commit }, userId) {
    return new Promise((resolve, reject) => {
      axios.get(`permissions/${userId}`, {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchRoles({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`roles`, {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then((response) => {
          resolve(response)
          commit('SET_ROLES', response.data)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchRole({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`roles`, {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then((response) => {
          resolve(response)

          // commit('SET_ROLE', response.data)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchLogs({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`logs`, {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  createUser({ commit }, data) {
    return new Promise((resolve, reject) => {

      axios({
        method: 'post',
        url: `account`,
        data: data,
        headers: { Authorization: localStorage.token }
      })
        .then(function (response) {
          //handle success
          resolve(response);
          commit('SET_USER', response.data)

        })
        .catch(function (response) {
          //handle error
          reject(response)
        });
    })
  },

  updateUserRole({ commit }, obj) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: `account`,
        data: obj,
        headers: { Authorization: localStorage.token }
      })
        .then(function (response) {
          //handle success
          resolve(response);
          commit('UPDATE_USER', response.data)

        })
        .catch(function (response) {
          //handle error
          reject(response)
        });
    })
  },
  changeUserPass({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.put(`account/changePass`, {
        ...data
      },
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  changeMyPass({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.put(`account/changeMyPass`, {
        ...data
      },
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  userImageSave({ commit }, data) {
    let formData = new FormData();
    formData.append("file", data);

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `account/image`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data', Authorization: localStorage.token }
      })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (response) {
          reject(response)
        });
    })
  },

  updateUserInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios.put(`account`,
        data
        ,
        { headers: { Authorization: localStorage.token } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })

  },
  removeItem({ commit }, userId) {
    return new Promise((resolve, reject) => {
      axios.delete(`account`, {
        headers: {
          Authorization: localStorage.token
        },
        data: {
          id: userId
        }
      })
        .then((response) => {
          commit('REMOVE_USER', userId)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  removeRole({ commit }, userId) {

    return new Promise((resolve, reject) => {
      axios.delete(`roles`, {
        headers: {
          Authorization: localStorage.token
        },
        data: {
          id: userId
        }
      })
        .then((response) => {
          commit('REMOVE_ROLE', userId)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  }
}
