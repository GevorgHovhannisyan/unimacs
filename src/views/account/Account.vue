<!-- =========================================================================================
  File Name: UserView.vue
  Description: User View page
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="page-user-edit ed_2">
    <PrivacyPopup :popupActive="privacy_popup" @popup="privacy_popup = $event" />
    <TermsPopup :popupActive="terms_popup" @popup="terms_popup = $event" />
    <div :class="{ activeLoading: activeLoading }" @click="openLoading(corners)"
      class="vs-con-loading__container loading-example"></div>
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner date_block">
          <vs-tab label="Main" icon-pack="feather" icon="icon-user" class="ac_main_tb">
            <div class="tab-text">
              <vx-card class="mt-base acc_vx_card" no-shadow>
                <div class="vx-row inner_roww">
                  <div class="vx-col md:w-1/6 w-full ac_image_bl">
                    <div class="
                        flex
                        items-start
                        flex-col
                        sm:flex-column
                        avatar_block
                      ">
                      <img :src="avatarSrc" class="mr-8 rounded h-24 w-24 account_avatar" />
                      <div class="account_actions_part">
                        <p class="text-lg font-medium mb-2 mt-4 sm:mt-0">
                          {{ userData.username }}
                        </p>
                        <input type="file" class="hidden" ref="update_avatar_input" @change="update_avatar"
                          accept="image/*" />

                        <div>
                          <feather-icon icon="EditIcon" style="font-size: 25px" @click="$refs.update_avatar_input.click()"
                            class="cursor-pointer" />

                          <feather-icon icon="XSquareIcon" style="font-size: 25px" v-if="userData.avatar"
                            @click="removeAvatar" class="cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="vx-col md:w-1/3 w-full company_infoss">
                    <h4>Account ID: {{ userData.id }}</h4>
                    <h4 class="mt-2 mb-2">
                      Company ID: {{ userData.company }}
                    </h4>

                    <span> Email: {{ userData.email }} </span>

                    <vs-input class="w-full mt-3" label="Account name" v-validate="'required'" name="first_name" disabled
                      v-model="userData.username" />

                    <vs-input class="w-full mt-3" label="Name" v-validate="'required'" name="first_name"
                      v-model="userData.first_name" />
                    <span class="text-danger text-sm" v-show="errors.has('first_name')">{{ errors.first("first_name")
                    }}</span>

                    <vs-input class="w-full mt-3" label="Surname" v-validate="'required'" name="last_name"
                      v-model="userData.last_name" />
                    <span class="text-danger text-sm" v-show="errors.has('last_name')">{{ errors.first("last_name")
                    }}</span>
                  </div>

                  <div class="vx-col checkbox_block" style="text-align: end">
                    <div class="w-full">
                      <vs-checkbox class="w-1/2 mt-6" disabled :value="true">I want to receive news information about
                        updates</vs-checkbox>
                      <vs-checkbox class="w-1/2 mt-6 policy_block" disabled :value="true">I agree to AllDoors
                        <a download="" :href="getPdf('policy')" target="_blank" class="cursor-pointer ploicy_link">
                          Privacy Policy
                        </a>
                        <!-- <span class="ploicy_link" @click="privacy_popup = true"
                          >Privacy Policy</span
                        > -->
                        <span style="margin-left: 5px"> </span>and

                        <a download="" :href="getPdf('terms')" target="_blank" class="cursor-pointer ploicy_link">
                          Terms of Service
                        </a>
                        <!-- <span class="ploicy_link" @click="terms_popup = true">
                          Terms of Service
                        </span> -->
                      </vs-checkbox>
                    </div>
                    <vs-button class="ml-auto mt-2 update_info_button unimacs_button" @click="updateInformation">Update
                      Information</vs-button>
                  </div>

                </div>
              </vx-card>
            </div>
          </vs-tab>
          <vs-tab label="Extra Information" icon-pack="material-icons" icon="info">
            <div class="tab-text">
              <vx-card class="mt-base" no-shadow>
                <div class="vx-row">
                  <div class="vx-col md:w-1/4">
                    <label for="" class="vs-input--label">Phone</label>

                    <vue-tel-input @input="checkPhone" class="phone_field" name="phone_number"
                      v-model="userData.phone_1"></vue-tel-input>
                    <span class="text-danger text-sm" v-show="errors.has('phone_number')">{{ errors.first("phone_number")
                    }}</span>
                  </div>

                  <div class="vx-col md:w-1/4 social_checkboxes">
                    <vs-checkbox class="w-1/2" v-model="userData.viber">Viber</vs-checkbox>

                    <vs-checkbox class="w-1/2 ml-3" v-model="userData.whatsapp">WhatsApp</vs-checkbox>

                    <vs-checkbox class="w-1/2 ml-3" v-model="userData.telegram">Telegram</vs-checkbox>
                  </div>
                </div>
                <div class="vx-row">
                  <div class="vx-col md:w-full w-full" v-if="userData.phone_2">
                    <vs-input class="w-1/2 mt-4" label="Phone 2" v-model="userData.phone_2" type="phone" name="phone"
                      @input="checkNumber" />
                  </div>
                </div>

                <div class="vx-row mt-2">
                  <div class="vx-col md:w-1/4" style="padding: 0 13px">
                    <label for="" class="vs-input--label">Country</label>
                    <v-select v-model="userData.country" :options="countries" name="country" placeholder="Country"
                      class="select_padding country_select" :reduce="(country) => country.label"
                      :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                    <span class="text-danger text-sm" v-show="errors.has('country')">{{ errors.first("country") }}</span>
                  </div>

                  <div class="vx-col md:w-1/5">
                    <vs-input class="" label="City" v-model="userData.city" v-validate="'required'" name="city" />
                    <span class="text-danger text-sm" v-show="errors.has('city')">{{ errors.first("city") }}</span>
                  </div>
                </div>
                <div class="vx-row mt-1">
                  <div class="vx-col md:w-1/4">
                    <vs-input class="w-full mt-2" label="Postal code" v-model="userData.post_code" v-validate="'required'"
                      name="post_code" />
                    <span class="text-danger text-sm" v-show="errors.has('post_code')">{{ errors.first("post_code")
                    }}</span>
                  </div>
                </div>
                <div class="vx-row mt-1">
                  <div class="vx-col md:w-1/4">
                    <vs-input class="w-full mt-2" label="Site" v-model="userData.site" name="site" />
                  </div>
                </div>
                <div class="vx-row mt-1">
                  <div class="vx-col md:w-1/4">
                    <vs-input class="w-full mt-2" label="Address" v-model="userData.address" v-validate="'required'"
                      name="address" />
                    <span class="text-danger text-sm" v-show="errors.has('address')">{{ errors.first("address") }}</span>
                  </div>
                </div>
                <div class="vx-row">
                  <div class="vx-col w-full">
                    <div class="mt-5 flex flex-wrap items-center justify-end">
                      <vs-button class="mt-2 unimacs_button" @click="updateInformation">Update Information</vs-button>
                    </div>
                  </div>
                </div>
              </vx-card>
            </div>
          </vs-tab>
          <vs-tab label="Security" icon-pack="material-icons" icon="lock">
            <div class="tab-text">
              <vx-card title="Change Password" class="mt-base" no-shadow>
                <span>If you want to change your password, enter your current
                  password and the password you want to use in the future.</span>
                <div class="vx-row md:w-1/2 mt-5">
                  <div class="vx-col md:w-full w-full">
                    <vs-input class="w-full mt-3" label="Current Password" type="password" v-model="old_password"
                      ref="current_password" name="current_password" />
                    <span class="text-danger text-sm" v-show="errors.has('current_password')">{{
                      errors.first("current_password") }}</span>
                  </div>

                  <div class="vx-col md:w-full w-full">
                    <vs-input class="w-full mt-3" label="New Password" type="password" v-model="password"
                      @input="checkPass($event)" ref="password" name="password" />
                    <span class="text-danger text-sm" v-show="errors.has('password')">{{ errors.first("password")
                    }}</span>
                  </div>

                  <div class="vx-col md:w-full w-full">
                    <vs-input class="w-full mt-3" type="password" label="Confirm Password" name="confirm_password"
                      v-model="confirm_password" v-validate="'required|confirmed:password'" data-vv-as="password" />
                    <span class="text-danger text-sm" v-show="errors.has('confirm_password')">{{
                      errors.first("confirm_password") }}</span>
                  </div>
                  <div class="vx-col w-full">
                    <div class="flex flex-wrap items-center justify-end">
                      <vs-button class="ml-auto mt-5 margin-right_auto unimacs_button" @click.prevent="changePass">Change
                        Password</vs-button>
                    </div>
                  </div>
                </div>
              </vx-card>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import moduleUser from "@/store/user/moduleUserManagement.js";
