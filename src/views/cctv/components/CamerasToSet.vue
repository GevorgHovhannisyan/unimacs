<template>
  <div class="cameras_to_set">
    <MultiTable
      :items="cameras"
      :headers="cameras_headers"
      @input="checkItem($event)"
      @setAll="setAllChecked($event)"
      :actions="false"
    />

    <div class="camera_to_set_btn flex items-center mt-4 justify-end">
      <vs-button class="unimacs_cancel_button" @click="$emit('closePopup')">
        Cancel
      </vs-button>
      <vs-button class="unimacs_button ml-5" @click="addCamerasToSet">
        Submit
      </vs-button>
    </div>
  </div>
</template>

<script>
import MultiTable from "./MultiTable";
export default {
  props: {
    camera_list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      cameras_headers: [
        { name: "Chanel #", key: "service_id" },
        { name: "Name", key: "name" },
        { name: "Device", key: "device_type_name" },
        { name: "IP Address", key: "connection_type" },
      ],
      cameras: [],
    };
  },
  methods: {
    addCamerasToSet() {
      let mainCamera;
      const camera_set_cameras = this.edit_set_data.camera_set_cameras;
      if (camera_set_cameras && camera_set_cameras.length) {
        mainCamera = camera_set_cameras.find((c) => c.main);
      }
      const cameras = this.selectedsCameras.map((item) => {
        let main = false;
        if (mainCamera) {
          main = item.id === mainCamera.id ? true : false;
        }
        return { id: item.id, main };
      });
      const payload = {
        id: this.edit_set_data.id,
        name: this.edit_set_data.name,
        before_event: this.edit_set_data.before_event,
        after_event: this.edit_set_data.after_event,
        cameras,
      };

      this.$store.dispatch("cctv/updateSet", payload).then(() => {
        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Cameras added to set",
        });
        this.$emit("closePopup");
        this.$parent.$parent.fetchCameras();
        this.$store.dispatch("cctv/fetchSet", this.edit_set_data.id);
        // this.$store.dispatch("cctv/fetchCctvSets");
      });
    },
    checkItem(data) {
      this.cameras = JSON.parse(JSON.stringify(data));
      // let find = this.cameras.find((a) => a.id == item.id);
      // if (find) {
      //   find.selected = event;
      // }

      // this.$store.commit("department/CHECK_ITEM", { event, item });
    },
    setAllChecked(event) {
      this.cameras.map(function (x) {
        x.selected = event;
      });

      // this.$store.commit("department/SET_ALL_CHECKED", { event: value });
    },
  },
  created() {
    this.cameras = JSON.parse(JSON.stringify(this.camera_list));
  },
  watch: {
    camera_list() {
      this.cameras = JSON.parse(JSON.stringify(this.camera_list));
    },
  },
  computed: {
    selectedsCameras() {
      return this.cameras.length ? this.cameras.filter((i) => i.selected) : [];
    },
    edit_set_data() {
      return this.$store.state.cctv.edit_set_data;
    },
  },
  components: {
    MultiTable,
  },
};
</script>

<style>
.cameras_to_set {
  width: 100%;
}
</style>
