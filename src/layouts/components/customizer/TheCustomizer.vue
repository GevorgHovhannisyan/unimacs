<!-- =========================================================================================
    File Name: TheCustomizer.vue
    Description: Template Customizer
    Component Name: TheCustomizer
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
  ========================================================================================== -->

<template>
  <div id="theme-customizer">
    <!-- Open Customizer Button -->
    <vs-button
      @click.stop="active = !active"
      color="primary"
      type="filled"
      class="customizer-btn custom_btnz"
      v-if="!hideNotif"
      :class="{ opene_customizer: active }"
    >
      {{ notifsCount || "0" }}
    </vs-button>

    <!-- Customizer Content -->
    <vs-sidebar
      click-not-close
      hidden-background
      position-right
      v-model="active"
      class="items-no-padding"
    >
      <div class="h-full">
        <div
          class="customizer-header mt-6 flex items-center justify-between px-6"
        >
          <div></div>
          <feather-icon
            icon="XIcon"
            @click.stop="active = false"
            class="cursor-pointer"
          ></feather-icon>
        </div>

        <vs-divider class="mb-0" />

        <component
          :is="scrollbarTag"
          class="scroll-area--customizer pt-4 pb-6"
          :settings="settings"
          :key="$vs.rtl"
        >
          <div class="px-6">
            <div class="custom_notif_block">
              <div class="header">
                {{
                  notifsCount
                    ? `${notifsCount} unconfirmed notifications`
                    : "No unconfirmed notifications"
                }}
              </div>
              <table>
                <tr
                  @click="$root.$emit('openNotif', notif)"
                  v-for="(notif, index) in notif_lists"
                  :key="index"
                  :class="{ unconfirmed: notif.confirmed == 'Unconfirmed' }"
                >
                  <td style="float: left; padding-right: 20px">
                    {{ notif.event }}
                  </td>
                  <td style="width: 80px; float: right">
                    {{ elapsedTime(notif.createDate) }}
                  </td>
                </tr>
              </table>
            </div>
            <vs-divider class="mb-0" />
          </div>
        </component>
      </div>
    </vs-sidebar>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  props: {
    footerType: { type: String, required: true },
    hideScrollToTop: { type: Boolean, required: true },
    navbarType: { type: String, required: true },
    navbarColor: { type: String, required: true, default: "#fff" },
    routerTransition: { type: String, required: true },
  },
  data() {
    return {
      hideNotif: false,
      active: false,
      customPrimaryColor: "#3DC9B3",
      customNavbarColor: "#3DC9B3",
      routerTransitionsList: [
        { text: "Zoom Fade", value: "zoom-fade" },
        { text: "Slide Fade", value: "slide-fade" },
        { text: "Fade Bottom", value: "fade-bottom" },
        { text: "Fade", value: "fade" },
        { text: "Zoom Out", value: "zoom-out" },
        { text: "None", value: "none" },
      ],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      themeColors: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
      saveSettings: null,
      dashboardPerms:
        localStorage.permissions &&
        JSON.parse(localStorage.permissions).Dashboard
          ? true
          : false,
      showNotifs: false,
      notif_lists: [],
      notifsCount:
        localStorage.user && JSON.parse(localStorage.user).notifications
          ? JSON.parse(localStorage.user).notifications
          : 0,
    };
  },
  watch: {
    layoutType(val) {
      // Reset unsupported options
      if (val === "horizontal") {
        // if (this.themeMode === "semi-dark") this.themeMode = "light";
        if (this.navbarType === "hidden") this.navbarTypeLocal = "floating";
        this.$emit("updateNavbarColor", "#fff");
      }
    },
  },
  computed: {
    elapsedTime() {
      return (startTime) => {
        const x = new Date(startTime);
        const now = new Date();
        let timeDiff = now - x;
        timeDiff /= 1000;

        const seconds = Math.round(timeDiff);
        timeDiff = Math.floor(timeDiff / 60);

        const minutes = Math.round(timeDiff % 60);
        timeDiff = Math.floor(timeDiff / 60);

        const hours = Math.round(timeDiff % 24);
        timeDiff = Math.floor(timeDiff / 24);

        const days = Math.round(timeDiff % 365);
        timeDiff = Math.floor(timeDiff / 365);

        const years = timeDiff;

        if (years > 0) {
          return `${years + (years > 1 ? " Years " : " Year ")}ago`;
        } else if (days > 0) {
          return `${days + (days > 1 ? " Days " : " Day ")}ago`;
        } else if (hours > 0) {
          return `${hours + (hours > 1 ? " Hrs " : " Hour ")}ago`;
        } else if (minutes > 0) {
          return `${minutes + (minutes > 1 ? " Mins " : " Min ")}ago`;
        } else if (seconds > 0) {
          return seconds + (seconds > 1 ? " sec ago" : "just now");
        }

        return "Just Now";
      };
    },
    footerTypeLocal: {
      get() {
        return this.footerType;
      },
      set(val) {
        this.$emit("updateFooter", val);
      },
    },
    hideScrollToTopLocal: {
      get() {
        return this.hideScrollToTop;
      },
      set(val) {
        this.$emit("toggleHideScrollToTop", val);
      },
    },
    navbarColorInitial() {
      return this.$store.state.theme === "dark" ? "#10163a" : "#fff";
    },
    navbarColorOptionClasses() {
      return (color) => {
        const classes = {};
        if (color === this.navbarColorLocal) classes["shadow-outline"] = true;
        if (this.navbarTypeLocal === "static")
          classes["cursor-not-allowed"] = true;
        return classes;
      };
    },
    navbarColorLocal: {
      get() {
        return this.navbarColor;
      },
      set(val) {
        if (this.navbarType === "static") return;
        this.$emit("updateNavbarColor", val);
      },
    },
    navbarTypeLocal: {
      get() {
        return this.navbarType;
      },
      set(val) {
        this.$emit("updateNavbar", val);
        this.$store.dispatch("updateNavbar", val);
      },
    },
    layoutType: {
      get() {
        return this.$store.state.mainLayoutType;
      },
      set(val) {
        this.$store.commit("UPDATE_MAIN_LAYOUT_TYPE", val);
      },
    },
    primaryColor: {
      get() {
        return this.$store.state.themePrimaryColor;
      },
      set(val) {
        this.$store.commit("UPDATE_PRIMARY_COLOR", val);
      },
    },
    reduced_sidebar: {
      get() {
        return this.$store.state.reduceButton;
      },
      set(val) {
        this.$store.commit("TOGGLE_REDUCE_BUTTON", val);
      },
    },
    routerTransitionLocal: {
      get() {
        return this.routerTransition;
      },
      set(val) {
        this.$emit("updateRouterTransition", val);
      },
    },
    rtl: {
      get() {
        return this.$vs.rtl;
      },
      set(val) {
        this.$vs.rtl = val;
      },
    },
    themeMode: {
      get() {
        return this.$store.state.theme;
      },
      set(val) {
        this.$store.dispatch("updateTheme", val);
      },
    },
    scrollbarTag() {
      return this.$store.state.is_touch_device ? "div" : "VuePerfectScrollbar";
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  methods: {

    updateCurrentTime() {
      this.currentTime = `${this.$moment().format("HH:mm:ss")} `;
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
                  if (item.confirmed) {
                    item.confirmed = this.$moment(
                      new Date(parseInt(item.confirmed))
                    ).format(`HH:MM DD.MM.YYYY ( dddd )`);
                    ("Unconfirmed");
                  } else {
                    item.confirmed = "Unconfirmed";
                  }

                  if (item.access_point) {
                    item.access_point = item.access_point;
                  } else {
                    item.access_point = "No Access Point";
                  }
                });
              }
              this.notif_lists = res.data.data;
            });
        }
      }
    },
    changeNotifs(count) {
      if (localStorage.user && JSON.parse(localStorage.user)) {
        let user = JSON.parse(localStorage.user);
        user.notifications = count;
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
  },
  created() {
    const user = localStorage.user ? JSON.parse(localStorage.user) : null;

    if (user && user.username == "super") {
      this.hideNotif = true;
    }

    this.$root.$on("nullableNotifs", () => {
      this.changeNotifs(0);

      this.notifsCount = 0;
      this.notif_lists.map((d) => {
        d.confirmed = this.$moment(new Date(1626816931997)).format(
          `HH:MM DD.MM.YYYY ( dddd )`
        );
      });
    });

    this.$root.$on("confirm_notif", (data) => {
      if(this.notifsCount && +this.notifsCount > 0) {
        this.notifsCount--;
      }
      this.changeNotifs(this.notifsCount);

      const index = this.notif_lists.findIndex((n) => n.id == data.id);
      this.notif_lists[index].confirmed = this.$moment(
        new Date(data.confirmed)
      ).format(`HH:MM DD.MM.YYYY ( dddd )`);
    });

    this.$root.$on("push_notification", (data) => {
      this.notifsCount++;
      this.changeNotifs(this.notifsCount);

      data.confirmed = "Unconfirmed";
      this.notif_lists.unshift(data);
    });

    this.showNotifs = true;

    const params = {
      page: 1,
      page_items_count: 15,
    };

    if (user.company && !user.cardholder) {
      this.getNotifs(params);
    }

    setInterval(() => this.updateCurrentTime(), 1 * 1000);
    this.$root.$on("eventHeader", () => {
      this.classObj = `${this.classObj} `;
    });
    // }
  },
  components: {
    VuePerfectScrollbar,
  },
};
</script>

