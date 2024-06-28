/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  SET_PACKETS(state, packets) {
    state.packets = []
    packets.forEach(type => {
      if (type.pay_terms) {
        type.pay_terms = JSON.parse(type.pay_terms)
      }
      if (type.extra_settings) {
        type.extra_settings = JSON.parse(type.extra_settings)
      }


      if (type.extra_settings && type.extra_settings.resources) {
        let resource = type.extra_settings.resources;
        let arr = [];
        for (const key in resource) {
          arr.push({ name: key, count: resource[key] });
        }
        type.resources = arr;
      }
      state.packets.push(type)
    });
  },
  SET_PACKET_TYPES(state, types) {
    state.packetTypes = types
  },
  SET_EXTRA_SETTINGS(state, settings) {
    state.extra_settings = settings
  },
  UPDATE_PACKET(state, packet) {
    const index = state.packets.findIndex((u) => u.id == packet.id);
    state.packets[index] = packet

  },
  DELETE_PACKET(state, packet) {
    const index = state.packets.findIndex((u) => u.id == packet);
    state.packets.splice(index, 1);
  },
}
