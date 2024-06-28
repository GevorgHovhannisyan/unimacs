<template>
  <div class="update__anpb">
    <div class="mt-3 vx-row">
      <div class="vx-col md:w-full">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="main_info.apb_enable_local"
          >Enable Local AntiPass Back</vs-checkbox
        >
      </div>

      <div class="vx-col md:w-full">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="main_info.apb_enable_timer"
          >Enable timer (Settings from Location Zone)</vs-checkbox
        >
      </div>
    </div>
    <div class="vx-row mt-3">
      <div class="vx-col md:w-2/3">
        <vs-input
          class="w-full"
          label="Time Count"
          v-validate="'required'"
          name="time_count"
          v-model="main_info.time"
          @input="checkNumber"
        />
      </div>
      <div class="vx-col md:w-1/3">
        <label for="" class="vs-input--label">Type</label>
        <v-select
          v-model="main_info.time_type"
          :options="time_types"
          class="select_padding ant_select"
          name="type"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
    </div>
  </div>
</template>


<script>
import vSelect from "vue-select";

export default {
  methods: {
    checkNumber(value) {
      return (this.main_info.time = value.replace(/[^+0-9]/g, ""));
    },
  },
  watch: {
    main_info: {
      handler: function (main_info) {
        this.$store.commit("accessPoint/SET_POINT_DATA", {
          name: this.active_point,
          data: main_info,
        });
      },
      deep: true,
    },
    active_point(data) {
      this.main_info = { ...this.access_points[data] };
    },
  },
  computed: {
    time_types() {
      return this.$store.state.accessPoint.time_types;
    },
    active_point() {
      return this.$store.state.accessPoint.active_point;
    },
    access_points() {
      return this.$store.state.accessPoint.acu_data.access_points;
    },
  },
  data() {
    return {
      main_info: {},
    };
  },
  created() {
    const find = this.access_points[this.active_point];
    this.main_info = { ...find };
  },
  components: {
    vSelect,
  },
};
</script>