<!-- =========================================================================================
  File Name: VerticalNavMenu.vue
  Description: Vertical NavMenu Component
  Component Name: VerticalNavMenu
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="parentx">
    <vs-sidebar class="v-nav-menu items-no-padding" v-model="isVerticalNavMenuActive" ref="verticalNavMenu"
      default-index="-1" :click-not-close="clickNotClose" :reduce-not-rebound="reduceNotRebound" :parent="parent"
      :hiddenBackground="clickNotClose" :reduce="reduce" v-hammer:swipe="onMenuSwipe">
      <div @mouseenter="mouseEnter" @mouseleave="mouseLeave">
        <!-- Header Shadow -->
        <div class="shadow-bottom" v-show="showShadowBottom" />
        <div class="custom_logo_content flex items-center">
          <div class="img_block">
            <img :src="getLogo" alt />
          </div>
          <!-- <span class="ml-3">
            <img :src="getText" alt />
          </span> -->
        </div>

        <!-- Menu Items -->
        <component :is="scrollbarTag" ref="verticalNavMenuPs" class="scroll-area-v-nav-menu pt-4" :settings="settings"
          @ps-scroll-y="psSectionScroll" @scroll="psSectionScroll" :key="$vs.rtl">
          <template v-for="(item, index) in menuItemsUpdated">
            <!-- Group Header -->
            <span v-if="item.header && !verticalNavMenuItemsMin" class="navigation-header truncate"
              :key="`header-${index}`">{{ $t(item.i18n) || item.header }}</span>
            <!-- /Group Header -->

            <template v-else-if="!item.header">
              <!-- Nav-Item -->
              <v-nav-menu-item v-if="!item.submenu" :key="`item-${index}`" :index="index"
                :to="item.slug !== 'external' ? item.url : null" :href="item.slug === 'external' ? item.url : null"
                :icon="item.icon" :target="item.target" :isDisabled="item.isDisabled" :slug="item.slug">
                <span v-show="!verticalNavMenuItemsMin" class="truncate">{{
                  $t(item.i18n) || item.name
                }}</span>
                <vs-chip class="ml-auto" :color="item.tagColor" v-if="item.tag && (isMouseEnter || !reduce)">{{ item.tag
                }}</vs-chip>
              </v-nav-menu-item>

              <!-- Nav-Group -->
              <template v-else>
                <v-nav-menu-group :key="`group-${index}`" :openHover="openGroupHover" :group="item" :groupIndex="index"
                  :open="isGroupActive(item)" />
              </template>
              <!-- /Nav-Group -->
            </template>
          </template>
          <div class="custom_theme_customize flex items-center">
            <span>Light/Dark</span>

            <vs-switch color="success" class="ml-3 theme_switcher" @input="changeTheme" v-model="theme_mode">
            </vs-switch>
          </div>
        </component>

        <!-- /Menu Items -->
      </div>
    </vs-sidebar>

    <!-- Swipe Gesture -->
    <div v-if="!isVerticalNavMenuActive" class="v-nav-menu-swipe-area" v-hammer:swipe="onSwipeAreaSwipe" />
    <!-- /Swipe Gesture -->
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VNavMenuGroup from "./VerticalNavMenuGroup.vue";
import VNavMenuItem from "./VerticalNavMenuItem.vue";

import Logo from "../Logo.vue";

