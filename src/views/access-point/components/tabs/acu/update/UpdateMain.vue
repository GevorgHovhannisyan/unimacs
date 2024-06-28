<template>
  <div>
    <span class="mt-5" style="font-weight: bold">{{
    acu_data.serial_number
    ? `ACU S/N: ${acu_data.serial_number}`
    : 'ACU S/N: "N/A"'
    }}
    </span>
    <div class="vx-row mt-3">
      <div class="vx-col md:w-full">
        <vs-input class="w-full" label="Name" v-validate="'required'" name="name" v-model="main_info.name" />
        <span class="text-danger text-sm" v-show="errors.has('name')">{{
        errors.first("name")
        }}</span>
      </div>
      <div class="vx-col w-full mt-4">
        <vs-input class="w-full" label="Description" name="description" v-model="main_info.description" />
      </div>
      <div class="vx-col md:w-2/3 mt-3">
        <label for="" class="vs-input--label">Model</label>
        <v-select v-model="main_info.model" :options="models" class="select_padding" name="model"
          v-validate="'required'" placeholder="Model" :reduce="(model) => model.label" :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :selectable="(option) => !option.disabled" disabled />

          <!-- ="disabledModelMode" -->

        <span class="text-danger text-sm" v-show="errors.has('model')">{{
        errors.first("model")
        }}</span>
      </div>

      <div class="vx-col md:w-1/3 mt-5">
        <vs-checkbox class="mb-4 mt-5" v-model="main_info.elevator_mode" :disabled="disabledModelMode">Elevator mode
        </vs-checkbox>
      </div>
      <div class="acu_reader_info mt-3 vx-col w-full">
        <table>
          <tr>
            <td>Outputs:</td>
            <td>
              {{ getInputs("outputs") }} /
              {{ controller ? controller.outputs : "0" }}

            </td>
          </tr>
          <tr>
            <td>Inputs:</td>
            <td>
              {{ getInputs("inputs") }} /
              {{ controller ? controller.inputs : "0" }}

            </td>
          </tr>
          <tr>
            <td>Readers</td>
            <td>
              {{ getReaders(access_points) }} /
              {{
              controller && controller.readers
              ? Object.keys(controller.readers).length
              : 0
              }}
            </td>
          </tr>
          <tr>
            <td>Wifi:</td>
            <td>{{ getWifiEthernet(1) }}</td>
          </tr>
          <tr>
            <td>Ethernet:</td>
            <td>{{ getWifiEthernet(0) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from "vue-select";

export default {
  computed: {
    acu_models() {
      return this.$store.state.accessPoint.acu_models;
    },
    resource_modes() {
      return this.$store.state.accessPoint.resource_modes;
    },
    acu_controllers() {
      return this.$store.state.accessPoint.acu_model.controllers;
    },
    acuModel() {
      return this.$store.state.accessPoint.edit_acu_data.model;
    },
    models() {
      let types = [...this.acu_models];

      if (this.main_info.elevator_mode) {
        types.map((t) => {
          if (t.label !== "Icon-PRO" && t.label !== "Icon") {
            t.disabled = true;
            return t;
          }
        });
      } else {
        types.map((t) => {
          t.disabled = false;
          return t;
        });
      }
      return types;
    },
    disabledModelMode() {
      const store_data = this.$store.state.accessPoint.edit_acu_data;
      return store_data.access_points.length ||
        (store_data.new_access_points &&
          Object.keys(store_data.new_access_points).length)
        ? true
        : false;
    },
    controller() {
      if (this.acuModel) {
        return this.acu_controllers[this.acuModel];
      } else {
        return null;
      }
    },
    access_points() {
      return this.$store.state.accessPoint.edit_acu_data.access_points;
    },
    getReaders() {
      return (access_points) => {
        let count = 0;
        if (access_points.length) {
          access_points.map((a) => {
            count += a.readers.length;
          });
        }
        return count;
      };
    },
    ext_devices() {
      return this.$store.state.accessPoint.edit_acu_data.ext_devices;
    },
    getInputs() {
      return (type) => {
        let count = 0;
        if (this.access_points.length) {
          for (let i = 0; i < this.access_points.length; i++) {
            if (
              this.access_points[i].resources &&
              Object.keys(this.access_points[i].resources).length
            ) {
              const resources = this.access_points[i].resources;
              for (const key in resources) {
                if (this.reader_types[key] === type) {
                  count += 1;
                }
              }
            }
          }
        }
        return count;
      };
    },
    getWifiEthernet() {
      return (type) => {
        let count = 0;

        if (this.ext_devices.length) {
          for (let i = 0; i < this.ext_devices.length; i++) {
            if (this.ext_devices[i].interface && type) {
              count += 1;
            } else if (!this.ext_devices[i].interface && !type) {
              count += 1;
            }
          }
        }
        return count;
      };
    },
    reader_types() {
      return this.$store.state.accessPoint.reader_types;
    },
  },

  data() {
    return {
      main_info: {},
      acu_data: this.$store.state.accessPoint.edit_acu_data,
    };
  },
  watch: {
    main_info: {
      handler: function (data) {
        if (Object.keys(data).length) {
          this.$store.commit("accessPoint/UPDATE_MAIN", data);
        }
      },
      deep: true,
    },
  },
  created() {
    this.main_info = { ...this.$store.state.accessPoint.edit_acu_data };
  },
  components: {
    vSelect,
  },
};
</script>

<style lang="scss">
.acu_reader_info {
  flex: 0 0 100%;
  max-width: 100%;

  table {
    width: 100%;
    border: 1px solid #cccccc;
    padding: 11px;
    border-radius: 5px;

    td:nth-child(2) {
      text-align: center;
    }

    tr {
      width: 100%;
      display: flex;
      justify-content: space-between;
      text-align: left;

      td {
        flex: 0 0 50%;
        text-align: left;
        padding-bottom: 5px;
      }
    }
  }
}
</style>
