/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  SET_DEPARTMENT(state, departments) {
    state.departments = []
    let colors = ['primary', 'success', 'danger', 'warning', 'dark', 'light']

    for (let i = 0; i < departments.length; i++) {
      departments[i].selected = false
      departments[i].color = colors[i]
      departments[i].count = i + 1
    }
    state.departments = departments
  },
  ADD_DEPARTMENT(state, departments) {

    state.departments.push(departments)

    let arr = [];
    state.departments.forEach((item, index) => {
      item.count = index + 1;
      arr.push(item);
    });

    state.departments = arr;
  },

  DELETE_DEPARTMENT(state, id) {
    const deparatmentIndex = state.departments.findIndex((u) => u.id == id)
    state.departments.splice(deparatmentIndex, 1)
    let arr = [];

    if (state.departments.length) {
      state.departments.forEach((item, index) => {
        item.count = index + 1;
        arr.push(item);
      });
    }
    state.departments = arr;
  },
  SET_ALL_CHECKED(state, obj) {
    state.departments.map(function (x) {
      x.selected = obj.event;
    });
  },

  CHECK_ITEM(state, { event, item }) {
    let find = state.departments.find((a) => a.id == item.id);
    if (find) {
      find.selected = event;
    }
  },
  UPDATE_DEPARTMENT(state, departments) {
    const productIndex = state.departments.findIndex(
      (p) => p.id == departments.id
    );

    departments.status = departments.status ? 'active' : 'inactive'
    Object.assign(state.departments[productIndex], departments);

  },
}
