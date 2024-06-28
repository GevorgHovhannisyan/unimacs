<!-- =========================================================================================
File Name: RegisterJWT.vue
Description: Register Page for JWT
----------------------------------------------------------------------------------------
Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="clearfix register_page mt-4">
    <vs-popup class="holamundo register_popup" title="Notification" :active.sync="popupActive">
      <h2 style="line-height: 1.3; font-size: 18px !important ">
        Thank you for registering!
        Your application to create an account has been accepted and is under consideration.
        We have sent an email with instructions on how to proceed to the email address you provided.
      </h2>
    </vs-popup>

    <div class="w-1/2 padding-r">
      <vs-input v-validate="'required'" label="First Name" name="first_name" placeholder="First Name" v-model="first_name"
        class="w-full" />
      <span class="text-danger text-sm">{{ errors.first("first_name") }}</span>
    </div>

    <div class="w-1/2 padding-l">
      <vs-input v-validate="'required'" label="Last Name" name="last_name" placeholder="Last Name" v-model="last_name"
        class="w-full" />
      <span class="text-danger text-sm">{{ errors.first("last_name") }}</span>
    </div>

    <div class="w-1/2 padding-r">
      <vs-input v-validate="'required|email'" name="email" type="email" label="Email" placeholder="Email" v-model="email"
        class="w-full mt-6" />
      <span class="text-danger text-sm">{{ errors.first("email") }}</span>
    </div>

    <div class="w-1/2 padding-l mt-6">
      <label for="" class="vs-input--label">Phone number</label>
      <vue-tel-input @input="checkNumber" name="phone" autocomplete="off" class="w-full phone_field" v-model="phone"
        :inputOptions="{
          autocomplete: 'off'
        }"></vue-tel-input>
      <span class="text-danger text-sm" v-show="errors.has('phone')">{{
        errors.first("phone")
      }}</span>
    </div>
    <div class="w-1/2 padding-r">
      <vs-input name="company_name" type="company_name" v-validate="'required'" label="Company Name"
        placeholder="Company Name*" v-model="company_name" class="w-full mt-6" />
      <span class="text-danger text-sm">{{ errors.first("company_name") }}</span>
    </div>
    <div class="w-1/2 padding-l mt-6 pass_block">
      <vs-input type="password" @input="checkPassword(password)" name="Password" label="Password" placeholder="Password"
        v-model="password" class="w-full reg_pass_inp" />
      <div class="pass_strength">

        <div class="reqments">
          To protect your data, you mast create a secure password. It must contein
        </div>
        <div class="req_list">
          <ul>
            <li :class="{ success: !testMin }">Min 7 character</li>
            <li :class="{ success: !testNum }">Number</li>
            <li :class="{ success: !testUpper }">Upper case</li>
            <li :class="{ success: !lowerCase }"> Lower case</li>

            <!-- <li>dfsafsdf</li> -->
          </ul>
        </div>

      </div>
      <span class="text-danger text-sm">{{ errors.first("Password") }}</span>
    </div>
    <vs-textarea class="w-full message_textarea" rows="5" label="Message" v-model="message" />
    <div class="flex items-center w-full">
      <vs-checkbox v-model="isTermsConditionAccepted"> </vs-checkbox>
      <span style="margin-right: 5px;">I accept</span>
      <a download :href="getPdf('policy')" target="_blank" style="text-decoration: underline;"
        class="cursor-pointer">Privacy Policy</a>

      <vs-checkbox v-model="isPrivacyPolicyAccepted" class="ml-10"></vs-checkbox>
      <span style="margin-right: 5px;">I accept the</span>

      <a download :href="getPdf('terms')" style="text-decoration: underline;" target="_blank" class="cursor-pointer">Terms
        of Service</a>
    </div>


    <div class="vx-row w-full reg_buttons mb-3">
      <div class="vx-col">
        <vs-button class="float-right mt-6 unimacs_button" @click="registerUserJWt"
          :disabled="!validateForm || disableBtn">Submit
        </vs-button>
      </div>
      <div class="vx-col">
        <vs-button class="float-right mt-6 unimacs_cancel_button" @click="$router.push('/login')">Cancel</vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";

