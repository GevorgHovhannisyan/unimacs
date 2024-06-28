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
    <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse; margin-top: 24px">
      <vs-button @click="saveDeviceLists" class="unimacs_button">
        Submit
      </vs-button>
    </div>
  </div>
</template>

<script>
import { validateTypes } from "@/functions/acuValidator";

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
    active_point() {
      return this.$store.state.accessPoint.edit_active_point;
    },
    acu_data() {
      return this.$store.state.accessPoint.edit_acu_data;
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
      let findAcPoint;
      let findType;
      if (Number.isInteger(+this.active_point)) {
        findAcPoint = this.acu_data.access_points.find(
          (a) => a.id == this.active_point
        );
        findType = findAcPoint.type;
      } else {
        findAcPoint = this.acu_data.new_access_points[this.active_point]
        findType = findAcPoint.real_type;
      }
      if (findType == "turnstile_one_side") {
        if (
          device === "RFID" ||
          device === "KEYPAD" ||
          device === "FINGER" ||
          device === "FACE"
        ) {
          const result = validateTypes(
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
      let readers_length = 0
      let new_readers_length = 0;
      let selected_length = 0
      const accessPoint = this.acu_data.access_points.find(acu => acu.id == this.active_point)
      if (accessPoint) {
        const count_arr = accessPoint.readers.map(r => {
          if (!r.deleted) {
            return r
          }
        })
        readers_length = count_arr.length
        let lengthOfReader = 0
        if (accessPoint.new_readers && Object.keys(accessPoint.new_readers).length) {
          for (const key in accessPoint.new_readers) {
            const reader = accessPoint.new_readers[key];
            if (reader.data && reader.data.title === 'readers') {
              lengthOfReader++
            }
          }
          new_readers_length = lengthOfReader
        }
      }

      let filter = this.selected_resources.filter(s => s.title === 'readers')
      selected_length = filter.length

      let sumCount = readers_length +
        new_readers_length +
        selected_length;


      const deviceIndex = this.filterDevice.findIndex((u) => u.title == title);
      const index = this.filterDevice[deviceIndex].devices.findIndex(
        (dev) => dev == device
      );
      this.selected_resources.push({ title, device });


      filter = this.selected_resources.filter(s => s.title === 'readers')
      selected_length = filter.length
      if (accessPoint) {
        const count_arr = accessPoint.readers.map(r => {
          if (!r.deleted) {
            return r
          }
        })
        readers_length = count_arr.length
        if (accessPoint.new_readers && Object.keys(accessPoint.new_readers).length) {
          let lengthOfReader = 0

          for (const key in accessPoint.new_readers) {
            const reader = accessPoint.new_readers[key];
            if (reader.data && reader.data.title === 'readers') {
              lengthOfReader++
            }
          }
          new_readers_length = lengthOfReader
        }
      }


      sumCount = readers_length +
        new_readers_length +
        selected_length;


      if (sumCount > 1 && title === 'readers') {
        const devIndex = this.filterDevice.findIndex((u) => u.title == 'readers');
        this.filterDevice.splice(devIndex, 1);
      }

      if (title != "readers") {
        this.filterDevice[deviceIndex].devices.splice(index, 1);
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
      const hasReader = this.filterDevice.find(t => t.title === 'readers')
      if (title == "readers" && filter.length < 3 && !hasReader) {
        const resource_list = this.resources.find(t => t.title === 'readers')
        this.filterDevice.unshift(resource_list)
      }


    },
  },
  created() {
    this.popup = this.popupActive;
    this.filterDevice = JSON.parse(JSON.stringify(this.resources));

    let readers_length = 0;
    let new_readers_length = 0;
    let selected_length = 0;
    const accessPoint = this.acu_data.access_points.find(acu => acu.id == this.active_point)
    if (accessPoint) {
      const count_arr = accessPoint.readers.map(r => {
        if (!r.deleted) {
          return r
        }
      })
      readers_length = count_arr.length
      if (accessPoint.new_readers && Object.keys(accessPoint.new_readers).length) {
        let lengthOfReader = 0
        for (const key in accessPoint.new_readers) {
          const reader = accessPoint.new_readers[key];
          if (reader.data && reader.data.title === 'readers') {
            lengthOfReader++
          }
        }
        new_readers_length = lengthOfReader
      }
    }

    let filter = this.selected_resources.filter(s => s.title === 'readers')
    selected_length = filter.length;
    let sumCount = readers_length +
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
