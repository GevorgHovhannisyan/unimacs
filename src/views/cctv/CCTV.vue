<template>
  <div class="cctv_parent_block other_version">
    <vs-popup
      class="holamundo cctv_popup"
      title="Create Device"
      :active.sync="popupActive"
    >
      <CreateDeviceForm
        ref="create_device_form"
        @closePopup="popupActive = false"
        :popupActive="popupActive"
        @createDevice="createDevice"
      />
    </vs-popup>

    <vs-popup
      class="holamundo"
      title="Create Set"
      :active.sync="popupSetActive"
    >
      <CreateSetForm
        :access_points="access_points"
        ref="create_set_form"
        @closePopup="popupSetActive = false"
        @createSet="createSet"
      />
    </vs-popup>

    <vs-popup
      class="holamundo cctv_popup"
      title="Edit Device"
      :active.sync="editDevicePopup"
    >
      <EditDeviceForm
        ref="edit_device_form"
        @updateDevice="updateDevice"
        @closePopup="editDevicePopup = false"
        :item="editedCctvItem"
      />
    </vs-popup>

    <vs-popup class="holamundo" title="Edit Set" :active.sync="editSetPopup">
      <EditSetForm
        :access_points="access_points"
        ref="edit_set_form"
        @closePopup="editSetPopup = false"
        @updateSet="updateSet"
        :item="editedSetItem"
      />
    </vs-popup>

    <vs-popup
      class="holamundo"
      title="Change Name"
      :active.sync="updateCameraPop"
    >
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

    <vx-card>
      <div class="tree_block">
        <div class="card_group_blocks">
          <div class="block_account">
            <div class="row_block">
              <div class="left_block">
                <vs-tabs v-model="activeTab">
                  <vs-tab label="CCTV">
                    <div class="vx-col">
                      <div class="vx-row search_row">
                        <div class="vx-col add_cctv_btn">
                          <vs-button
                            class="mr-4 unimacs_button unimacs_add_new_btn"
                            @click="popupActive = true"
                          >
                            Create device
                          </vs-button>
                          <SearchComponent />
                        </div>
                      </div>
                      <TableContext
                        class="cctv_table"
                        :selectedItem="selectedCctv"
                        :items="devices"
                        @openRule="openCctv($event)"
                        @remove="removeDevice($event)"
                        @editItem="editCctvItem($event)"
                        type="cctv"
                        :showHiddens="showHiddens"
                        :search="false"
                      /></div
                  ></vs-tab>
                  <!-- @hideSelected="hideSelected"
                        @showHidden="showHidden"
                        @showCameras="showCameras"
                        @showUnHidden="showUnHidden" -->
                  <vs-tab label="Set">
                    <div class="vx-col">
                      <div class="vx-row search_row">
                        <div class="vx-col add_cctv_btn">
                          <vs-button
                            class="mr-4 unimacs_button unimacs_add_new_btn"
                            @click="popupSetActive = true"
                          >
                            Create set
                          </vs-button>

                          <SearchComponent />
                        </div>
                      </div>
                      <TableContext
                        class="cctv_table"
                        type="set"
                        :selectedItem="selectedSet"
                        :items="sets"
                        @openRule="openSet($event)"
                        @createRule="createRule($event)"
                        @remove="removeSet($event)"
                        @editItem="editSetItem($event)"
                        :search="false"
                      />
                    </div>
                  </vs-tab>
                </vs-tabs>
              </div>

              <div class="right_block">
                <div class="inner_block_groups cctvv">
                  <div class="vx-col description_block">
                    <!-- <keep-alive> -->
                    <component
                      :showHiddens="showHiddens"
                      :selectedCctv="selectedCctv"
                      :is="groupComponent"
                    ></component>
                    <!-- </keep-alive> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import moduleCctv from "@/store/cctv/moduleCctv";
