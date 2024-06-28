/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import moment from 'moment-timezone'

export default {
  SET_COMPANIES(state, companies) {
    state.companies.data = []
    state.companies.count = 0

    const date_format = localStorage.user ? JSON.parse(localStorage.user).date_format : null
    const time_format = localStorage.user ? JSON.parse(localStorage.user).time_format : null
    let default_date = 'YYYY/MM/DD'
    let default_hours = 'hh:mm'
    if (time_format) {
      default_hours = time_format == '12H' ? 'hh:mm' : 'HH:mm'
    }
    if (date_format) {
      default_date = date_format
    }

    companies.data.forEach((company, index) => {
      const correct_date = moment(company.createDate).format(`${default_date} ${default_hours}`)
      const correct_last_online = company.company_account && company.company_account.last_login_date
        ? company.company_account.last_login_date : null
      company.email = company.company_account ?company.company_account.email:''
      if (company.company_documents && company.company_documents.length) {
        company.company_documents.forEach(file => {
          if (file.file) {
            file.file = JSON.parse(file.file)
            file.image = `${process.env.VUE_APP_BACK}/${file.file.path}`
          }
        });
      }

      company.createDate = correct_date

      company.last_online = correct_last_online ? moment(correct_last_online).format(`${default_date} ${default_hours}`) : null

      company.country = company.company_account ? company.company_account.country : null
      company.contact_person = company.company_account ?
        company.company_account.first_name + ' ' + company.company_account.last_name : null
      company.facilities = company.company_account && company.company_account.facilities ? company.company_account.facilities : null
      company.device = company.device ? company.device : null
      company.comment = company.comment ? company.comment : null
      company.status = company.status ? company.status : null
      company.count = index + 1
    });
    state.companies.count = companies.count
    state.companies.data = companies.data


  },
  ADD_DEPARTMENT(state, departments) {
    state.departments.push(departments)
  },

  DELETE_COMPANY(state, id) {
    const deparatmentIndex = state.companies.data.findIndex((u) => u.id == id)
    state.companies.data.splice(deparatmentIndex, 1)
    state.companies.count--
    let comp_arr = [];

    if (state.companies.data.length) {
      state.companies.data.forEach((item, index) => {
        item.count = index + 1
        comp_arr.push(item)
      });
    }

    state.companies.data = comp_arr
  },
  UPDATE_COMPANY(state, company) {

    const productIndex = state.companies.data.findIndex(
      (p) => p.id == company.id
    );
    if (company.message) {
      state.companies.data[productIndex].message = company.message
    }

    if(company.status && state.companies.data.length) {
      state.companies.data[productIndex].status = company.status
    }
  },
}
