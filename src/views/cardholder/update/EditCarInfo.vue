<template>
  <div>
    <!-- title="Car Information" -->
    <vx-card class="mt-base card_theme ed_car__infos" no-shadow>
      <div class="vx-row">
        <div class="vx-col md:w-1/4 w-full card_block1">
          <div class="flex items-start flex-col sm:flex-column avatar_block">
            <div style="width: 100%; height: 100%">
              <img
                :src="avatarSrc"
                class="mr-8 rounded h-24 w-24 car_avatar"
                style="object-fit: contain"
              />
            </div>
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
                  v-if="carInformation && carInformation.avatar"
                  @click="removeAvatar"
                  class="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="vx-col md:w-2/3 w-full ml-4 card__info">
          <vs-input
            class="w-full"
            label="Model"
            v-validate="'required'"
            name="model"
            v-model="carInformation.model"
          />
          <span class="text-danger text-sm" v-show="errors.has('model')">{{
            errors.first("model")
          }}</span>

          <vs-input
            class="w-full mt-3"
            label="Color"
            v-validate="'required'"
            name="color"
            v-model="carInformation.color"
          />
          <span class="text-danger text-sm" v-show="errors.has('color')">{{
            errors.first("color")
          }}</span>

          <vs-input
            class="w-full mt-3"
            label="LP Number"
            v-validate="'required'"
            name="lp_number"
            v-model="carInformation.lp_number"
          />
          <span class="text-danger text-sm" v-show="errors.has('lp_number')">{{
            errors.first("lp_number")
          }}</span>
          <div
            class="vx-row mt-3 car_event_block"
            style="margin-top: 0.75rem !important"
          >
            <div class="vx-col md:w-2/3 select__block">
              <label for="" class="vs-input--label mt-3">Car credential</label>

              <v-select
                v-model="carInformation.car_credential"
                :options="carOprions"
                class="select_padding"
                placeholder="Car credential"
                :reduce="(type) => type.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
            </div>

            <div class="vx-col md:w-1/3 mt-6 checkbox__block">
              <vs-checkbox
                v-model="carInformation.car_event"
                class="w-full mt-2"
                >Car event</vs-checkbox
              >
            </div>
          </div>
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
    // editData: {
    //   type: Object,
    //   required: true,
    // },
  },
  computed: {
    car_info() {
      return this.$store.state.cardholder.edit_cardholder_info.car_infos;
    },
  },
  components: {
    vSelect,
  },
  watch: {
    carInformation: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_EDIT_CAR__INFO", { ...newValue });
      },
      deep: true,
    },
  },
  created() {
    if (this.car_info) {
      this.carInformation = JSON.parse(JSON.stringify(this.car_info));
    }
    if (this.carInformation && this.carInformation.avatar) {
      this.carInformation.avatar =
        typeof this.carInformation.avatar == "string"
          ? JSON.parse(this.carInformation.avatar)
          : this.carInformation.avatar;

      this.avatarSrc = `${process.env.VUE_APP_BACK}/${this.carInformation.avatar.path}`;
    }
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
          this.carInformation.avatar = JSON.stringify({
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
      this.avatarSrc = "/no_car.svg";
      this.carInformation.avatar = null;

      this.$store.commit("cardholder/SET_EDIT_CAR__INFO", this.carInformation);
    },
  },
  data() {
    return {
      carInformation: {
        model: null,
        color: null,
        lp_number: null,
        car_credential: null,
        car_event: false,
        avatar: null,
      },
      avatarSrc: "/no_car.svg",
      selecteds: [],
      carOprions: [
        {
          label: "N1_RFID",
          id: 1,
        },
        {
          label: "N1_PINPASS",
          id: 2,
        },
        {
          label: "N3_VIKEY",
          id: 3,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.ed_car__infos {
  //  padding: 0 0 0 15px !important;
    // margin-left: 0 !important;
  .edit_car_avatar {
    object-fit: cover;
  }
  .checkbox_block {
    flex: 0 0 100%;
  }
  .card_block1 {
    padding: 0 !important;
    width: 40% !important;
    img {
      width: 100% !important;
      height: auto !important;
      max-width: 100% !important;
      max-height: 254px !important;
      margin: 0 0 5px 0 !important;
    }
    button {
      margin: 5px 0 !important;
    }
  }
  .edit_tools {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .card__info {
    padding: 0 0 0 15px !important;
    margin-left: 0 !important;
    width: 60% !important;
    .select__block {
      padding-left: 0 !important;
      margin-top: 0 !important;
    }
  }
}
</style>