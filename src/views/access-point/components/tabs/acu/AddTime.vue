<template>
  <div>
    <div class="vx-row mt-3">
      <div class="vx-col md:w-full">
        <vs-checkbox class="custom__checkbox" v-model="time.timezone_from_facility"
          >Timezone from Facility</vs-checkbox
        >
      </div>

      <div class="vx-col md:w-full mt-3">
      <label for="" class="vs-input--label">Time zones</label>
        <v-select
          v-model="time.time_zone"
          :options="time_zones"
          :disabled="time.timezone_from_facility"
          class="select_padding update_time"
          @input="changeTimeZone"
          name="connection_type"
          placeholder="Time zones"
          :reduce="(time_zone) => time_zone.value"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
    </div>

    <vs-divider />

    <div class="vx-row mt-3 flex-col">
      <div class="vx-col md:w-full custom__checkbox">
        <vs-checkbox
          v-model="time.enable_daylight_saving_time"
          >Enable Daylight saving time</vs-checkbox
        >
      </div>
<!-- <br>
      <div class="vx-col md:w-full custom__checkbox">
        <vs-checkbox
          class="mt-3"
          v-model="time.daylight_saving_time_from_user_account"
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
  watch: {
    time: {
      handler: function (data) {
        if (Object.keys(data).length) {
          this.$store.commit("accessPoint/SET_TIME", { data: data });
        }
      },
      deep: true,
    },
  },
  methods: {
    changeTimeZone(){
      if(this.time.time_zone) {
        const timeZone = time_zones.find(t => t.value === this.time.time_zone);
        const firstSplit = timeZone.label.split('(GMT')[1];
        this.time.time_zone_unix = firstSplit.split(')')[0]
      } else {
        this.time.time_zone = null
      }
    }
  },
  data() {
    return {
      time: {},
      time_zones,
    };
  },
  created() {
    const acu_data = this.$store.state.accessPoint.acu_data.time
    if(!acu_data.time_zone) {
      const time = Intl.DateTimeFormat().resolvedOptions().timeZone
      this.time = { ...acu_data };
      this.time.time_zone = time;
    } else {

      this.time = { ...acu_data };
    }
    this.$root.$on("initACU", () => {
      this.time = this.$parent.$parent.$parent.acu_data.time;
    });
  },
  components: { vSelect },
};
</script>
