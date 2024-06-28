<template>
  <div>
    <div class="vx-row">
      <vs-tabs>
        <vs-tab label="Main">
          <div>
            <div class="vx-row">
              <div class="vx-col w-full">
                <label for="" class="vs-input--label">Component source</label>

                <v-select
                  v-model="reader_data.component_source"
                  :options="[
                    { id: 0, label: 'ACU', disabled: isFloor ? true : false },
                  ]"
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
        </vs-tab>

        <vs-tab label="Alarm settings">
          <div>
            <div class="vx-row">
              <div class="vx-col w-full">
                <vs-tabs>
                  <vs-tab label="Door Held Open">
                    <div class="vx-row">
                      <div class="vx-col w-full">
                        <vs-checkbox
                          style="margin: 15px 0"
                          v-model="reader_data.enable_door_ajar_alarm"
                          >Enable door held open alarm</vs-checkbox
                        >
                      </div>
                      <div class="vx-col w-2/3">
                        <vs-input
                          class="w-full"
                          label="Door Held Open time,s"
                          @input="checkNumber($event, 'door_ajar_time')"
                          v-model="reader_data.door_ajar_time"
                        />
                      </div>

                      <div class="vx-col w-1/3">
                        <vs-input
                          class="w-full"
                          label="Door Held Open time,s"
                          disabled
                          @input="checkNumber($event, 'duration')"
                          v-model="reader_data.duration"
                        />
                      </div>
                      <div class="vx-col w-full" style="margin-top: 10px">
                        <label for="" class="vs-input--label"
                          >Trigger Output if Door Held Open</label
                        >

                        <v-select
                          v-model="reader_data.trigger_output_if_door_ajar"
                          :options="trigger_output_if_door_ajars"
                          class="select_padding w-full"
                          name="status"
                          placeholder="Trigger Output if Door Held Open"
                          :reduce="(source) => source.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        />
                      </div>
                    </div>
                  </vs-tab>

                  <vs-tab label="Door Forced-open">
                    <div class="vx-row">
                      <div class="vx-col w-full">
                        <div class="vx-col w-full">
                          <vs-checkbox
                            class="mt-3"
                            v-model="reader_data.enable_door_forced_open_alarm"
                            >Enable door forced-open alarm</vs-checkbox
                          >
                        </div>
                      </div>
                    </div>
                    <div class="vx-row mt-4">
                      <div class="vx-col w-2/3">
                        <label for="" class="vs-input--label"
                          >Trigger Output if Door Forced-open</label
                        >

                        <v-select
                          v-model="
                            reader_data.trigger_output_if_door_forced_open
                          "
                          :options="trigger_output_if_door_forced_opens"
                          class="select_padding w-full"
                          name="status"
                          placeholder="Trigger Output if Door Forced-open"
                          :reduce="(source) => source.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        />
                      </div>
                      <div class="vx-col w-1/3">
                        <vs-input
                          class="w-full"
                          label="Door Held Open time,s"
                          @input="checkNumber($event, 'duration')"
                          v-model="reader_data.duration"
                        />
                      </div>
                    </div>
                  </vs-tab>
                </vs-tabs>
              </div>
            </div>
          </div>
        </vs-tab>
      </vs-tabs>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { checkInput } from "@/functions/checkInputOutput";

export default {
  data() {
    return {
      reader_data: {},
      type: "ajar",
      componentsources: [],
      inputs: [],
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
    acuModel() {
      return this.$store.state.accessPoint.acu_data.model;
    },
    access_points() {
      return this.$store.state.accessPoint.acu_data.access_points;
    },
    acu_model() {
      return this.$store.state.accessPoint.acu_model.controllers;
    },
    conditions() {
      return this.$store.state.accessPoint.conditions;
    },
    trigger_output_if_door_ajars() {
      return this.$store.state.accessPoint.trigger_output_if_door_ajars;
    },
    trigger_output_if_door_forced_opens() {
      return this.$store.state.accessPoint.trigger_output_if_door_forced_opens;
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
    checkNumber(value, field) {
      return (this.reader_data[field] = +value.replace(/[^+0-9]/g, ""));
    },
    initValues() {
      this.reader_data = {
        component_source: null,
        name: null,
        condition: this.conditions[0].id,
        input: null,
        enable_door_ajar_alarm: false,
        door_ajar_time: null,
        duration: null,
        trigger_output_if_door_ajar: null,
        enable_door_forced_open_alarm: false,
        trigger_output_if_door_forced_open: null,
      };
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

<style lng="scss" scoped>
.bt_left,
.bt_right {
  padding: 10px !important;
  width: 160px;
}

.bt_left {
  margin-right: 5px;
}
</style>
