/*=========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import router from "../router";
import axios from "axios";

function changeSettings(settings) {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${process.env.VUE_APP_BACK}/account/changeSettings`,
        {
          settings: settings,
        },
        { headers: { Authorization: localStorage.token } }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

const actions = {
  setSettings({ commit }, settings) {
    return new Promise((resolve, reject) => {
      axios
        .put(
          `${process.env.VUE_APP_BACK}/account/changeSettings`,
          {
            settings: settings,
          },
          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {

          const settings = response.data.settings
            ? JSON.parse(response.data.settings)
            : {};
          commit("SET_SETTINGS", settings);
          localStorage.setItem("settings", JSON.stringify(settings))
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getSettings({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${process.env.VUE_APP_BACK}/account/getUserData`,

          { headers: { Authorization: localStorage.token } }
        )
        .then((response) => {

          const settings = response.data.settings
            ? JSON.parse(response.data.settings)
            : {};
          commit("SET_SETTINGS", settings)
          localStorage.setItem("settings", JSON.stringify(settings))
          resolve(response);

        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  checkResource({ commit }, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${process.env.VUE_APP_BACK}/company/companyResource`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  pagePermissions({ commit }, permissions) {
    let checkFalse = function (obj) {
      for (var i in obj) {
        if (obj[i] == true) return false;
      }
      return true;
    };

    let checkFalses = function (obj) {
      for (var i in obj) {
        for (var j in obj[i]) {
          if (obj[i][j] == true) return false;
        }
      }
      return true;
    };

    if (checkFalse(permissions)) {
      let routes = router.options.routes[0].children;
      let route = routes.filter((r) => r.custom);
      let perms = JSON.parse(localStorage.permissions);

      for (let i = 1; i < route.length; i++) {
        if (!checkFalses(perms[route[i].name])) {
          return route[i].path;
        }
      }
    } else {
      return true;
    }
  },

  // /////////////////////////////////////////////
  // COMPONENTS
  // /////////////////////////////////////////////

  // Vertical NavMenu
  updateVerticalNavMenuWidth({ commit }, width) {
    commit("UPDATE_VERTICAL_NAV_MENU_WIDTH", width);
  },
  updatePermissions({ commit }, permissions) {
    commit("UPDATE_ROLE", permissions);
  },

  // VxAutoSuggest
  updateStarredPage({ commit }, payload) {
    commit("UPDATE_STARRED_PAGE", payload);
  },

  // The Navbar
  arrangeStarredPagesLimited({ commit }, list) {
    commit("ARRANGE_STARRED_PAGES_LIMITED", list);
  },
  arrangeStarredPagesMore({ commit }, list) {
    commit("ARRANGE_STARRED_PAGES_MORE", list);
  },

  // /////////////////////////////////////////////
  // UI
  // /////////////////////////////////////////////

  toggleContentOverlay({ commit }) {
    commit("TOGGLE_CONTENT_OVERLAY");
  },
  updateTheme({ state, commit, dispatch }, settings) {
    const settings_store = state.settings || null
    if (settings_store && settings_store.theme_config) {
      settings_store.theme_config.theme = settings;
      commit("UPDATE_THEME", settings);
      // setTimeout(() => {
      dispatch('setSettings', settings_store)
      // this.setSettings(settings_store);
      // }, 900);
    } else {
      commit("UPDATE_THEME", settings);
      dispatch('setSettings', {
        ...settings_store,
        theme_config: {
          theme: settings,
        },
      })

      // setTimeout(() => {
      //   this.setSettings({
      //     ...settings_store,
      //     theme_config: {
      //       theme: settings,
      //     },
      //   });
      // }, 900);
    }
  },
  updateNavbar({ commit }, settings) {
    const settings_store =
      localStorage.user &&
        JSON.parse(localStorage.user) &&
        JSON.parse(localStorage.user).settings
        ? JSON.parse(JSON.parse(localStorage.user).settings)
        : null;
    if (settings_store && settings_store.theme_config) {
      settings_store.theme_config.navbar = settings;
      commit("UPDATE_NAVBAR", settings);
      setTimeout(() => {
        changeSettings(settings_store);
      }, 1000);
    } else {
      setTimeout(() => {
        changeSettings({
          theme_config: {
            navbar: settings,
          },
        });
      }, 400);
    }

    // if (settings_store) {
    //   const settings_data = JSON.parse(settings_store).theme_config;
    //   settings_data.navbar = JSON.parse(JSON.stringify(settings));
    //   commit("UPDATE_NAVBAR", settings);
    //   changeSettings(settings_data);
    // }
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  updateUserInfo({ commit }, payload) {
    // commit('UPDATE_USER_INFO', payload)
  },
  updateUserRole({ dispatch }, payload) {
    // Change client side
    payload.aclChangeRole(payload.userRole);

    // Make API call to server for changing role

    // Change userInfo in localStorage and store
    dispatch("updateUserInfo", { userRole: payload.userRole });
  },
};

export default actions;
