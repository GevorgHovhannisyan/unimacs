<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="layout--main" :class="[
    layoutTypeClass,
    navbarClasses,
    footerClasses,
    { 'no-scroll': isAppPage },
  ]">
    <the-customizer v-if="!disableCustomizer" :footerType="footerType" :hideScrollToTop="hideScrollToTop"
      :navbarType="navbarType" :navbarColor="navbarColor" :routerTransition="routerTransition"
      @toggleHideScrollToTop="toggleHideScrollToTop" @updateFooter="updateFooter" @updateNavbar="updateNavbar"
      @updateNavbarColor="updateNavbarColor" @updateRouterTransition="updateRouterTransition" />

    <v-nav-menu :navMenuItems="navbarItems" title="Vuexy" parent=".layout--main" />

    <div id="content-area" :class="[contentAreaClass, { 'show-overlay': bodyOverlay }]">
      <div id="content-overlay" />

      <template>
        <the-navbar-vertical :navbarColor="navbarColor" :class="[
          { 'text-white': isNavbarDark && !isThemeDark },
          { 'text-base': !isNavbarDark && isThemeDark },
        ]" />
      </template>

      <!-- /Navbar -->

      <div class="content-wrapper">
        <div class="router-view">
          <div class="router-content">
            <transition :name="routerTransition">
              <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
                class="router-header flex flex-wrap items-center  justify-between"
                style="margin-top: 4.5rem !important; margin-bottom: 0.5rem !important;">
                <div class="content-area__heading" :class="{
                  'pr-4 border-0 md:border-r border-solid border-grey-light':
                    $route.meta.breadcrumb,
                }">
                  <h2 class="">{{ routeTitle }}</h2>

                  <div class="tutorial_" v-if="!isSuper && $route.meta && $route.meta.tutorial">
                    <img src="/youtube.svg" @click="openTutorial" alt="">
                    <h4>Tutorial</h4>
                  </div>
                </div>



                <vs-button class="unimacs_button ml-3 send_inv" v-if="$route.name === 'Company' &&
                  permissionsInvite &&
                  permissionsInvite.createLink
                  " @click="opendInvitePopup">Send invite to the {{ hasCompany }}</vs-button>

                <!-- BREADCRUMB -->
                <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" :route="$route"
                  :isRTL="$vs.rtl" />
              </div>
            </transition>

            <div class="content-area__content">
              <back-to-top bottom="5%" :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'" visibleoffset="500"
                v-if="!hideScrollToTop">
                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg btn-back-to-top" />
              </back-to-top>

              <transition :name="routerTransition" mode="out-in">
                <router-view @changeRouteTitle="changeRouteTitle" @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)
                  " />
              </transition>
            </div>
          </div>
        </div>
      </div>
      <!-- <the-footer /> -->
    </div>
  </div>
</template>

<script>
import BackToTop from "vue-backtotop";
import navMenuItems from "@/layouts/components/vertical-nav-menu/navMenuItems.js";
import TheCustomizer from "@/layouts/components/customizer/TheCustomizer.vue";

import TheNavbarHorizontal from "@/layouts/components/navbar/TheNavbarHorizontal.vue";
import TheNavbarVertical from "@/layouts/components/navbar/TheNavbarVertical.vue";
import TheFooter from "@/layouts/components/TheFooter.vue";
import themeConfig from "@/../themeConfig.js";
import VNavMenu from "@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue";
import { pagePermissions } from "@/functions/pagePermissions";

const VxTour = () => import("@/components/VxTour.vue");

