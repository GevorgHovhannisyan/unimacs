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
  uploadFile({ commit }, file) {
    let formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_BACK}/upload`,
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

  ticketImage({ commit }, file) {
    let formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `ticket/file`,
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
  userImageSave({ commit }, file) {
    let formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `cardholder/image`,
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
  companyFileUpload({ commit }, file) {
    let formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `company/document/file`,
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



  deleteFile({ commit }, fileName) {
    return new Promise((resolve, reject) => {
      axios.delete(`upload`, { headers: { Authorization: localStorage.token }, data: { name: fileName } })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
}
