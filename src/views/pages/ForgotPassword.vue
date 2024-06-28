<!-- =========================================================================================
    File Name: ForgotPassword.vue
    Description: FOrgot Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img">
    <vs-popup class="holamundo" title="Notification" :active.sync="notif_popup">
      <p class="notif_text">Please check your email.</p>

      <vs-button
        class="float-right mt-6 unimacs_button"
        @click="notif_popup = false"
        >OK</vs-button
      >
    </vs-popup>

    <div
      class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center"
    >
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div
              class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center forgot_img_block"
            >
              <img
                src="/password__reset_mail.png"
                alt="login"
                class="mx-auto"
              />
            </div>
            <div
              class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg"
            >
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Recover your password</h4>
                  <p>
                    Please enter your email address and we'll send you
                    instructions on how to reset your password.
                  </p>
                </div>

                <vs-input
                  type="email"
                  label-placeholder="Email"
                  v-model="email"
                  class="w-full mb-8"
                />
                <vs-button
                  type="border"
                  to="/login"
                  class="px-4 w-full md:w-auto"
                  >Back To Login</vs-button
                >
                <vs-button
                  class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0"
                  @click="recoverPassword"
                  >Recover Password</vs-button
                >
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      notif_popup: false,
    };
  },
  methods: {
    recoverPassword() {
      this.$http
        .post("account/forgotPassword", { email: this.email })
        .then((res) => {
          this.notif_popup = true;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.notif_text {
  text-align: center;
  padding-top: 25px;
  font-weight: 600;
}

.forgot_img_block {
  padding: 60px 20px !important;
  img {
    max-width: 300px;
  }
}
</style>
