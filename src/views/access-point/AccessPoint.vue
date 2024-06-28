<template>
  <div class="access_point_page">
    <DetachHardwarePopup
      v-if="detachHardwareData"
      :popupActive="detachHardwarePopups"
      @popup="detachHardwarePopups = $event"
      :propsData="detachHardwareData"
      :deviceId="detachDevId"
    />

    <vs-prompt
      title="Export To Excel"
      class="export-options"
      @cancle="clearFields"
      @accept="exportToExcel"
      accept-text="Export"
      @close="clearFields"
      :active.sync="activePrompt"
    >
      <vs-input
        v-model="fileName"
        @input="fileName = $event"
        placeholder="Enter File Name.."
        class="w-full"
      />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
        <span class="mr-4">Cell Auto Width:</span>
        <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>
      </div>
    </vs-prompt>
    <div class="vx-row scr_config_acu">
      <div class="vx-col">
        <vs-button
          class="ml-4 unimacs_button"
          @click="popups.screenConfig = true"
        >
          <vs-icon icon-pack="material-icons" icon="settings" />
        </vs-button>
      </div>
    </div>

    <vs-popup
      class="holamundo"
      title="Choose ACU Table headers"
      :active.sync="popups.acu_columns_popup"
    >
      <vs-checkbox
        v-for="(header, index) in acu_headers"
        :key="index"
        class="mb-4 mt-5 custom__checkbox"
        v-model="header.show"
        :disabled="header.field === 'actions'"
        >{{ header.headerName }}</vs-checkbox
      >
      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" @click="changeAcuHeaders"
          >Submit</vs-button
        >
        <vs-button
          class="mr-6 mt-4 unimacs_cancel_button"
          @click="popups.acu_columns_popup = false"
          >Cancel</vs-button
        >
      </div>
    </vs-popup>

    <vs-popup
      class="holamundo"
      title="Choose Access Points headers"
      :active.sync="popups.point_columns_popup"
    >
      <vs-checkbox
        v-for="(header, index) in access_point_headers"
        :key="index"
        class="mb-4 mt-5 custom__checkbox"
        v-model="header.show"
        :disabled="header.field === 'actions'"
        >{{ header.headerName }}</vs-checkbox
      >

      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" @click="changeApHeaders"
          >Submit</vs-button
        >

        <vs-button
          class="mr-6 mt-4 unimacs_cancel_button"
          @click="popups.point_columns_popup = false"
          >Cancel
        </vs-button>
      </div>
    </vs-popup>

    <ScreenConfig
      v-if="popups.screenConfig"
      class="acu_screen_config"
      :popupActive="popups.screenConfig"
      @popup="popups.screenConfig = $event"
      @showAcuTable="acuTable = $event"
      @submitScreen="submitScreen($event)"
    />

    <AttachHardwarePopup
      v-if="attachHardData"
      :popupActive="popups.attachHardwarePopup"
      @popup="popups.attachHardwarePopup = $event"
      :propsData="attachHardData"
      :deviceId="deviceId"
    />

    <AddACU
      :popupActive="popups.addACUPopup"
      @popup="popups.addACUPopup = $event"
      :page="page"
      :page_items_count="itemsPerPage"
      :page_point="pagePoint"
      :page_items_count_point="itemsPerPagePoint"
    />

    <vs-popup
      class="holamundo popup_width_small ac_point__popup updatee"
      title="Update ACU / Access Point"
      :active.sync="popups.editACUPopup"
    >
      <UpdateACU
        :page="page"
        :page_items_count="itemsPerPage"
        :page_point="pagePoint"
        :page_items_count_point="itemsPerPagePoint"
        v-if="popups.editACUPopup"
        class="popup_width_small"
      />
    </vs-popup>

    <vx-card title="Access Points" v-if="apTable">
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="actions_block_acuu">
            <div class="add_access_point">
              <vs-button
                class="unimacs_button mr-5"
                @click="
                  exportType = 'acc_point';
                  activePrompt = true;
                "
                :disabled="!access_points.length"
                >Export</vs-button
              >
              <vs-button
                class="unimacs_button"
                @click="popups.point_columns_popup = true"
                icon-pack="material-icons"
                icon="filter_list"
              ></vs-button>
            </div>
          </div>
          <AcPointTable
            :items="access_points"
            :headers="filter_access_point_headers"
            @updateItem="updateAccessPoint($event)"
          />

          <CustomPaging
            class="log_page"
            @pageChanged="pagePoint = $event"
            :total="totalPagePoint"
            v-show="
              itemsPerPagePoint < point_count && access_points.length
                ? true
                : false
            "
          />
        </div>
      </div>
    </vx-card>

    <vx-card class="mt-base" title="Access Control Unit" v-if="acuTable">
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="add_access_point">
            <vs-button
              class="unimacs_button mr-5"
              @click="
                exportType = 'acu';
                activePrompt = true;
              "
              :disabled="!access_points.length"
              >Export</vs-button
            >
            <vs-button
              class="mr-4 unimacs_button unimacs_add_new_btn"
              @click="checkAccessPointResource"
              v-if="acuPermissions.addItem"
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" /> Add ACU
            </vs-button>
            <vs-button
              @click="popups.acu_columns_popup = true"
              class="unimacs_button"
              icon-pack="material-icons"
              icon="filter_list"
            ></vs-button>
          </div>
          <AcuTable
            :items="acu"
            :headers="filter_acu_headers"
            @updateItem="editACU($event)"
          />
          <CustomPaging
            class="log_page"
            @pageChanged="page = $event"
            :total="totalPage"
            v-show="itemsPerPage < acu_count && acu.length ? true : false"
          />
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import AcPointTable from "./components/tables/ApTable";
import AcuTable from "./components/tables/AcuTable";

