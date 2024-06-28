<template>
  <div class="add_device_form">
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-input
          label="Name"
          v-model="device_data.name"
          @input="checkLength(device_data.name)"
          class="w-full"
          name="Name"
          v-validate="'required'"
        />
      </div>

      <div class="vx-col w-full mt-2">
        <label for="" class="vs-input--label mt-4">Connection type</label>
        <v-select
          v-model="device_data.connection_type"
          :options="connection_types"
          autocomplete="new-password"
          class="select_padding"
          placeholder="Connection type"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div
        class="vx-col w-full mt-2"
        v-if="device_data.connection_type === 'IP/Domain'"
      >
        <vs-input
          class="w-full"
          label="IP / Domain"
          name="domain"
          autocomplete="new-password"
          v-model="device_data.domain"
          v-validate="'required'"
        />

        <span class="text-danger text-sm" v-show="errors.has('domain')">{{
          errors.first("domain")
        }}</span>
      </div>

      <div
        class="vx-col w-full mt-2"
        v-if="device_data.connection_type === 'Cloud'"
      >
        <vs-input
          v-model="device_data.serial_number"
          label="Serial number"
          class="w-full"
          autocomplete="new-password"
          name="Serial number"
        />
      </div>
      <div class="vx-col w-full mt-2">
        <label for="" class="vs-input--label mt-4">Device type</label>
        <v-select
          v-model="device_data.device_type"
          :options="device_types"
          autocomplete="new-password"
          class="select_padding"
          placeholder="Device type"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div
        class="vx-col w-full mt-2"
        v-if="device_data.connection_type === 'IP/Domain'"
      >
        <vs-input
          v-model="device_data.port"
          label="Port"
          class="w-full"
          name="Port"
        />
      </div>
      <div class="vx-col w-full mt-2">
        <vs-input
          v-model="device_data.username"
          label="Username"
          class="w-full"
          autocomplete="new-password"
          name="Username"
        />
      </div>
      <div class="vx-col w-full mt-2">
        <vs-input
          v-model="device_data.password"
          label="Password"
          class="w-full"
          autocomplete="new-password"
          type="password"
          name="Password"
        />
      </div>

      <div class="vx-col w-1/3 mt-5">
        <vs-button
          type="border"
          @click="testConnection"
          color="success"
          class="w-full"
        >
          Test
        </vs-button>
      </div>

      <div class="vx-col w-2/3 mt-5">
        <div class="w-full test_ok">Test {{ testResult }}</div>
      </div>
    </div>

    <div class="vx-row mt-5">
      <div
        class="vx-col w-full mt-3"
        style="display: flex; flex-direction: row-reverse"
      >
        <vs-button
          class="ml-3 unimacs_button"
          :disabled="!formIsValid"
          @click="$emit('createDevice', device_data)"
        >
          Submit
        </vs-button>
        <vs-button color="danger"  @click="$emit('closePopup')">Cancel </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { isCreateCctvValid } from "../utils/utils";
export default {
  props: {
    popupActive: {
      type: Boolean,
    },
  },
  data() {
    return {
      connection_types: [
        { id: "Cloud", label: "Cloud" },
        { id: "IP/Domain", label: "IP / Domain" },
      ],
      device_types: [
        { id: "nvr", label: "NVR" },
        { id: "ipc", label: "IPC" },
      ],
      device_data: {
        name: null,
        connection_type: "Cloud",
        domain: null,
        serial_number: null,
        port: null,
        username: null,
        password: null,
        device_type: "nvr",
      },
      testResult: "",
    };
  },
  components: {
    vSelect,
  },
  methods: {
    initValues() {
      this.device_data = {
        name: null,
        connection_type: "Cloud",
        domain: null,
        serial_number: null,
        port: null,
        username: null,
        password: null,
        device_type: "nvr",
      };
    },
    testConnection() {
      const data = this.device_data;
      const payload = {
        name: data.name,
        connection_type: data.connection_type,
        username: data.username,
        password: data.password,
        device_type: data.device_type,
      };

      if (data.connection_type === "Cloud") {
        payload.serial_number = data.serial_number;
      } else {
        payload.domain = data.domain;
        payload.port = data.port;
      }

      this.$store
        .dispatch("cctv/testConnection", payload)
        .then(() => {
          this.testResult = " success";
        })
        .catch((error) => {
          this.testResult = " failed";
        });
    },
    checkLength(value) {
      this.device_data.name = value.slice(0, 32);
    },
  },
  computed: {
    formIsValid() {
      const deviceData = this.device_data;

      return isCreateCctvValid(deviceData);
    },
  },
  watch: {
    popupActive(val) {
      if (!val) {
        this.initValues();
      }
    },
    device_data: {
      handler: function (device_data) {
        this.testResult = "";
      },
      deep: true,
    },
  },
  created() {},
};
</script>

<style lang="scss" >
// @import "../style.scss";
</style>
