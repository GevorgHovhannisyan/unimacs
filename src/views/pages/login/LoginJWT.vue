<template>
  <div class="login_block">
    <vs-input
      v-validate="'required|min:3'"
      data-vv-validate-on="change"
      name="username"
      icon-no-border
      icon="icon icon-user"
      icon-pack="feather"
      @keyup.enter="loginJWT"
      label-placeholder="Username or email"
      v-model="username"
      class="w-full"
    />
    <span class="text-danger text-sm">{{ errors.first("username") }}</span>

    <vs-input
      data-vv-validate-on="change"
      v-validate="'required|min:4'"
      type="password"
      name="password"
      icon-no-border
      @keyup.enter="loginJWT"
      icon="icon icon-lock"
      icon-pack="feather"
      label-placeholder="Password"
      v-model="password"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first("password") }}</span>

    <div class="flex flex-wrap justify-between forgot my-5">
      <!-- <a href="/forgot-password">Forgot Password</a> -->
      <router-link to="/forgot-password">Forgot Password?</router-link>
    </div> 
    <div class="flex flex-wrap justify-between mb-3">
      <vs-button type="border" @click="$router.push('/register')">Register</vs-button>
      <vs-button @click="loginJWT">Login</vs-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginJwt",
  data() {
    return {
      username: "",
      password: "",
      checkbox_remember_me: false,
    };
  },
  computed: {
    // validateForm() {
    //   return !this.errors.any() && this.username !== "" && this.password !== "";
    // },
  },
  methods: {
    loginJWT() {
      // this.$vs.loading();

      const payload = {
        userDetails: {
          username: this.username,
          password: this.password,
        },
      };

      this.$store
        .dispatch("auth/loginJWT", payload)
        .then((res) => {
          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
  },
};
</script>

<style scoped>
.login_block {
  margin-top: 50px;
}
</style>