export default {
  data() {
    return {
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirm_password: null,
      isTermsConditionAccepted: false,
      isPrivacyPolicyAccepted: false,
      packet_type: null,
      phone: null,
      company_name: null,
      post_code: null,
      message: null,
      description: null,
      site: null,
      password: null,
      country: null,
      viber: null,
      whatsapp: null,
      address: null,
      telegram: null,
      types: [],
      popupActive: false,
      conf_password: null,
      disableBtn: false
    };
  },
  components: {
    vSelect,
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.company_name &&
        this.phone &&
        this.last_name &&
        this.first_name &&
        this.email &&
        this.isTermsConditionAccepted == true &&
        this.isPrivacyPolicyAccepted == true &&
        !this.testMin && !this.testNum && !this.testUpper && !this.lowerCase
      );
    },
    getPdf() {
      return (type) => {
        if (type == "terms") {
          return `${process.env.VUE_APP_BACK}/Terms/terms.pdf`;
        } else if (type == "policy") {
          return `${process.env.VUE_APP_BACK}/Privacy/Privacy.pdf`;
        }
      };
    },
    countries() {
      return this.$store.state.countries;
    },
    testMin() {
      if (String(this.password).length < 7) {
        return true
      }
    },
    testNum() {
      if (!/\d/.test(this.password)) {
        return true
      }
    },
    testUpper() {
      if (!/[A-Z]/.test(this.password)) {
        return true
      }
    },
    lowerCase() {
      if (!/[a-z]/.test(this.password)) {
        return true
      }
    }
  },
  methods: {
    checkNumber(number, obj) {
      if (this.phone) {
        if (!obj.valid || !this.phone) {
          this.errors.add({
            field: "phone",
            msg: "Phone number not valid",
          });
        } else {
          const filter = this.errors.items.filter((e) => e.field == "phone");
          filter.forEach((f) =>
            this.errors.items.splice(
              this.errors.items.findIndex((e) => e.field === f.field),
              1
            )
          );
        }
      }
    },
    checkPassword(string) {
      this.$validator.errors.remove('password', null);
      // this.errors.clear();
      if (
        /\d/.test(string) &&
        /[A-Z]/.test(string) &&
        /[a-z]/.test(string)
        // &&        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string)
      ) {
        this.$validator.errors.remove('Password', null);
        return true;
      } else if (string.length == 0) {
        this.errors.add({
          field: "Password",
          msg: "Password field required",
        });
      } else if (string.length < 7) {
        this.errors.add({
          field: "Password",
          msg: "Password field must have min 7 character",
        });
      } else if (!/\d/.test(string)) {
        this.errors.add({
          field: "Password",
          msg: "Password field must have number",
        });
      } else if (!/[A-Z]/.test(string)) {
        this.errors.add({
          field: "Password",
          msg: "Password field must have upper case letter",
        });
      } else if (!/[a-z]/.test(string)) {
        this.errors.add({
          field: "Password",
          msg: "Password field must have lower case letter",
        });
      }

      return false;
    },
    registerUserJWt() {
      this.$vs.loading({
        type: "corners",
      });

      const payload = {
        company: {
          company_name: this.company_name,
          message: this.message,
        },
        account: {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          phone_1: this.phone,
          phone_2: null,
          post_code: this.post_code,
          country: this.country,
          site: this.site,
          address: this.address,
          password: this.password,
          // telegram: 1
        }
      };

      this.$http
        .post(`sign-up`, payload)
        .then((res) => {
          this.$vs.loading.close();
          this.popupActive = true;
          this.disableBtn = true
        })
        .catch((err) => {
          this.$vs.loading.close();



          this.activeLoading = false;
          this.popupActive = false;
        });
    },
  },
};
</script>

<style lang="scss">
.phone_field {
  padding: 2px 0;
}

.choose_type {
  display: flex;
  align-items: center;
}

.reg_buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.register_page {
  display: flex;
  flex-wrap: wrap;
}

.register_page .vs-popup--title h3 {
  font-weight: bold;
  transform: none;
}

.register_popup .vs-popup--header i {
  background: transparent;
}

.register_popup .vs-popup--header i:hover {
  color: #7367f0;
}

.send_again button {
  padding: 0.6rem 2rem !important;
}

.vs-popup--content {
  padding: 2rem !important;
  text-align: center;

  h2 {
    font-size: 14px !important;
  }
}

.message_textarea {
  margin-top: 20px;
}

.padding-r {
  padding-right: 10px;
}

.padding-l {
  padding-left: 10px;
}

.register_text {
  margin: 13px 0;
  color: #666666;
  line-height: 1.2em;
}

.number_input {
  border-radius: 5px;
  color: inherit;
  position: relative;
  padding: 0.6rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  width: 100%;
}

.send_again {
  margin-top: 15px;

  button {
    margin-left: 10px;
  }
}

.pass_block {
  position: relative;
}

.pass_strength {
  width: 230px;
  position: absolute;
  right: -250px;
  bottom: -145px;
  z-index: 9999999999;
  border: 1px solid black;
  padding: 16px;
  background: white;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: -10px;
    top: 10px;
    width: 10px;
    height: 14px;
    border-style: solid;
    border-width: 7px 10px 7px 0;
    border-color: transparent black;
    box-sizing: border-box;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: -9px;
    top: 11px;
    width: 10px;
    height: 12px;
    border-style: solid;
    border-width: 6px 10px 6px 0;
    border-color: transparent white;
    z-index: 1;
    box-sizing: border-box;
  }
}

.reqments {
  font-size: 13px;
  font-weight: bold;
  line-height: 1.3;
  padding-bottom: 10px;
}

.req_list {
  ul li {
    font-size: 14px;
    display: flex;
    align-items: center;

    &:before {
      content: '';
      width: 10px;
      height: 10px;
      background-color: red;
      border-radius: 50%;
      display: block;
      margin-right: 5px;
    }

    &.success {
      &:before {
        background-color: green;
        border: none;
      }
    }

    &.danger {
      &:before {
        border: none;
      }
    }
  }
}

.pass_strength {
  display: none
}

.reg_pass_inp.isFocus+.pass_strength {
  display: block
}
</style>
