<template>
  <div>
    <label for="" class="vs-input--label mt-4">Interface Type</label>

    <v-select
      v-model="device.interface"
      :options="interfaces"
      class="select_padding"
      name="port"
      placeholder="Interface Type"
      :reduce="(type) => type.id"
      :selectable="(option) => !option.disabled"
      :dir="$vs.rtl ? 'rtl' : 'ltr'"
    />
    <form autocomplete="new-password">
      <div class="vx-row" v-if="'interface' in device">
        <div class="vx-col w-1/3">
          <vs-input
            label="Name"
            class="w-full mt-3"
            name="name"
            v-model="device.name"
            v-validate="'required'"
          />
        </div>
        <div class="vx-col w-1/3 mt-3">
          <label for="" class="vs-input--label mt-4">Protocol</label>

          <v-select
            v-model="device.protocol"
            :options="protocoles"
            autocomplete="new-password"
            class="select_padding"
            name="port"
            placeholder="Protocol"
            :reduce="(type) => type.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
        <div class="vx-col w-1/3 mt-3">
          <label for="" class="vs-input--label mt-4">Port</label>

          <v-select
            v-model="device.port"
            :options="port_types"
            class="select_padding"
            name="port"
            autocomplete="new-password"
            placeholder="Port"
            :reduce="(type) => type.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
        <div class="vx-col w-1/3 mt-3" v-if="device.interface === 0">
          <label for="" class="vs-input--label mt-4">Baud rate</label>

          <v-select
            v-model="device.baud_rate"
            :options="baud_rates"
            class="select_padding"
            autocomplete="new-password"
            name="port"
            placeholder="Baud rate"
            :reduce="(type) => type.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
        <div class="vx-col w-1/3 mt-3" v-if="device.interface === 0">
          <label for="" class="vs-input--label mt-4">Address</label>

          <v-select
            v-model="device.address"
            :options="addresses"
            class="select_padding"
            name="addresss"
            autocomplete="new-password"
            placeholder="Address"
            :reduce="(type) => type.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
        <div class="vx-col w-1/3 mt-3" v-if="device.interface !== 0">
          <vs-input
            class="w-full"
            label="Address"
            name="address"
            v-model="device.address"
            v-validate="'validateIP'"
          />
          <span class="text-danger text-sm" v-show="errors.has('address')">{{
            errors.first("address")
          }}</span>
        </div>
      </div>
    </form>

    <div class="ext_device_block">
      <vs-button @click="addDevice" class="unimacs_button"
        >{{ buttonText }} Extention Device
      </vs-button>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { ValidateIPaddress } from "@/functions/IP_validator.js";