import moduleReport from "@/store/report/moduleReport";
import CctvComponent from "./components/CctvComponent";
import SetComponent from "./components/SetComponent";
import TableContext from "./components/Table";
import vSelect from "vue-select";
import CreateDeviceForm from "./components/CreateDeviceForm";
import CreateSetForm from "./components/CreateSetForm";
import EditDeviceForm from "./components/EditDeviceForm";
import EditSetForm from "./components/EditSetForm";
import SearchComponent from "../../components/custom/SearchComponent";
// import moduleAccessPoint from "@/store/access-point/moduleAccessPoint";
export default {
  data() {
    return {
      groupComponent: "CctvComponent",
      popupActive: false,
      selectedCctv: null,
      selectedSet: null,
      searchText: null,
      popupSetActive: false,
      deletedDevice: null,
      deletedSet: null,
      editDevicePopup: null,
      editSetPopup: null,
      editedCctvItem: {},
      editedSetItem: {},
      activeTab: 0,
      showHiddens: false,
      cameraItem: {},
      updateCameraPop: false,
      deleteCameraPop: false,
      cameraNewName: null
    };
  },
  methods: {
    createDevice(data) {
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
      this.$vs.loading();

      this.$store
        .dispatch("cctv/createCctvDevice", payload)
        .then((res) => {
          setTimeout(() => {
            try {
              this.$store.dispatch("cctv/fetchCctvDevices").then((res) => {
                if (res.data.length) {
                  this.openCctv(res.data[0]);
                }
                this.$vs.loading.close();
                // this.openCctv(res.data);
                this.popupActive = false;
                this.$refs.create_device_form.initValues();
                this.$vs.notify({
                  time: 5000,
                  color: "success",
                  text: "List of camera to be prepared, please reload the browser",
                  title: "Device was successfully created",
                });
                // this.$vs.loading.close();
                // this.popupActive = false;
                // this.$refs.create_device_form.initValues();
              });
            } catch (error) {
              this.$vs.loading.close();
            }
          }, 250);
        })
        .catch(() => {
          this.$vs.loading.close();
        });
    },
    createSet(data) {
      const payload = {
        name: data.name,
        before_event: data.before_event,
        after_event: data.after_event,
        access_point: data.access_point,
      };

      this.$store.dispatch("cctv/createCctvSet", payload).then(async (res) => {
        await this.$store.dispatch("cctv/fetchCctvSets");
        await this.$store.dispatch("cctv/fetchAccessPointCameraSets");
        setTimeout(() => {
          this.openSet(res.data);
        }, 100);

        this.popupSetActive = false;
        this.$refs.create_set_form.initValues();
        this.$vs.notify({
          time: 5000,
          color: "success",
          title: "Device was successfully added",
        });
      });
    },
    async openCctv(data) {
      if (this.selectedCctv !== data.id) {
        this.$vs.loading();
        this.showHiddens = false;
        this.selectedCctv = data.id;
        try {
          await this.fetchCameras({
            camera_device: data.id,
            hidden: this.showHiddens,
          });
          setTimeout(async () => {
            this.$vs.loading.close();
          }, 200);
        } catch (error) {
          this.$vs.loading.close();
        }
      }
    },
    async openSet(data) {
      this.selectedSet = data.id;
      this.$vs.loading();
      try {
        await this.$store.dispatch("cctv/fetchSet", data.id);
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
      } catch (error) {
        this.$vs.loading.close();
      }
      // this.$store.commit("cctv/SET_EDIT_DATA", data);
    },
    editCctvItem(data) {
      this.openCctv(data);
      this.editedCctvItem = data;
      this.editDevicePopup = true;
    },
    editSetItem(data) {
      this.openSet(data);
      this.editedSetItem = data;
      this.editSetPopup = true;
    },
    removeDevice(device) {
      this.deletedDevice = device;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${device.name} device`,
        accept: this.deleteDevice,
        acceptText: "Delete",
      });
    },
    deleteDevice() {
      this.$store
        .dispatch("cctv/deleteCctvDevice", this.deletedDevice.id)
        .then(async () => {
          await this.$store.dispatch("cctv/fetchCctvDevices");
          if (this.devices.length) {
            this.openCctv(this.devices[0]);
          } else {
            this.$store.commit("cctv/SET_CAMERAS", []);
          }
          this.$vs.notify({
            time: 5000,
            color: "success",
            title: "Device was successfully deleted",
          });
        });
    },
    removeSet(set) {
      this.deletedSet = set;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${set.name} set`,
        accept: this.deleteSet,
        acceptText: "Delete",
      });
    },
    deleteSet() {
      this.$store
        .dispatch("cctv/deleteCctvSet", this.deletedSet.id)
        .then(async () => {
          await this.$store.dispatch("cctv/fetchCctvSets");
          await this.$store.dispatch("cctv/fetchAccessPointCameraSets");

          if (this.sets.length) {
            this.openSet(this.sets[0]);
          } else {
            this.$store.commit("cctv/SET_EDIT_DATA", null);
          }

          this.$vs.notify({
            time: 5000,
            color: "success",
            title: "Set was successfully deleted",
          });
        });
    },
    fetchCameras(params) {
      this.$store.dispatch("cctv/fetchCameras", {
        params,
      });
    },
    initValues() {
      this.name = null;
      this.connection_type = null;
      this.ip_domain = null;
      this.serial_number = null;
      this.port = null;
      this.username = null;
      this.password = null;
    },
    updateDevice(data) {
      const payload = {
        id: data.id,
        name: data.name,
        connection_type: data.connection_type,
        serial_number: data.serial_number,
        domain: data.domain,
        port: data.port,
        username: data.username,
        password: data.password,
        device_type: data.device_type,
      };
      this.$store.dispatch("cctv/updateDevice", payload).then(() => {
        this.$store.dispatch("cctv/fetchCctvDevices");
        this.editDevicePopup = false;

        this.$vs.notify({
          time: 5000,
          color: "success",
          title: "Device was successfully updated",
        });
      });
    },
    updateSet(data) {
      const payload = {
        id: data.id,
        name: data.name,
        before_event: data.before_event,
        after_event: data.after_event,
        access_point: data.access_point,
      };
      this.$store.dispatch("cctv/updateSet", payload).then(() => {
        this.$store.dispatch("cctv/fetchCctvSets");
        this.$store.dispatch("cctv/fetchSet", data.id);
        this.editSetPopup = false;

        this.$vs.notify({
          time: 5000,
          color: "success",
          title: "Set was successfully updated",
        });
      });
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
        this.fetchCameras({
          camera_device: this.selectedCctv,
          hidden: this.showHiddens,
        });

        this.updateCameraPop = false;
      });
    },
    deleteCamera() {
      this.$store.dispatch("cctv/deleteCamera", this.cameraItem.id).then(() => {
        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Camera deleted",
        });

        this.fetchCameras({
          camera_device: this.selectedCctv,
          hidden: this.showHiddens,
        });

        this.deleteCameraPop = false;
      });
    },
    // async showUnHidden() {
    //   this.showHiddens = false;
    //   this.fetchCameras({
    //     camera_device: this.selectedCctv,
    //     hidden: false,
    //   });
    // },
  },
  components: {
    CctvComponent,
    SetComponent,
    TableContext,
    vSelect,
    CreateDeviceForm,
    CreateSetForm,
    SearchComponent,
    EditDeviceForm,
    EditSetForm,
  },
  computed: {
    devices() {
      return this.$store.state.cctv.devices;
    },
    sets() {
      return this.$store.state.cctv.sets;
    },
    access_points() {
      return this.$store.state.cctv.accessPointCamSets;
    },
    cctv_selected_cameras() {
      return this.$store.state.cctv.cctv_selected_cameras;
    },
  },
  watch: {
    activeTab(tab) {
      const pageName = this.$route.name;
      if (tab === 1) {
        if (this.selectedSet) {
          this.openSet({ id: this.selectedSet });
        } else {
          if (this.sets.length) {
            this.openSet(this.sets[0]);
          }
        }

        if (pageName === "Cctv") {
          this.$router.push("/set");
        }
        this.groupComponent = "SetComponent";
      } else {
        if (pageName === "Set") {
          this.$router.push("/cctv");
        }
        this.groupComponent = "CctvComponent";
      }
    },
  },
  async created() {
    const pageName = this.$route.name;
    if (pageName === "Cctv") {
      this.activeTab = 0;
    } else {
      this.activeTab = 1;
    }
    if (!moduleCctv.isRegistered) {
      this.$store.registerModule("cctv", moduleCctv);
      moduleCctv.isRegistered = true;
    }
    if (!moduleReport.isRegistered) {
      this.$store.registerModule("report", moduleReport);
      moduleReport.isRegistered = true;
    }

    await this.$store.dispatch("cctv/fetchCctvDevices");
    if (this.devices.length) {
      this.openCctv(this.devices[0]);
    }

    await this.$store.dispatch("cctv/fetchCctvSets");

    await this.$store.dispatch("cctv/fetchAccessPointCameraSets");

    if (pageName === "Set") {
      if (this.sets.length) {
        this.openSet(this.sets[0]);
      }
    }
    this.$root.$on("hideCCTVCamera", async (data) => {
      try {
        this.$vs.loading();
        const payload = {
          hidden: data.hidden ? false : true,
          camera_device: this.selectedCctv,
          camera_ids: [data.id],
        };
        this.$store.dispatch("cctv/hideCameras", payload).then(() => {
          let selectedCameras = JSON.parse(
            JSON.stringify(this.cctv_selected_cameras)
          );

          this.$store.commit("cctv/REMOVE_CAMERA_CCTV", data.id);

          const index = selectedCameras.findIndex((item) => item.id == data.id);
          if (index != -1) {
            selectedCameras.splice(index, 1);
            const ids = selectedCameras.map((item) => item.id);

            this.$root.$emit("checkSelectedsAgain", ids);
          }

          // this.fetchCameras({
          //   camera_device: this.selectedCctv,
          //   hidden: this.showHiddens,
          // });
          setTimeout(() => {
            this.$vs.loading.close();
          }, 100);

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Cameras was hidden",
          });
        });
      } catch (error) {
        this.$vs.loading.close();
      }
    });

    this.$root.$on("editCCTVCamera", (data) => {
      this.cameraItem = data;
      this.cameraNewName =  this.cameraItem.name
      this.updateCameraPop = true;
    });
  },
  destroyed() {
    this.$root.$off("editCCTVCamera");
    this.$root.$off("hideCCTVCamera");
  },
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
