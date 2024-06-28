<template>
  <div class="card_add_page">
    <!-- title="Cardholder Info" -->
    <vx-card class="mt-base card_theme" no-shadow>
      <div class="vx-row">
        <div class="vx-col md:w-1/4 w-full card_block">
          <div class="flex items-start flex-col sm:flex-column avatar_block">
            <img :src="avatarSrc" class="mr-8 rounded h-24 w-24 card_avatar" />
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
        <form class="vx-col md:w-2/3 w-full ml-3 card_info">
          <div>
            <vs-input
              class="w-full mt-3"
              label="First name"
              v-validate="'required'"
              name="first_name"
              v-model="cardHolderInfo.first_name"
            />

            <span
              class="text-danger text-sm"
              v-show="errors.has('first_name')"
              >{{ errors.first("first_name") }}</span
            >

            <vs-input
              class="w-full mt-3"
              label="Last Name"
              name="last_name"
              v-model="cardHolderInfo.last_name"
            />

            <vs-input
              class="w-full mt-3"
              label="Family name"
              name="family_name"
              v-model="cardHolderInfo.family_name"
            />

            <vs-input
              class="w-full mt-3"
              label="Company"
              name="company_name"
              v-model="cardHolderInfo.company_name"
            />

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
        </form>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";
export default {
  watch: {
    cardHolderInfo: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_CARDHOLDER_INFO", newValue);
        // this.$emit("input", this.cardHolderInfo);
      },
      deep: true,
    },
    navigation() {},
  },
  components: {
    vSelect,
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
    // initValues() {
    //   this.cardHolderInfo = {
    //     avatar: null,
    //     email: null,
    //     first_name: null,
    //     last_name: null,
    //     family_name: null,
    //     company_name: null,
    //     phone: null,
    //     status: false,
    //     user_account: false,
    //   };
    //   this.avatarSrc = "avatar.jpg";
    //   this.$validator.reset();
    // },
  },
  data() {
    return {
      cardHolderInfo: {},
      avatarSrc: "/no_avatar.svg",
    };
  },
  created() {
    this.cardHolderInfo = { ...this.$store.state.cardholder.cardholder_info };

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

<style lang="scss" scoped>
.phone_field {
  padding: 2px 0;
}
.card_avatar {
  object-fit: cover;
}

.checkbox_block {
  flex: 0 0 100%;
}
</style>

<style lang="scss">
.block_account.add {
  .right_block {
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
  .card_block {
    padding: 0 !important;
    width: 40% !important;
    img {
      width: 100% !important;
      object-fit: contain;
      height: auto !important;
      max-width: 100% !important;
      max-height: 254px !important;
      margin: 0 0 5px 0 !important;
    }
    button {
      margin: 5px 0 !important;
    }
  }
  .card_info {
    // padding: 0 0 0 10px !important;
    // width: 70% !important;
    // margin: 0 !important;
    width: 60% !important;
    margin-left: 0px !important;
    padding: 0px 0px 0px 15px !important;
    .vs-input-primary {
      // margin-top: 0 !important;
    }
  }
  .edit_tools {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>