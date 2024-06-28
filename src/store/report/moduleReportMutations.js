/*=========================================================================================
  File Name: moduleEmailMutations.js
  Description: Email Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import moment from "moment-timezone";

export default {
  SET_REPORTS(state, reports) {
    state.reports.count = reports.count;
    reports.data.forEach((report, index) => {
      report.createDate = moment(report.createDate)
        .utcOffset(0)
        .format(`YYYY-MM-DD HH:mm`);
      let count = index + 1;
      report.count = count;
      report.author = report.authors
        ? report.authors.last_name
          ? `${report.authors.first_name}  ${report.authors.last_name}`
          : report.authors.first_name
        : "";
    });
    state.reports.data = reports.data;
  },
  SET_REPORT(state, report) {
    state.reports.count++;
    report.createDate = moment(report.createDate)
      .utcOffset(0)
      .format(`YYYY-MM-DD HH:mm`);
    state.reports.data.push(report);
    let arr = [];

    state.reports.data.forEach((item, index) => {
      item.count = index + 1;
      arr.push(item);
      item.author = item.authors
        ? item.authors.last_name
          ? `${item.authors.first_name}  ${item.authors.last_name}`
          : item.authors.first_name
        : "";
    });
    state.reports.data = arr;
  },
  SET_POINT_LIST(state, access_points) {
    let options = [];
    if (access_points.length) {
      access_points.forEach((point, index) => {
        if (!options.find((o) => o.label === point.location_zone)) {
          options.push({
            label: point.location_zone,
            id: `${point.location_zone}_${index + 1}`,
          });
        }
      });
    }
    state.loc_zones = options;
    state.access_points = access_points;
  },

  SET_ACCESS_POINTS(state, { event, value }) {
    let find = state.access_points.find((a) => a.id == event.id);
    if (find) {
      find.selected = value;
    }

    const selecteds = state.access_points.filter((a) => a.selected);
    state.access_points_selecteds = selecteds;
  },
  SET_CARDS_LIST(state, cardholders) {
    let options = [];

    if (cardholders.length) {
      cardholders.forEach((point, index) => {
        if (!options.find((o) => o.label === point.group)) {
          options.push({
            label: point.group,
            id: `${point.group}_${index + 1}`,
          });
        }
      });
    }

    state.cardholders = cardholders;
    state.groups = options;
  },
  CLEAR_FILTERS(state) {
    state.event_show_selected = false;
    // state.event_types = [];
    state.event_type = null;
    state.ap_show_selected = false;
    state.loc_zone = null;
    // state.loc_zones = [];
    state.card_show_selected = false;
    state.group = null;
    // state.groups = [];
    state.edit_event_types = [];
    state.edit_event_type = null;
    state.edit_ap_show_selected = false;
    state.edit_loc_zone = null;
    state.edit_loc_zones = [];
    state.edit_card_show_selected = false;
    state.edit_group = null;
    state.edit_groups = [];
    state.edit_event_show_selected = false;
  },
  SET_CARDHOLDERS(state, { event, value }) {
    let find = state.cardholders.find((a) => a.id == event.id);
    if (find) {
      find.selected = value;
    }
  },
  EDIT_SET_CARDS_LIST(state, cardholders) {
    let options = [];
    if (cardholders.length) {
      cardholders.forEach((point, index) => {
        if (!options.find((o) => o.label === point.group)) {
          options.push({
            label: point.group,
            id: `${point.group}_${index + 1}`,
          });
        }
      });
    }
    state.edit_cardholders = cardholders;
    state.edit_groups = options;
  },
  EDIT_SET_CARDHOLDERS(state, { event, value }) {
    let find = state.edit_cardholders.find((a) => a.id == event.id);
    if (find) {
      find.selected = value;
    }
  },
  SET_EVENT_LIST(state, { events, types }) {
    state.event_list = events;
    state.event_types = types;
  },
  SET_EVENTS(state, { event, value }) {
    let find = state.event_list.find((a) => a.id == event.id);
    if (find) {
      find.selected = value;
    }
  },
  CLEAR_EVENTS(state, events) {
    state.edit_event_list = [];
    state.edit_access_points = [];
    state.edit_cardholders = [];
  },
  EDIT_SET_EVENT_LIST(state, { events, types }) {
    state.edit_event_list = events;
    state.edit_event_types = types;
  },
  EDIT_SET_EVENTS(state, { event, value }) {
    let find = state.edit_event_list.find((a) => a.id == event.id);
    if (find) {
      find.selected = value;
    }
  },
  EDIT_SET_POINT_LIST(state, access_points) {
    let options = [];
    state.edit_access_points = access_points;

    if (access_points.length) {
      access_points.forEach((point, index) => {
        if (!options.find((o) => o.label === point.location_zone)) {
          options.push({
            label: point.location_zone,
            id: `${point.location_zone}_${index + 1}`,
          });
        }
      });
    }
    state.edit_loc_zones = options;
  },
  EDIT_SET_ACCESS_POINTS(state, { event, value }) {
    let find = state.edit_access_points.find((a) => a.id == event.id);
    if (find) {
      find.selected = value;
    }
  },
  SET_PERIOD(state, period) {
    state.period = { ...period };
  },

  SET_ALL_EVENT(state, { event, type }) {
    state.event_list.map(function (x) {
      if (type) {
        if (x.event_type === type) {
          x.selected = event;
        }
      } else {
        x.selected = event;
      }
    });
  },
  SET_ALL_CARDS(state, { event, type }) {
    state.cardholders.map(function (x) {
      if (type) {
        if (x.group === type) {
          x.selected = event;
        }
      } else {
        x.selected = event;
      }
    });
  },
  SET_ALL_POINTS(state, { event, type }) {
    state.access_points.map(function (x) {
      if (type) {
        if (x.location_zone === type) {
          x.selected = event;
        }
      } else {
        x.selected = event;
      }
    });

    const selecteds = state.access_points.filter((a) => a.selected);
    state.access_points_selecteds = selecteds;
  },
  EDIT_SET_ALL_POINTS(state, event) {
    state.edit_access_points.map(function (x) {
      if (type) {
        if (x.location_zone === type) {
          x.selected = event;
        }
      } else {
        x.selected = event;
      }
    });
  },
  EDIT_SET_ALL_EVENT(state, { event, type }) {
    state.edit_event_list.map(function (x) {
      if (type) {
        if (x.event_type === type) {
          x.selected = event;
        }
      } else {
        x.selected = event;
      }
    });
  },
  EDIT_SET_ALL_CARDS(state, { event, type }) {
    state.edit_cardholders.map(function (x) {
      if (type) {
        if (x.group === type) {
          x.selected = event;
        }
      } else {
        x.selected = event;
      }
    });
  },
  SET_TEMPLATE(state, { data }) {
    state.template = { ...data };
  },
  EDIT_SET_TEMPLATE(state, { data }) {
    state.edit_template = { ...data };
  },
  REMOVE_TEMPLATES(state, { data }) {
    state.template = {};
  },
  saveLogs(state, log) {
    state.saveLogs.push(log);
  },
  SET_EDITED_REPORT(state, editedReports) {
    state.editedReport = editedReports;
  },
  SET_PERIOD(state, period) {
    state.edit_period = period;
  },
  UPDATE_REPORT(state, report) {
    const index = state.reports.data.findIndex((u) => u.id == report.id);
    state.reports.data[index].createDate = report.createDate;
    state.reports.data[index].name = report.name;
    state.reports.data[index].description = report.description;
    state.reports.data[index].author = report.authors
      ? report.authors.last_name
        ? `${report.authors.first_name}  ${report.authors.last_name}`
        : report.authors.first_name
      : "";
    state.reports.data[index].createDate = moment(report.createDate)
      .utcOffset(0)
      .format(`YYYY-MM-DD HH:mm`);
  },
  DELETE_REPORT(state, id) {
    const index = state.reports.data.findIndex((u) => u.id == id);

    state.reports.data.splice(index, 1);
    state.reports.count--;
    let arr = [];
    if (state.reports.data.length) {
      state.reports.data.forEach((item, index) => {
        item.count = index + 1;
        arr.push(item);
      });
    }
    state.reports.data = arr;
  },
  SET_SHOW(state, value) {
    state.event_show_selected = value;
  },
  SET_TYPE(state, value) {
    state.event_type = value;
  },

  SET_AP_SHOW(state, value) {
    state.ap_show_selected = value;
  },
  SET_LOC(state, value) {
    state.loc_zone = value;
  },
  SET_CARD_SHOW(state, value) {
    state.card_show_selected = value;
  },
  SET_GROUP(state, value) {
    state.group = value;
  },

  EDIT_SET_SHOW(state, value) {
    state.edit_event_show_selected = value;
  },
  EDIT_SET_TYPE(state, value) {
    state.edit_event_type = value;
  },

  EDIT_SET_AP_SHOW(state, value) {
    state.edit_ap_show_selected = value;
  },
  EDIT_SET_LOC(state, value) {
    state.edit_loc_zone = value;
  },
  EDIT_SET_CARD_SHOW(state, value) {
    state.edit_card_show_selected = value;
  },
  EDIT_SET_GROUP(state, value) {
    state.edit_group = value;
  },
};
