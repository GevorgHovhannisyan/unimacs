<template>
  <div>
    <!-- title="Extra Features" -->
    <vx-card class="mt-base card_theme"  no-shadow>
      <div class="vx-row">
        <div class="md:w-full w-full">
          <div class="vx-row">
            <div class="vx-col md:w-full">
              <label for="" class="vs-input--label">Type</label>

              <v-select
                v-model="extra_features.type"
                :options="extraFeatureTypes"
                class="w-full select_padding"
                :reduce="(type) => type.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
            </div>
          </div>
          <vs-divider />
          <div class="vx-row">
            <div class="vx-col w-1/2">
              <vs-input
                class="count_passersss new_inp"
                style="width: 80%"
                label="Set Time"
                @input="checkNumber($event, 'time')"
                v-model="extra_features.time"
                v-validate="'required'"
              />
            </div>

            <div class="vx-col w-1/2">
              <label for="" class="vs-input--label">Units</label>

              <v-select
                v-model="extra_features.time_type"
                :options="timeTypes"
                class="select_padding unit_select"
                :reduce="(type) => type.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
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
  watch: {
    extra_features: {
      handler: function (newValue) {
        this.$store.commit("cardholder/SET_EXTRA_FEATURES_INFO", newValue);
      },
      deep: true,
    },
  },
  components: {
    vSelect,
  },
  methods: {
    checkNumber(value, field) {
      return (this.extra_features[field] = +value.replace(/[^+0-9]/g, ""));
    },
    initValues() {
      // this.extra_features = {
      //   type: 1,
      //   time_type: null,
      // };
    },
  },
  created() {
    this.extra_features = {
      ...this.$store.state.cardholder.cardholder_info.extra_features,
    };
  },
  data() {
    return {
      extra_features: {
        type: null,
        time: null,
        time_type: null,
      },
      extraFeatureTypes: [
        {
          label: "Extended Entry time",
          id: 1,
        },
      ],
      timeTypes: [
        {
          label: "Minutes",
          id: "minutes",
        },
        {
          label: "Seconds",
          id: "seconds",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.counting_block {
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
