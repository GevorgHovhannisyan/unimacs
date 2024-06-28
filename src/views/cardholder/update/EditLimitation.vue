<template>
  <div>
    <!-- title="Limitations" -->
    <vx-card class="mt-base card_theme"  no-shadow >
      <div class="vx-row">
        <div class="vx-col md:w-full w-full">
          <vs-checkbox
            v-model="limitation.limitation_inherited"
            class="w-full checkbox_block custom__checkbox"
            @change="changeToInherit"
            :disabled="!group"
            >Limitation Inherited</vs-checkbox
          >
          <vs-checkbox
            v-model="limitation.enable_date"
            :disabled="
              limitation.limitation_inherited ||
              !features ||
              !features.CardholderDeactivationByDate ||
              limitation.first_use_counter_enable ||
              limitation.last_use_counter_enable
            "
            class="w-full checkbox_block custom__checkbox"
            v-if="features && features.CardholderDeactivationByDate"
            >Enable Date Limitation</vs-checkbox
          >
          <div class="vx-row date_filter mr-5 limitation_rangepicker">
            <div class="vx-col start_date">
              <flat-pickr
                :config="configdateTimePicker"
                v-model="limitation.valid_from"
                @input="validateLimitations"
                :disabled="
                  limitation.limitation_inherited ||
                  !limitation.enable_date ||
                  !features ||
                  !features.CardholderDeactivationByDate
                "
                placeholder="Valid from"
              />
            </div>
            <div class="vx-col endDate">
              <flat-pickr
                :config="configdateTimePicker"
                v-model="limitation.valid_due"
                @input="validateLimitations"
                :disabled="
                  limitation.limitation_inherited || !limitation.enable_date
                "
                placeholder="Due"
              />
            </div>
          </div>
          <vs-divider />
          <!-- <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
            <vs-tab label="Pass Counter" icon-pack="feather" icon="icon-user">
              <div class="tab-text ">
                <vs-checkbox
                  v-model="limitation.pass_counter_enable"
                  class="w-full checkbox_block mt-4 custom__checkbox"
                  :disabled="
                    limitation.limitation_inherited ||
                    !features ||
                    !features.CardholderDeactivationByLimit
                  "
                  >Enable Pass Counter</vs-checkbox
                >
                <span
                  >Credentials will expire when pass count will be
                  reached.</span
                >
                <div class="counting_block">
                  <vs-input
                    label="Passes"
                    class="count_passers"
                    @input="checkNumber($event, 'pass_counter_passes')"
                    :disabled="
                      limitation.limitation_inherited ||
                      !limitation.pass_counter_enable ||
                      !features ||
                      !features.CardholderDeactivationByLimit
                    "
                    v-model="limitation.pass_counter_passes"
                    v-validate="'required'"
                    value="25"
                  />
                  <vs-input
                    label="Current status"
                    class="count_status"
                    v-model="limitation.pass_counter_current"
                    value="20"
                    disabled
                  />
                  <div>
                    <img
                      style="cursor: pointer; position: relative; top: -10px"

                      :src="require(`@/assets/images/file-icons/reload.png`)"
                    />
                  </div>
                </div>
              </div>
            </vs-tab>

            <vs-tab
              label="First Use Counter"
              icon-pack="feather"
              icon="icon-user"
            >
              <div class="tab-text">
                <vs-checkbox
                  v-model="limitation.first_use_counter_enable"
                  :disabled="
                    limitation.limitation_inherited ||
                    !features ||
                    !features.CardholderDeactivationByLimit ||
                    limitation.enable_date
                  "
                  class="w-full checkbox_block mt-3 custom__checkbox"
                  >Enable First Use Counter</vs-checkbox
                >
                <span
                  >Credentials will expire a specified number of days after the
                  first use.</span
                >
                <div class="counting_block">
                  <vs-input
                    label="Days"
                    v-model="limitation.first_use_counter_days"
                    class="count_passers"
                    :disabled="
                      limitation.limitation_inherited ||
                      !limitation.first_use_counter_enable ||
                      !features ||
                      !features.CardholderDeactivationByLimit
                    "
                    v-validate="'required'"
                    @input="checkNumber($event, 'first_use_counter_days')"
                    value="25"
                  />
                  <vs-input
                    label="Current status"
                    class="count_status"
                    value="20"
                    v-model="limitation.first_use_counter_current"
                    disabled
                  />
                  <div>
                    <img
                      style="cursor: pointer; position: relative; top: -10px"

                      :src="require(`@/assets/images/file-icons/reload.png`)"
                    />
                  </div>
                </div>
              </div>
            </vs-tab>

            <vs-tab
              label="Last Use Counter"
              icon-pack="feather"
              icon="icon-user"
            >
              <div class="tab-text">
                <vs-checkbox
                  v-model="limitation.last_use_counter_enable"
                  :disabled="
                    limitation.limitation_inherited ||
                    !features ||
                    !features.CardholderDeactivationByLimit ||
                    limitation.enable_date
                  "
                  class="w-full checkbox_block mt-3 custom__checkbox"
                  >Enable Last Use Counter</vs-checkbox
                >
                <span
                  >Credentials will expire when it has not been used for a
                  specified number of days.</span
                >
                <div class="counting_block">
                  <vs-input
                    label="Days"
                    v-model="limitation.last_use_counter_days"
                    class="count_passers"
                    v-validate="'required'"
                    :disabled="
                      limitation.limitation_inherited ||
                      !limitation.last_use_counter_enable ||
                      !features ||
                      !features.CardholderDeactivationByLimit
                    "
                    @input="checkNumber($event, 'last_use_counter_days')"
                    value="25"
                  />
                  <vs-input
                    v-model="limitation.last_use_counter_current"
                    label="Current status"
                    class="count_status"
                    value="20"
                    disabled
                  />
                  <div>
                    <img
                      style="cursor: pointer; position: relative; top: -10px"

                      :src="require(`@/assets/images/file-icons/reload.png`)"
                    />
                  </div>
                </div>
              </div>
            </vs-tab>
          </vs-tabs> -->
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  components: {
    flatPickr,
    // VueSlideTab,
  },
  props: {
    // features: {
    //   type: Object,
    // },
    // editData: {
    //   type: Object,
    //   required: true,
    // },
  },
  computed: {
    group() {
      return this.$store.state.cardholder.edit_cardholder_info.cardholder_group;
    },
    features() {
      return localStorage.getItem("features") &&
        JSON.parse(localStorage.features).Cardholder
        ? JSON.parse(localStorage.features).Cardholder
        : null;
    },
  },
  watch: {
    limitation: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_EDIT_LIMITATION_DATA", {
          ...newValue,
        });
      },
      deep: true,
    },
  },
  methods: {
    checkNumber(value, field) {
      return (this.limitation[field] = +value.replace(/[^+0-9]/g, ""));
    },
    validateLimitations() {
      let from = this.limitation.valid_from;
      let due = this.limitation.valid_due;
      if (from && due) {
        if (new Date(from) > new Date(due)) {
          this.limitation.valid_due = null;
        }
      }
    },
    changeToInherit() {
      if (this.limitation.limitation_inherited) {
        this.$store
          .dispatch("cardGroup/fetchCardGroup", this.group)
          .then((res) => {
            this.limitation = { ...res.data.limitations };
            this.limitation.limitation_inherited = true;
          });
      } else {
        this.limitation = {};
      }
    },
  },
  created() {
    // if (this.features && Object.keys(this.features).length) {
    //   this.card_features = this.features;
    // }

    this.limitation = {
      ...this.$store.state.cardholder.edit_cardholder_info.limitations,
    };
    this.limitation.limitation_inherited =
      this.$store.state.cardholder.edit_cardholder_info.limitation_inherited;

    if (this.limitation.limitation_inherited) {
      this.changeToInherit();
    }
  },
  data() {
    return {
      activeTab: 0,
      currentTab: "pass_counter",
      card_features: null,
      limitation: {},
      configdateTimePicker: {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true
      },
    };
  },
};
</script>

