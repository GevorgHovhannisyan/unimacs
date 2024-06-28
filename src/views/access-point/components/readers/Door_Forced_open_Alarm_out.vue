<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <label for="" class="vs-input--label">Component source</label>

        <v-select
          v-model="reader_data.component_source"
          :options="[{ id: 0, label: 'ACU', disabled: isFloor ? true : false }]"
          class="select_padding w-full"
          name="status"
          placeholder="Component source"
          :reduce="(source) => source.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/2">
        <vs-input
          label="Name"
          class="w-full"
          name="name"
          disabled
          v-model="reader_data.name"
        />
      </div>

      <div class="vx-col w-1/2">
        <label for="" class="vs-input--label">Outputs</label>

        <v-select
          v-model="reader_data.output"
          :options="inputs"
          class="select_padding w-full"
          name="status"
          placeholder="Outputs"
          :reduce="(source) => source.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :selectable="(option) => !option.disabled"
          :disabled="reader_data.component_source == null"
        />
      </div>

      <div class="vx-col w-1/2">
        <label for="" class="vs-input--label">Relay mode</label>

        <v-select
          v-model="reader_data.relay_mode"
          :options="relay_modes"
          class="select_padding w-full"
          name="status"
          placeholder="Relay mode"
          :reduce="(source) => source.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/2">
        <vs-input
          class="w-full input_dur"
          label="Impulse Duration in seconds"
          :disabled="reader_data.relay_mode !== 1"
          @input="checkNumber($event, 'impulse_time')"
          v-model="reader_data.impulse_time"
        />
      </div>

      <div class="vx-col w-1/2">
        <label for="" class="vs-input--label">Type</label>

        <v-select
          v-model="reader_data.type"
          :options="lock_types"
          class="select_padding w-full"
          name="status"
          placeholder="Type"
          :reduce="(source) => source.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { checkOutput } from "@/functions/checkInputOutput";

export default {
  data() {
    return {
      inputs: [],
      reader_data: {},
    };
  },
  watch: {
    reader_data: {
      handler: function (reader_data, oldData) {
        this.$store.commit("accessPoint/SET_READER_DATA", {
          data: { ...reader_data },
        });
      },
      deep: true,
    },
    active_reader(data) {
      const reader_data =
        this.access_points[this.active_point].readers[this.active_reader];

      if (reader_data.reader_info) {
        this.reader_data = { ...reader_data.reader_info };
      } else {
        this.initValues();
        this.reader_data.name = reader_data.name;
      }
      this.setInputs();
    },
    acuModel() {
      this.setInputs();
    },
  },
  computed: {
    active_reader() {
      return this.$store.state.accessPoint.active_reader;
    },
    active_point() {
      return this.$store.state.accessPoint.active_point;
    },
    access_points() {
      return this.$store.state.accessPoint.acu_data.access_points;
    },
    componentsources() {
      return this.$store.state.accessPoint.componentsources;
    },
    relay_modes() {
      return this.$store.state.accessPoint.relay_modes;
    },
    lock_types() {
      return this.$store.state.accessPoint.lock_types;
    },
    acuModel() {
      return this.$store.state.accessPoint.acu_data.model;
    },
    acu_model() {
      return this.$store.state.accessPoint.acu_model.controllers;
    },
    isFloor() {
      let model = this.acuModel;
      let elevator_mode = this.$store.state.accessPoint.acu_data.elevator_mode;

      if ((model == "Icon" || model == "Icon-PRO") && elevator_mode) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    checkNumber(value, field) {
      let result = +value.replace(/[^+0-9]/g, "");

      if (field === "impulse_time") {
        result = value.replace(/[^\d.]|\.(?=.*\.)/g, "");
        if (result > 2) {
          this.reader_data.impulse_time = 2;
        } else {
          let filtered = 0;
          if (result.slice(-1) === ".") {
            filtered = result;
          } else {
            let res = +result;

            let isDecimal = +res % 1;

            if (isDecimal !== 0) {
              filtered = +res.toFixed(1);
            } else {
              filtered = res;
            }
          }

          this.reader_data.impulse_time = filtered;
        }
      } else {
        this.reader_data[field] = result;
      }
    },
    initValues() {
      this.reader_data = {
        component_source: null,
        name: null,
        output: null,
        relay_mode: this.relay_modes[0].id,
        type: this.lock_types[0].id,
        impulse_time: 0,
      };
    },
    setInputs(value) {
      const data = this.$store.state.accessPoint.acu_data;
      const access_points = data.access_points;
      const resources = checkOutput(access_points, this.active_reader);
      this.inputs = [];

      let input_arr = [];
      if (data.model) {
        this.acu_model[data.model].outputs;
        for (let i = 1; i <= this.acu_model[data.model].outputs; i++) {
          if (resources.includes(i)) {
            input_arr.push({ id: i, label: i, disabled: true });
          } else {
            input_arr.push({ id: i, label: i });
          }
        }
        this.inputs = input_arr;
        if (value !== "changed") {
          this.reader_data.output = input_arr[0].id;
        }
      }
    },
  },
  created() {
    const reader_data =
      this.access_points[this.active_point].readers[this.active_reader];
    this.initValues();
    this.setInputs();

    this.reader_data.name = reader_data.name;
  },
  components: {
    vSelect,
  },
};
</script>