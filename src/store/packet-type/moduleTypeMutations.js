/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  SET_TYPE(state, types) {
    types.map(function (x, index) {
      x.selected = false;
      x.count = index + 1
    });
    state.packetTypes = types
  },
  SET_ALL(state, obj) {
    state.packetTypes.map(function (x) {
      x.selected = obj.event;
    });
  },
  CHECK_ITEM(state, { event, item }) {
    let find = state.packetTypes.find((a) => a.id == item.id);
    if (find) {
      find.selected = event;
    }
  },
  ADD_TYPE(state, types) {
    state.packetTypes.unshift(types)
    let arr = [];

    state.packetTypes.forEach((item, index) => {
      item.count = index + 1;
      arr.push(item);
    });

    state.packetTypes = arr
  },
  DELETE_DEPARTMENT(state, id) {
    const deparatmentIndex = state.packetTypes.findIndex((u) => u.id == id)
    state.packetTypes.splice(deparatmentIndex, 1)

    let arr = [];

    if (state.packetTypes.length) {
      state.packetTypes.forEach((item, index) => {
        item.count = index + 1;
        arr.push(item);
      });
    }

    state.packetTypes = arr
  },
  UPDATE_TYPE(state, departments) {
    const productIndex = state.packetTypes.findIndex(
      (p) => p.id == departments.id
    );
    Object.assign(state.packetTypes[productIndex], departments);

  },

}
