<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <label for="" class="vs-input--label">Component source</label>

        <v-select
          v-model="reader_data.component_source"
          :options="componentsources"
          @input="changeComponentSource"
          class="select_padding w-full"
          name="status"
          placeholder="Component source"
          :reduce="(source) => source.id"
          :selectable="(option) => !option.disabled"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/2 mt-3">
        <vs-input
          label="Name"
          class="w-full"
          name="name"
          disabled
          v-model="reader_data.name"
        />
      </div>

      <div class="vx-col w-1/2 mt-3">
        <label for="" class="vs-input--label">Outputs</label>

        <v-select
          v-model="reader_data.output"
          :options="inputs"
          class="select_padding w-full"
          name="status"
          placeholder="Outputs"
          :reduce="(source) => source.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :disabled="reader_data.component_source == null || only_blue"
          :selectable="(option) => !option.disabled"
        />
      </div>

      <div class="vx-col w-1/2 mt-3">
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

      <div class="vx-col w-1/2 mt-3">
        <vs-input
          class="w-full input_dur"
          label="Impulse Duration in seconds"
          :disabled="reader_data.relay_mode !== 1"
          @input="checkNumber($event, 'impulse_time')"
          v-model="reader_data.impulse_time"
        />
      </div>

      <div class="vx-col w-1/2 mt-3">
        <label for="" class="vs-input--label">Type</label>

        <v-select
        :disabled="disabledType"

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
import { checkOutputArr } from "@/functions/checkInputOutput";

export default {
  data() {
    return {
      inputs: [],
      componentsources: [
        { id: 0, label: "ACU", disabled: this.isFloor ? true : false },
      ],
      reader_data: {},
      type_outputs: null,
      only_blue: false
    };
  },
  watch: {
    acuModel() {
      this.setInputs();

      this.componentsources = [];
      if (this.extDevice.length) {
        this.extDevice.forEach((device) => {
          let hasInput;
          if (device.ext_board == "LR-RB16") {
            hasInput = this.expansion_boards.relay_board["LR-RB16"];
          } else if (device.ext_board == "LR-IB16") {
            hasInput = this.expansion_boards.alarm_board["LR-IB16"];
          }

          if (hasInput.outputs) {
            this.componentsources.push({ id: device.id, label: device.name });
          }
        });
      }
    },
    reader_data: {
      handler: function (reader_data, oldData) {
        this.$store.commit("accessPoint/SET_EDIT_READER_DATA", {
          data: { ...reader_data },
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

          if (hasInput.outputs) {
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
    relay_modes() {
      return this.$store.state.accessPoint.relay_modes;
    },

    lock_types() {
      return this.$store.state.accessPoint.lock_types;
    },
    acuModel() {
      return this.$store.state.accessPoint.edit_acu_data.model;
    },
    acu_model() {
      return this.$store.state.accessPoint.acu_model.controllers;
    },
    res_types() {
      return this.$store.state.accessPoint.res_types;
    },
    extDevice() {
      return this.$store.state.accessPoint.edit_acu_data.ext_devices;
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
    disabledType() {
      const data = this.$store.state.accessPoint.edit_acu_data;
      const out = this.reader_data.output;

      return (
        (this.type_outputs === "outputs_info" &&
          data.model === "Icon-PRO" &&
          (out === 1 || out === 2 || out === 3 || out === 4)) ||
        (this.type_outputs === "outputs_info" &&
          out === 1 &&
          data.model === "Icon") ||
        this.type_outputs === "outputs_info_ext" ||
        this.isFloor
      );
    }
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
        relay_mode: null,
        type: null,
        entry_exit_open_durations: null,
        door_sensor_autolock: false,
        impulse_time: 0,
      };
    },
    setInputs(changed) {
      const data = this.$store.state.accessPoint.edit_acu_data;
      let input_arr = [];
      const resources = checkOutputArr(data, this.active_reader, false);

      if (data.model && !this.reader_data.component_source) {
        if (
          this.acu_model[data.model].outputs_info &&
          !this.reader_data.component_source
        ) {
          if (data.model === "Icon" || data.model === "Icon-PRO") {
            this.type_outputs = "outputs_info";
          } else if (data.model === "AIR-CR" || data.model === "AIR-CB") {
            this.only_blue = true;
            this.reader_data.output = 1;
          }
          const out_info = this.acu_model[data.model].outputs_info;

          for (const key in out_info) {
            if (resources.includes(+key)) {
              input_arr.push({
                id: +key,
                label: out_info[key].name,
                disabled: true,
              });
            } else {
              input_arr.push({ id: +key, label: out_info[key].name });
            }
          }
          if (changed) {
            this.reader_data.output = input_arr[0].id;
          }
        } else {
          if (data.model === "Icon" || data.model === "Icon-PRO") {
            this.type_outputs = "outputs_info_ext";
          }

          for (let i = 1; i <= this.acu_model[data.model].outputs; i++) {
            if (resources.includes(i)) {
              input_arr.push({ id: i, label: i, disabled: true });
            } else {
              input_arr.push({ id: i, label: i });
            }
          }
          if (changed) {
            this.reader_data.output = input_arr[0].id;
          }
        }

        this.inputs = input_arr;
      } else {
        this.changeComponentSource();
      }
    },
    changeComponentSource() {
      const data = this.$store.state.accessPoint.edit_acu_data;
      const resources = checkOutputArr(data, this.active_reader, true);

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
        if (device.outputs) {
          for (let i = 1; i <= device.outputs; i++) {
            if (resources.includes(i)) {
              input_arr.push({ id: i, label: i, disabled: true });
            } else {
              input_arr.push({ id: i, label: i });
            }
          }
        }
        this.inputs = input_arr;
        if (data.model === "Icon" || data.model === "Icon-PRO") {
          this.type_outputs = "outputs_info_ext";
        } else {
          this.type_outputs = "outputs";
        }
        this.only_blue = false;
        // this.reader_data.output = input_arr[0].id;
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

          if (hasInput.outputs) {
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

        if (hasInput.outputs) {
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
