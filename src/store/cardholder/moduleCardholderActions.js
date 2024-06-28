/*=========================================================================================
  File Name: moduleEmailActions.js
  Description: Email Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "@/axios.js";

export default {
    fetchCardholders({ commit }, params) {
        return new Promise((resolve, reject) => {

            axios.get(`cardholder`, { headers: { Authorization: localStorage.token }, params })
                .then((response) => {
                    commit("SET_CARDHOLDER", { cardholderss: response.data, params })
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    fetchCredentialTypes({ commit }, payload) {
        return new Promise((resolve, reject) => {

            axios.get(`credential/types`, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    const data = response.data
                    let types = []

                    if (data.length) {
                        data.forEach(type => {
                          const label = type === 'vikey' ? 'web pass' : type.split("_").join(" ")
                          types.push({ label, id: type })
                        });
                    }
                    resolve(types)
                })
                .catch((error) => { reject(error) })
        })
    },
    fetchCardholder({ commit }, payload) {
        return new Promise((resolve, reject) => {

            axios.get(`cardholder/${payload}`, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    commit('SET_EDIT_DATA', response.data)
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    fetchGuestKeys({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get(`cardholder/guests`, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    commit('SET_GUESTS', response.data)

                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    fetchGuestKey({ commit }, id) {
        return new Promise((resolve, reject) => {
            axios.get(`cardholder/guests`, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    commit('SET_GUESTS', response.data)

                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    getGuestLimit({ commit }, id) {
        return new Promise((resolve, reject) => {
            axios.get(`cardholder/guestsLimit`, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    deleteCardholderMany({ commit }, ids) {
        return new Promise((resolve, reject) => {
            axios.delete(`cardholder/groupDelete`, {
                    headers: {
                        Authorization: localStorage.token
                    },
                    data: {
                        ids: ids
                    }
                })
                .then((response) => {
                    commit('DELETE_CARDHOLDER_MANY', ids)
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    deleteCardholder({ commit }, userId) {

        return new Promise((resolve, reject) => {

            axios.delete(`cardholder`, {
                    headers: {
                        Authorization: localStorage.token
                    },
                    data: {
                        id: userId
                    }
                })
                .then((response) => {
                    commit('DELETE_CARDHOLDER', userId)
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    deleteCredential({ commit }, credential_id) {
        return new Promise((resolve, reject) => {
            axios.delete(`credential`, {
                    headers: {
                        Authorization: localStorage.token
                    },
                    data: {
                        id: credential_id
                    }
                })
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },

    updateUser({ commit }, data) {
        return new Promise((resolve, reject) => {
            axios.put(`cardholder`, data, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    resolve(response)
                    // commit('SET_EDIT_DATA', response.data)
                })
                .catch((error) => { reject(error) })
        })

    },
    moveToGroup({ commit }, { ids, cardholder_group }) {
        return new Promise((resolve, reject) => {
            axios.put(`cardholder/moveToGroup`, { ids, cardholder_group }, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })

    },
    updateCardStatus({ commit }, { status, ids }) {
        return new Promise((resolve, reject) => {
            axios.put(`cardholder/deActivate`, { status, ids }, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    resolve(response)
                    commit('UPDATE_CARD_STATUS', { status, ids })
                })
                .catch((error) => { reject(error) })
        })
    },
    updateStatus({ commit }, data) {
        return new Promise((resolve, reject) => {
            axios.put(`credential/updateStatus`, data, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    createUser({ commit }, {data, params}) {
        return new Promise((resolve, reject) => {

            axios({
                    method: 'post',
                    url: `cardholder`,
                    data: data,
                    headers: { Authorization: localStorage.token }
                })
                .then(function(response) {
                    //handle success
                    resolve(response);
                    commit('SET_CARD', {cardholder: response.data, params})

                })
                .catch(function(response) {
                    //handle error
                    reject(response)
                });
        })
    },
    inviteCardholder({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `cardholder/inviteCardholder`,
                    payload, { headers: { Authorization: localStorage.token }, }
                )
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    createGuestKey({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `cardholder/guest`,
                    payload, { headers: { Authorization: localStorage.token }, }
                )
                .then((response) => {
                    commit('SET_GUEST', response.data)
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    updateGuestKey({ commit }, data) {
        return new Promise((resolve, reject) => {
            axios.put(`cardholder/guest`, data, { headers: { Authorization: localStorage.token } })
                .then((response) => {
                    commit('UPDATE_GUEST', response.data)
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
    deleteGuestCardholder({ commit }, guest_id) {
        return new Promise((resolve, reject) => {
            axios.delete(`cardholder/guest`, {
                    headers: {
                        Authorization: localStorage.token
                    },
                    data: {
                        id: guest_id
                    }
                })
                .then((response) => {
                    commit('DELETE_GUEST', guest_id)
                    resolve(response)
                })
                .catch((error) => { reject(error) })
        })
    },
}
