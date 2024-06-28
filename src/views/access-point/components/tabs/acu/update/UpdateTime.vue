<template>
  <div>
    <div class="vx-row mt-3">
      <!-- <div class="vx-col md:w-full">
        <vs-checkbox
          class="mb-4 mt-5 custom__checkbox"
          v-model="time.timezone_from_facility"
          disabled
          >Timezone from Facility</vs-checkbox
        >
      </div> -->

      <div class="vx-col md:w-full">
        <v-select
          v-model="time.time_zone"
          :options="time_zones"
          :disabled="time.timezone_from_facility"
          class="select_padding update_time mt-5"
          name="connection_type"
          placeholder="Time zones"
          :reduce="(time_zone) => time_zone.value"
          @input="changeTimeZone"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
    </div>

    <vs-divider />

    <div class="vx-row mt-3">
      <div class="vx-col md:w-full">
        <vs-checkbox
          class="mb-4 mt-5 custom__checkbox"
          v-model="time.enable_daylight_saving_time"
          >Enable Daylight saving time</vs-checkbox
        >
      </div>
      <!-- <br /> -->
      <!-- <div class="vx-col md:w-full">
        <vs-checkbox
          class="mb-4 mt-5 custom__checkbox"
          v-model="time.daylight_saving_time_from_user_account"
          disabled
          >Daylight saving time from User account</vs-checkbox
        >
      </div> -->
    </div>
  </div>
</template>


<script>
import vSelect from "vue-select";
import time_zones from "@/assets/json_files/time_zones.json";
export default {
  props: {},
  watch: {
    time: {
      handler: function (data) {
        if (Object.keys(data).length) {
          this.$store.commit("accessPoint/UPDATE_TIME", { data: data });
        }
      },
      deep: true,
    },
  },
  methods: {
    changeTimeZone() {
      const timeZone = time_zones.find((t) => t.value === this.time.time_zone);
      const firstSplit = timeZone.label.split("(GMT")[1];
      this.time.time_zone_unix = firstSplit.split(")")[0];
    },
  },
  data() {
    return {
      time: {},
      time_zones,
    };
  },
  created() {
    this.time = { ...this.$store.state.accessPoint.edit_acu_data.time };

    const timeZone = time_zones.find((t) => t.value === this.time.time_zone);
    const firstSplit = timeZone.label.split("(GMT")[1];
    this.time.time_zone_unix = firstSplit.split(")")[0];
  },
  components: { vSelect },
};
</script>
