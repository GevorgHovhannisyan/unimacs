/*=========================================================================================
  File Name: moduleCalendarMutations.js
  Description: Calendar Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {

  SET_ALL(state, users) {
    if (users.length) {
      users.forEach((user, index) => {
        user.selected = false
        let count = index + 1
        user.count = count
        user.name = user.last_name ? user.first_name + ' ' + user.last_name : user.first_name;

        user.department = user.departments ? user.departments.name : "No department"
        if (user.avatar) {
          user.avatar = JSON.parse(user.avatar)
        }
      });
      state.admins = users

    }
  },
  SET_ALL_CHECKED(state, obj) {
    state.admins.map(function (x) {
      x.selected = obj.event;
    });
  },

  CHECK_ITEM(state, { event, item }) {
    let find = state.admins.find((a) => a.id == item.id);
    if (find) {
      find.selected = event;
    }
  },
  UPDATE_USER(state, user) {
    const userIndex = state.admins.findIndex((u) => u.id == user.id)
    state.admins[userIndex].status = user.status
  },
  changeUsersTab(state, tab) {
    state.users_tab = tab
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  },
  SET_ROLE(state, roles) {
    state.role = roles
  },

  UPDATE_PERMISSIONS(state, permissions) {
    const productIndex = state.admins.findIndex((p) => p.id == permissions.id);
    Object.assign(state.admins[productIndex].status, permissions.status)
  },
  SET_LOGS(state, logs) {
    for (let i = 0; i < logs.length; i++) {
      let day = new Date(logs[i].createDate).getDate();
      let month = new Date(logs[i].createDate).getMonth() + 1;
      let year = new Date(logs[i].createDate).getFullYear();

      logs[i].createDate = `${day}/${month}/${year}`

    }
    state.logs = logs

  },
  SET_USER(state, user) {
    user.department = user.department ? user.department : "No department"
    user.name = user.last_name ? user.first_name + ' ' + user.last_name : user.first_name;

    state.admins.unshift(user);

    let user_arr = [];

    state.admins.forEach((admin, index) => {
      let count = index + 1
      admin.count = count

      user_arr.push(admin)
    });

    state.admins = user_arr
  },
  UPDATE_USER_INFO(state, data) {
    state.userData = data

  },
  REMOVE_USER(state, itemId) {

    if (typeof itemId == 'number') {
      const userIndex = state.admins.findIndex((u) => u.id == itemId)
      state.admins.splice(userIndex, 1)
    } else if (typeof itemId == 'object') {
      itemId.forEach(ids => {
        let userIndex = state.admins.findIndex((u) => u.id == ids)
        state.admins.splice(userIndex, 1)
      });
    }


    if (state.admins.length) {
      let user_arr = [];

      state.admins.forEach((admin, index) => {
        let count = index + 1
        admin.count = count

        user_arr.push(admin)
      });

      state.admins = user_arr
    }
  },
  REMOVE_ROLE(state, itemId) {
    const userIndex = state.role.findIndex((u) => u.id == itemId)
    state.role.splice(userIndex, 1)
  },
  REMOVE_RECORD(state, itemId) {
    const userIndex = state.users.findIndex((u) => u.id == itemId)
    state.users.splice(userIndex, 1)
  },
}
