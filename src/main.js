/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Vuesax Component Framework
import Vuesax from "vuesax";
import "material-icons/iconfont/material-icons.css"; //Material Icons
import "vuesax/dist/vuesax.css"; // Vuesax
Vue.use(Vuesax);

// axios
import axios from "./axios.js";
import VueSocketIO from "vue-socket.io";

import VueTelInput from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";

import "video.js/dist/video-js.css";
import VueVideoPlayer from "vue-video-player";

Vue.use(VueVideoPlayer);

import VueDragResize from "vue-drag-resize";

Vue.use(VueDragResize);

Vue.component("VueDragResize", VueDragResize);

import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);

Vue.use(VueTelInput, { validCharactersOnly: true, mode: "international" });

import CustomPaging from "./components/custom/CustomPaging";
Vue.component("CustomPaging", CustomPaging);

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: `${process.env.VUE_APP_SOCKET_PORT}/`,
  })
);
import VueGtag from "vue-gtag";

axios.interceptors.response.use(
  function (response) {
    // vm.$vs.loading({
    //   type: "corners",
    // });

    // setTimeout(() => {
    //   vm.$vs.loading.close();
    // }, 300);

    return response;
  },
  function (error) {
    if (error && error.response) {
      if (error.response.config.url == "cardholderGroup") {
        vm.$vs.notify({
          time: 7000,
          color: "danger",
          title: error.response.data.message,
        });
      } else if (error.response.status == 401) {
        if (error.response.data.message === "Wrong username or e-mail") {
          vm.$vs.notify({
            time: 7000,
            color: "danger",
            title: error.response.data.message,
          });
        } else if (localStorage.token) {
          vm.$vs.notify({
            time: 7000,
            color: "danger",
            title: error.response.data.message,
          });
          localStorage.clear();
          router
            .push("/login")
            .then((res) => { })
            .catch(() => { });
        }
      } else if (error.response.config.url.includes("camera/accessPoint")) {

      } else {
        if (error.response.data && error.response.data.message) {
          const message = error.response.data.message;
          if (message !== "There are no streams") {
            vm.$vs.notify({
              time: 7000,
              color: "danger",
              title: error.response.data.message,
            });
          }
        }
      }
      return Promise.reject(error);
    }
  }
);

Vue.prototype.$http = axios;

import VueMoment from "vue-moment";
import moment from "moment-timezone";

// Vue.use(require('vue-moment'));
Vue.prototype.$moment = VueMoment;

Vue.use(VueMoment, {
  moment,
});

// API Calls
import "./http/requests";

// Theme Configurations
import "../themeConfig.js";

// Globally Registered Components
import "./globalComponents.js";

// Styles: SCSS
import "./assets/scss/main.scss";

// Tailwind
import "@/assets/css/main.css";
import "@/assets/custom_fonts/custom_fonts.scss";
// Vue Router

// Vuex Store
import store from "./store/store";

// i18n
import i18n from "./i18n/i18n";

// Vuexy Admin Filters
import "./filters/filters";

// VeeValidate
import VeeValidate from "vee-validate";
Vue.use(VeeValidate, { fieldsBagName: "formFields" });

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from "vue2-hammer";
Vue.use(VueHammer);

import {
  TreeViewPlugin,
  ContextMenuPlugin,
} from "@syncfusion/ej2-vue-navigations";

Vue.use(TreeViewPlugin);
Vue.use(ContextMenuPlugin);

const GA_CODE = process.env.VUE_APP_GA_CODE || null;
if (GA_CODE) {
  Vue.use(VueGtag, { config: { id: GA_CODE } }, router);
}
// PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Feather font icon
require("./assets/css/iconfont.css");

// Vue select css
// Note: In latest version you have to add it separately
import "vue-select/dist/vue-select.css";

const regist_path = router.history._startLocation.split("/");
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (
  localStorage.token &&
  router.history._startLocation !== "/login" &&
  regist_path &&
  regist_path.length &&
  regist_path[1] != "registration" &&
  regist_path &&
  regist_path.length &&
  regist_path[1] != "registrationofPartition" &&
  regist_path &&
  regist_path.length &&
  regist_path[1] != "newUserPassword" &&
  regist_path &&
  regist_path.length &&
  regist_path[1] != "credential" &&
  regist_path &&
  regist_path.length &&
  regist_path[1] != "newpassword" &&
  regist_path &&
  regist_path.length
) {

  axios
    .get(`account/getUserData`, {
      headers: { Authorization: localStorage.token },
    })
    .then((res) => {
      const settings_data = res.data.settings;

      const settings =
        settings_data && JSON.parse(settings_data)
          ? JSON.parse(settings_data)
          : null;
      store.commit("SET_SETTINGS", settings);
      localStorage.setItem("settings", JSON.stringify(settings))

      if (settings && settings.theme_config) {
        localStorage.setItem(
          "theme_config",
          JSON.stringify(settings.theme_config)
        );
        // {"primary_color":"#FF9F43","reduceButton":false}
        if ("theme" in settings.theme_config) {
          store.commit("UPDATE_THEME", settings.theme_config.theme);
        }
        // if ("navbar" in settings.theme_config) {
        //   store.commit("UPDATE_NAVBAR", settings.theme_config.navbar);
        // }
        // if ("navbar_color" in settings.theme_config) {
        //   store.commit(
        //     "UPDATE_PRIMARY_COLOR",
        //     settings.theme_config.navbar_color
        //   );
        // }
      }
      localStorage.setItem("user", JSON.stringify(res.data));
      if (res.data.features) {
        localStorage.setItem("features", JSON.stringify(res.data.features));
      }
      axios
        .get(`${process.env.VUE_APP_BACK}/roles/${res.data.role}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((result) => {
          localStorage.setItem("permissions", result.data.permissions);
        });
    })
    .catch((error) => {
      if (error.response && error.response.status == 401) {
        localStorage.clear();

        router.push("/login").catch(() => { });
      }
    });
} else {
  router.push("/login").catch(() => { });
}

router.beforeEach((to, from, next) => {

  if (!localStorage.token && !token) {
    if (
      to.name != "forgot-password" &&
      to.name != "recoveryPassword" &&
      to.name != "page-login" &&
      to.name != "register-cardholder" &&
      to.name != "register" &&
      to.name != "Register" &&
      to.name != "Register-company" &&
      to.name != "credential" &&
      to.name != "guest-credential" &&
      to.name != "New-User-Password" &&
      to.name != "New-Partition-Password"
    ) {
      return next("/login");
    } else {
      return next();
    }
  } else {
    return next();
  }
});

let vm = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
