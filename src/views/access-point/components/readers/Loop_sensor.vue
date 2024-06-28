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

      <div class="vx-col w-1/2 mt-3">
        <label for="" class="vs-input--label">Condition</label>

        <v-select
          v-model="reader_data.condition"
          :options="conditions"
          class="select_padding w-full"
          name="status"
          placeholder="Condition"
          :reduce="(source) => source.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/2 mt-3">
        <label for="" class="vs-input--label">Inputs</label>

        <v-select
          v-model="reader_data.input"
          :options="inputs"
          class="select_padding w-full"
          name="status"
          placeholder="Input"
          :reduce="(source) => source.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :selectable="(option) => !option.disabled"
          :disabled="reader_data.component_source == null"
        />
      </div>

      <div class="vx-col w-full mt-3">
        <vs-input
          label="Name"
          class="w-full"
          name="name"
          disabled
          v-model="reader_data.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { checkInput } from "@/functions/checkInputOutput";

export default {
  data() {
    return {
      inputs: [],
      reader_data: {},
    };
  },
  watch: {
    reader_data: {
      handler: function (reader_data) {
        this.$store.commit("accessPoint/SET_READER_DATA", {
          data: reader_data,
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
    conditions() {
      return this.$store.state.accessPoint.conditions;
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
      return (this.reader_data[field] = +value.replace(/[^+0-9]/g, ""));
    },
    initValues() {
      this.reader_data = {
        component_source: null,
        name: null,
        condition: this.conditions[0].id,
        input: null,
      };
    },
    setInputs(value) {
      const data = this.$store.state.accessPoint.acu_data;
      const access_points = data.access_points;
      this.inputs = [];
      const resources = checkInput(access_points, this.active_reader);

      let input_arr = [];
      if (data.model) {
        this.acu_model[data.model].inputs;
        for (let i = 1; i <= this.acu_model[data.model].inputs; i++) {
          if (resources.includes(i)) {
            input_arr.push({ id: i, label: i, disabled: true });
          } else {
            input_arr.push({ id: i, label: i });
          }
        }
        this.inputs = input_arr;
        if (value !== "changed") {
          this.reader_data.input = input_arr[0].id;
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
