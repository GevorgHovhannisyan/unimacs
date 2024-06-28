<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
  >
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
                  <h4 class="mb-4">Recovery Password</h4>
                  <p>Fill the below form to set a new password.</p>
                </div>
                <div class="register_block"></div>
                <div class="clearfix">
                  <vs-input
                    ref="password"
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

                  <vs-button
                    class="float-right mt-6"
                    @click="setNewPass"
                    :disabled="!validateForm"
                    >Set password</vs-button
                  >
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
export default {
  data() {
    return {
      password: "",
      confirm_password: "",
    };
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.password !== "" &&
        this.confirm_password !== ""
      );
    },
  },
  methods: {
    setNewPass() {
      this.$http
        .put(`account/invite/${this.$route.params.token}`, {
          password: this.password,
        })
        .then((res) => {
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Password successfully changed",
          });

          this.$router.push("/login").catch(() => {});
        })
        .catch((err) => {
          this.$vs.loading.close();
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
</style>
