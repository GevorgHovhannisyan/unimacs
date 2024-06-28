/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import moment from "moment";

export default {
  SET_CONTROLLERS(state, controllers) {
    state.controllers = controllers
  },
  SET_CONTROLLER(state, controller) {
    state.controller = controller
    state.access_points = controller.access_points
  },
  SET_TASK_DATA(state, payload) {
    state.task_data = { ...state.task_data, ...payload }
  },
  CLEAR_TASK_DATA(state) {
    state.task_data = {
      name: null,
      access_point: null,
      acu: null,
      reaction_access_points: [],
      reaction: null,
      reaction_type: null,
      conditions: {},
      condition: null,
      enable: false
    }
    state.conditions = []
  },
  CLEAR_REACTION_POINTS(state) {
    state.task_data.reaction_access_points = []
  },
  CLEAR_EDIT_REACTION_POINTS(state) {
    state.edit_auto_task.reaction_access_points = []
  },
  SET_EDIT_TASK_DATA(state, payload) {
    state.edit_auto_task = { ...state.edit_auto_task, ...payload }
    state.edit_conditions = []
    if (state.edit_auto_task.conditions) { //  && !state.set_conds
    const cond_arr = [];

      const condition = JSON.parse(state.edit_auto_task.conditions);

      if ('EventsDirection' in condition) {
        cond_arr.push({
          EventsDirection: condition.EventsDirection,
          condition_type: "direction",
          id: 3
        })
      }
      if('EventsCondition' in condition) {
        cond_arr.push({
          EventsCondition: condition.EventsCondition,
          condition_type: "event",
          id: 2
        })
      }

      if('DaysOfWeek' in condition) {
        cond_arr.push({
          DaysOfWeek: condition.DaysOfWeek,
          TmEndCondition: condition.TmEndCondition,
          TmBeginCondition: condition.TmBeginCondition,
          condition_type:"time",
          repeat: condition.repeat?condition.repeat:false,
          id: 1,
        })
      }

      // state.set_conds = true;
      state.edit_conditions = cond_arr;
    }

  },
  SET_AUTO_TASKS(state, autoTasks) {
    const tasks = [];
    if (autoTasks.length) {
      for (let i = 0; i < autoTasks.length; i++) {
        const task = { ...autoTasks[i] };
        task.created_at = moment(autoTasks[i].createDate).format("YYYY-MM-DD HH:mm")
        task.access_point = autoTasks[i].access_point;
        task.access_point_name = autoTasks[i].access_point ? autoTasks[i].access_points.name : null;
        task.task_level = autoTasks[i].acu ? autoTasks[i].acus.name : null;
        task.status = autoTasks[i].enable ? "Active" : "Inactive";
        task.selected = false
        tasks.push(task);
      }
    }
    state.auto_tasks = tasks
  },
  SET_ALL_CHECKED(state, obj) {
    state.auto_tasks.map(function (x) {
      x.selected = obj.event;
    });
  },

  CHECK_ITEM(state, { event, item }) {
    let find = state.auto_tasks.find((a) => a.id == item.id);
    if (find) {
      find.selected = event;
    }
  },
  SET_AUTO_TASK(state, autoTask) {
    state.edit_auto_task = autoTask
  },
  SET_CONDITION(state, payload) {
    state.conditions.push(payload);
    if (state.conditions.length) {
      state.conditions.forEach((condition, index) => {
        condition.id = index + 1;
      });
    }
  },
  SET_EDIT_CONDITION(state, payload) {
    state.edit_conditions.push(payload);
    if (state.edit_conditions.length) {
      state.edit_conditions.forEach((condition, index) => {
        condition.id = index + 1;
      });
    }
  },
  DELETE_CONDITION(state, payload) {
    const index = state.conditions.findIndex(condition => condition.id === payload.id);
    state.conditions.splice(index, 1);
  },
  DELETE_EDIT_CONDITION(state, payload) {
    const index = state.edit_conditions.findIndex(condition => condition.id === payload.id);
    state.edit_conditions.splice(index, 1);
  },
  SET_REACTIONS_DATA(state, payload) {
    state.task_data = { ...state.task_data, ...payload };
  },
  SET_EDIT_REACTIONS_DATA(state, payload) {
    state.edit_auto_task = { ...state.edit_auto_task, ...payload };
  },
  SET_CONDITION_DATA(state, condition) {
    state.condition = condition;
  },
  SET_EVENTS_COMMANDS(state, event_command) {
    state.commands = event_command.commands
    state.events = event_command.events
  },
}