<style lang="scss">
.hasTime.animate.open.arrowTop.arrowLeft {
      z-index: 99999999;
}
</style>

<style lang="scss" scoped>
.checkbox_block {
  flex: 0 0 100%;
  margin-bottom: 15px;
}
.counting_block {
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  .count_passers,
  .count_status {
    flex: 0 0 40%;
  }
  img {
    width: 20px;
  }
}

.tabs.default-tabs
  .tabs__item.tabs__item_active.default-tabs__item_active.default-tabs__item {
  background: red i !important;
}
.limitation_rangepicker {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-left: -5px;
  margin-bottom: 20px;
  .start_date,
  .endDate {
    flex: 0 0 50%;
    padding: 10px;
  }
}
.display_none {
  display: none;
}
.display_block {
  display: flex;
}
.default-tabs {
  position: relative;
  margin: 0 auto;
  width: 100%;
  justify-content: space-between;
  display: flex;
  button {
    background: transparent !important;
  }
  .tabs__item {
    background: red !important;
  }
  &__item {
    display: inline-block;
    margin: 0 5px;
    padding: 10px;
    padding-bottom: 8px;
    font-size: 16px;
    letter-spacing: 0.8px;
    color: gray;
    text-decoration: none;
    border: none;
    background-color: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s;
    &_active {
      color: black;
    }
    &:hover {
      border-bottom: 2px solid gray;
      color: black;
    }
    &:focus {
      outline: none;
      border-bottom: 2px solid gray;
      color: black;
    }
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  &__active-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: black;
    transition: transform 0.4s ease, width 0.4s ease;
  }
}
.content {
  margin-top: 30px;
}
</style>
