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
    <vs-popup
      class="holamundo register_popup"
      title="Notification"
      :active.sync="popupActive"
    >
      <h2>
        We send invitation link to your email. Please open link and follow
        instruction for finish.
      </h2>

      <div class="send_again">
        Don't get an email?<vs-button
          @click="sendMailAgain"
          class="unimacs_button"
          >Send Again</vs-button
        >
      </div>
    </vs-popup>
    <div class="vx-row w-full choose_type mb-4" style="margin: 0">
      <div class="vx-col w-1/3">
        <span>Choose your facility type: </span>
      </div>
      <div class="vx-col w-2/3" style="padding-right: 0">
        <label for="" class="vs-input--label">Package type</label>
        <v-select
          v-model="packet_type"
          v-validate="'required'"
          :options="types"
          disabled
          name="packet_type"
          class="w-full select_padding update_pack"
          placeholder="Package type"
          @input="changeDescription"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
    </div>

    <div class="vx-row w-full">
      <div class="vx-col w-full">
        <div class="vx-col w-full register_text" v-if="packet_type">
          {{ description }}
        </div>
      </div>
    </div>

    <div class="w-1/2 padding-r">
      <vs-input
        v-validate="'required|alpha_dash|min:3'"
        data-vv-validate-on="change"
        label="First Name"
        name="first_name"
        placeholder="First Name*"
        v-model="first_name"
        class="w-full"
      />
      <span class="text-danger text-sm">{{ errors.first("first_name") }}</span>
    </div>

    <div class="w-1/2 padding-l">
      <vs-input
        v-validate="'required|alpha_dash|min:3'"
        data-vv-validate-on="change"
        label="Last Name"
        name="last_name"
        placeholder="Last Name*"
        v-model="last_name"
        class="w-full"
      />
      <span class="text-danger text-sm">{{ errors.first("last_name") }}</span>
    </div>

    <div class="w-1/2 padding-r">
      <vs-input
        v-validate="'required|email'"
        data-vv-validate-on="change"
        name="email"
        type="email"
        label="Email"
        placeholder="Email*"
        v-model="email"
        class="w-full mt-6"
      />
      <span class="text-danger text-sm">{{ errors.first("email") }}</span>
    </div>

    <div class="w-1/2 padding-l mt-6">
      <label for="" class="vs-input--label">Phone number</label>

      <vue-tel-input
        @input="checkNumber"
        name="phone"
        class="w-full phone_field"
        v-model="phone"
      ></vue-tel-input>

      <span class="text-danger text-sm" v-show="errors.has('phone')">{{
        errors.first("phone")
      }}</span>
    </div>
    <vs-input
      data-vv-validate-on="change"
      name="company_name"
      type="company_name"
      label="Company Name"
      placeholder="Company Name*"
      v-model="company_name"
      class="w-full mt-6"
    />
    <span class="text-danger text-sm">{{ errors.first("company_name") }}</span>
    <vs-textarea
      class="w-full message_textarea"
      rows="5"
      label="Optional message"
      v-model="message"
    />
    <div class="flex items-center w-full">
      <vs-checkbox v-model="isTermsConditionAccepted"> </vs-checkbox
      ><a
        download
        :href="getPdf('terms')"
        target="_blank"
        class="cursor-pointer"
        >I accept the terms & conditions*</a
      >
      <vs-checkbox v-model="isPrivacyPolicyAccepted" class="ml-10"></vs-checkbox
      ><a
        download
        :href="getPdf('policy')"
        target="_blank"
        class="cursor-pointer"
        >I accept Privacy and Policy*</a
      >
    </div>

    <div class="vx-row w-full reg_buttons mb-3">
      <div class="vx-col">
        <vs-button
          class="float-right mt-6 unimacs_button"
          @click="registerUserJWt"
          :disabled="!validateForm"
          >Submit</vs-button
        >
      </div>
      <div class="vx-col">
        <vs-button
          class="float-right mt-6 unimacs_cancel_button"
          @click="$router.push('/login')"
          >Cancel</vs-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { type } from "os";
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
      message: null,
      description: null,
      types: [],
      popupActive: false,
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
        this.packet_type &&
        this.phone &&
        this.last_name &&
        this.first_name &&
        this.email &&
        this.isTermsConditionAccepted == true &&
        this.isPrivacyPolicyAccepted == true
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
  },
  created() {
    this.types = [];
    this.$http
      .get(`registration/registrationOfPartition/${this.$route.params.token}`)
      .then((res) => {
        if (res.data) {
          this.types = [{ ...res.data, label: res.data.name }];
          this.packet_type = res.data.id;
        }
      })
      .catch((err) => {
        this.$vs.loading.close();
        if (err && err.response && err.response.data) {
          if (err.response.data.message == "Wrong token!!") {
            this.$router.push("/login").catch(() => {});
          }
        }
      });
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
    changeDescription() {
      let find = this.types.find((t) => t.id == this.packet_type);

      if (find) this.description = find.description;
    },
    registerUserJWt() {
      const payload = {
        company: {
          company_name: this.company_name,
          package_type: this.packet_type,
          message: this.message,
        },
        account: {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          phone_1: this.phone,
          avatar: null,
          phone_2: null,
          site: null,
          address: null,
          viber: false,
          whatsapp: false,
        },
        partition: true
      };

      this.$http
        .post(`registration/regPartition/${this.$route.params.token}`, payload)
        .then((res) => {
          this.$vs.loading.close();
          this.popupActive = true;
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
          this.popupActive = false;
        });
    },

    sendMailAgain() {
      const payloadEmail = {
        email: this.email,
      };

      this.$http
        .put(`registration/regPartition/${this.$route.params.token}`, payloadEmail)
        .then((res) => {
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Invite link sent",
          });
          this.activeLoading = false;
          this.popupActive = false;
          //  this.$router.push("/error-500").catch(() => {});
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


</style>
