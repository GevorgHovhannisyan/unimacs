<template>
  <div class="the-navbar__user-meta flex items-center">
    <vs-dropdown vs-custom-content class="cursor-pointer" vs-trigger-click>
      <div class="con-img ml-3">
        <img
          key="onlineImg"
          :src="avatarSrc"
          alt="user-img"
          width="40"
          height="40"
          class="rounded-full shadow-md cursor-pointer block"
        />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <vs-dropdown-item
          @click.prevent="$router.push('/account').catch(() => {})"
        >
          <span class="ml-2" style="font-size: 14px">Account</span>
        </vs-dropdown-item>

        <vs-dropdown-item
          @click.prevent="$router.push('/admins').catch(() => {})"
        >
          <span class="ml-2" style="font-size: 14px">Local Accounts</span>
        </vs-dropdown-item>

        <vs-dropdown-item
          @click.prevent="$router.push('/user-logs').catch(() => {})"
        >
          <span class="ml-2" style="font-size: 14px">User Logs</span>
        </vs-dropdown-item>
        <vs-divider class="m-1" />
        <vs-dropdown-item @click.prevent="logout">
          <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
          <span class="ml-2">Logout</span>
        </vs-dropdown-item>

        <!-- <ul style="min-width: 9rem">
          <li
            class="
              flex
              py-2
              px-4
              cursor-pointer
              hover:bg-primary hover:text-white
            "
            style="padding: 5px 5px !important"
            @click="$router.push('/account').catch(() => {})"
          >
            <span class="ml-2" style="font-size: 14px">Account</span>
          </li>
          <li
            class="
              flex
              py-2
              px-4
              cursor-pointer
              hover:bg-primary hover:text-white
            "
            style="padding: 5px 5px !important"
            @click="$router.push('/admins').catch(() => {})"
          >
            <span class="ml-2" style="font-size: 14px">Local Accounts</span>
          </li>

          <li
            class="
              flex
              py-2
              px-4
              cursor-pointer
              hover:bg-primary hover:text-white
            "
            style="padding: 5px 5px !important"
            @click="$router.push('/user-logs').catch(() => {})"
          >
            <span class="ml-2" style="font-size: 14px">User Logs</span>
          </li>

          <vs-divider class="m-1" />

          <li
            class="
              flex
              py-2
              px-4
              cursor-pointer
              hover:bg-primary hover:text-white
            "
            @click="logout"
          >
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Logout</span>
          </li>
        </ul> -->
      </vs-dropdown-menu>
    </vs-dropdown>
    <div class="text-right leading-tight hidden sm:block ml-4">
      <p class="font-semibold">{{ username }}</p>
      <small>{{ email }}</small>
    </div>
  </div>
</template>

<script>
export default {
  data(mail) {
    return {
      username:
        localStorage.user && JSON.parse(localStorage.user)
          ? JSON.parse(localStorage.user).last_name
            ? JSON.parse(localStorage.user).first_name +
              " " +
              JSON.parse(localStorage.user).last_name
            : JSON.parse(localStorage.user).first_name
          : "",
      email: localStorage.user ? JSON.parse(localStorage.user).email : "",
      avatarSrc: "/no_avatar.svg",
    };
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
  },
  created() {
    if (localStorage.user && localStorage.token) {
      let avatar = JSON.parse(localStorage.user).avatar
        ? JSON.parse(JSON.parse(localStorage.user).avatar)
        : null;

      this.avatarSrc = avatar
        ? `${process.env.VUE_APP_BACK}/${avatar.path}`
        : "/no_avatar.svg";

      this.$root.$on("changeAvatar", (avatar) => {
        if (avatar) {
          avatar = JSON.parse(avatar);
          this.avatarSrc = `${process.env.VUE_APP_BACK}/${avatar.path}`;
        } else {
          this.avatarSrc = "/no_avatar.svg";
        }
      });
      this.$root.$on("changeName", (user) => {
        this.username = user.last_name
          ? user.first_name + " " + user.last_name
          : user.first_name;
        this.email = user.email;
      });
    }
  },
  methods: {
    logout() {
      // If JWT login
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("permissions");
        localStorage.removeItem("features");
        localStorage.removeItem("settings");
        localStorage.removeItem("theme_config");

        // localStorage.removeItem("token");
        // localStorage.clear();
        this.$router.push("/login").catch(() => {});
        this.$store.commit("UPDATE_THEME", "light");
      }

      // Change role on logout. Same value as initialRole of acj.js
      // this.$acl.change("admin");
      // localStorage.removeItem("userInfo");

      // This is just for demo Purpose. If user clicks on logout -> redirect
      this.$router.push("/login").catch(() => {});
    },
  },
};
</script>
