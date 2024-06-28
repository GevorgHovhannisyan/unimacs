<!-- =========================================================================================
File Name: RegisterJWT.vue
Description: Register Page for JWT
----------------------------------------------------------------------------------------
Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="clearfix">
    <vs-popup class="holamundo" title="Notification" :active.sync="notif_popup">
      <p class="notif_text">
        Your account must be to activated.
        <br />
        Please wait we are contact with you soon.
      </p>

      <vs-button
        class="float-right mt-6 unimacs_button"
        @click="notif_popup = false"
        >OK</vs-button
      >
    </vs-popup>
    <vs-input
      data-vv-validate-on="change"
      name="email"
      type="email"
      label="Email"
      placeholder="Email"
      :disabled="true"
      v-model="email"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first("email") }}</span>

    <vs-input
      data-vv-validate-on="change"
      label="Full Name"
      name="full_name"
      :disabled="true"
      placeholder="Full Name"
      v-model="full_name"
      class="w-full mt-1"
    />

    <span class="text-danger text-sm">{{ errors.first("full_name") }}</span>

    <vs-input
      ref="password"
      type="password"
      data-vv-validate-on="change"
      v-validate="'required|min:7'"
      name="password"
      @input="checkPass($event)"
      label="Password"
      placeholder="Password"
      v-model="password"
      class="w-full mt-2"
    />
    <span class="text-danger text-sm">{{ errors.first("password") }}</span>

    <vs-input
      type="password"
      v-validate="'min:7|confirmed:password'"
      data-vv-as="password"
      name="confirm_password"
      label="Confirm Password"
      placeholder="Confirm Password"
      v-model="confirm_password"
      class="w-full mt-2"
    />
    <span class="text-danger text-sm">{{
      errors.first("confirm_password")
    }}</span>

    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button
          class="float-right mt-6 w-full set_pass"
          color="#03ce00"
          @click="registerUserJWt"
          :disabled="!validateForm"
          >Finish Registration</vs-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: null,
      full_name: null,
      password: null,
      confirm_password: null,
      notif_popup: false,
    };
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.email &&
        this.full_name &&
        this.password &&
        this.confirm_password
      );
    },
  },
  watch: {},
  created() {
    this.$http
      .get(`account/invite/${this.$route.params.token}`)
      .then((res) => {
        this.email = res.data.email;
        this.full_name = res.data.first_name + " " + res.data.last_name;
      })
      .catch((err) => {
        // if (err && err.response && err.response.data) {
        //   if (err.response.data.message == "Wrong token!!") {
        //     this.$router.push("/login").catch(() => {});
        //   }
        // }
      });
  },
  methods: {
    registerUserJWt() {
      this.$http
        .put(`account/invite/${this.$route.params.token}`, {
          password: this.password,
        })
        .then((res) => {
          this.$vs.notify({
time: 7000,
            color: "success",
            title: `Password set. Please try to log in`,
          });
          setTimeout(() => {
            this.$router.push("/login").catch(() => {});
          }, 100);
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
          this.popupActive = false;
        });
    },
    passValidation(string) {
      this.errors.clear();
      if (
        /\d/.test(string) &&
        /[A-Z]/.test(string) &&
        /[a-z]/.test(string) 
        // &&        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string)
      ) {
        this.errors.clear();
        return true;
      } else if (string.length == 0) {
        this.errors.add({
          field: "password",
          msg: "Password field required",
        });
      } else if (string.length < 7) {
        this.errors.add({
          field: "password",
          msg: "Password field must have min 7 character",
        });
      } else if (!/\d/.test(string)) {
        this.errors.add({
          field: "password",
          msg: "Password field must have number",
        });
      } else if (!/[A-Z]/.test(string)) {
        this.errors.add({
          field: "password",
          msg: "Password field must have upper case letter",
        });
      } else if (!/[a-z]/.test(string)) {
        this.errors.add({
          field: "password",
          msg: "Password field must have lower case letter",
        });
      } 

      return false;
    },
    checkPass(event) {
      this.passValidation(event);
    },
  },
};
</script>

<style scoped>
.notif_text {
  text-align: center;
  padding-top: 25px;
  font-weight: 600;
}

.set_pass {
  border: 2px solid black;
  padding: 10px 0;
}
</style>