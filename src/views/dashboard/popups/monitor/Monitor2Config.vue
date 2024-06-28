<template>
  <vs-popup
    class="holamundo"
    title="Monitor configuration"
    :active.sync="showPopup"
    v-if="showPopup"
  >
    <div class="vx-row">
      <div class="vx-col w-1/2" v-for="(option, index) in options" :key="index">
        <vs-checkbox
          v-model="option.show"
          class="mb-4 mt-5"
          :disabled="option.disabled"

        >
          {{ option.name }}
        </vs-checkbox>
      </div>
    </div>

    <div class="screen_false mt-2">
      <vs-button class="mt-4 unimacs_button" @click="changeMonitorConfigs"
        >Submit</vs-button
      >

      <!-- @click="changeAvtivityHeaders" -->

      <vs-button
        class="mr-6 mt-4 unimacs_cancel_button"
        @click="
          $emit('closePopup');
          showPopup = false;
        "
        >Cancel</vs-button
      >
    </div>
  </vs-popup>
</template>

<script>
export default {
  props: {
    configPopup: {
      type: Boolean,
      default: false,
    },
    monitorDataConfig: {
      type: Array,
      default: () => [],
    },
    settings: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showPopup: false,
      options: [],
    };
  },
  methods: {
    changeMonitorConfigs() {
      this.$emit("submitUpdate", this.options);
      this.showPopup = false;
    },
    setOptions() {
      this.options = JSON.parse(JSON.stringify(this.monitorDataConfig));
      if (!this.hasAcPoint) {
        let findOp = this.options.find(
          (option) => option.key == "manual_override"
        );
        findOp.disabled = true;
      }
    },
  },
  watch: {
    configPopup(popupShow) {
      this.showPopup = popupShow;
    },
    monitorDataConfig() {
      this.setOptions();
    },
    showPopup(val) {
      if (!val) {
        this.$emit("closePopup");
      }
    },
    settings() {
      this.setOptions();
    },
  },
  created() {
    this.showPopup = this.configPopup;
    this.setOptions();
  },
  computed: {
    hasAcPoint() {
      return this.settings && this.settings.access_point;
    },
  },
};
</script>
