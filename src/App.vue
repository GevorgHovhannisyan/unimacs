<!-- =========================================================================================
  File Name: App.vue
  Description: Main vue file - APP
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="app" :class="vueAppClasses">
    <vs-popup
      class="holamundo notif__part"
      title="Alarm event"
      :active.sync="notif_popup"
    >
      <Notification
        v-if="notif_data"
        :propsData="notif_data"
        @closeConfirmPopup="notif_popup = false"
      />
    </vs-popup>
    <vs-popup
      class="holamundo notif_list_part"
      title="Alarm event"
      :active.sync="notif_list_popup"
    >
      <NotificationsList
        v-if="notif_list_data.data.length"
        @close_notif_popup="notif_list_popup = false"
        :propsData="notif_list_data"
      />
    </vs-popup>

    <vs-popup
      class="holamundo notif_list_part"
      title="Error message"
      :active.sync="errorPopup"
    >
      <ErrorMessage v-if="errorPopup" :message="errorData" />
    </vs-popup>

    <router-view @setAppClasses="setAppClasses" />
  </div>
</template>

<script>
import themeConfig from "@/../themeConfig.js";
import jwt from "@/http/requests/auth/jwt/index.js";
import Notification from "./Notification";
import NotificationsList from "./NotificationsList";
import ErrorMessage from "./ErrorMessage";
export default {
  components: {
    Notification,
    NotificationsList,
    ErrorMessage,
  },
  sockets: {
    connect: function () {},
  },
  data() {
    return {
      vueAppClasses: [],
      notif_popup: false,
      notif_data: null,
      errorData: null,
      errorPopup: false,
      notif_list_popup: false,
      notif_list_data: {
        data: [],
        count: 0,
      },
    };
  },
  watch: {
    "$store.state.theme"(val) {
      this.toggleClassInBody(val);
    },
    "$vs.rtl"(val) {
      document.documentElement.setAttribute("dir", val ? "rtl" : "ltr");
    },
  },
  computed: {
    themeColor() {
      return this.$store.state.theme;
    },
  },
  methods: {
    toggleClassInBody(className) {
      if (className === "dark") {
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
        document.body.classList.add("theme-dark");
      } else if (className === "semi-dark") {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-semi-dark");
      } else {
        if (document.body.className.match("theme-dark")) {
          document.body.classList.remove("theme-dark");
        }
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
      }
    },
    setAppClasses(classesStr) {
      this.vueAppClasses.push(classesStr);
    },
    handleWindowResize() {
      this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

      // Set --vh property
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    },
    handleScroll() {
      this.$store.commit("UPDATE_WINDOW_SCROLL_Y", window.scrollY);
    },
    getNotifs(params) {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;

      if (user) {
        if (user.company && !user.package) {
        } else {
          this.$http
            .get(`notification`, {
              headers: { Authorization: localStorage.token },
              params,
            })
            .then((res) => {
              this.notif_lists = [];

              if (res.data.data.length) {
                res.data.data.forEach((item) => {
                  const time_zone =
                    item.access_points && "time_zone" in item.access_points
                      ? item.access_points.time_zone
                      : null;
                  const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
                  var isFirefox = typeof InstallTrigger !== "undefined";
                  var isSafari =
                    navigator.vendor &&
                    navigator.vendor.indexOf("Apple") > -1 &&
                    navigator.userAgent &&
                    navigator.userAgent.indexOf("CriOS") == -1 &&
                    navigator.userAgent.indexOf("FxiOS") == -1;
                  var is_OSX = /(Mac|iPhone|iPod|iPad)/i.test(
                    navigator.platform
                  );
                  let correct_date;
                  if (isFirefox || isSafari || is_OSX) {
                    const local = this.$moment
                      .utc(item.createDate, "YYYY-MM-DD HH:mm:ss")
                      .tz(time_zone ? time_zone : time);
                    const momentFormat = this.$moment(
                      local,
                      "YYYY-MM-DD HH:mm:ss"
                    ).format("YYYY-MM-DD HH:mm:ss");
                    correct_date = momentFormat;
                    if (item.confirmed) {
                      const confirmedLocal = this.$moment
                        .utc(new Date(+item.confirmed), "YYYY-MM-DD HH:mm:ss")
                        .tz(time_zone ? time_zone : time);
                      const momentFormat = this.$moment(
                        confirmedLocal,
                        "YYYY-MM-DD HH:mm:ss"
                      ).format("YYYY-MM-DD HH:mm:ss");
                      item.confirmed = momentFormat;
                    }
                  } else {
                    correct_date = this.$moment(item.createDate)
                      .tz(time_zone ? time_zone : time)
                      .format(`YYYY-MM-DD HH:mm:ss`);

                    if (item.confirmed) {
                      item.confirmed = this.$moment(new Date(+item.confirmed))
                        .tz(time_zone ? time_zone : time)
                        .format(`YYYY-MM-DD HH:mm:ss`);
                    }
                  }
                  item.createDate = correct_date;
                });
              }

              this.notif_list_data = res.data;
              this.notif_popup = false;
              this.notif_list_popup = true;
            });
        }
      }
    },
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme);
    this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    this.$root.$on("openNotif", (data) => {
      this.notif_data = data;
      this.notif_popup = true;
    });
  },
  async created() {
    localStorage.setItem("disable_notifs", false);

    // jwt
    jwt.init();
    const dir = this.$vs.rtl ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);

    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("scroll", this.handleScroll);

    if (this.themeColor) {
      setTimeout(() => {
        this.toggleClassInBody(this.themeColor);
      }, 0);
    }

    const user = localStorage.user ? JSON.parse(localStorage.user) : null;
    if (user && user.company) {
      if(!user.cardholder) {
        this.sockets.subscribe(`notification/${user.company}`, (payload) => {
          const socket_data = JSON.parse(payload);
          this.notif_data = socket_data;
          const disable_notif = localStorage.getItem("disable_notifs");
          if (this.$route.name !== "page-login" && disable_notif != "true") {
            this.notif_popup = true;
          }

          this.$root.$emit("push_notification", socket_data);
        });
      }
    }

    this.$root.$on("view_all_notifs", () => {
      const params = {
        page: 1,
        page_items_count: 10,
      };
      this.getNotifs(params);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="scss">
:root {
  --select-border: #777;
  --select-focus: blue;
  --select-arrow: var(--select-border);
}
.notif__part.vs-popup-primary,
.notif__part {
  z-index: 99999999999999;
}

.notif__part {
  left: auto !important;
  right: 0px !important;
  width: 800px !important;
  .vs-popup--background {
    background: none !important;
  }
}


.notif__part .vs-popup {
  position: absolute;
  top: 15px;
  right: 15px;
}

.notif_list_part.vs-popup-primary {
  z-index: 1000000000;
}

.notif_list_part .vs-popup {
  width: 1000px !important;
}

.notif_list_part .vs-popup--content {
  max-height: 75vh;
}

.custom_select_tag {
  // A reset of styles, including removing the default dropdown arrow
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;

  // Stack above custom arrow
  z-index: 1;

  // Remove dropdown arrow in IE10 & IE11
  // @link https://www.filamentgroup.com/lab/select-css.html
  &::-ms-expand {
    display: none;
  }

  // Remove focus outline, will add on alternate element
  outline: none;
}

.custom_select {
  display: grid;
  grid-template-areas: "select";
  align-items: center;
  position: relative;

  .custom_select_tag,
  &::after {
    grid-area: select;
  }

  min-width: 15ch;
  max-width: 30ch;

  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;

  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;

  // Optional styles
  // remove for transparency
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);

  // Custom arrow
  &:not(.select--multiple)::after {
    content: "";
    justify-self: end;
    width: 0.8em;
    height: 0.5em;
    background-color: var(--select-arrow);
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }
}

// Interim solution until :focus-within has better support
.custom_select_tag:focus + .custom_focus {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 2px solid var(--select-focus);
  border-radius: inherit;
}

.select--disabled {
  cursor: not-allowed;
  background-color: #eee;
  background-image: linear-gradient(to top, #ddd, #eee 33%);
}

.custom_select + label {
  margin-top: 2rem;
}

.vs-component.con-vs-dialog.vs-dialog-danger {
  z-index: 5555555555 !important;
}
</style>