export default {
  name: "v-nav-menu",
  components: {
    VNavMenuGroup,
    VNavMenuItem,
    VuePerfectScrollbar,
    Logo,
  },
  props: {
    logo: { type: String },
    openGroupHover: { type: Boolean, default: false },
    parent: { type: String },
    reduceNotRebound: { type: Boolean, default: true },
    navMenuItems: { type: Array, required: true },
  },
  data: () => ({
    title: "ForTech",
    clickNotClose: false, // disable close navMenu on outside click
    isMouseEnter: false,
    reduce: false, // determines if navMenu is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    settings: {
      // perfectScrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true,
    },
    showShadowBottom: false,
    theme_mode: false,
  }),
  computed: {
    getLogo() {
      if (this.$store.state.theme === "dark") {
        return "/LumiRing_logo_D.svg";
      } else {
        return "/LumiRing_logo_W.svg";
      }
    },
    getText() {
      if (this.$store.state.theme === "dark") {
        return "/d_comp_name.svg";
      } else {
        return "/l_comp_name.svg";
      }
    },
    isGroupActive() {
      return (item) => {
        const path = this.$route.fullPath;
        const routeParent = this.$route.meta
          ? this.$route.meta.parent
          : undefined;
        let open = false;

        const func = (item) => {
          if (item.submenu) {
            item.submenu.forEach((item) => {
              if (
                item.url &&
                (path === item.url || routeParent === item.slug)
              ) {
                open = true;
              } else if (item.submenu) {
                func(item);
              }
            });
          }
        };
        func(item);
        return open;
      };
    },
    menuItemsUpdated() {
      const clone = this.navMenuItems.slice();

      for (const [index, item] of this.navMenuItems.entries()) {
        if (item.header && item.items.length && (index || 1)) {
          const i = clone.findIndex((ix) => ix.header === item.header);
          for (const [subIndex, subItem] of item.items.entries()) {
            clone.splice(i + 1 + subIndex, 0, subItem);
          }
        }
      }

      return clone;
    },
    isVerticalNavMenuActive: {
      get() {
        return this.$store.state.isVerticalNavMenuActive;
      },
      set(val) {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", val);
      },
    },
    layoutType() {
      return this.$store.state.mainLayoutType;
    },
    reduceButton: {
      get() {
        return this.$store.state.reduceButton;
      },
      set(val) {
        this.$store.commit("TOGGLE_REDUCE_BUTTON", val);
      },
    },
    isVerticalNavMenuReduced() {
      return Boolean(this.reduce && this.reduceButton);
    },
    verticalNavMenuItemsMin() {
      return this.$store.state.verticalNavMenuItemsMin;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    settingsStore() {
      return this.$store.state.settings
    }
  },
  watch: {
    $route() {
      if (this.isVerticalNavMenuActive && this.showCloseButton)
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);
    },
    reduce(val) {
      const verticalNavMenuWidth = val
        ? "reduced"
        : this.$store.state.windowWidth < 1200
          ? "no-nav-menu"
          : "default";
      this.$store.dispatch("updateVerticalNavMenuWidth", verticalNavMenuWidth);

      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    },
    layoutType() {
      this.setVerticalNavMenuWidth();
    },
    reduceButton() {
      this.setVerticalNavMenuWidth();
    },
    windowWidth() {
      this.setVerticalNavMenuWidth();
    },
    settingsStore: {
      handler: function (data) {
        const storage = localStorage.theme_config && JSON.parse(localStorage.theme_config) ? JSON.parse(localStorage.theme_config) : null
        if (data && data.theme_config) {
          const theme = data.theme_config;
          if (theme.theme && theme.theme === "dark") {
            this.theme_mode = true;
          }
        } else if (storage) {
          if (storage.theme === 'dark') {
            this.theme_mode = true;
          } else {
            this.theme_mode = false;
          }
        } else {
          this.theme_mode = false;
        }
      },
      deep: true,
    }
  },
  methods: {
    changeTheme() {
      this.$store.dispatch("updateTheme", this.theme_mode ? "dark" : "light");
    },
    onMenuSwipe(event) {
      if (event.direction === 4 && this.$vs.rtl) {
        // Swipe Right
        if (this.isVerticalNavMenuActive && this.showCloseButton)
          this.isVerticalNavMenuActive = false;
      } else if (event.direction === 2 && !this.$vs.rtl) {
        // Swipe Left
        if (this.isVerticalNavMenuActive && this.showCloseButton)
          this.isVerticalNavMenuActive = false;
      }
    },
    onSwipeAreaSwipe(event) {
      if (event.direction === 4 && !this.$vs.rtl) {
        // Swipe Right
        if (!this.isVerticalNavMenuActive && this.showCloseButton)
          this.isVerticalNavMenuActive = true;
      } else if (event.direction === 2 && this.$vs.rtl) {
        // Swipe Left
        if (!this.isVerticalNavMenuActive && this.showCloseButton)
          this.isVerticalNavMenuActive = true;
      }
    },
    psSectionScroll() {
      const scroll_el =
        this.$refs.verticalNavMenuPs.$el || this.$refs.verticalNavMenuPs;
      this.showShadowBottom = scroll_el.scrollTop > 0;
    },
    mouseEnter() {
      if (this.reduce)
        this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", false);
      this.isMouseEnter = true;
    },
    mouseLeave() {
      if (this.reduce)
        this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", true);
      this.isMouseEnter = false;
    },
    setVerticalNavMenuWidth() {
      if (this.windowWidth > 1200) {
        if (this.layoutType === "vertical") {
          // Set reduce
          this.reduce = !!this.reduceButton;

          // Open NavMenu
          this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);

          // Set Menu Items Only Icon Mode
          const verticalNavMenuItemsMin = !!(
            this.reduceButton && !this.isMouseEnter
          );
          this.$store.commit(
            "UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN",
            verticalNavMenuItemsMin
          );

          // Menu Action buttons
          this.clickNotClose = true;
          this.showCloseButton = false;

          const verticalNavMenuWidth = this.isVerticalNavMenuReduced
            ? "reduced"
            : "default";
          this.$store.dispatch(
            "updateVerticalNavMenuWidth",
            verticalNavMenuWidth
          );

          return;
        }
      }

      // Close NavMenu
      this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);

      // Reduce button
      if (this.reduceButton) this.reduce = false;

      // Menu Action buttons
      this.showCloseButton = true;
      this.clickNotClose = false;

      // Update NavMenu Width
      this.$store.dispatch("updateVerticalNavMenuWidth", "no-nav-menu");

      // Remove Only Icon in Menu
      this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", false);
    },
    toggleReduce(val) {
      this.reduceButton = val;
      this.setVerticalNavMenuWidth();
    },

  },
  mounted() {
    this.setVerticalNavMenuWidth();
    // await this.$store.dispatch("getSettings")
    const settings = JSON.parse(JSON.stringify(this.settingsStore)) || null;

    if (settings && settings.theme_config) {
      const theme = settings.theme_config;
      if (theme.theme && theme.theme === "dark") {
        this.theme_mode = true;
      }
    } else {
      this.theme_mode = false;
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/verticalNavMenu.scss";

.navigation-header.truncate {
  display: none;
}

.truncate.mr-3.select-none {
  margin-left: 8px !important;
}

.custom_logo_content {
  padding: 30px 30px 0 30px;

  .img_block {
    width: 100%;
    max-width: 200px;

    img {
      width: 80%;
    }
  }

  span {
    font-weight: bold;
    font-size: 20px;
    margin: 0;
    width: 100%;

    img {
      width: 100%;
    }
  }
}

.scroll-area-v-nav-menu.ps--theme_default {
  display: flex;
  position: relative;
  flex-direction: column;
}

.custom_theme_customize {
  position: absolute;
  bottom: 65px;
  left: 60px;
}

.theme_switcher {
  background: none !important;
  border: 1px solid #00cfe8;

  .vs-switch--circle {
    background: #00cfe8;
    top: 1px;
  }
}
</style>
