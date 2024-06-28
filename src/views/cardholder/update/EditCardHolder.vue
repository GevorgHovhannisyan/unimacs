<template>
  <div>
    <!-- title="Cardholder Info" -->
    <vx-card class="mt-base card_theme" no-shadow>
      <div class="vx-row">
        <div class="vx-col md:w-1/4 w-full card_blockss">
          <div class="flex items-start flex-col sm:flex-column avatar_block">
            <img
              :src="avatarSrc"
              class="mr-8 rounded h-24 w-24 edit_card_avatar"
            />
            <div class="edit_tools">
              <input
                type="file"
                class="hidden"
                ref="update_avatar_input"
                @change="update_avatar"
                accept="image/*"
              />

              <div>
                <feather-icon
                  icon="EditIcon"
                  style="font-size: 25px"
                  @click="$refs.update_avatar_input.click()"
                  class="cursor-pointer"
                />

                <feather-icon
                  icon="XSquareIcon"
                  style="font-size: 25px"
                  @click="removeAvatar"
                  v-if="cardHolderInfo.avatar"
                  class="cursor-pointer"
                />
              </div>
            </div>

            <div class="w-full">
              <vs-checkbox
                v-model="cardHolderInfo.status"
                class="mt-6 custom__checkbox"
                >Active</vs-checkbox
              >
              <vs-checkbox
                class="mt-6 custom__checkbox"
                v-model="cardHolderInfo.user_account"
                >User account</vs-checkbox
              >
            </div>
          </div>
        </div>

        <div
          class="vx-col md:w-2/3 w-full"
          style="width: 60% !important; margin-left: 0 !important; padding: 0 0 0 15px!important;"
        >
          <vs-input
            class="w-full"
            label="First name"
            v-validate="'required'"
            name="first_name"
            v-model="cardHolderInfo.first_name"
          />

          <span class="text-danger text-sm" v-show="errors.has('first_name')">{{
            errors.first("first_name")
          }}</span>

          <vs-input
            class="w-full mt-3"
            label="Last Name"
            name="last_name"
            v-model="cardHolderInfo.last_name"
          />
          <!-- <span class="text-danger text-sm" v-show="errors.has('last_name')">{{
            errors.first("last_name")
          }}</span> -->

          <vs-input
            class="w-full mt-3"
            label="Family name"
            name="family_name"
            v-model="cardHolderInfo.family_name"
          />
          <!-- <span
            class="text-danger text-sm"
            v-show="errors.has('family_name')"
            >{{ errors.first("family_name") }}</span
          > -->

          <vs-input
            class="w-full mt-3"
            label="Company"
            name="company_name"
            v-model="cardHolderInfo.company_name"
          />
          <!-- <span
            class="text-danger text-sm"
            v-show="errors.has('company_name')"
            >{{ errors.first("company_name") }}</span
          > -->

          <vs-input
            class="w-full mt-3 mb-3"
            label="Email"
            type="email"
            v-validate="'email'"
            name="email"
            v-model="cardHolderInfo.email"
          />
          <span class="text-danger text-sm" v-show="errors.has('email')">{{
            errors.first("email")
          }}</span>
          <label for="" class="vs-input--label">Phone</label>
          <vue-tel-input
            @input="checkNumber"
            name="phone"
            class="phone_field"
            v-model="cardHolderInfo.phone"
          ></vue-tel-input>
          <span class="text-danger text-sm" v-show="errors.has('phone')">{{
            errors.first("phone")
          }}</span>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";

export default {
  props: {
    rowsPopup: {
      type: Boolean,
    },
  },
  components: {
    vSelect,
  },
  watch: {
    cardHolderInfo: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_EDIT_CARDHOLDER_INFO", newValue);
      },
      deep: true,
    },
  },
  computed: {
    edit_data() {
      return this.$store.state.cardholder.edit_cardholder_info;
    },
  },
  methods: {
    update_avatar(event) {
      this.$vs.loading({
        type: "corners",
      });
      var input = event.target.files[0];

      this.$store
        .dispatch("file/userImageSave", input)
        .then((res) => {
          this.avatarSrc = `${process.env.VUE_APP_BACK}/${res.data.path}`;
          // this.imageTooltip = res.data.name;
          this.cardHolderInfo.avatar = JSON.stringify({
            path: res.data.path,
            name: res.data.name,
          });
          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    removeAvatar() {
      this.avatarSrc = "/no_avatar.svg";
      this.cardHolderInfo.avatar = null;
    },
    checkNumber(number, obj) {
      if (this.cardHolderInfo.phone) {
        if (!obj.valid) {
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
    initValues() {
      this.cardHolderInfo = {
        avatar: null,
        email: null,
        first_name: null,
        last_name: null,
        family_name: null,
        company_name: null,
        phone: null,
        active: false,
        user_account: false,
        antipassback: false,
      };
    },
  },
  data() {
    return {
      access: false,
      cardHolderInfo: {},
      avatarSrc: "/no_avatar.svg",
      isTermsConditionAccepted: false,
      isPrivacyPolicyAccepted: false,
    };
  },
  created() {
    this.cardHolderInfo = {
      ...this.edit_data,
    };
    if (this.cardHolderInfo.avatar) {
      this.cardHolderInfo.avatar =
        typeof this.cardHolderInfo.avatar == "string"
          ? JSON.parse(this.cardHolderInfo.avatar)
          : this.cardHolderInfo.avatar;

      this.avatarSrc = `${process.env.VUE_APP_BACK}/${this.cardHolderInfo.avatar.path}`;
    }
  },
};
</script>

<style lang="scss" >
.block_account.edit {
  .right_block {
    padding: 0 15px;
    .card_theme {
      // margin-top: 1.4rem !important;
    }
    .vx-card__body {
      padding: 0 !important;
      .vx-row {
        margin: 0 !important;
      }
    }
  }

  .avatar_block {
    height: 100%;
    display: flex !important;
    flex-direction: column !important;
    .w-full {
      margin-top: auto !important;
    }
  }

  .edit_tools {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .card_blockss {
    padding: 0 !important;
    // width: 30% !important;
    width: 40% !important;
    img {
      width: 100% !important;
      height: auto !important;
      object-fit: contain;
      // max-width: 190px !important;
      // max-height: 190px !important;
      max-width: 100% !important;
      max-height: 254px !important;
      margin: 0 0 5px 0 !important;
    }
    button {
      margin: 5px 0 !important;
    }
  }
}
.phone_field {
  padding: 2px 0;
}
.edit_card_avatar {
  object-fit: cover;
}
.checkbox_block {
  flex: 0 0 100%;
}
</style>