export default {
  components: {
    BackToTop,
    TheFooter,
    TheNavbarHorizontal,
    TheNavbarVertical,
    TheCustomizer,
    VNavMenu,
    VxTour,
  },
  data() {
    return {
      // permissions: this.$store.state.permissions,
      disableCustomizer: themeConfig.disableCustomizer,
      disableThemeTour: themeConfig.disableThemeTour,
      dynamicWatchers: {},
      footerType: themeConfig.footerType || "static",
      hideScrollToTop: themeConfig.hideScrollToTop,
      isNavbarDark: false,
      navbarColor: themeConfig.navbarColor || "#fff",
      navbarType: themeConfig.navbarType || "floating",
      navMenuItems,
      navbarItems: [],
      routerTransition: themeConfig.routerTransition || "none",
      routeTitle: this.$route.meta.pageTitle,
      steps: [
        {
          target: "#btnVNavMenuMinToggler",
          content: "Toggle Collapse Sidebar.",
        },
        {
          target: ".vx-navbar__starred-pages",
          content:
            "Create your own bookmarks. You can also re-arrange them using drag & drop.",
        },
        {
          target: ".i18n-locale",
          content: "You can change language from here.",
        },
        {
          target: ".navbar-fuzzy-search",
          content: "Try fuzzy search to visit pages in flash.",
        },
        {
          target: ".customizer-btn",
          content: "Customize template based on your preference",
          params: {
            placement: "left",
          },
        },
        {
          target: ".vs-button.buy-now",
          content: "Buy this awesomeness at affordable price!",
          params: {
            placement: "top",
          },
        },
      ],
      saveSettings: null,
    };
  },
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle;
    },
    isThemeDark(val) {
      const color = this.navbarColor === "#fff" && val ? "#10163a" : "#fff";
      this.updateNavbarColor(color);
    },
    "$store.state.mainLayoutType"(val) {
      this.setNavMenuVisibility(val);
      this.disableThemeTour = true;
    },
  },
  computed: {
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)
        : this.$store.state.permissions
          ? this.$store.state.permissions
          : null;
    },
    bodyOverlay() {
      return this.$store.state.bodyOverlay;
    },
    contentAreaClass() {
      if (this.mainLayoutType === "vertical") {
        if (this.verticalNavMenuWidth === "default")
          return "content-area-reduced";
        else if (this.verticalNavMenuWidth === "reduced")
          return "content-area-lg";
        else return "content-area-full";
      } else return "content-area-full";
    },
    footerClasses() {
      return {
        "footer-hidden": this.footerType === "hidden",
        "footer-sticky": this.footerType === "sticky",
        "footer-static": this.footerType === "static",
      };
    },
    isAppPage() {
      return this.$route.meta.no_scroll;
    },
    isThemeDark() {
      return this.$store.state.theme === "dark";
    },
    layoutTypeClass() {
      return `main-${this.mainLayoutType}`;
    },
    mainLayoutType() {
      return this.$store.state.mainLayoutType;
    },
    navbarClasses() {
      return {
        "navbar-hidden": this.navbarType === "hidden",
        "navbar-sticky": this.navbarType === "sticky",
        "navbar-static": this.navbarType === "static",
        "navbar-floating": this.navbarType === "floating",
      };
    },
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    permissionsInvite() {
      return localStorage.permissions &&
        JSON.parse(localStorage.permissions)["RegistrationInvite"]
        ? JSON.parse(localStorage.permissions)["RegistrationInvite"].actions
        : null;
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
    },
    settingsStore() {
      return this.$store.state.settings
    },
    isSuper() {
      return localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")) && JSON.parse(localStorage.getItem("user")).username === 'super'
    },
    tutorialLinks() {
      return this.$store.state.tutorialLinks
    }
  },
  methods: {
    async setSettings(event) {
      this.$store.dispatch("setSettings", event);
    },
    // async getSettings() {
    //   const data = await this.$http.get(`/account/getUserData`, {
    //     headers: { Authorization: localStorage.token },
    //   });
    //   return data;
    // },
    changeRouteTitle(title) {
      this.routeTitle = title;
    },
    updateNavbar(val) {
      if (val === "static")
        this.updateNavbarColor(this.isThemeDark ? "#10163a" : "#fff");
      this.navbarType = val;
    },
    async updateNavbarColor(val) {
      // console.log('updateNavbarColor');
      // // this.$store.commit("UPDATE_NAVBAR", val);
      // // await this.getSettings().then((res) => {
      //   const settings = JSON.parse(JSON.stringify(this.settingsStore)) || null;

      //   if (settings) {
      //     if (settings.theme_config) {
      //       settings.theme_config.navbar_color = val;
      //     } else {
      //       settings.theme_config = {
      //         navbar_color: val,
      //       };
      //     }
      //     await this.$store.dispatch("setSettings", settings)
      //     // this.setSettings(settings);
      //     localStorage.setItem(
      //       "theme_config",
      //       JSON.stringify(settings.theme_config)
      //     );
      //   }
      // // });
      // //

      // this.navbarColor = val;
      // if (val === "#fff") this.isNavbarDark = false;
      // else this.isNavbarDark = true;
    },
    updateFooter(val) {
      this.footerType = val;
    },
    updateRouterTransition(val) {
      this.routerTransition = val;
    },
    setNavMenuVisibility(layoutType) {
      if (
        (layoutType === "horizontal" && this.windowWidth >= 1200) ||
        (layoutType === "vertical" && this.windowWidth < 1200)
      ) {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);
        this.$store.dispatch("updateVerticalNavMenuWidth", "no-nav-menu");
      } else {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);
      }
    },
    toggleHideScrollToTop(val) {
      this.hideScrollToTop = val;
    },
    upperCaseToSpace(modelName) {
      let name = "";
      const char = modelName;
      if (char === char.toUpperCase()) {
        name = name + char.toLowerCase();
      } else {
        name = name + char;
      }

      name = name.replace(/([A-Z])/g, " $1").trim();
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    checkFalse(obj) {
      for (var i in obj) {
        for (var j in obj[i]) {
          if (obj[i][j] == true) return false;
        }
      }
      return true;
    },
    checkDepartment(obj) {
      for (var i in obj) {
        if (obj[i] == true && i != "getAllItems") return false;
      }
      return true;
    },
    opendInvitePopup() {
      this.$root.$emit("openInvitePop");
    },
    openTutorial() {
      const url = this.tutorialLinks[this.$route.name]
      if (url) {
        window.open(url, '_blank');
      }
    }
  },

  created() {

    const settings = JSON.parse(JSON.stringify(this.settingsStore)) || null;

    const user = localStorage.user ? JSON.parse(localStorage.user) : null;
    this.navbarItems = [];
    let depart_role = true;
    this.navbarItems[0] = {
      header: "Content",
      icon: "LayersIcon",
      items: [],
    };

    var accpointcontroll = {
      url: null,
      name: "Access Point Control",
      slug: "AccessPointControl",
      icon: "icon_point_controll",
      submenu: [],
    };

    var clientcompany = {
      url: null,
      name: "System",
      slug: "ClientCompany",
      icon: "icon_system",
      submenu: [],
    };

    var cardcontrol = {
      url: null,
      name: "Cardholders Control",
      slug: "CardControll",
      icon: "icon_card_controll",
      submenu: [],
    };

    var schedulecontrol = {
      url: null,
      name: "Schedules Control",
      slug: "SchedulesControl",
      icon: "icon_schedule_controll",
      submenu: [],
    };

    var reportcontrol = {
      url: null,
      name: "Reporting Manager",
      slug: "ReportsControl",
      icon: "icon_reporting_manager",
      submenu: [],
    };

    var companycontrol = {
      url: null,
      name: "Company Control",
      slug: "CompanyControll",
      icon: "icon_company_controll",
      submenu: [],
    };
    const pointsControll = ["AccessPoint", "AccessPointGroup"];
    const scedulesControll = ["Schedule"];
    const comapaniesControll = ["Company", "ServiceCompany"]; // "ClientCompany",

    const cardholdersControll = [
      "AccessRight",
      "Guests",
      "Cardholder",
      "CardholderGroup",
      "GuestKeys",
    ];

    const reportsControll = ["EventLog", "StandardReport", "UserLog"];
    this.navMenuItems.forEach((item, index, object) => {
      var hasFalseKeys = this.checkFalse(this.permissions[item.slug]);

      if (
        item.slug == "Admin" &&
        this.permissions[item.slug] &&
        this.permissions[item.slug].actions.getAllItems
      ) {
        this.navbarItems[0].items.push(item);
      } else if (!hasFalseKeys && item.slug !== "Admin") {
        if (
          item.slug == "Department" &&
          this.permissions[item.slug] &&
          this.permissions[item.slug].actions
        ) {
          depart_role = this.checkDepartment(
            this.permissions[item.slug].actions
          );
          if (!depart_role) {
            this.navbarItems[0].items.push(item);
          }
        } else if (pointsControll.includes(item.slug)) {
          if (user && !user.partition_parent_id) {
            let accessPointControl = this.navbarItems[0].items.find(
              (x) => x.slug == "AccessPointControl"
            );
            if (accessPointControl) {
              accessPointControl.submenu.push(item);
            } else {
              accpointcontroll.submenu.push(item);
              this.navbarItems[0].items.push(accpointcontroll);
            }
          }
        } else if (scedulesControll.includes(item.slug)) {
          let schedulecontroll = this.navbarItems[0].items.find(
            (x) => x.slug == "SchedulesControl"
          );
          if (schedulecontroll) {
            schedulecontroll.submenu.push(item);
          } else {
            schedulecontrol.submenu.push(item);
            this.navbarItems[0].items.push(schedulecontrol);
          }
        } else if (cardholdersControll.includes(item.slug)) {
          let cardcontroll = this.navbarItems[0].items.find(
            (x) => x.slug == "CardControll"
          );

          if (item.slug == "AccessPointGroup") {
            const groupPerms = this.permissions.AccessPointGroup
              ? this.permissions.AccessPointGroup.actions
              : {};
            const zonePerms = this.permissions.AccessPointZone
              ? this.permissions.AccessPointZone.actions
              : {};

            if (
              (groupPerms && pagePermissions(groupPerms) == true) ||
              (zonePerms && pagePermissions(zonePerms) == true)
            ) {
              if (cardcontroll) {
                cardcontroll.submenu.push(item);
              } else {
                cardcontrol.submenu.push(item);
                this.navbarItems[0].items.push(cardcontrol);
              }
            }
          } else {
            if (item.slug == "Cardholder") {
              if (user && user.cardholder) {
                const findGuest = this.navMenuItems.find(
                  (x) => x.slug == "Guests"
                );

                if (cardcontroll) {
                  cardcontroll.submenu.push(findGuest);
                } else {
                  cardcontrol.submenu.push(findGuest);
                  this.navbarItems[0].items.push(cardcontrol);
                }
              } else {
                if (cardcontroll) {
                  cardcontroll.submenu.push(item);
                } else {
                  cardcontrol.submenu.push(item);
                  this.navbarItems[0].items.push(cardcontrol);
                }
              }
            } else {
              if (cardcontroll) {
                cardcontroll.submenu.push(item);
              } else {
                cardcontrol.submenu.push(item);
                this.navbarItems[0].items.push(cardcontrol);
              }
            }
          }
        } else if (reportsControll.includes(item.slug)) {
          let repcontroll = this.navbarItems[0].items.find(
            (x) => x.slug == "ReportsControl"
          );
          if (repcontroll) {
            repcontroll.submenu.push(item);
          } else {
            reportcontrol.submenu.push(item);
            this.navbarItems[0].items.push(reportcontrol);
          }
        } else if (comapaniesControll.includes(item.slug)) {
          let compcontroll = this.navbarItems[0].items.find(
            (x) => x.slug == "CompanyControll"
          );
          if (compcontroll) {
            if (item.slug === 'Company') {
              if (user.username === 'super') {
                compcontroll.submenu.push(item);
              }
            } else {
              compcontroll.submenu.push(item);
            }
          } else {
            if (item.slug === 'Company') {
              if (user.username === 'super') {
                companycontrol.submenu.push(item);
                this.navbarItems[0].items.push(companycontrol);
              }
            } else {
              companycontrol.submenu.push(item);
              this.navbarItems[0].items.push(companycontrol);

            }
          }
        } else if (item.slug == "EventLog") {
          this.navbarItems[0].items.push(item);
        } else if (item.slug == "Product") {
          let compcontroll = this.navbarItems[0].items.find(
            (x) => x.slug == "ClientCompany"
          );
          if (compcontroll) {
            compcontroll.submenu.push(item);
          } else {
            clientcompany.submenu.push(item);
            this.navbarItems[0].items.push(clientcompany);
          }
        } else {
          this.navbarItems[0].items.push(item);
        }
      } else {
        if (item.slug == "GuestKeys") {
          if (user && !user.cardholder) {
            if (cardcontrol) {
              cardcontrol.submenu.push(item);
            } else {
              cardcontrol.submenu.push(item);
              this.navbarItems[0].items.push(cardcontrol);
            }
          }
        }

        if (item.slug == "AutoTask") {
          if (user && user.company && !user.cardholder) {
            let schedulecontroll = this.navbarItems[0].items.find(
              (x) => x.slug == "SchedulesControl"
            );
            if (schedulecontroll) {
              schedulecontroll.submenu.push(item);
            } else {
              schedulecontrol.submenu.push(item);
              this.navbarItems[0].items.push(schedulecontrol);
            }
          }
        }

        if (
          item.slug == "Cctv" &&
          this.permissions.CameraDevice &&
          this.permissions.CameraDevice.actions.getAllItems
        ) {
          this.navbarItems[0].items.push(item);
        }
      }
    });

    this.setNavMenuVisibility(this.$store.state.mainLayoutType);
    this.dynamicWatchers.windowWidth = this.$watch(
      "$store.state.windowWidth",
      (val) => {
        if (val < 1200) {
          this.disableThemeTour = true;
          this.dynamicWatchers.windowWidth();
        }
      }
    );

    this.dynamicWatchers.verticalNavMenuWidth = this.$watch(
      "$store.state.verticalNavMenuWidth",
      () => {
        this.disableThemeTour = true;
        this.dynamicWatchers.verticalNavMenuWidth();
      }
    );

    this.dynamicWatchers.rtl = this.$watch("$vs.rtl", () => {
      this.disableThemeTour = true;
      this.dynamicWatchers.rtl();
    });

    this.$root.$on("changeTitle", (data) => {
      this.routeTitle = data;
    });
  },
  beforeDestroy() {
    Object.keys(this.dynamicWatchers).map((i) => {
      this.dynamicWatchers[i]();
      delete this.dynamicWatchers[i];
    });
  },
};
</script>
