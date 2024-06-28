/*=========================================================================================
  File Name: moduleEmailGetters.js
  Description: Email Module Getters
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  filteredMails: state => state.mails.filter((mail) => {
    return (state.mail_filter === 'inbox' ? mail
      : state.mail_filter === 'closed' ? mail.active == false : state.mail_filter === 'active' ? mail.active == true : mail.department == state.mail_filter /*|| mail.labels.includes(state.mail_filter) */) && (mail.user.first_name.toLowerCase().includes(state.mailSearchQuery.toLowerCase()) || mail.user.last_name.toLowerCase().includes(state.mailSearchQuery.toLowerCase()) || mail.user.email.toLowerCase().includes(state.mailSearchQuery.toLowerCase()) || mail.message.toLowerCase().includes(state.mailSearchQuery.toLowerCase()) || mail.subject.toLowerCase().includes(state.mailSearchQuery.toLowerCase()))
  }),
  getMail: state => (emailId) => state.mails.find((email) => email.id === emailId)
}
