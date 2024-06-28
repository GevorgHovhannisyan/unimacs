<template>
  <div>
    <!-- <span class="mt-5" style="font-weight: bold">ACU S/N: "N/A" </span> -->
    <div class="vx-row mt-3">
      <div class="vx-col md:w-full">
        <vs-input
          class="w-full"
          label="Name"
          v-validate="'required'"
          name="name"
          v-model="main_info.name"
        />
        <span class="text-danger text-sm" v-show="errors.has('name')">{{
          errors.first("name")
        }}</span>
      </div>
      <div class="vx-col w-full mt-3">
        <vs-input
          class="w-full"
          label="Description"
          name="description"
          v-model="main_info.description"
        />
      </div>
      <div class="vx-col md:w-2/3 mt-3">
        <label for="" class="vs-input--label">Model</label>
        <v-select
          v-model="main_info.model"
          :options="models"
          class="select_padding"
          name="model"
          v-validate="'required'"
          placeholder="Model"
          :reduce="(model) => model.label"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :selectable="(option) => !option.disabled"
        />

        <span class="text-danger text-sm" v-show="errors.has('model')">{{
          errors.first("model")
        }}</span>
      </div>

      <div class="vx-col md:w-1/3 mt-5">
        <vs-checkbox class="mb-4 mt-5" v-model="main_info.elevator_mode"
          >Elevator mode</vs-checkbox
        >
      </div>

      <div class="acu_reader_info mt-3 vx-col w-full">
        <table>
          <tr>
            <td>Outputs:</td>
            <td>{{ controller ? controller.outputs : "0" }} / 0</td>
          </tr>
          <tr>
            <td>Inputs:</td>
            <td>{{ controller ? controller.inputs : "0" }} / 0</td>
          </tr>
          <tr>
            <td>Readers</td>
            <td>
              {{
                controller && controller.readers
                  ? Object.keys(controller.readers).length
                  : 0
              }}
              / 0
            </td>
          </tr>
          <tr>
            <td>Wifi:</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Ethernet:</td>
            <td>0</td>
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
    controller() {
      if (this.acuModel) {
        return this.acu_controllers[this.acuModel];
      } else {
        return null;
      }
    },
    acuModel() {
      return this.$store.state.accessPoint.acu_data.model;
    },
  },
  data() {
    return {
      main_info: {},
    };
  },
  watch: {
    main_info: {
      handler: function (data) {
        if (Object.keys(data).length) {
          this.$store.commit("accessPoint/SET_MAIN", data);
        }
      },
      deep: true,
    },
  },
  created() {
    this.main_info = { ...this.$store.state.accessPoint.acu_data };
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
