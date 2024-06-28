<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="relative">
    <vs-popup class="holamundo" title="Send Invite" :active.sync="sendPopup">
      <div>
        <vs-input
          class="w-full mt-4"
          label="Email"
          v-model="email"
          type="email"
          v-validate="'email'"
          name="email"
        />
        <span class="text-danger text-sm" v-show="errors.has('email')">{{
          errors.first("email")
        }}</span>
      </div>
      <div class="vx-roww-full">
        <div
          class="vx-col w-full"
          style="display: flex; flex-direction: row-reverse"
        >
          <vs-button
            class="mt-4 unimacs_button"
            @click="sendEmail"
            :disabled="!isEmailValid"
            >Send invite</vs-button
          >
        </div>
      </div>
      <!-- <vs-button class="unimacs_button" @click="sendPopup = false"
        >Cancel</vs-button
      > -->
    </vs-popup>

    <div class="vx-navbar-wrapper" :class="classObj">
      <vs-navbar
        class="vx-navbar navbar-custom navbar-skelton unimacs_header"
        :color="navbarColorLocal"
        :class="textColor"
      >
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer p-2"
          icon="MenuIcon"
          @click.stop="showSidebar"
        />
        <profile-drop-down />
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import I18n from "./components/I18n.vue";
import SearchBar from "./components/SearchBar.vue";
import CartDropDown from "./components/CartDropDown.vue";
import NotificationDropDown from "./components/NotificationDropDown.vue";
import ProfileDropDown from "./components/ProfileDropDown.vue";
import { pagePermissions } from "../../../functions/pagePermissions";

export default {
  name: "the-navbar-vertical",
  props: {
    navbarColor: {
      type: String,
      default: "#fff"
    }
  },
  components: {
    I18n,
    SearchBar,
    CartDropDown,
    NotificationDropDown,
    ProfileDropDown
  },
  watch: {
    sendPopup(val) {
      if (!val) {
        this.email = null;
      }
    }
  },
  data() {
    return {
      classObj: "vx-navbar-wrapper navbar-default",
      currentTime: null,
      email: null,
      sendPopup: false,
      notif_lists: [],
      dashboardPerms:
        localStorage.permissions &&
        JSON.parse(localStorage.permissions).Dashboard
          ? true
          : false,
        showNotifs: false
    };
  },
  created() {
    this.currentTime = `${this.$moment().format("HH:mm:ss")} `;

    const showNotifs = pagePermissions(this.dashPermissions);
    if (showNotifs !== true) {
      this.showNotifs = false;
    } else {
      this.showNotifs = true;


      setInterval(() => this.updateCurrentTime(), 1 * 1000);
      this.$root.$on("eventHeader", () => {
        this.classObj = `${this.classObj} `;
      });
    }
  },

  computed: {
    dashPermissions() {
      return localStorage.permissions &&
        JSON.parse(localStorage.permissions).Dashboard
        ? JSON.parse(localStorage.permissions).Dashboard.actions
        : null;
    },
    permissions() {
      return localStorage.permissions &&
        JSON.parse(localStorage.permissions)["RegistrationInvite"]
        ? JSON.parse(localStorage.permissions)["RegistrationInvite"].actions
        : null;
    },
    getLogo() {
      if (this.$store.state.theme === "dark") {
        return "/lumiring_dark.png";
      } else {
        return "/lumiring_light.png";
      }
    },
    navbarColorLocal() {
      return this.$store.state.theme === "dark" && this.navbarColor === "#fff"
        ? "#10163a"
        : this.navbarColor;
    },
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    textColor() {
      return {
        "text-white":
          (this.navbarColor != "#10163a" &&
            this.$store.state.theme === "dark") ||
          (this.navbarColor != "#fff" && this.$store.state.theme !== "dark")
      };
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    isEmailValid() {
      return !this.errors.any() && this.email;
    },
    hasCompany() {
      const userCompany =
        localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))
          ? JSON.parse(localStorage.getItem("user")).company
          : null;

      if (userCompany) {
        return "partition";
      } else {
        return "company";
      }
    }
  },
  methods: {
    openNotificationList() {},
    showSidebar() {
      this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);
    },
    sendEmail() {
      this.$vs.loading({
        type: "corners"
      });
      this.$http
        .post(
          `registrationInvite`,
          {
            email: this.email
          },
          { headers: { Authorization: localStorage.token } }
        )
        .then(res => {
          this.sendPopup = false;

          this.email = "";

          this.errors.items = [];

          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Registraion invite sent"
          });
          this.$vs.loading.close();
        })
        .catch(error => {
          this.$vs.loading.close();
          this.sendPopup = false;
        });
    },
    updateCurrentTime() {
      this.currentTime = `${this.$moment().format("HH:mm:ss")} `;
    }
  }
};
</script>

<style lang="scss">
.dateTime {
  margin-left: 4%;
  font-size: 20px;
}

.search {
  margin-right: 25px;
}

.unimacs_header {
  .vs-con-items {
    align-items: left;
    justify-content: end;
  }
}
</style>