export default {
  computed: {
    active_device() {
      return this.$store.state.accessPoint.active_device;
    },
    acu_models() {
      return this.$store.state.accessPoint.acu_models;
    },
    edit_data() {
      return this.$store.state.accessPoint.edit_acu_data;
    },
    new_ext_device() {
      return this.$store.state.accessPoint.edit_acu_data.new_ext_device;
    },
    acuModel() {
      return this.$store.state.accessPoint.edit_acu_data.model;
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
  watch: {
    active_device(device) {
      this.disableIfFloor(this.isFloor);

      let active_dev;
      if (this.active_device.includes("ext_")) {
        active_dev = +this.active_device.split("_", 2)[1];
      }
      let ext_device;
      if (Number.isInteger(+active_dev)) {
        this.buttonText = "Update ";
        ext_device = this.edit_data.ext_devices.find(
          (a) => a.id == +active_dev
        );
        this.device = JSON.parse(JSON.stringify(ext_device));
      } else {
        this.buttonText = "Add ";
        if (
          this.new_ext_device &&
          this.new_ext_device[device] &&
          !this.new_ext_device[device].deleted
        ) {
          this.device = JSON.parse(JSON.stringify(this.new_ext_device[device]));
        } else if (this.new_ext_device[device].deleted) {
          ext_device = this.edit_data.ext_devices.find(
            (a) => a.save_id == device
          );
          this.device = JSON.parse(JSON.stringify(ext_device));

          this.buttonText = "Update ";
        }
      }
    },
    device: {
      handler: function (data, oldVal) {
        this.$store.commit("accessPoint/SET_DEVICE_INFO", data);
      },
      deep: true,
    },
  },
  data() {
    return {
      buttonText: null,
      device: {
        name: null,
        port: null,
        boud_rate: null,
        address: null,
        board: null,
        protocol: null,
        interface: null,
        baud_rate: null,
      },
      port_types: [
        {
          id: 1,
          label: "1",
        },
        {
          id: 2,
          label: "2",
        },
        {
          id: 3,
          label: "3",
        },
        {
          id: 4,
          label: "4",
        },
      ],
      baud_rates: [
        {
          id: 2400,
          label: 2400,
        },
        {
          id: 9600,
          label: 9600,
        },
        {
          id: 19200,
          label: 19200,
        },
        {
          id: 28800,
          label: 28800,
        },
        {
          id: 38400,
          label: 38400,
        },
        {
          id: 57600,
          label: 57600,
        },
      ],
      protocoles: [
        {
          id: "OSDPe",
          label: "OSDPe",
        },
        {
          id: "OSDP",
          label: "OSDP",
        },
        {
          id: "Default",
          label: "Default",
        },
      ],
      interfaces: [
        {
          id: 0,
          label: "RS485",
        },
        {
          id: 1,
          label: "Ethernet",
        },
      ],
      addresses: [],
    };
  },
  methods: {
    addDevice() {
      const acu_id = this.$store.state.accessPoint.edit_acu_data.id;

      let active_dev;

      if (this.active_device.includes("ext_")) {
        active_dev = +this.active_device.split("_", 2)[1];
      }

      if (Number.isInteger(+active_dev)) {
        this.$store
          .dispatch("accessPoint/updateDevices", this.device)
          .then((res) => {
            if (res.data.message) {
              this.$vs.notify({
time: 7000,
                color: "success",
                title: res.data.message,
              });
            } else {
              let ext_device;

              ext_device = this.edit_data.ext_devices.find(
                (a) => a.id == +res.data.id
              );

              this.device = { ...ext_device };

              this.$vs.notify({
time: 7000,
                color: "success",
                title: "Extention device updated",
              });
            }
            this.$vs.loading.close();
          });
      } else {
        const obj = {
          name: this.device.name,
          acu: acu_id,
          ext_board: this.device.board,
          baud_rate: this.device.baud_rate,
          address: this.device.address,
          port: this.device.port,
          protocol: this.device.protocol,
          interface: this.device.interface,
        };

        if (
          this.new_ext_device[this.active_device] &&
          !this.new_ext_device[this.active_device].deleted
        ) {
          this.$store.dispatch("accessPoint/addDevices", obj).then((res) => {
            this.buttonText = "Update ";

            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Extention device created",
            });
            let ext_device;

            ext_device = this.edit_data.ext_devices.find(
              (a) => a.id == +res.data.id
            );
            this.device = { ...ext_device };

            this.$parent.changeExtName(obj);
            this.$vs.loading.close();
          });
        } else if (
          this.new_ext_device[this.active_device] &&
          this.new_ext_device[this.active_device].deleted
        ) {
          obj.id = this.device.id;
          this.$store.dispatch("accessPoint/updateDevices", obj).then((res) => {
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Extention device updated",
            });
            let ext_device;
            ext_device = this.edit_data.ext_devices.find(
              (a) => a.id == +obj.id
            );

            this.device = { ...ext_device };

            this.$vs.loading.close();
          });
        }
      }
    },
    disableIfFloor(floor) {
      let findInterface = this.interfaces.find((i) => i.id === 1);
      if (floor) {
        findInterface.disabled = true;
      } else {
        findInterface.disabled = false;
      }
    },
  },
  created() {
    this.disableIfFloor(this.isFloor);
    let active_dev;

    if (this.active_device.includes("ext_")) {
      active_dev = +this.active_device.split("_", 2)[1];
    }

    let ext_device;

    let addr = [];

    for (let i = 1; i < 255; i++) {
      addr.push({ id: i, label: i });
    }
    this.addresses = addr;

    if (Number.isInteger(+active_dev)) {
      this.buttonText = "Update ";
      ext_device = this.edit_data.ext_devices.find((a) => a.id == +active_dev);

      this.device = JSON.parse(JSON.stringify(ext_device));
    } else {
      this.buttonText = "Add ";

      if (
        this.edit_data.new_ext_device &&
        this.edit_data.new_ext_device[this.active_device] &&
        !this.edit_data.new_ext_device[this.active_device].deleted
      ) {
        this.device = JSON.parse(
          JSON.stringify(this.edit_data.new_ext_device[this.active_device])
        );
      } else if (this.edit_data.new_ext_device[this.active_device].deleted) {
        ext_device = this.edit_data.ext_devices.find(
          (a) => a.ext_board == this.active_device
        );
        this.device = JSON.parse(JSON.stringify(ext_device));
      }
    }
    this.$validator.extend("validateIP", {
      getMessage: (field) => field + " not valid",
      validate: (value) => {
        return ValidateIPaddress(value);
      },
    });
  },
  components: {
    vSelect,
  },
};
</script>

<style scoped>
.ext_device_block {
  position: absolute;
  bottom: 10px;
  right: 15px;
}
</style>
