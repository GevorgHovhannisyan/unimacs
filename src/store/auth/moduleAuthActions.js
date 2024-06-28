/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import jwt from "../../http/requests/auth/jwt/index.js";
import axios from "axios";
import router from "@/router";
import store from "@/store/store";

export default {
  // Google Login
  // JWT
  loginJWT({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .login(payload.userDetails.username, payload.userDetails.password)
        .then((response) => {
          if (response.data.user) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            axios
              .get(`${process.env.VUE_APP_BACK}/account/getUserData`, {
                headers: { Authorization: localStorage.token },
              })
              .then((result) => {
                const settings_data = result.data.settings;
                const settings =
                  settings_data && JSON.parse(settings_data)
                    ? JSON.parse(settings_data)
                    : null;
                if (settings && settings.theme_config) {

                  store.commit("UPDATE_THEME", settings.theme_config.theme);
                }
                localStorage.setItem("user", JSON.stringify(result.data));
                if (result.data.features) {
                  localStorage.setItem(
                    "features",
                    JSON.stringify(result.data.features)
                  );
                }
              });

            axios
              .get(
                `${process.env.VUE_APP_BACK}/roles/${response.data.user.role}`,
                {
                  headers: { Authorization: localStorage.token },
                }
              )
              .then((result) => {
                localStorage.setItem("permissions", result.data.permissions);
                const user = response.data.user;
                if (user && user.package) {
                  router.push("/");
                } else if(user && user.username === 'super') {
                  router.push("/package");
                } else if (user && !user.package) {
                  router.push("/packages");
                }
                resolve(response);
              });
          } else {
            reject({ message: "Wrong Email or Password" });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
