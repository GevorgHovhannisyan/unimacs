<template>
  <div>
    <vs-popup
      class="holamundo set_popup"
      title="Add cameras to the set"
      :active.sync="popupActive"
    >
      <AddCamerasToSet
        :camera_list="camera_list"
        @closePopup="popupActive = false"
      />
    </vs-popup>
    <vs-popup
      class="holamundo live_preview"
      title="Preview"
      :active.sync="showPopup"
    >
      <LiveStream
        :cameraId="cameraId"
        :cameraName="cameraName"
        v-if="showPopup"
        monitor="device"
      />
    </vs-popup>
    <vs-popup
      class="holamundo camera_delete"
      title="Confirm Delete"
      :active.sync="deleteCameraPop"
    >
      <div class="info">Do you want to delete {{ cameraItem.name }}?</div>
      <div class="flex items-center mt-6 justify-end">
        <vs-button
          class="unimacs_cancel_button"
          @click="deleteCameraPop = false"
        >
          Cancel
        </vs-button>
        <vs-button class="unimacs_button ml-5" @click="deleteCamera">
          Submit
        </vs-button>
      </div>
    </vs-popup>
    <vs-popup
      class="holamundo"
      title="Change Name"
      :active.sync="updateCameraPop"
    >
      <div>
        <vs-input
          v-model="cameraNewName"
          label-placeholder="Camera name"
          class="w-full"
        />

        <div class="camera_to_set_btn flex items-center mt-6 justify-end">
          <vs-button
            class="unimacs_cancel_button"
            @click="updateCameraPop = false"
          >
            Cancel
          </vs-button>
          <vs-button
            class="unimacs_button ml-5"
            :disabled="!cameraNewName"
            @click="changeCameraName"
          >
            Submit
          </vs-button>
        </div>
      </div>
    </vs-popup>
    <div class="vx-row">
      <div class="vx-col w-1/2">
        <vs-input
          label="Name"
          v-model="edited_set.name"
          @input="checkLength(edited_set.name)"
          class="w-full"
          :disabled="!edit_set_data"
          placeholder="Name"
          name="Name"
        />
      </div>

      <div class="vx-col w-1/2">
        <vs-input
          label="Description"
          v-model="edited_set.description"
          placeholder="Description"
          :disabled="!edit_set_data"
          class="w-full"
          name="Description"
        />
      </div>
      <div class="vx-col w-1/3 mt-3">
        <label for="" class="vs-input--label mt-4">Access point</label>
        <!-- :selectable="(option) => !option.disabled" -->
        <v-select
          v-model="edited_set.access_point"
          :options="access_points"
          autocomplete="new-password"
          :disabled="!edit_set_data"
          class="select_padding"
          :clearable="false"
          placeholder="Access point"
          label="name"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/3 mt-3">
        <vs-input
          label="Before the event,s"
          v-model="edited_set.before_event"
          :disabled="!edit_set_data"
          @input="checkNumber(edited_set.before_event, 'before_event')"
          class="w-full"
          placeholder="Before the event,s"
          name="Before the event,s"
        />
      </div>
      <div class="vx-col w-1/3 mt-3">
        <vs-input
          label="After the event,s"
          v-model="edited_set.after_event"
          @input="checkNumber(edited_set.after_event, 'after_event')"
          :disabled="!edit_set_data"
          class="w-full"
          placeholder="After the event,s"
          name="After the event,s"
        />
      </div>
    </div>

    <div class="vx-row justify-end add_section">
      <div class="vx-col mt-3">
        <vs-button
          class="unimacs_button unimacs_add_new_btn"
          :disabled="!edit_set_data"
          @click="addCamerasToSet"
          v-if="edit_set_data"
        >
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" /> Add New
        </vs-button>
      </div>
    </div>
    <div v-if="edited_set && edited_set.camera_set_cameras">
      <ag-grid-vue
        ref="agGridTablee"
        :gridOptions="gridOptions"
        class="ag-theme-material w-100 my-4 ag-grid-table ap_ag_grid acu_dashboard_tbl"
        :class="{ opacity_resize: opacity_table }"
        :columnDefs="headers"
        :defaultColDef="defaultColDef"
        :rowData="edited_set.camera_set_cameras"
        colResizeDefault="shift"
        domLayout="autoHeight"
        @grid-ready="onGridReady"
        :enableRtl="$vs.rtl"
        :suppressDragLeaveHidesColumns="true"
        :suppressAggFuncInHeader="true"
        :suppressPaginationPanel="true"
        :suppressRowClickSelection="true"
        @column-moved="moved"
      >
        <!-- :animateRows="true" -->
      </ag-grid-vue>
    </div>

    <div class="vx-row justify-end">
      <div class="vx-col mt-3">
        <vs-button
          class="unimacs_button unimacs_add_new_btn"
          @click="updateSet"
          :disabled="
            !edit_set_data ||
            edited_set.after_event == 0 ||
            edited_set.before_event == 0
          "
        >
          Submit
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import CellRendererSetCameraActions from "../renderer/CellRendererSetCameraActions";
import AddCamerasToSet from "./CamerasToSet";
import CellRendererCameraView from "../renderer/CellRendererSetView";
import CellRendererCameraName from "../renderer/CellRendererCameraName";
import vSelect from "vue-select";
import LiveStream from "../../dashboard/components/LiveStream.vue";
export default {
  components: {
    AgGridVue,
    CellRendererSetCameraActions,
    CellRendererCameraView,
    CellRendererCameraName,
    vSelect,
    AddCamerasToSet,
    LiveStream,
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      gridOptions: {},
      setData: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        lockPinned: true,
      },
      components: {
        CellRendererSetCameraActions,
        CellRendererCameraView,
        CellRendererCameraName,
      },
      opacity_table: false,

      edited_set: {},

      popupActive: false,
      camera_list: [],

      deleteCameraPop: false,
      cameraItem: {},

      cameraId: null,
      showPopup: false,
      updateCameraPop: false,
      cameraName: null,
      access_points: [],
      cameraNewName: null,
    };
  },

  methods: {
    moved(event) {
      // console.log(event);
    },
    onCellClicked(cell) {
      if (cell.column.colId !== "actions") {
        this.$vs.loading({
          type: "corners",
        });
        this.$emit("updateItem", cell.data);
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
      }
    },
    onGridReady(params) {
      this.$vs.loading({
        type: "corners",
      });
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      setTimeout(() => {
        this.autoSizeAll();
      }, 100);
    },
    handleWindowResize() {
      this.autoSizeAll();
    },
    autoSizeAll() {
      this.gridApi.sizeColumnsToFit();
      setTimeout(() => {
        this.opacity_table = true;
        this.$vs.loading.close();
      }, 100);
    },
    async fetchCameras() {
      const { data } = await this.$store.dispatch("cctv/fetchCameras", {
        isSet: true,
        params: {
          hidden: false,
        },
      });
      this.camera_list = [];
      const cameras = data.map((cam) => {
        cam.selected = this.selectedCameraIds.includes(cam.id);

        if (cam.address_info && typeof cam.address_info === "string") {
          const address_info = JSON.parse(cam.address_info);
          cam.connection_type = address_info.Address;
          cam.port = address_info.Port;
        }

        if (cam.camera_device) {
          cam.device_type_name = cam.camera_devices.name;
        }

        return cam;
      });
      this.camera_list = cameras;
      return cameras;
    },
    updateSet() {
      const payload = {
        id: this.edited_set.id,
        name: this.edited_set.name,
        description: this.edited_set.description,
        before_event: this.edited_set.before_event,
        after_event: this.edited_set.after_event,
        access_point: this.edited_set.access_point,
      };
      this.$store.dispatch("cctv/updateSet", payload).then(() => {
        this.$store.dispatch("cctv/fetchCctvSets");

        this.editSetPopup = false;

        this.$vs.notify({
          time: 5000,
          color: "success",
          title: "Set was successfully updated",
        });
      });
    },
    async addCamerasToSet() {
      await this.fetchCameras();
      this.popupActive = true;
    },
    deleteCamera() {
      let selectedCameras = JSON.parse(JSON.stringify(this.seletedCameras));
      const index = selectedCameras.findIndex(
        (cam) => cam.cameras.id == this.cameraItem.id
      );
      selectedCameras.splice(index, 1);
      const selectedCamerasPayload = selectedCameras.map((cam) => {
        return { id: cam.cameras.id, main: cam.main };
      });
      const payload = {
        ...this.edit_set_data,
        cameras: selectedCamerasPayload,
      };
      this.$store.dispatch("cctv/updateSet", payload).then(() => {
        this.$vs.notify({
          time: 5000,
          color: "success",
          title: "Camera deleted from set",
        });
        this.deleteCameraPop = false;
        this.$store.dispatch("cctv/fetchSet", this.edited_set.id);
      });
    },
    bindCameras() {
      let data = JSON.parse(JSON.stringify(this.edit_set_data)) || {};
      const set_cameras = data.camera_set_cameras;
      const cameras = [];
      if (data && set_cameras && set_cameras.length) {
        for (let i = 0; i < set_cameras.length; i++) {
          const cam = set_cameras[i];
          cameras.push({ ...cam.cameras, main: cam.main });
        }
      }
      data.cameras = cameras;
      this.edited_set = data;
    },
    changeCameraName() {
      const payload = {
        id: this.cameraItem.id,
        name: this.cameraNewName,
      };

      this.$store.dispatch("cctv/updateCamera", payload).then(() => {
        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Camera name updated",
        });

        const index = this.edited_set.camera_set_cameras.findIndex(
          (c) => c.id === this.cameraItem.id
        );
        this.$store.dispatch("cctv/fetchCctvSets");
        this.edited_set.camera_set_cameras[index].name = this.cameraNewName;

        this.updateCameraPop = false;
      });
    },
    checkLength(value) {
      this.edited_set.name = value.slice(0, 32);
    },
    checkNumber(value, field) {
      this.edited_set[field] = +value.replace(/\D/g, "");

      if (this.edited_set[field] < 1) this.edited_set[field] = 1;
      if (this.edited_set[field] > 60) this.edited_set[field] = 60;
    },
  },
  created() {
    this.bindCameras();
    window.addEventListener("resize", this.handleWindowResize);
    this.$vs.loading.close();
    setTimeout(() => {
      this.autoSizeAll();
    }, 100);

    this.$root.$on("deleteCameraFromSet", (data) => {
      this.cameraItem = data;
      this.deleteCameraPop = true;
    });

    this.$root.$on("editSetCamera", (data) => {
      this.cameraItem = data;
      this.cameraNewName = data.name;
      this.updateCameraPop = true;
    });

    this.$root.$on("showSetCamera", (camera) => {
      this.cameraName = camera.name;
      this.cameraId = camera.id;
      this.$vs.loading();

      this.$store
        .dispatch("report/checkLiveStream", camera.id)
        .then(() => {
          this.showPopup = true;
          this.$vs.loading.close();
        })
        .catch(() => {
          setTimeout(() => {
            this.$vs.loading.close();
          }, 300);
        });
    });

    this.$root.$on("setMainCamera", (data) => {
      let cameras = JSON.parse(JSON.stringify(this.seletedCameras));
      cameras = cameras.map((cam) => {
        return { id: cam.cameras.id, main: cam.main };
      });
      const findMainIndex = cameras.findIndex((cam) => cam.main);
      cameras[findMainIndex].main = false;
      const index = cameras.findIndex((cam) => cam.id === data.id);
      cameras[index].main = true;

      const payload = {
        id: this.edit_set_data.id,
        cameras,
      };
      this.$store.dispatch("cctv/updateSet", payload).then(() => {
        this.$vs.notify({
          time: 5000,
          color: "success",
          title: "Main camera change",
        });
        this.deleteCameraPop = false;
        this.$store.dispatch("cctv/fetchSet", this.edited_set.id);
      });
    });
  },
  computed: {
    cameras() {
      return this.$store.state.cctv.cameras;
    },
    edit_set_data() {
      return this.$store.state.cctv.edit_set_data;
    },
    seletedCameras() {
      return this.edited_set.camera_set_cameras;
    },
    selectedCameraIds() {
      return this.edited_set.camera_set_cameras.map((cam) => cam.cameras.id);
    },
    headers() {
      return this.$store.state.cctv.set_camera_headers;
    },
  },
  watch: {
    edit_set_data() {
      this.bindCameras();

      const cameraSets = this.$store.state.cctv.accessPointCamSets;
      const access_points = JSON.parse(JSON.stringify(cameraSets));

      if (this.edited_set.access_points) {
        access_points.push({
          id: this.edited_set.access_point,
          name: this.edited_set.access_points.name,
          disabled: true,
        });
      }
      this.access_points = access_points;
    },
  },
  destroyed() {
    this.$root.$off("setMainCamera");
    this.$root.$off("deleteCameraFromSet");
    this.$root.$off("editSetCamera");
    this.$root.$off("showSetCamera");
  },
};
</script>

<style lang="scss">
.inner_block_groups.cctvv {
  .ag-cell.ag-cell-value {
    display: flex;
    // align-items: center;
  }
}
</style>