import vSelect from "vue-select";
import moduleFile from "@/store/files/moduleFile.js";
import "vue-tel-input/dist/vue-tel-input.css";

import PrivacyPopup from "./PrivacyPolicyPopup";
import TermsPopup from "./TermsPopup";
import time_zones from "@/assets/json_files/gmt_timezones.json";
export default {
  components: {
    vSelect,
    PrivacyPopup,
    TermsPopup,
  },
  data() {
    return {
      isTermsConditionAccepted: false,
      isPrivacyPolicyAccepted: false,
      activeLoading: false,
      userData: {},
      activeTab: 0,
      old_password: "",
      password: "",
      confirm_password: "",
      avatarSrc: "/no_avatar.svg",
      file: null,
      privacy_popup: false,
      terms_popup: false,
      time_zones,
      date_formats: [{ label: "MM/DD/YYYY" }, { label: "YYYY/MM/DD" }],
      time_formats: [{ label: "24H" }, { label: "12H" }],
    };
  },
  computed: {
    countries() {
      return this.$store.state.countries;
    },
    getPdf() {
      return (type) => {
        if (type == 'terms') {
          return `${process.env.VUE_APP_BACK}/Terms/terms.pdf`
        } else if (type == 'policy') {
          return `${process.env.VUE_APP_BACK}/Privacy/Privacy.pdf`

        }
      }
    },
    settingsStore() {
      return this.$store.state.settings
    }
  },
  methods: {
    cancel() {
      this.$router.push("/admins");
    },
    checkNumber(value) {
      return (this.phone = value.replace(/[^+0-9]/g, ""));
    },
    checkPhone(number, obj) {
      if (this.userData.phone_1) {
        if (!obj.valid) {
          this.errors.add({
            field: "phone_number",
            msg: "Phone number not valid",
          });
        } else {
          this.errors.items = [];
        }
      }
    },
    updateInformation(e) {
      if (!this.errors.items.length) {
        this.$store
          .dispatch("user/updateUserInfo", this.userData)
          .then((res) => {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Account updated",
            });
            this.$root.$emit("changeAvatar", res.data.avatar);
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      }
    },
    removeAvatar() {
      this.avatarSrc = "/no_avatar.svg";
      this.userData.avatar = null;
    },
    update_avatar(event) {
      this.$vs.loading({
        type: "corners",
      });

      var input = event.target.files[0];

      this.$store
        .dispatch("user/userImageSave", input)
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
      if (string.length == 0) {
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
      } else {
        this.errors.clear();
        return true;
      }

      return false;
    },
    checkPass(event) {
      this.passValidation(event);
    },
    changePass() {
      if (
        this.passValidation(this.password) &&
        this.password == this.confirm_password
      ) {
        const data = {
          id: this.userData.id,
          password: this.password,
          old_password: this.old_password,
        };

        this.$vs.loading({
          type: "corners",
        });

        this.$store
          .dispatch("user/changeMyPass", data)
          .then((res) => {
            setTimeout(() => {
              this.$vs.loading.close();
              this.activeLoading = false;
              this.$vs.notify({
                time: 7000,
                color: "success",
                title: `Password changed`,
              });
              this.old_password = "";
              this.password = "";
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
      } else if (this.password != this.confirm_password) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Password entries do not match",
        });
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Password entry does not meet criteria",
        });
      }
    },
  },
  created() {
    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    if (!moduleUser.isRegistered) {
      this.$store.registerModule("user", moduleUser);
      moduleUser.isRegistered = true;
    }

    this.$vs.loading();

    this.$http
      .get(`account/getUserData`, {
        headers: { Authorization: localStorage.token },
      })
      .then((res) => {
        const admin = res.data;

        this.userData = admin;

        if (admin.avatar) {
          let path = JSON.parse(admin.avatar);
          this.avatarSrc = `${process.env.VUE_APP_BACK}/${path.path}`;
        }

        if (admin.country) {
          this.userData.country = admin.country;
        }
        this.$vs.loading.close();
      }).catch(() => {
        this.$vs.loading.close();

      });
  },
};
</script>

