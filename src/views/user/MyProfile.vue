<template>
  <div class="page-user-edit">
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Account" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <vx-card class="mt-base" no-shadow >
                <div class="vx-row">
                  <div class="vx-col w-full">
                    <div class="flex items-start flex-col sm:flex-row">
                      <img
                        :src="avatarSrc"
                        class="mr-8 rounded h-24 w-24"
                        style="object-fit: cover"
                      />

                      <div>
                        <input
                          type="file"
                          class="hidden"
                          ref="update_avatar_input"
                          @change="update_avatar"
                          accept="image/*"
                        />

                        <vs-button
                          type="border"
                          class="mr-4"
                          @click="$refs.update_avatar_input.click()"
                          >Change Avatar</vs-button
                        >

                        <!-- <vs-button class="mr-4 mb-4">Change Avatar</vs-button> -->
                        <vs-button
                          type="border"
                          color="danger"
                          @click.prevent="removeAvatar"
                          >Remove Avatar</vs-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <form>
                  <div class="vx-row">
                    <div class="vx-col md:w-1/3 w-full">
                      <vs-input
                        v-model="userData.first_name"
                        class="w-full mt-4"
                        label="First Name"
                        v-validate="'required'"
                        name="first_name"
                      />
                      <span
                        class="text-danger text-sm"
                        v-show="errors.has('first_name')"
                        >{{ errors.first("first_name") }}</span
                      >
                    </div>
                    <div class="vx-col md:w-1/3 w-full">
                      <vs-input
                        v-model="userData.last_name"
                        class="w-full mt-4"
                        label="Last Name"
                        v-validate="'required'"
                        name="last_name"
                      />
                      <span
                        class="text-danger text-sm"
                        v-show="errors.has('last_name')"
                        >{{ errors.first("last_name") }}</span
                      >
                    </div>

                    <div class="vx-col md:w-1/3 w-full">
                      <vs-input
                        class="w-full mt-4"
                        v-model="userData.email"
                        label="Email"
                        type="email"
                        v-validate="'required|email'"
                        name="email"
                      />
                      <span
                        class="text-danger text-sm"
                        v-show="errors.has('email')"
                        >{{ errors.first("email") }}</span
                      >
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center justify-end">
                    <vs-button
                      @click.prevent="changeUserData"
                      class="ml-auto mt-10"
                      >Save</vs-button
                    >
                    <vs-button
                      class="mt-10 ml-2 unimacs_cancel_button"
                      @click="cancel"
                      >Cancel</vs-button
                    >
                  </div>
                </form>
              </vx-card>
              <!-- <user-edit-tab-account class="mt-4" :data="user_data" /> -->
            </div>
          </vs-tab>

          <vs-tab label="Change password" icon-pack="feather" icon="icon-info">
            <div class="tab-text">
              <form>
                <vx-card no-shadow>
                  <vs-input
                    class="w-full mb-base"
                    label-placeholder="Old Password"
                    type="password"
                    autocomplete="new-password"
                    v-model="old_password"
                    v-validate="'min:4'"
                    ref="password"
                  />
                  <vs-input
                    class="w-full mb-base"
                    label-placeholder="New Password"
                    type="password"
                    v-model="password"
                    @input="checkPass($event)"
                    ref="password"
                    name="password"
                  />
                  <span
                    class="text-danger text-sm"
                    v-show="errors.has('password')"
                    >{{ errors.first("password") }}</span
                  >
                  <vs-input
                    class="w-full mb-base"
                    type="password"
                    label-placeholder="Confirm Password"
                    name="confirm_password"
                    v-model="confirm_password"
                    v-validate="'required|confirmed:password'"
                    data-vv-as="password"
                  />
                  <span
                    class="text-danger text-sm"
                    v-show="errors.has('confirm_password')"
                    >{{ errors.first("confirm_password") }}</span
                  >

                  <!-- Save & Reset Button -->
                  <div class="flex flex-wrap items-center justify-end">
                    <vs-button class="ml-auto mt-2" @click.prevent="changePass"
                      >Change Password</vs-button
                    >
                    <vs-button
                      type="border"
                      class="mt-2 ml-2"
                      color="#b49b13"
                      @click="cancel"
                      >Cancel</vs-button
                    >
                  </div>
                </vx-card>
              </form>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import moduleUser from "@/store/user/moduleUserManagement.js";
import moduleFile from "@/store/files/moduleFile.js";

import axios from "axios";
export default {
  data() {
    return {
      userData: {},
      old_password: "",
      password: "",
      confirm_password: "",
      activeTab: 0,
      avatarSrc: "/no_avatar.svg",
      active: 0,
      file: null,
    };
  },
  methods: {
    changeUserData() {
      this.$vs.loading({
        type: "corners",
      });

      axios({
        method: "put",
        url: `account/myProfile`,
        data: this.userData,
        headers: {
          Authorization: localStorage.token,
        },
      })
        .then((response) => {
          this.$vs.loading.close();

          this.$root.$emit("changeAvatar", response.data.avatar);
          this.$root.$emit("changeName", response.data);

          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Your info updated",
          });

          this.$router.push("/admins");
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    cancel() {
      this.$router.push("/admins");
    },
    update_avatar(event) {
      this.$vs.loading({
        type: "corners",
      });
      var input = event.target.files[0];

      this.$store
        .dispatch("file/uploadFile", input)
        .then((res) => {
          this.avatarSrc = `${process.env.VUE_APP_BACK}/${res.data.path}`;
          this.userData.avatar = JSON.stringify({
            path: res.data.path,
            name: res.data.name,
          });
          this.$vs.loading.close();
        })
        .catch((error) => {
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
    removeAvatar() {
      this.file = null;
      this.avatarSrc = "/no_avatar.svg";
    },
    changePass() {
      if (this.passValidation(this.password)) {
        const userId = localStorage.getItem("userId");

        const data = {
          id: +userId,
          old_password: this.old_password,
          password: this.password,
        };

        this.$vs.loading({
          type: "corners",
        });

        this.$store
          .dispatch("user/changeMyPass", data)
          .then((res) => {
            this.$vs.loading.close();

            setTimeout(() => {
              this.$vs.loading.close();
              this.activeLoading = false;
              this.$vs.notify({
time: 7000,
                color: "success",
                title: `Password changed`,
              });
              this.password = "";
              this.old_password = "";
              this.confirm_password = "";
              this.$validator.reset();
              setTimeout(() => {
                this.activeTab = 0;
              }, 500);
            }, 1000);
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      } else {
        // form have errors
      }
    },
  },
  created() {
    // Register Module UserManagement Module

    if (!moduleUser.isRegistered) {
      this.$store.registerModule("user", moduleUser);
      moduleUser.isRegistered = true;
    }

    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    const userId = JSON.parse(localStorage.user).id;

    this.$store.dispatch("user/fetchUser", +userId).then((res) => {
      const admin = res.data.admin;

      if (admin.avatar) {
        admin.avatar = JSON.parse(admin.avatar);
        this.avatarSrc = `${process.env.VUE_APP_BACK}/${admin.avatar.path}`;
      }

      this.userData = {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
      };
    });
  },
};
</script>


<style scoped>
</style>