import Table from "../../components/custom/table/Table";
import moduleAccessPoint from "@/store/access-point/moduleAccessPoint";
import moduleGroupZone from "@/store/group-zones/moduleAccessPoint";
import ScreenConfig from "./components/popups/ScreenConfig";
import AddDevicePopup from "./components/popups/AddDeviceDragDrop";
import AddACU from "./components/popups/acu/AddACU";
import UpdateACU from "./components/popups/acu/UpdateACUPopup";
import AttachHardwarePopup from "./components/popups/AttachHardwarePopup";
import DetachHardwarePopup from "./components/tabs/acu/update/AttachFromACU.vue";
import CellRendererApActions from "./renderer/CellRendererApActions";

import vSelect from "vue-select";

import store from "@/store/access-point/moduleAccessPoint.js";
export default {
  watch: {
    activePrompt(val) {
      if (!val) {
        this.fileName = "";
      }
    },
    "popups.point_columns_popup"(value) {
      this.access_point_headers = JSON.parse(JSON.stringify(this.ap_header));
    },
    "popups.acu_columns_popup"(value) {
      this.acu_headers = JSON.parse(JSON.stringify(this.acu_header));
      // this.access_point_headers = JSON.parse(JSON.stringify(this.ap_header));
    },
    "popups.editACUPopup"(value) {
      const user = localStorage.user ? JSON.parse(localStorage.user) : null;
      if (!value && user) {
        this.sockets.unsubscribe(
          `reader_delete/${user.company}/${user.id}/acu/${this.acu_id}`
        );
        this.sockets.unsubscribe(
          `ext_brd_delete/${user.company}/${user.id}/acu/${this.acu_id}`
        );
        this.sockets.unsubscribe(
          `ext_brd_update/${user.company}/${user.id}/acu/${this.acu_id}`
        );
        this.sockets.unsubscribe(
          `access_point_update/${user.company}/${user.id}/acu/${this.acu_id}`
        );
      }
    },
    itemsPerPage() {
      const params = {
        page: 1,
        page_items_count: this.itemsPerPage,
      };

      this.fetchAcus(params);
    },
    page() {
      const params = {
        page: this.page,
        page_items_count: this.itemsPerPage,
      };

      this.fetchAcus(params);
    },

    itemsPerPagePoint() {
      const params = {
        page: 1,
        page_items_count: this.itemsPerPagePoint,
      };

      this.fetchPoints(params);
    },
    pagePoint() {
      const params = {
        page: this.pagePoint,
        page_items_count: this.itemsPerPagePoint,
      };

      this.fetchPoints(params);
    },
  },
  methods: {
    checkAccessPointResource() {
      this.popups.addACUPopup = true;
    },
    async changeApHeaders() {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.table_headers.access_point_headers = this.access_point_headers;
      this.ap_header = JSON.parse(JSON.stringify(this.access_point_headers));
      await this.$store.dispatch("setSettings", settings);
      // this.setSettings(settings);
      this.popups.point_columns_popup = false;
      this.$root.$emit("refreshAcApTable");
    },
    async changeAcuHeaders() {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.table_headers.acu_headers = this.acu_headers;
      this.acu_header = JSON.parse(JSON.stringify(this.acu_headers));
      await this.$store.dispatch("setSettings", settings);
      // this.setSettings(settings);
      this.popups.acu_columns_popup = false;
      this.$root.$emit("refreshAcuTable");
    },
    activateACU(event) {
      this.$store.dispatch("accessPoint/activateACU", event.id).then((res) => {
        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Hardware activated",
        });
      });
    },
    editACU(event) {
      if (!event.disabled) {
        this.$store.dispatch("accessPoint/fetchACU", event.id).then((res) => {
          setTimeout(() => {
            this.acu_id = event.id;
            this.popups.editACUPopup = true;
          }, 200);
        });
      }
    },
    copyACU(event) {
      if (event.status === "active") {
        this.copy_acu = event.id;
        let findAction = this.contextMenuActions.find(
          (a) => a.action === "paste"
        );
        findAction.disabled = false;

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "ACU Copied",
        });
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Can't copy inactive ACU",
        });
      }
    },
    pastACU(event) {
      if (event.cloud_status === "online") {
        if (event.status === "active") {
          if (this.copy_acu === event.id) {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Can't paste on the same copied ACU",
            });
          } else if (this.copy_acu) {
            this.$store
              .dispatch("accessPoint/pasteACU", {
                acu_copy: this.copy_acu,
                acu_paste: event.id,
              })
              .then(async () => {
                this.$vs.notify({
                  time: 7000,
                  color: "success",
                  title: "Successfully installed",
                });
                const params = {
                  page: this.page,
                  page_items_count: this.itemsPerPage,
                };

                await this.fetchAcus(params);
              });
          } else {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "At first select ACU for copy",
            });
          }
        } else {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "Can't paste on inactive ACU",
          });
        }
      } else {
        if (this.copy_acu) {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title:
              "The operation could not be completed because the device is not online",
          });
        } else {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "At first select ACU for copy",
          });
        }
      }
    },
    attachACU(event) {
      if (event.status == "no_hardware") {
        this.popups.attachHardwarePopup = true;
        this.$store.dispatch("accessPoint/fetchAttachHardware").then((res) => {
          this.attachHardData = { attach_hard: res.data, device: event };
          this.deviceId = event.id;
        });
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Selected ACU hasn't No Hardware Status",
        });
      }
    },
    deleteAp(event) {
      this.deleteApItem = event;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${this.deleteApItem.name} Access Point `,
        accept: this.deleteApFunction,
        acceptText: "Delete",
      });
    },
    deactivateConfirm(event) {
      this.deactivateItem = event;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${this.deactivateItem.name} ACU `,
        accept: this.deactivateAcu,
        acceptText: "Delete",
      });
    },
    deactivateAcu() {
      this.$store
        .dispatch("accessPoint/deactivateAcu", this.deactivateItem)
        .then((response) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "ACU deactivated",
          });
        });
    },
    // async getSettings() {
    //   const data = await this.$http.get(`/account/getUserData`, {
    //     headers: { Authorization: localStorage.token },
    //   });
    //   return data;
    // },
    // async setSettings(event) {
    //   this.$store.dispatch("setSettings", event).then((res) => {
    //     this.settings = res.data.settings
    //       ? JSON.parse(res.data.settings)
    //       : null;
    //   });
    // },
    deleteApFunction() {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("accessPoint/deleteAccessPoint", this.deleteApItem)
        .then((res) => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Access Point Deleted",
          });
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    deleteACU(event) {
      this.deleteACUItem = event;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${this.deleteACUItem.name} ACU `,
        accept: this.deleteNode,
        acceptText: "Delete",
      });
    },
    deleteNode() {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("accessPoint/deleteACU", this.deleteACUItem)
        .then(async (res) => {
          const pointParams = {
            page: this.pagePoint,
            page_items_count: this.itemsPerPagePoint,
          };
          const params = {
            page: this.page,
            page_items_count: this.itemsPerPage,
          };
          await this.fetchAcus(params);

          await this.fetchPoints(pointParams);

          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "ACU Deleted",
          });
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    updateAccessPoint(event) {
      if (!event.disabled) {
        this.$store.dispatch("accessPoint/fetchACU", event.acu).then((res) => {
          setTimeout(() => {
            this.popups.editACUPopup = true;
          }, 200);
        });
      }
    },
    exportToExcel() {
      const name = this.fileName;

      import("@/vendor/Export2Excel").then((excel) => {
        const list = this.exportType == "acu" ? this.acu : this.access_points;
        const header =
          this.exportType == "acu"
            ? this.acu_headers.map((item) => {
                if (item.field !== "actions") {
                  return item.headerName;
                }
              })
            : this.access_point_headers.map((item) => {
                if (item.field !== "actions") {
                  return item.headerName;
                }
              });

        const headerVal =
          this.exportType == "acu"
            ? this.acu_headers.map((item) => {
                return item.field;
              })
            : this.access_point_headers.map((item) => {
                return item.field;
              });

        const data = this.formatJson(headerVal, list);
        excel.export_json_to_excel({
          header: header,
          data,
          filename: name,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat,
        });
        this.clearFields();
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    clearFields() {
      this.filename = null;
      this.cellAutoWidth = true;
      this.selectedFormat = "xlsx";
    },
    detachHardware(event) {
      this.detachHardwarePopups = true;
      const id = event.id;

      this.$store.dispatch("accessPoint/fetchAttachHardware").then((res) => {
        this.detachDevId = id;
        this.detachHardwareData = { attach_hard: res.data, device: event };
      });
    },
    submitScreen() {
      const point_table = localStorage.getItem("point_table");
      const acu_table = localStorage.getItem("acu_table");
      this.apTable = point_table == "false" ? false : true;
      this.acuTable = acu_table == "false" ? false : true;
    },
    async fetchAcus(params) {
      this.$store.dispatch("accessPoint/fetchACUs", params).then((res) => {
        this.$vs.loading.close();
        const sum = this.acu_count % this.itemsPerPage;
        if (!sum) {
          this.totalPage = Math.floor(this.acu_count / this.itemsPerPage);
        } else {
          this.totalPage = Math.floor(this.acu_count / this.itemsPerPage) + 1;
        }
        setTimeout(() => {
          this.$root.$emit("refreshAcuTable");
        }, 300);
      });
    },
    async fetchPoints(params) {
      this.$store.dispatch("accessPoint/fetchAccessPoint", params).then(() => {
        this.$vs.loading.close();

        const sum = this.point_count % this.itemsPerPagePoint;
        if (!sum) {
          this.totalPagePoint = Math.floor(
            this.point_count / this.itemsPerPagePoint
          );
        } else {
          this.totalPagePoint =
            Math.floor(this.point_count / this.itemsPerPagePoint) + 1;
        }

        setTimeout(() => {
          this.$root.$emit("refreshAcApTable");
        }, 300);
      });
    },
  },
  async created() {
    if (!moduleAccessPoint.isRegistered) {
      this.$store.registerModule("accessPoint", moduleAccessPoint);
      moduleAccessPoint.isRegistered = true;
    }

    if (!moduleGroupZone.isRegistered) {
      this.$store.registerModule("accessPointGroup", moduleGroupZone);
      moduleGroupZone.isRegistered = true;
    }
    this.submitScreen();

    this.$root.$on("deleteAccessP", (data) => {
      this.deleteAp(data);
    });

    this.$root.$on("updateAccessP", (data) => {
      this.updateAccessPoint(data);
    });

    this.$root.$on("activateAcu", (data) => {
      this.activateACU(data);
    });

    this.$root.$on("copyAcu", (data) => {
      this.copyACU(data);
    });

    this.$root.$on("pasteAcu", (data) => {
      this.pastACU(data);
    });

    this.$root.$on("attachHardwareAcu", (data) => {
      this.attachACU(data);
    });

    this.$root.$on("detachHardwareAcu", (data) => {
      this.detachHardware(data);
    });

    this.$root.$on("updateItemAcu", (data) => {
      this.editACU(data);
    });

    this.$root.$on("deleteAcu", (data) => {
      this.deleteACU(data);
    });
    this.$root.$on("closeUpdatePopup", () => {
      this.popups.editACUPopup = false;
    });

    const settings = JSON.parse(JSON.stringify(this.settingsStore));
    if (!settings) {
      await this.$store.dispatch("setSettings", {
        table_headers: {
          access_point_headers: this.access_point_headers,
          acu_headers: this.acu_headers,
        },
      });
      this.ap_header = JSON.parse(JSON.stringify(this.access_point_headers));
      this.acu_header = JSON.parse(JSON.stringify(this.acu_headers));
    } else {
      if (settings.table_headers) {
        const saveSettings = { ...settings };

        if (settings.table_headers.access_point_headers) {
          this.ap_header = JSON.parse(
            JSON.stringify(settings.table_headers.access_point_headers)
          );
          this.access_point_headers = JSON.parse(
            JSON.stringify(this.ap_header)
          );
        } else {
          saveSettings.table_headers.access_point_headers =
            this.access_point_headers;
          this.ap_header = JSON.parse(
            JSON.stringify(this.access_point_headers)
          );
        }

        if (settings.table_headers.acu_headers) {
          this.acu_header = JSON.parse(
            JSON.stringify(settings.table_headers.acu_headers)
          );
          this.acu_headers = JSON.parse(JSON.stringify(this.acu_header));
        } else {
          saveSettings.table_headers.acu_headers = this.acu_headers;
          this.acu_header = JSON.parse(JSON.stringify(this.acu_headers));
        }
        await this.$store.dispatch("setSettings", saveSettings);
        // this.setSettings(saveSettings);
      } else {
        const saveSettings = { ...settings };
        saveSettings.table_headers = {
          access_point_headers: this.access_point_headers,
          acu_headers: this.acu_headers,
        };
        this.acu_header = JSON.parse(JSON.stringify(this.acu_headers));
        this.ap_header = JSON.parse(JSON.stringify(this.access_point_headers));
        await this.$store.dispatch("setSettings", saveSettings);
        // this.setSettings(saveSettings);
      }
    }
    // });

    this.$vs.loading({
      type: "corners",
    });
    const pointParams = {
      page: this.pagePoint,
      page_items_count: this.itemsPerPagePoint,
    };
    this.fetchPoints(pointParams);

    const params = {
      page: this.page,
      page_items_count: this.itemsPerPage,
    };

    await this.fetchAcus(params);

    this.$store.dispatch("accessPoint/fetchAcuModels").then((res) => {
      this.$vs.loading.close();
    });

    this.$store.dispatch("accessPoint/fetchAccessPointTypes").then((res) => {
      this.$vs.loading.close();
    });

    if (this.acuPermissions.destroyItem) {
      this.contextMenuActions.push({ name: "Delete", action: "delete" });
    }

    if (this.acuPermissions.updateItem) {
      this.contextMenuActions.push({ name: "Edit", action: "updateItem" });
    }
  },
  data() {
    return {
      // acu: [],
      fileName: "",
      ap_name: null,
      port: null,
      address: null,
      boud_rate: null,
      acu_id: null,
      store,
      updateACU_propsData: null,
      attachHardData: null,
      popups: {
        addAccessPointPopup: false,
        addDevicePopup: false,
        attachHardwarePopup: false,
        addACUPopup: false,
        acu_columns_popup: false,
        point_columns_popup: false,
        screenConfig: false,
        editACUPopup: false,
        editApPopup: false,
      },
      ap_header: [],
      access_point_headers: [
        {
          headerName: "#",
          field: "count",
          filter: true,
          show: true,
          pinned: "left",
          lockPinned: true,
          lockPosition: "left",
          cellClass: "locked-col",
          maxWidth: 100,
          minWidth: 100,
          width: 100,
          // minWidth: 100,
          // width: 100,
          suppressSizeToFit: true,
        },
        {
          headerName: "Name",
          field: "name",
          filter: true,
          show: true,
          minWidth: 130,
          // width: 130,
        },
        {
          headerName: "ACU Name",
          field: "acu_name",
          filter: true,
          show: true,
          // minWidth: 130,
          // width: 130,
        },
        {
          headerName: "Type",
          field: "type",
          filter: true,
          show: true,
          // minWidth: 90,
          // width: 90,
        },
        {
          headerName: "Group",
          field: "group",
          filter: true,
          show: true,
          // minWidth: 70,
          // width: 70,
        },
        {
          headerName: "Status",
          field: "acu_status",
          filter: true,
          show: true,
          cellRendererFramework: "CellRendererAcuStatus",
          // minWidth: 80,
          // width: 80,
        },
        {
          headerName: "Mode",
          field: "mode",
          filter: true,
          show: true,
          // minWidth: 90,
          // width: 90,
        },
        {
          headerName: "Actions",
          field: "actions",
          show: true,
          cellRendererFramework: "CellRendererApActions",
          filter: false,
          // pinned: "right",
          // lockPinned: true,
          // lockPosition: "right",
          // cellClass: "locked-col",
          maxWidth: 120,
          minWidth: 120,
          width: 120,
          // suppressSizeToFit: true
        },
      ],
      components: {
        CellRendererApActions,
      },
      acu_header: [],
      acu_headers: [
        {
          headerName: "#",
          field: "count",
          filter: true,
          show: true,
          pinned: "left",
          lockPinned: true,
          lockPosition: "left",
          cellClass: "locked-col",
          maxWidth: 100,
          width: 100,
          suppressSizeToFit: true,
        },
        {
          headerName: "Name",
          field: "name",
          filter: true,
          show: true,
          minWidth: 160,
          width: 160,
        },
        {
          headerName: "Model",
          field: "model",
          filter: true,
          show: true,
          minWidth: 140,
          width: 140,
        },
        {
          headerName: "ACU Serial Number",
          field: "serial_number",
          filter: true,
          show: true,
          minWidth: 220,
          width: 220,
        },
        {
          headerName: "Device Status",
          field: "status",
          filter: true,
          show: true,
          cellRendererFramework: "CellRendererStatus",
          minWidth: 180,
          width: 180,
        },
        {
          headerName: "Cloud Connection",
          field: "cloud_status",
          filter: true,
          show: true,
          cellRendererFramework: "CellRendererCloudStatus",
          minWidth: 200,
          width: 200,
        },
        {
          headerName: "Connection Type",
          field: "connection_type",
          filter: true,
          show: true,
          minWidth: 190,
          width: 190,
        },
        {
          headerName: "IP Address",
          field: "ip_address",
          filter: true,
          show: true,
          minWidth: 150,
          width: 150,
        },
        {
          headerName: "Reg. Date",
          field: "registration_date",
          filter: true,
          show: true,
          minWidth: 180,
          width: 180,
        },
        {
          headerName: "Last Online",
          field: "last_online",
          filter: true,
          show: true,
          minWidth: 180,
          width: 180,
        },
        {
          headerName: "FW Ver",
          field: "fw_version",
          filter: true,
          show: true,
          minWidth: 140,
          width: 140,
        },
        {
          headerName: "HW Ver",
          field: "rev",
          filter: true,
          show: true,
          minWidth: 140,
          width: 140,
        },
        {
          headerName: "API ver",
          field: "api_ver",
          filter: true,
          show: true,
          minWidth: 140,
          width: 140,
        },
        {
          headerName: "ACU Comment",
          field: "acu_comment",
          filter: true,
          show: true,
          minWidth: 180,
          width: 180,
        },
        {
          headerName: "Actions",
          field: "actions",
          show: true,
          cellRendererFramework: "CellRendererAcuActions",
          pinned: "right",
          lockPinned: true,
          lockPosition: "right",
          cellClass: "locked-col",
          maxWidth: 120,
          minWidth: 120,
          width: 120,
          suppressSizeToFit: true,
        },
      ],
      contextMenuActions: [
        { name: "Activate", action: "activate" },
        { name: "Copy", action: "copy" },
        { name: "Paste", action: "paste", disabled: true },
        { name: "Attach Hardware", action: "attachHardware" },
        { name: "Change Acu", action: "detachHardware" },
      ],
      contextMenuAPActions: [
        { name: "Delete", action: "delete" },
        { name: "Edit", action: "updateItem" },
      ],
      deleteACUItem: null,
      apTable: true,
      deleteApItem: null,
      acuTable: true,
      deviceId: null,
      upd_acu_component: null,
      formats: ["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      headerTitle: [],
      headerVal: [],
      activePrompt: false,
      exportType: "acc_point",
      detachHardwarePopups: false,
      detachHardwareData: null,
      detachDevId: null,
      copy_acu: null,
      paste_acu: null,
      itemsPerPage: 15,
      page: 1,
      totalPage: 0,

      pagePoint: 1,
      totalPagePoint: 0,
      itemsPerPagePoint: 15,
    };
  },
  computed: {
    acu() {
      return store.state.acu;
    },
    acu_count() {
      return store.state.acu_count;
    },
    acuPermissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions).Acu
          ? JSON.parse(localStorage.permissions).Acu.actions
          : null
        : null;
    },
    access_pointPermissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions).AccessPoint
          ? JSON.parse(localStorage.permissions).AccessPoint.actions
          : null
        : null;
    },
    access_points() {
      return store.state.access_points;
    },
    point_count() {
      return store.state.access_points_count;
    },
    // filter_acu_headers() {
    //   return this.acu_headers.filter((h) => h.show);
    // },
    filter_acu_headers() {
      return this.acu_header.filter((h) => h.show);
    },
    filter_access_point_headers() {
      return this.ap_header.filter((h) => h.show);
    },
    settingsStore() {
      return this.$store.state.settings;
    },
    totalPages() {
      return this.gridApi && this.gridApi.paginationGetTotalPages
        ? this.gridApi.paginationGetTotalPages()
        : 0;
    },
  },
  components: {
    Table,
    AddDevicePopup,
    AttachHardwarePopup,
    AddACU,
    ScreenConfig,
    UpdateACU,
    DetachHardwarePopup,
    vSelect,
    AcPointTable,
    AcuTable,
    CellRendererApActions,
  },
  beforeDestroy() {
    this.$root.$off("refreshAcApTable");
    this.$root.$off("refreshAcuTable");
    this.$root.$off("deleteAccessP");
    this.$root.$off("updateAccessP");
    this.$root.$off("activateAcu");
    this.$root.$off("copyAcu");
    this.$root.$off("pasteAcu");
    this.$root.$off("attachHardwareAcu");
    this.$root.$off("detachHardwareAcu");
    this.$root.$off("updateItemAcu");
    this.$root.$off("deleteAcu");
    this.$root.$off("closeUpdatePopup");
  },
};
</script>

<style lang="scss">
@import url("./css/style.css");

.access_point_page {
  .vx-card__header {
    position: absolute;
  }

  .table_block {
    .table_title {
      margin-top: 40px;
    }

    table {
      td {
        padding-top: 10px;
      }

      margin-top: 10px;
      width: 100%;
    }
  }

  .select_block {
    display: flex;
    margin: -15px;

    .v-select {
      flex: 0 0 33.33%;
      padding: 15px;
    }
  }

  .actions_block_acuu {
    .add_device {
      margin-left: 15px;
    }
  }

  .add_access_point {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  .popup_width_small {
    .vs-popup--content {
      padding-bottom: 0 !important;
    }

    .vs-popup {
      min-width: 1000px;
      min-height: 680px;
      max-height: 750px;
    }
  }
}
</style>

<style lang="scss">
.access_point_page {
  position: relative;

  .scr_config_acu {
    position: absolute;
    top: -46px;
    right: 0;

    .button {
      z-index: 9999999;
    }
  }

  .ap_tbl__padding {
    .con-input-search.vs-table--search {
      margin-right: 175px;
      margin-top: -60px;
    }

    .tr-values {
      .vs-table--td {
        padding: 0 15px !important;
      }
    }
  }

  .ap_tbl_padding {
    .con-input-search.vs-table--search {
      margin-right: 320px;
      margin-top: -60px;
    }

    .tr-values {
      .vs-table--td {
        padding: 0 15px !important;
      }
    }
  }

  .scr_config_acu {
    display: flex;
    flex-direction: row-reverse;
  }

  .screen_false {
    display: flex;
    flex-direction: row-reverse;
  }
}

.ac_point__popup .vs-popup {
  min-width: 950px !important;
}

// .ap_ag_grid {
//   height: auto;
// }
</style>
