/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  SET_EMAIL_SEARCH_QUERY(state, query) {
    state.mailSearchQuery = query
  },
  SET_MAILS(state, mails) {
    state.mails = mails
  },
  SET_TAGS(state, tags) {
    state.mailTags = tags
  },
  SET_READ(state, mail) {
    const productIndex = state.mails.findIndex(
      (p) => p.id == mail.id
    );
    let findMail = state.mails[productIndex]
    if (mail.read) {
      findMail.read = mail.read
    }

  },
  DELETE_TICKET(state, id) {
    const mailIndex = state.mails.findIndex((mail) => mail.id === id)

    state.mails.splice(mailIndex, 1)
  },
  UPDATE_MAIL_FILTER(state, filterName) {
    state.mail_filter = filterName
  },
  ADD_TICKET(state, mail) {

    if (mail.user.avatar) {
      mail.user.avatar = JSON.parse(mail.user.avatar)
      mail.user.image = `${process.env.VUE_APP_BACK}/${mail.user.avatar.path}`
    } else {
      mail.user.image = '/no_avatar.svg'
    }


    if (mail.image) {
      mail.image = JSON.parse(mail.image)
    }
    state.mails.unshift(mail)
  },
  UPDATE_LABELS(state, payload) {
    payload.mails.forEach((mailId) => {
      const mailIndex = state.mails.findIndex((mail) => mail.id === mailId)
      const index = state.mails[mailIndex].labels.indexOf(payload.label)

      if (index === -1) state.mails[mailIndex].labels.push(payload.label)
      else state.mails[mailIndex].labels.splice(index, 1)
    })
  },
  SET_LABELS(state, payload) {
    state.mails.find((mail) => mail.id === payload.mailId).labels = payload.labels
  },
  SET_UNREAD(state, payload) {
    payload.emailIds.forEach((mailId) => {
      const mailIndex = state.mails.findIndex((mail) => mail.id === mailId)
      if (mailIndex !== -1) state.mails[mailIndex].unread = payload.unreadFlag
    })
  },

}
