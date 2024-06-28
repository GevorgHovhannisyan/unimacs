<template>
  <div class="edit_device_form">
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
          disabled
          class="select_padding"
          placeholder="Connection type"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
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
          class="w-full"
          label="IP / Domain"
          name="ip_domain"
          autocomplete="new-password"
          v-model="device_data.domain"
          v-validate="'required|validateIP'"
        />

        <span class="text-danger text-sm" v-show="errors.has('ip_domain')">{{
          errors.first("ip_domain")
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
          color="success"
          class="w-full"
          @click="testConnection"
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
          @click="$emit('updateDevice', device_data)"
        >
          Submit
        </vs-button>
        <vs-button color="danger" @click="$emit('closePopup')">Cancel </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
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
  watch: {
    item(data) {
      this.device_data = JSON.parse(JSON.stringify(data));
    },
    device_data: {
      handler: function (device_data) {
        this.testResult = "";
      },
      deep: true,
    },
  },
  components: {
    vSelect,
  },
  methods: {
    testConnection() {
      this.$store
        .dispatch("cctv/testConnection", this.device_data)
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
      if (
        !deviceData.name ||
        !deviceData.connection_type ||
        !deviceData.username ||
        !deviceData.password ||
        !deviceData.device_type
      ) {
        return false;
      }

      // Check the connection type and the corresponding fields
      if (deviceData.connection_type === "Cloud") {
        if (!deviceData.serial_number) {
          return false;
        }
      } else {
        if (!deviceData.ip_domain || !deviceData.port) {
          return false;
        }
      }

      return true;
    },
  },
};
</script>

<style lang="scss" >
// @import "../style.scss";
</style>
