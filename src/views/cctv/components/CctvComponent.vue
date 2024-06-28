<template>
  <div class="relative">
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

    <div class="group_actions">
      <vs-dropdown
        class="cursor-pointer ml-3"
        vs-custom-content
        vs-trigger-click
      >
        <div class="p-3 cursor-pointer">
          <span class="mr-2 leading-none"
            ><vs-icon
              style="font-size: 25px"
              icon-pack="material-icons"
              icon="reorder"
          /></span>
        </div>

        <vs-dropdown-menu>
          <vs-dropdown-item @click="hideSelected">
            <span class="flex items-center">
              <span>Hide Selected</span>
            </span>
          </vs-dropdown-item>

          <vs-dropdown-item @click="showHidden">
            <span class="flex items-center">
              <span>Show Hidden</span>
            </span>
          </vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
    </div>

    <ag-grid-vue
      ref="agGridTablee"
      :gridOptions="gridOptions"
      class="ag-theme-material w-100 my-4 ag-grid-table ap_ag_grid acu_dashboard_tbl"
      :class="{ opacity_resize: opacity_table }"
      :columnDefs="headers"
      :defaultColDef="defaultColDef"
      :rowData="cameras"
      colResizeDefault="shift"
      @grid-ready="onGridReady"
      :enableRtl="$vs.rtl"
      rowSelection="multiple"
      :suppressDragLeaveHidesColumns="true"
      :suppressAggFuncInHeader="true"
      :suppressRowClickSelection="true"
      @row-selected="onRowSelected"
      domLayout="autoHeight"
      :pagination="true"
      :paginationPageSize="10"
      :suppressPaginationPanel="true"
    >
    </ag-grid-vue>

    <CustomPaging
      class="mt-3 mb-3"
      @pageChanged="page = $event"
      :total="totalPages"
      v-if="10 < cameras.length ? true : false"
    />
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import CellRendererCctvCameraActions from "../renderer/CellRendererCctvCameraActions";
import CellRendererCameraView from "../renderer/CellRendererCameraView";
import LiveStream from "../../dashboard/components/LiveStream.vue";
export default {
  props: {
    selectedCctv: {
      type: Number,
    },
    showHiddens: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AgGridVue,
    CellRendererCctvCameraActions,
    CellRendererCameraView,
    LiveStream,
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        lockPinned: true,
      },
      components: {
        CellRendererCctvCameraActions,
        CellRendererCameraView,
      },
      opacity_table: false,
      page: 1,
      showPopup: false,
      cameraId: null,
    };
  },

  methods: {
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
    onRowSelected(event) {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      this.$store.commit("cctv/SET_SELECTED_CAMERAS", selectedData);
      const check = event.node.isSelected();
    },
    customNumberFormatter(params) {
      return `Page ${params.currentPage} of ${params.totalPages}`;
    },
    onPrevPage() {
      this.gridApi.paginationGoToPreviousPage();
    },
    onNextPage() {
      this.gridApi.paginationGoToNextPage();
    },
    fetchCameras(params) {
      this.$store.dispatch("cctv/fetchCameras", {
        params,
      });
    },
    async hideSelected() {
      if (this.cctv_selected_cameras.length) {
        const ids = this.cctv_selected_cameras.map((cam) => cam.id);
        this.$vs.loading({
          type: "corners",
        });
        try {
          const payload = {
            camera_ids: ids,
            hidden: true,
            camera_device: this.selectedCctv,
          };
          await this.$store.dispatch("cctv/hideCameras", payload);

          this.fetchCameras({
            camera_device: this.selectedCctv,
            hidden: this.showHiddens,
          });
          this.$store.commit("cctv/SET_SELECTED_CAMERAS", []);

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Cameras were hidden",
          });
        } catch (error) {
          this.$vs.loading.close();
        }
        this.$vs.loading.close();
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "No selected cameras",
        });
      }
    },
    showHidden() {
      const saveSelecteds = JSON.parse(
        JSON.stringify(this.cctv_selected_cameras)
      );
      this.$http
        .get(`camera`, {
          headers: { Authorization: localStorage.token },
          params: {
            camera_device: this.selectedCctv,
            hidden: true,
          },
        })
        .then(async (response) => {
          const cameras = response.data.map((camera) => {
            camera.selected = true;
            return camera;
          });
          const ids = cameras.map((c) => c.id);
          const payload = {
            hidden: false,
            camera_device: this.selectedCctv,
            camera_ids: ids,
          };
          await this.$store.dispatch("cctv/hideCameras", payload);

          this.$store.commit("cctv/APPEND_CAMERAS", cameras);
          setTimeout(() => {
            this.gridApi.forEachLeafNode((node) => {
              if (
                cameras.find((cam) => cam.id == node.data.id) ||
                saveSelecteds.find((cam) => cam.id == node.data.id)
              ) {
                node.setSelected(true);
              }
            });
          }, 100);
        });
    },
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
    this.$vs.loading.close();
    setTimeout(() => {
      this.autoSizeAll();
    }, 100);

    this.$root.$on("refreshAcApTable", () => {
      this.opacity_table = false;
      setTimeout(() => {
        this.autoSizeAll();
        this.$vs.loading.close();
      }, 100);
    });

    this.$root.$on("showCctvCamera", (camera) => {
      this.cameraId = camera.id;
      this.cameraName = camera.name;

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

    this.$root.$on("checkSelectedsAgain", (ids) => {
      setTimeout(() => {
        this.gridApi.forEachLeafNode((node) => {
          if (ids.includes(node.data.id)) {
            node.setSelected(true);
          }
        });
      }, 150);
    });
  },
  computed: {
    cameras() {
      return this.$store.state.cctv.cameras;
    },
    headers() {
      return this.$store.state.cctv.cctv_camera_headers;
    },
    totalPages() {
      return this.gridApi && this.gridApi.paginationGetTotalPages
        ? this.gridApi.paginationGetTotalPages()
        : 0;
    },
    cctv_selected_cameras() {
      return this.$store.state.cctv.cctv_selected_cameras;
    },
  },
  watch: {
    page(pageNum) {
      this.gridApi.paginationGoToPage(pageNum - 1);
    },
    showPopup(val) {
      if (!val) {
        this.cameraId = null;
      }
    },
  },
  destroyed() {
    this.$root.$off("showCctvCamera");
    this.$root.$off("checkSelectedsAgain");
  },
};
</script>