<style lang="scss" >
.ac_main_tb {
  .con-tab.vs-tabs--content {
    padding: 0 0 23px !important;
  }

  .inner_roww {
    padding: 0;
    margin: 0;
  }

  .ac_image_bl {
    padding: 0;
  }

  .ac_image_bl {
    max-width: 180px !important;
    max-height: 180px !important;
    width: 100% !important;
    height: 100%;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      width: 100% !important;
      height: 100% !important;
      margin-right: 0 !important;
    }
  }

  .account_actions_part {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-top: 5px;
  }

  .checkbox_block {
    padding: 40px 0 0 !important;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .w-full {
      width: 60% !important;
      flex: 1;
    }
  }

  .company_infoss {
    padding-left: 30px;
  }

  .update_info_button {
    margin: 0 0 0 20px !important;
    white-space: nowrap;
    padding: 0.75rem 2rem !important;
    width: auto !important;

    .vs-button--text {
      display: inline-block;
      vertical-align: top;
    }
  }
}

.phone_field {
  padding: 2px 0;
}

.upd_info_btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;

  button {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.country_select .vs__dropdown-toggle {
  padding: 0px 0 2px 0;
}

.account_avatar {
  object-fit: cover;
}

.page-user-edit {
  .social_checkboxes {
    display: flex;
    align-items: center;
  }

  .date_block {
    .con-slot-tabs {
      overflow: visible !important;
    }
  }

  .con-vs-tabs {
    overflow: visible !important;
  }
}



.policy_block {
  .ploicy_link {
    text-decoration: underline;
    color: blue;
    position: relative;
    z-index: 250;
    cursor: pointer;
  }
}

.theme-dark {
  .policy_block {
    .ploicy_link {
      text-decoration: underline;
      color: #5656ff;
      position: relative;
      z-index: 250;
      cursor: pointer;
    }
  }
}

#avatar-col {
  width: 10rem;
}

.ed_2 {
  .avatar_block {
    button {
      margin-top: 10px;
    }
  }
}

.checkbox_socials {
  width: 100%;
}

.checkbox_block {
  flex: 0 0 100%;
}

.update_info_button {
  margin-top: 20px !important;
}

.acc_vx_card {
  .vx-card__body {
    padding: 0 !important;
  }
}

#page-user-view {
  table {
    td {
      vertical-align: top;
      min-width: 140px;
      padding-bottom: 0.8rem;
      word-break: break-all;
    }

    &:not(.permissions-table) {
      td {
        @media screen and (max-width: 370px) {
          display: block;
        }
      }
    }
  }
}

// #account-info-col-1 {
//   // flex-grow: 1;
//   width: 30rem !important;
//   @media screen and (min-width:1200px) {
//     & {
//       flex-grow: unset !important;
//     }
//   }
// }

@media screen and (min-width: 1201px) and (max-width: 1211px),
only screen and (min-width: 636px) and (max-width: 991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }
}
</style>
