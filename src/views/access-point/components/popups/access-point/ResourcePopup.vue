<template>
  <div class="vx-row mt-5">
    <div class="vx-col md:w-1/2 b_right">
      <h3 style="text-align: center">Resources list</h3>

      <div class="exp_boards mt-5" v-for="(device, index) in filterDevice" :key="index">

        <h4 v-if="device.devices.length">
          {{ device.title }}
        </h4>

        <div class="device_item" v-for="(item, index) in device.devices" :key="index" style="cursor: pointer"
          @dblclick.stop="moveDevice(device.title, item)">
          <span>
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <div class="vx-col md:w-1/2">
      <h3 style="margin-bottom: 50px; text-align: center">Selected</h3>
      <div class="selected_devices" v-for="(selected, index) in selected_resources" :key="index"
        @dblclick.stop="deleteDevice(selected.title, selected.device)">
        <span>
          {{ selected.device }}
        </span>
      </div>
    </div>
    <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse; padding-top: 25px;">
      <vs-button @click="saveDeviceLists" class="unimacs_button">
        Submit
      </vs-button>
    </div>
  </div>
</template>

<script>
import { validateTypesCreate } from "@/functions/acuValidator";

export default {
  props: {
    popupActive: {
      type: Boolean,
    },
    resources: {
      type: Array,
    },
    type: {
      type: String,
    },
  },
  watch: {
    popupActive(val) {
      this.popup = val;
      this.$emit("popup", val);
    },
    popup(val) {
      this.$emit("popup", val);
    },
  },
  computed: {
    acu_model() {
      return this.$store.state.accessPoint.acu_model.controllers;
    },
    acu_data() {
      return this.$store.state.accessPoint.acu_data;
    },
    active_point() {
      return this.$store.state.accessPoint.active_point;
    },
  },
  data() {
    return {
      popup: false,
      filterDevice: [],
      selected_resources: [],

      saved_devices: {
        saved_devices: [],
        saved_selected_devices: [],
      },
    };
  },
  methods: {
    saveDeviceLists() {
      this.popup = false;
      if (this.type === "add") {
        this.$parent.$parent.addResources(this.selected_resources);
      } else if (this.type === "update") {
        this.$parent.$children[0].$parent.$parent.createResources(
          this.selected_resources
        );
      }

      this.selected_resources = [];
    },
    moveDevice(title, device) {
      const findAcPoint = this.acu_data.access_points[this.active_point];
      if (findAcPoint.real_type == "turnstile_one_side") {
        if (
          device === "RFID" ||
          device === "KEYPAD" ||
          device === "FINGER" ||
          device === "FACE"
        ) {
          const result = validateTypesCreate(
            this.acu_data,
            this.active_point,
            this.selected_resources
          );
          if (!result) {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Can't add more than one reader",
            });

            return false;
          }
        }
      }
      let filter = this.selected_resources.filter(s => s.title === 'readers')
      if (title == "readers" && filter.length && filter.length > 1) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Can't add more readers",
        });

        return false
      }
      const deviceIndex = this.filterDevice.findIndex((u) => u.title == title);

      const index = this.filterDevice[deviceIndex].devices.findIndex(
        (dev) => dev == device
      );
      this.selected_resources.push({ title: title, device: device });

      if (title != "readers") {
        this.filterDevice[deviceIndex].devices.splice(index, 1);
      }
      let new_readers_length = 0;
      if (findAcPoint.readers && Object.keys(findAcPoint.readers).length) {
        let lengthOfReader = 0

        for (const key in findAcPoint.readers) {
          const reader = findAcPoint.readers[key];
          if (reader.data && reader.data.title === 'readers') {
            lengthOfReader++
          }
        }
        new_readers_length = lengthOfReader
        // new_readers_length = Object.keys(findAcPoint.readers).length
      }

      filter = this.selected_resources.filter(s => s.title === 'readers')
      if (title == "readers" && (filter.length + new_readers_length > 1)) {
        const deviceIndex = this.filterDevice.findIndex((u) => u.title == 'readers');
        this.filterDevice.splice(deviceIndex, 1);

      }
    },

    deleteDevice(title, device) {
      const deviceIndex = this.selected_resources.findIndex(
        (u) => u.device == device
      );

      const saveIndex = this.filterDevice.findIndex((u) => u.title == title);

      if (title != "readers") {
        this.filterDevice[saveIndex].devices.push(device);
      }
      this.selected_resources.splice(deviceIndex, 1);

      const filter = this.selected_resources.filter(s => s.title === 'readers')
      if (title == "readers" && filter.length < 2) {
        const resource_list = this.resources.find(t => t.title === 'readers')
        this.filterDevice.unshift(resource_list)
      }


    },
  },
  created() {
    this.popup = this.popupActive;

    this.filterDevice = JSON.parse(JSON.stringify(this.resources));

    let new_readers_length = 0;
    let selected_length = 0
    const accessPoint = this.acu_data.access_points[this.active_point];
    if (accessPoint) {

      if (accessPoint.readers && Object.keys(accessPoint.readers).length) {
        let lengthOfReader = 0

        for (const key in accessPoint.readers) {
          const reader = accessPoint.readers[key];
          if (reader.data && reader.data.title === 'readers') {
            lengthOfReader++
          }
        }
        new_readers_length = lengthOfReader
      }
    }

    let filter = this.selected_resources.filter(s => s.title === 'readers')
    selected_length = filter.length

    let sumCount =
      new_readers_length +
      selected_length;


    if (sumCount > 1) {
      const devIndex = this.filterDevice.findIndex((u) => u.title == 'readers');
      this.filterDevice.splice(devIndex, 1);
    }

    this.$vs.loading.close();
  },
  components: {},
};
</script>

<style scoped>
.desc_text {
  font-size: 90%;
  margin-left: 15px;
}
</style>
