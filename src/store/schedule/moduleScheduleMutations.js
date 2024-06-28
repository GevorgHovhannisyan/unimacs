/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  SET_SCHEDULES(state, schedules) {
    state.schedules = schedules
  },
  SET_TREE_DATA(state, tree) {
    state.treeData = tree
  },
  SET_FLEXITIME_SCHEDULE(state, schedule) {
    // state.languages = language

    const scheduleIndex = state.schedules.findIndex((u) => u.id == schedule.parent_id)

    state.schedules[scheduleIndex].data.push(schedule)
  },
  DELETE_SCHEDULE(state, id) {
    const scheduleIndex = state.schedules.findIndex((u) => u.id == id)
    state.schedules.splice(scheduleIndex, 1)
  },
  SET_MAILS(state, mails) {
    state.mails = mails
  },

  UPDATE_MAIL_FILTER(state, filterName) {
    state.mail_filter = filterName
  },
  UPDATE_SCHEDULE_INFO(state, payload) {
    const scheduleIndex = state.schedules.findIndex((u) => u.id == payload.id)
    state.schedules[scheduleIndex] = payload

  },
  SET_MONITOR_DATA(state, monitorDataConfig) {
    state.monitorDataConfig = monitorDataConfig
  },
  SET_MONITOR_2_DATA(state, monitorDataConfig) {
    state.monitor2DataConfig = monitorDataConfig
  },

}
