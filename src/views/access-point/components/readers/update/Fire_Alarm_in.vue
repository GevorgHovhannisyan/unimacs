<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <label for="" class="vs-input--label">Component source</label>

        <v-select
          v-model="reader_data.component_source"
          :options="componentsources"
          class="select_padding w-full"
          name="status"
          placeholder="Component source"
          @input="changeComponentSource"
          :reduce="(source) => source.id"
          :selectable="(option) => !option.disabled"
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
          placeholder="Inputs"
          :reduce="(source) => source.id"
          :disabled="reader_data.component_source == null"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :selectable="(option) => !option.disabled"
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
import { checkInputArr } from "@/functions/checkInputOutput";

export default {
  data() {
    return {
      inputs: [],
      componentsources: [],
      reader_data: {},
    };
  },
  watch: {
    acuModel() {
      this.setInputs();
      this.componentsources = [
        { id: 0, label: "ACU", disabled: this.isFloor ? true : false },
      ];
      if (this.extDevice.length) {
        this.extDevice.forEach((device) => {
          let hasInput;
          if (device.ext_board == "LR-RB16") {
            hasInput = this.expansion_boards.relay_board["LR-RB16"];
          } else if (device.ext_board == "LR-IB16") {
            hasInput = this.expansion_boards.alarm_board["LR-IB16"];
          }

          if (hasInput.inputs) {
            this.componentsources.push({ id: device.id, label: device.name });
          }
        });
      }
    },
    reader_data: {
      handler: function (reader_data) {
        this.$store.commit("accessPoint/SET_EDIT_READER_DATA", {
          data: reader_data,
        });
      },
      deep: true,
    },
    active_reader(data) {
      this.componentsources = [
        { id: 0, label: "ACU", disabled: this.isFloor ? true : false },
      ];
      if (this.extDevice.length) {
        this.extDevice.forEach((device) => {
          let hasInput;
          if (device.ext_board == "LR-RB16") {
            hasInput = this.expansion_boards.relay_board["LR-RB16"];
          } else if (device.ext_board == "LR-IB16") {
            hasInput = this.expansion_boards.alarm_board["LR-IB16"];
          }

          if (hasInput.inputs) {
            this.componentsources.push({ id: device.id, label: device.name });
          }
        });
      }
      let access_point;
      let reader;
      if (!this.active_point) {
        reader = JSON.parse(
          JSON.stringify(this.$store.state.accessPoint.edit_acu_data.readers)
        );
      } else if (Number.isInteger(+this.active_point)) {
        access_point = this.access_points.find(
          (a) => a.id == +this.active_point
        );
        const split = data.split("-", 2);

        if (this.res_types[split[1]]) {
          reader = { ...access_point.resources[split[1]] };
        } else if (access_point.new_readers && access_point.new_readers[data]) {
          reader = { ...access_point.new_readers[data] };
        } else {
          return;
        }
      } else {
        access_point =
          this.$store.state.accessPoint.edit_acu_data.new_access_points[
            this.active_point
          ];
        reader = { ...access_point.readers[data] };
      }

      if (!reader.data) {
        this.reader_data = { ...reader, name: reader.name };
      } else if (reader.reader_info) {
        this.reader_data = {
          ...reader.reader_info,
          name: reader.reader_info.data.device,
        };
      } else if (reader.data && !reader.reader_info) {
        this.reader_data = {
          ...reader,
          name: reader.data.device,
        };
      }
      this.setInputs();
    },
  },
  computed: {
    active_reader() {
      return this.$store.state.accessPoint.edit_active_reader;
    },
    active_point() {
      return this.$store.state.accessPoint.edit_active_point;
    },
    access_points() {
      return this.$store.state.accessPoint.edit_acu_data.access_points;
    },
    // componentsources() {
    //   return this.$store.state.accessPoint.componentsources;
    // },
    conditions() {
      return this.$store.state.accessPoint.conditions;
    },
    acuModel() {
      return this.$store.state.accessPoint.edit_acu_data.model;
    },
    acu_model() {
      return this.$store.state.accessPoint.acu_model.controllers;
    },
    extDevice() {
      return this.$store.state.accessPoint.edit_acu_data.ext_devices;
    },
    res_types() {
      return this.$store.state.accessPoint.res_types;
    },
    expansion_boards() {
      return this.$store.state.accessPoint.acu_model.expansion_boards;
    },
    isFloor() {
      let model = this.acuModel;
      let elevator_mode =
        this.$store.state.accessPoint.edit_acu_data.elevator_mode;

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
        componentsource: null,
        name: null,
        condition: null,
        input: null,
      };
    },
    setInputs(changed) {
      const data = this.$store.state.accessPoint.edit_acu_data;
      let input_arr = [];
      const resources = checkInputArr(data, this.active_reader, false);
      if (data.model && !this.reader_data.component_source) {
        if (
          this.acu_model[data.model].inputs_info &&
          !this.reader_data.component_source
        ) {
          const inp_info = this.acu_model[data.model].inputs_info;

          for (const key in inp_info) {
            if (resources.includes(+key)) {
              input_arr.push({
                id: +key,
                label: inp_info[key].name,
                disabled: true,
              });
            } else {
              input_arr.push({ id: +key, label: inp_info[key].name });
            }
          }
          if (changed) {
            this.reader_data.input = input_arr[0].id;
          }
        } else {
          for (let i = 1; i <= this.acu_model[data.model].inputs; i++) {
            if (resources.includes(i)) {
              input_arr.push({ id: i, label: i, disabled: true });
            } else {
              input_arr.push({ id: i, label: i });
            }
          }
          if (changed) {
            this.reader_data.input = input_arr[0].id;
          }
        }

        this.inputs = input_arr;
      } else {
        this.changeComponentSource();
      }
    },
    changeComponentSource() {
      const data = this.$store.state.accessPoint.edit_acu_data;
      const resources = checkInputArr(data, this.active_reader, true);

      if (this.reader_data.component_source !== 0) {
        const dev = this.extDevice.find(
          (i) => i.id === this.reader_data.component_source
        );
        let device;
        let input_arr = [];

        if (dev && dev.ext_board) {
          if (dev.ext_board == "LR-RB16") {
            device = this.expansion_boards.relay_board["LR-RB16"];
          } else if (dev.ext_board == "LR-IB16") {
            device = this.expansion_boards.alarm_board["LR-IB16"];
          }
        }
        if (device.inputs) {
          for (let i = 1; i <= device.inputs; i++) {
            if (resources.includes(i)) {
              input_arr.push({ id: i, label: i, disabled: true });
            } else {
              input_arr.push({ id: i, label: i });
            }
          }
        }
        this.inputs = input_arr;
      } else {
        this.setInputs();
      }
    },
    fetchSource() {
      this.componentsources = [];
      this.componentsources.push({
        id: 0,
        label: "ACU",
        disabled: this.isFloor ? true : false,
      });
      if (this.extDevice.length) {
        this.extDevice.forEach((device) => {
          let hasInput;
          if (device.ext_board == "LR-RB16") {
            hasInput = this.expansion_boards.relay_board["LR-RB16"];
          } else if (device.ext_board == "LR-IB16") {
            hasInput = this.expansion_boards.alarm_board["LR-IB16"];
          }

          if (hasInput.inputs) {
            this.componentsources.push({ id: device.id, label: device.name });
          }
        });
      }
    },
  },
  created() {
    this.$root.$on("fetchSource", () => {
      this.fetchSource();
    });

    this.componentsources = [];
    this.componentsources.push({
      id: 0,
      label: "ACU",
      disabled: this.isFloor ? true : false,
    });
    if (this.extDevice.length) {
      this.extDevice.forEach((device) => {
        let hasInput;
        if (device.ext_board == "LR-RB16") {
          hasInput = this.expansion_boards.relay_board["LR-RB16"];
        } else if (device.ext_board == "LR-IB16") {
          hasInput = this.expansion_boards.alarm_board["LR-IB16"];
        }

        if (hasInput.inputs) {
          this.componentsources.push({ id: device.id, label: device.name });
        }
      });
    }
    let access_point;
    let reader;

    if (Number.isInteger(+this.active_point)) {
      access_point = this.access_points.find((a) => a.id == +this.active_point);
      const split = this.active_reader.split("-", 2);

      if (this.res_types[split[1]]) {
        reader = { ...access_point.resources[split[1]] };
      } else {
        reader = { ...access_point.new_readers[this.active_reader] };
      }
    } else {
      access_point =
        this.$store.state.accessPoint.edit_acu_data.new_access_points[
          this.active_point
        ];
      reader = { ...access_point.readers[this.active_reader] };
    }

    if (!reader.data) {
      this.reader_data = { ...reader, name: reader.name };
    } else if (reader.reader_info) {
      this.reader_data = {
        ...reader.reader_info,
        name: reader.reader_info.data.device,
      };
    } else if (reader.data && !reader.reader_info) {
      this.reader_data = {
        ...reader,
        name: reader.data.device,
      };
    }

    this.setInputs();
  },
  components: {
    vSelect,
  },
};
</script>
