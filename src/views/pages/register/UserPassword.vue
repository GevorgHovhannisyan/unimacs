<!-- =========================================================================================
    File Name: Register.vue
    Description: Register Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
  >
    <PrivacyPopup
      :popupActive="privacy_popup"
      @popup="privacy_popup = $event"
    />
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter">
            <div
              class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center"
            >
              <img
                src="@/assets/images/pages/register.jpg"
                alt="register"
                class="mx-auto"
              />
            </div>
            <div
              class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg"
            >
              <div class="px-8 pt-8 register-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">Registration</h4>
                  <p>Fill the below form to create a new account.</p>
                </div>
                <div class="register_block"></div>
                <div class="clearfix">
                  <vs-popup
                    class="holamundo"
                    title="Notification"
                    :active.sync="notif_popup"
                  >
                    <p class="notif_text">
                      Your account must be to activated.
                      <br />
                      Please wait we are contact with you soon.
                    </p>

                    <vs-button
                      class="float-right mt-6"
                      color="#b49b13"
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
                  <span class="text-danger text-sm">{{
                    errors.first("email")
                  }}</span>

                  <vs-input
                    data-vv-validate-on="change"
                    label="First name"
                    name="full_name"
                    :disabled="true"
                    placeholder="Full Name"
                    v-model="full_name"
                    class="w-full mt-1"
                  />

                  <span class="text-danger text-sm">{{
                    errors.first("full_name")
                  }}</span>

                  <vs-input
                    ref="password"
                    autocomplate="off"
                    type="password"
                    data-vv-validate-on="change"
                    v-validate="'required|min:6'"
                    name="password"
                    @input="checkPass($event)"
                    label="Password"
                    placeholder="Password"
                    v-model="password"
                    class="w-full mt-2"
                  />
                  <span class="text-danger text-sm">{{
                    errors.first("password")
                  }}</span>

                  <vs-input
                    type="password"
                    autocomplate="off"
                    v-validate="'min:6|confirmed:password'"
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
                </div>
                <div class="vx-row w-full">
                  <div class="vx-col w-full mt-3 terms_condictions">
                    <vs-checkbox v-model="terms"
                      >I agree Terms and conditions</vs-checkbox
                    >
                  </div>
                  <div class="vx-col w-full mt-3 terms_condictions">
                    <vs-checkbox class="mt-6 policy_block" v-model="privacy"
                      >I agree to UNICONS
                      <span class="ploicy_link" @click="privacy_popup = true"
                        >Privacy Policy</span
                      >
                    </vs-checkbox>
                  </div>
                </div>
                <div class="vx-row w-full" style="margin: auto">
                  <div class="vx-col w-full" style="padding-bottom: 20px">
                    <vs-button
                      class="float-right mt-6 w-full new_pass"
                      @click="registerUserJWt"
                      color="#03ce00"
                      :disabled="!validateForm"
                      >Register</vs-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import PrivacyPopup from "@/views/account/PrivacyPolicyPopup";
export default {
  data() {
    return {
      email: null,
      full_name: null,
      password: null,
      confirm_password: null,
      notif_popup: false,
      terms: false,
      privacy_popup: false,
      privacy: false,
    };
  },
  components: {
    PrivacyPopup,
  },
  created() {
    this.$http
      .get(`account/invite/${this.$route.params.token}`)
      .then((res) => {
        this.email = res.data.email;
        this.full_name = res.data.first_name;
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          if (err.response.data.message == "Wrong token!!") {
            this.$router.push("/login").catch(() => {});
          }
        }
      });
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.terms &&
        this.privacy &&
        this.email &&
        this.full_name &&
        this.password &&
        this.confirm_password
      );
    },
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
            title: "Password set. Please try to login",
          });

          setTimeout(() => {
            this.$router.push("/login").catch(() => {});
          }, 200);
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

<style lang="scss">
.register-tabs-container {
  min-height: 517px;

  .con-tab {
    padding-bottom: 23px;
  }
}

.notif_text {
  text-align: center;
  padding-top: 25px;
  font-weight: 600;
}

.terms_condictions {
  text-decoration: underline;
}

.new_pass {
  border: 2px solid black;
  padding: 9px 0;
}

.policy_block {
  font-size: 15px;
}

.ploicy_link {
  text-decoration: underline;
  color: blue;
  position: relative;
  z-index: 250;
  cursor: pointer;
}
</style>
