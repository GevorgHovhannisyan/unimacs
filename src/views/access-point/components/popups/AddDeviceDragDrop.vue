<template>

  <div class="vx-row mt-5">
    <div class="vx-col md:w-1/2 b_right">
      <h3>Devices list</h3>

      <div
        class="exp_boards mt-5"
        v-for="(device, index) in filterDevice"
        :key="index"
      >
        <h4>
          {{ device.title }}
        </h4>

        <div
          class="device_item"
          v-for="(item, index) in device.devices"
          :key="index"
           style="cursor: pointer"
          @dblclick.stop="moveDevice(device.title, item)"
        >
          <span>
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <div class="vx-col md:w-1/2">
      <h3 style="margin-bottom: 50px">Selected</h3>
      <div
        class="selected_devices"
        v-for="(selected, index) in selected_devices"
        :key="index"
        @dblclick.stop="deleteDevice(selected.title, selected.device)"
      >
        <span>
          {{ selected.device }}
        </span>
      </div>
    </div>
    <div class="vx-col w-full dev_block mt-4">
      <vs-button @click="saveDeviceLists" class="unimacs_button">
        Submit
      </vs-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    popupActive: {
      type: Boolean,
    },
  },
  watch: {
    popupActive(val) {
      this.selected_devices = [];
    },
  },
  computed: {},
  data() {
    return {
      popup: false,
      devices: [],
      filterDevice: [],
      selected_devices: [],
    };
  },
  methods: {
    saveDeviceLists() {
      // this.$root.$emit("addDevices", this.selected_devices);
      this.$parent.$parent.createDevices(this.selected_devices);
      this.selected_devices = [];
      this.$parent.$parent.addDevicePopup = false;
    },
    moveDevice(title, device) {
      // const deviceIndex = this.filterDevice.findIndex((u) => u.title == title);

      // const index = this.filterDevice[deviceIndex].devices.findIndex(
      //   (dev) => dev == device
      // );
      this.selected_devices.push({ title: title, device: device });
      // this.filterDevice[deviceIndex].devices.splice(index, 1);
    },
    deleteDevice(title, device) {
      const deviceIndex = this.selected_devices.findIndex(
        (u) => u.device == device
      );
      // const saveIndex = this.filterDevice.findIndex((u) => u.title == title);
      // this.filterDevice[saveIndex].devices.push(device);
      this.selected_devices.splice(deviceIndex, 1);
    },
  },
  created() {
    // this.popup = this.popupActive;
    this.$store.dispatch("accessPoint/getDeviceData").then((res) => {
      const boards = res.data.expansion_boards;
      let filter = [];
      if (boards && Object.keys(boards).length) {
        Object.keys(boards).forEach((name) => {
          if (Object.keys(boards[name]).length) {
            let obj = {};
            obj.title = name.split("_").join(" ");
            obj.devices = [];
            Object.keys(boards[name]).forEach((key) => {
              obj.devices.push(key);
            });
            filter.push(obj);
          }
        });
      }

      this.filterDevice = filter;
      this.devices = filter;

      this.$vs.loading.close();
    });
  },
  components: {},
};
</script>

<style scoped>
.desc_text {
  font-size: 90%;
  margin-left: 15px;
}

.dev_block {
  float: right;
  display: flex;
  flex-direction: row-reverse;
}
</style>