<style lang="scss">
#theme-customizer {
  .vs-sidebar {
    position: fixed;
    // z-index: 52000;
    z-index: 555555;
    width: 800px;
    max-width: 90vw;
    // @apply shadow-lg;
    box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
      0 5px 15px 0 rgba(0, 0, 0, 0.08);
  }
}

.customizer-btn {
  position: fixed;
  top: 50%;
  right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 50000;

  // .vs-icon {
  //   animation: spin 1.5s linear infinite;
  // }
}

.scroll-area--customizer {
  height: calc(100% - 5rem);

  &:not(.ps) {
    overflow-y: auto;
  }
}

.opene_customizer {
  right: 775px;
}

.custom_btnz {
  padding: 10px !important;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  z-index: 1111111111;

  &:hover {
    box-shadow: none;
  }

  .vs-button-text.vs-button--text {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.custom_notif_block {
  max-height: 300px;
  overflow: hidden;
  overflow-y: auto;

  .header {
    padding: 10px 0;
    text-align: center;
    border-top-left-radius: 2px;
    border-top-right-radius: 5px;
    border-bottom: none;
    font-weight: 600;
    font-size: 17px;
    top: 0;
    z-index: 1;
    position: sticky;
  }

  table {
    width: 100%;
    max-width: 100%;
    min-width: 100%;

    tr {
      display: table-caption;
      padding: 10px 15px;

      &.unconfirmed {
        background: #80808033;
      }

      &:hover {
        background: #80808033;
        cursor: pointer;
      }
    }
  }
}

.wizard_part {
  justify-content: space-between;

  div {
    padding: 10px;
    cursor: pointer;
    // border: 1px solid #00dbff;
    // background: #283046;
    // color: #00dbff;
    min-width: 240px;
    text-align: center;
  }
}
</style>
