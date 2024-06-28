/*=========================================================================================
  File Name: moduleEmailActions.js
  Description: Email Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from '@/axios.js'

export default {
  setEmailSearchQuery({ commit }, query) {
    commit('SET_EMAIL_SEARCH_QUERY', query)
  },
  fetchEmail({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.get(`ticket/${id}`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          commit('SET_READ', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  // Fetch emails
  fetchEmails({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(`ticket`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          const filter = payload.filter
          let filteredEmails
          if (filter == 'inbox') {
            filteredEmails = response.data
          } else if (filter === 'closed' || filter === 'active') {
            let status = filter === 'closed' ? false : true
            filteredEmails = response.data.filter(email => email.active == status)
          } else {
            filteredEmails = response.data.filter(email => email.department == filter)
          }

          filteredEmails.forEach(mail => {
            if (mail.user.avatar) {
              mail.user.avatar = JSON.parse(mail.user.avatar)
              mail.user.image = `${process.env.VUE_APP_BACK}/${mail.user.avatar.path}`
            } else {
              mail.user.image = '/no_avatar.svg'
            }

            if (mail.image) {
              mail.image = JSON.parse(mail.image)
            }
          });

          commit('SET_MAILS', filteredEmails)
          resolve(filteredEmails)
        })
        .catch((error) => { reject(error) })
    })
  },

  createTicket({ commit }, message) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `ticket`,
          { ...message },
          { headers: { Authorization: localStorage.token }, }
        )
        .then((response) => {

          axios.get(`ticket/${response.data.id}`, { headers: { Authorization: localStorage.token } }
          )
            .then((res) => {
              commit('ADD_TICKET', res.data)

            })
            .catch((error) => { })
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  // Fetch emails
  deleteTicket({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.delete(`ticket`, { headers: { Authorization: localStorage.token }, data: { id: id } })
        .then((response) => {
          // commit("DELETE_TICKET", payload)
          commit('DELETE_TICKET', id)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  changeStatus({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`ticket`, {
        id: payload.id,
        active: payload.active
      },
        { headers: { Authorization: localStorage.token } })
        .then((response) => {

          // commit('SET_READ', response.data)

          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  replyMessage({ commit }, message) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `ticket/message`,
          { ...message },
          { headers: { Authorization: localStorage.token }, }
        )
        .then((response) => {
          response.data.user = message.user
          // commit('ADD_REPLY', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
}
