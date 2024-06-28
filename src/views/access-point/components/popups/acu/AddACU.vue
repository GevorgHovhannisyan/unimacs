<template>
  <div class="acu_page_block">
    <vs-popup class="holamundo resource_popup" title="Add resources" :active.sync="addResourcesPopup">
      <ResourcePopup :resources="resources" v-if="addResourcesPopup" type="add" />
    </vs-popup>
    <vs-popup class="holamundo access_point_popup" title="Create Access Point" :active.sync="ap_name_popup">
      <vs-input label="Name" class="w-full" placeholder="Name" name="name" v-model="ap_name" v-validate="'required'" />

      <v-select v-model="ap_type" :options="point_types" class="select_padding acu_sel mt-4" name="ap_type"
        placeholder="Access Point type" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'"
        :selectable="(option) => !option.disabled" />
      <div class="vx-row w-full" style="margin: 0">
        <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse; padding: 0">
          <vs-button class="mt-5 ml-5 unimacs_button" :disabled="!isFormValid" @click="addAPName">
            Submit
          </vs-button>

          <vs-button class="mt-5 unimacs_cancel_button" @click="ap_name_popup = false">
            Cancel
          </vs-button>
        </div>
      </div>
    </vs-popup>
    <vs-popup class="holamundo acu_popup_width_small card_acu ac_point__popup" title="Create ACU / Access Point"
      :active.sync="popup">
      <div class="block_account add_acu_blok">
        <div class="row_block">
          <div class="left_block">
            <div class="vx-col _tree_block">
              <div class="acu_configs">
                <vs-button @click="expandAll" class="mt-3 acu_conf_btns">
                  <vs-icon class="acu_conf_icons" icon-pack="material-icons" icon="expand_more" /></vs-button>

                <vs-button @click="collapseAll" class="mt-3 acu_conf_btns">
                  <vs-icon class="acu_conf_icons" icon-pack="material-icons" icon="chevron_right" /></vs-button>

                <vs-button :disabled="disableAddButton" style="padding: 0px 30px !important" @click="contextMenuOpen"
                  class="mt-3 acu_conf_btns">
                  <vs-icon class="acu_conf_icons" icon-pack="material-icons" icon="add" /></vs-button>
              </div>

              <div class="tree_block">
                <div class="mt-5" style="background: white">
                  <ejs-treeview id="acu_tree" :nodeSelected="nodeSelected" :nodeClicked="nodeclicked" :fields="field"
                    v-if="field.dataSource.length">
                    <ejs-contextmenu id="acuu_menutrees" target="#acu_tree" :items="menuItems" :beforeOpen="beforeopen"
                      :select="menuclick"></ejs-contextmenu>
                  </ejs-treeview>
                </div>
              </div>
            </div>
          </div>
          <div class="right_block">
            <div class="inner_block">
              <div class="vx-col tabs_block" v-if="canCreate">
                <div class="overflow_hid">
                  <keep-alive>
                    <component :propsData="propsData" :is="acuComponent"></component>
                  </keep-alive>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="vx-col mt-5 buttons_groups" v-if="findOfType !== 'relay_boards'">
        <vs-button class="unimacs_cancel_button" @click="popup = false">
          Cancel
        </vs-button>
        <vs-button @click="addAcu" class="unimacs_button ml-5">
          Submit
        </vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import createACU from "../../acu/CreateACU";
import createAP from "../../access-point/AddAp";
import createDevice from "../device-config/DeviceConfig";
import vSelect from "vue-select";
import ResourcePopup from "../access-point/ResourcePopup";
import { treeData } from "@/functions/treeData";
import { uid } from "uid";

import RFID from "../../readers/RFID";
import KEYPAD from "../../readers/KEYPAD";
import FINGER from "../../readers/FINGERPRINT";
import FACE from "../../readers/FACE";

import Loop_sensor from "../../readers/Loop_sensor";
import Door_sensor from "../../readers/Door_sensor";
import Exit_button from "../../readers/Exit_button";
import Open_button from "../../readers/Open_button";
import Open_relay from "../../readers/Open_relay";
import Emergency_open from "../../readers/Emergency_open";
import Turnstile_ready from "../../readers/Turnstile_ready";
import Entry_relay from "../../readers/Entry_relay";
import Exit_relay from "../../readers/Exit_relay";
import Entry_button from "../../readers/Entry_button";
import Pass_control from "../../readers/Pass_control";

import Lock from "../../readers/Lock";
import Alarm_out from "../../readers/Alarm_out";
import Block_Turnstile from "../../readers/Block_Turnstile";
import Fire_Alarm_in from "../../readers/Fire_Alarm_in";
import Door_Ajar_Alarm_out from "../../readers/Door_Ajar_Alarm_out";
import Door_Forced_open_Alarm_out from "../../readers/Door_Forced_open_Alarm_out";

export default {
  props: {
    popupActive: {
      type: Boolean,
    },
    page: {
      type: Number,
      default: 1,
    },
    page_items_count: {
      type: Number,
      default: 10,
    },
    page_point: {
      type: Number,
      default: 1,
    },
    page_items_count_point: {
      type: Number,
      default: 10,
    },
  },
  watch: {
    popupActive(val) {
      this.popup = val;
      this.$emit("popup", val);
    },
    popup(val) {
      if (!val) {
        this.$store.commit("accessPoint/RESET_TREE");
        this.field.dataSource = [];
        this.canCreate = false;
        document.querySelector("body").classList.remove("popup_open_body");
      } else {
        this.canCreate = false;
        this.field.dataSource = treeData(this.acuCreateTree);
        setTimeout(() => {
          var treeObj = document.getElementById("acu_tree").ej2_instances[0];

          treeObj.selectedNodes = [`1`];
        }, 10);
        this.canCreate = true;
        this.acuComponent = "createACU";
        this.disableAddButton = true;

        document.querySelector("body").classList.add("popup_open_body");
      }
      this.$emit("popup", val);
    },
    ap_name_popup(val) {
      if (!val) {
        this.initAPInfo();

        if (!this.canCreateAp) {
          var treeObj = document.getElementById("acu_tree").ej2_instances[0];
          treeObj.selectedNodes = ["1"];
          this.canCreate = true;
          this.acuComponent = "createACU";
        }
      }
    },
  },
  computed: {
    acuCreateTree() {
      return this.$store.state.accessPoint.acuCreateTree;
    },
    ap_types() {
      return this.$store.state.accessPoint.points_types;
    },
    isFormValid() {
      return this.ap_name && this.ap_type;
    },
    active_point() {
      return this.$store.state.accessPoint.active_point;
    },
    acu_data() {
      return this.$store.state.accessPoint.acu_data;
    },
    reader_types() {
      return this.$store.state.accessPoint.reader_types;
    },
    isFloor() {
      let model = this.$store.state.accessPoint.acu_data.model;
      let elevator_mode = this.$store.state.accessPoint.acu_data.elevator_mode;

      if ((model == "Icon" || model == "Icon-PRO") && elevator_mode) {
        return true;
      } else {
        return false;
      }
    },
    point_types() {
      let types = [...this.ap_types];
      if (this.isFloor) {
        types.map((t) => {
          if (t.label !== "Floor") {
            return (t.disabled = true);
          }
        });
      } else {
        types.map((t) => {
          if (t.label !== "Floor") {
            return (t.disabled = false);
          }
        });
      }
      return types;
    },
    acuModel() {
      return this.$store.state.accessPoint.acu_data.model;
    },
    acu_models() {
      return this.$store.state.accessPoint.acu_model.controllers;
    },
  },
  data() {
    return {
      findOfType: null,
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
        htmlAttributes: "hasAttribute",
      },
      menuItems: [{ text: "Delete" }, { text: "Add Resources" }],
      resources: [],
      canCreate: false,
      popup: false,
      acuComponent: null,
      ap_type: null,
      ap_name: null,
      ap_name_popup: false,
      canCreateAp: false,
      propsData: null,
      addResourcesPopup: false,
      sensorType: null,
      saveResourceData: null,
      reader_type: {
        RFID: 0,
        KEYPAD: 1,
        FINGER: 2,
        FACE: 3,
      },
      disableAddButton: true,
    };
  },
  methods: {
    nodeSelected(event) {
      const data = event.nodeData;
    },
    addAcu() {
      let data = Object.assign({}, this.$store.state.accessPoint.acu_data);

      let saveObj = Object.assign({}, data);
      let objForSend = Object.assign({}, { ...data });

      const points = [];
      if (Object.keys(saveObj.access_points).length) {
        for (const key in saveObj.access_points) {
          delete saveObj.access_points[key]["id"];
          let access_point = { ...saveObj.access_points[key] };
          let readers = [];
          let resources = {};
          if (
            access_point.readers &&
            Object.keys(access_point.readers).length
          ) {
            for (const i in access_point.readers) {
              if (access_point.readers[i].data.title == "readers") {
                const item = access_point.readers[i].reader_info;

                if (access_point.readers[i].reader_info.wg_type === -1) {
                  let readerObj = {
                    type: this.reader_type[item.name],
                    osdp_address: item.osdp_address,
                    direction: item.direction,
                    mode: item.mode,
                    port: item.port,
                    wg_type: item.wg_type,
                    enable_buzzer: item.enable_buzzer,
                    enable_crc: item.enable_crc,
                    name: item.name,
                    leaving_zone: item.leaving_zone,
                    came_to_zone: item.came_to_zone,
                    osdp_data: {
                      baud_rate: item.baud_rate,
                      card_data_format_flags: item.card_data_format_flags,
                      configuration: item.configuration,
                      enable_osdp_secure_channel:
                        item.enable_osdp_secure_channel,
                      enable_osdp_tracing: item.enable_osdp_tracing,
                      led_mode: item.led_mode,
                      keypad_mode: item.keypad_mode,
                      offline_mode: item.offline_mode,
                    },
                  };

                  readers.push(readerObj);
                } else {
                  let readerObj = {
                    type: this.reader_type[item.name],
                    direction: item.direction,
                    mode: item.mode,
                    port: item.port,
                    wg_type: item.wg_type,
                    enable_buzzer: item.enable_buzzer,
                    enable_crc: item.enable_crc,
                    reverse_byte_order: item.reverse_byte_order,
                    name: item.name,
                    leaving_zone: item.leaving_zone,
                    came_to_zone: item.came_to_zone,
                  };
                  readers.push(readerObj);
                }
              } else {
                resources[access_point.readers[i].name] =
                  access_point.readers[i].reader_info;
              }
            }
          }
          access_point.resources = resources;

          if (!this.isFloor) {
            access_point.readers = readers;
          }
          access_point.type = access_point.real_type;

          points.push(access_point);
        }
      }

      if (this.isFloor) {
        const reader_default = {
          type: 0,
          port: 1,
          wg_type: 0,
          mode: 0,
          direction: 0,
          enable_buzzer: true,
          enable_crc: true,
          reverse_byte_order: true,
        };
        objForSend.readers = reader_default;
      }

      objForSend.access_points = points;

      if (this.isFloor && objForSend.access_points.length) {
        objForSend.access_points.forEach((point) => {
          delete point.readers;
        });
      }
      this.$vs.loading({
        type: "corners",
      });

      const filterObj = this.delKeys(objForSend);

      this.$store
        .dispatch("accessPoint/createACU", filterObj)
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "ACU Created",
          });

          const params = {
            page: this.page,
            page_items_count: this.page_items_count,
          };
          const pointParams = {
            page: this.page_point,
            page_items_count: this.page_items_count_point,
          };

          this.$store.dispatch("accessPoint/fetchACUs",params).then((res) => {
            this.$vs.loading.close();
          });

          this.$store.dispatch("accessPoint/fetchAccessPoint", pointParams).then((res) => {
            this.$vs.loading.close();
          });

          this.$store.commit("accessPoint/RESET_TREE");
          this.popup = false;
          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    delKeys(cloneObj) {
      const obj = JSON.parse(JSON.stringify(cloneObj))
      if (obj.time) {
        if ('timezone_from_facility' in obj.time) delete obj.time['timezone_from_facility'];
        if ('daylight_saving_time_from_user_account' in obj.time) delete obj.time['daylight_saving_time_from_user_account'];

      }

      return obj
    },
    nodeclicked(args) {
      let model = this.$store.state.accessPoint.acu_data.model;
      var treeObj = document.getElementById("acu_tree").ej2_instances[0];
      const item = treeObj.getNode(args.node);
      const treeData = treeObj.getTreeData();
      const findType = treeData.find((d) => d.id == item.id);
      this.findOfType = findType.item_type;
      if (findType.item_type == "acu") {
        this.canCreate = true;
        this.acuComponent = "createACU";
        this.disableAddButton = true;
      } else if (findType.item_type == "access_point") {
        const apModel = this.acu_models[model];
        let canCreateCnt = 0;
        if (this.isFloor) {
          canCreateCnt = apModel.floor_count;
        } else {
          canCreateCnt = apModel.access_points_count;
        }

        let sumCnt = 0;

        if (
          this.acu_data.access_points &&
          Object.keys(this.acu_data.access_points).length
        ) {
          sumCnt += Object.keys(this.acu_data.access_points).length;
        }

        if (sumCnt >= canCreateCnt) {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "You can't create more access points",
          });
        } else {
          if (!model) {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Select ACU model",
            });
            treeObj.selectedNodes = ["1"];
            this.canCreate = true;

            this.acuComponent = "createACU";
          } else {
            this.ap_name_popup = true;
            this.acuComponent = null;
            this.canCreate = false;
            this.disableAddButton = false;
          }
        }
      } else if (findType.item_type == "access_point_inner") {
        this.$store.commit("accessPoint/CHANGE_ACTIVE_POINT", item.id);

        if (
          findType.type == "turnstile_one_side" ||
          findType.type == "turnstile_two_side"
        ) {
          findType.type = "turnstile";
        }
        this.fetchResources(findType.type);
        this.acuComponent = null;
        this.canCreate = true;
        this.acuComponent = "createAP";
        this.disableAddButton = false;
      } else if (findType.item_type == "readers") {
        const reader_name = findType.data.device;
        const get_parent = treeData.find((d) => d.id == item.parentID);
        this.$store.commit("accessPoint/CHANGE_ACTIVE_POINT", get_parent.id);
        this.$store.commit("accessPoint/CHANGE_ACTIVE_READER", findType.id);
        this.acuComponent = reader_name;
        this.canCreate = true;
        this.disableAddButton = true;
      } else if (findType.type == "device") {
        this.disableAddButton = true;
        this.canCreate = true;
        this.acuComponent = "createDevice";
        this.propsData = item;
      } else {
        this.disableAddButton = true;
        this.canCreate = false;
        this.acuComponent = null;
      }
    },
    beforeopen: function (args) {
      var treevalidate = document.getElementById("acu_tree").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];
      if (!targetNodeId) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Select some item",
        });
        return false;
      } else {
        var targetNode = document.querySelector(
          '[data-uid="' + targetNodeId + '"]'
        );

        var contentmenutree =
          document.getElementById("acuu_menutrees").ej2_instances[0];

        if (targetNode.classList.contains("resource")) {
          contentmenutree.enableItems(["Add Resources"], true);
        } else {
          contentmenutree.enableItems(["Add Resources"], false);
        }

        if (targetNode.classList.contains("delete")) {
          contentmenutree.enableItems(["Delete"], true);
        } else {
          contentmenutree.enableItems(["Delete"], false);
        }
      }
    },
    menuclick: function (args) {
      var treevalidate = document.getElementById("acu_tree").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];
      var treeNodes = treevalidate.getTreeData();

      if (args.item.text == "Delete") {
        let deleteItem = treevalidate.getNode(targetNodeId);
        const tree_item = treeNodes.find((i) => i.id == deleteItem.id);
        treevalidate.removeNodes([deleteItem.id]);
        this.$store.commit("accessPoint/DELETE_TREE_ITEM", tree_item);
      }
      if (args.item.text == "Add Resources") {
        if (this.resources.length) {
          this.addResourcesPopup = true;
        } else {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "No Access Point",
          });
        }
      }
    },
    addAPName() {
      var treevalidate = document.getElementById("acu_tree").ej2_instances[0];

      const deviceType = {
        name: this.ap_name,
        id: uid(12),
        pid: 3,
        item_type: "access_point_inner",
        hasAttribute: { class: "resource delete" },
        expanded: true,
        real_type: this.ap_type,
      };
      if (
        this.ap_type === "turnstile_two_side" &&
        (this.acu_data.model === "Icon" || this.acu_data.model === "Icon-PRO")
      ) {
        if (
          this.acu_data.access_points &&
          Object.keys(this.acu_data.access_points).length
        ) {
          let canCreate = true
          const ap = this.acu_data.access_points
          for (const key in ap) {
            if (ap[key].real_type === 'turnstile_two_side') canCreate = false
          }
          if (!canCreate) {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Can't add more than one access point",
            });
            return false;
          }
        }
      }

      this.canCreateAp = true;
      this.ap_name_popup = false;
      this.canCreate = true;

      if (
        this.ap_type == "turnstile_one_side" ||
        this.ap_type == "turnstile_two_side"
      ) {
        deviceType.type = "turnstile";
      } else {
        deviceType.type = this.ap_type;
      }

      treevalidate.addNodes([deviceType], null, null);

      this.$store.commit("accessPoint/SET_POINT", {
        ...deviceType,
      });

      this.fetchResources(deviceType.type);
      this.$store.commit("accessPoint/CHANGE_ACTIVE_POINT", deviceType.id);
      treevalidate.selectedNodes = [`${deviceType.id}`];
      this.acuComponent = "createAP";
    },
    addResources(obj) {
      var treevalidate = document.getElementById("acu_tree").ej2_instances[0];
      const treeData = treevalidate.getTreeData();
      if (obj.length) {
        obj.forEach((item) => {
          const res = {};
          res.name = item.device;
          res.id = uid(12);
          res.data = item;
          res.pid = treevalidate.selectedNodes[0];
          res.hasAttribute = { class: "delete" };
          res.item_type = "readers";
          res.expanded = true;
          this.$store.commit("accessPoint/SET_READER", res);

          treevalidate.addNodes([res], treevalidate.selectedNodes[0], null);
        });
      }

      this.addResourcesPopup = false;
    },
    initAPInfo() {
      this.ap_type = null;
      this.ap_name = null;
    },
    resetTree() {
      var treevalidate = document.getElementById("acu_tree").ej2_instances[0];
      treevalidate.selectedNodes = [];

      this.canCreate = false;
      this.acuComponent = null;
    },
    isValid(obj) {
      return obj.name && obj.model;
    },
    async fetchResources(type) {
      let res = await this.$store.dispatch("accessPoint/fetchResource", type);
        let resources = res.data.resources;

        if (
          this.acu_data.access_points[this.active_point].readers &&
          Object.keys(this.acu_data.access_points[this.active_point].readers)
            .length
        ) {
          let readers = {
            ...this.acu_data.access_points[this.active_point].readers,
          };

          for (const key in readers) {
            if (this.reader_types[readers[key].name] !== "readers") {
              delete resources[this.reader_types[readers[key].name]][
                readers[key].name
              ];
            }
          }
        }

        this.saveResourceData = resources;
        this.$store.commit("accessPoint/SET_RESOURCE", resources);

        let filter = [];
        if (resources && Object.keys(resources).length) {
          Object.keys(resources).forEach((name) => {
            if (this.isFloor) {
              if (name !== "readers") {
                if (Object.keys(resources[name]).length) {
                  let obj = {};
                  obj.title = name;
                  obj.devices = [];
                  Object.keys(resources[name]).forEach((key) => {
                    obj.devices.push(key);
                  });
                  filter.push(obj);
                }
              }
            } else {
              if (Object.keys(resources[name]).length) {
                let obj = {};
                obj.title = name;
                obj.devices = [];
                Object.keys(resources[name]).forEach((key) => {
                  obj.devices.push(key);
                });
                filter.push(obj);
              }
            }
          });
        }
        this.resources = filter;
    },
    getTreeItem(id) {
      return this.$store.state.accessPoint.acuCreateTree.find(
        (acu) => acu.id == id
      ).item_type;
    },
    expandAll() {
      var treevalidate = document.getElementById("acu_tree").ej2_instances[0];
      treevalidate.expandAll();
    },
    collapseAll() {
      var treevalidate = document.getElementById("acu_tree").ej2_instances[0];
      treevalidate.collapseAll();
    },
    async contextMenuOpen() {
      var treevalidate = document.getElementById("acu_tree").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];
      let item = treevalidate.getNode(targetNodeId);
      const treeData = treevalidate.getTreeData();
      let findType = { ...treeData.find((d) => d.id == item.id) };
      const type = findType.item_type;
      await this.fetchResources(findType.type);
      if (type === "access_point") {
        this.ap_name_popup = true;
      } else if (type === "access_point_inner") {
        if (this.resources.length) {
          this.addResourcesPopup = true;
        } else {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "No Access Point",
          });
        }
      }
    },
  },
  created() {
    this.popup = this.popupActive;

    this.$root.$on("resetTree", () => {
      this.resetTree();
    });
  },
  components: {
    createACU,
    createAP,
    vSelect,
    ResourcePopup,
    Exit_button,
    createDevice,
    RFID,
    Door_sensor,
    Lock,
    Fire_Alarm_in,
    Door_Ajar_Alarm_out,
    Door_Forced_open_Alarm_out,
    Alarm_out,
    Block_Turnstile,
    KEYPAD,
    FINGER,
    FACE,
    Loop_sensor,
    Open_button,
    Open_relay,
    Emergency_open,
    Turnstile_ready,
    Entry_relay,
    Exit_relay,
    Pass_control,
    Entry_button,
  },
};
</script>

<style lang="scss">
.card_acu {
  .vs-popup--content {
    flex-direction: column;
    align-items: flex-end;
  }

  .row_block,
  .block_account {
    padding: 0;
  }

  .block_account {
    height: 630px;
  }
}

.card_acu {
  .vs-popup--content {
    flex: 1;
    display: flex;
  }

  .inner_block {
    padding: 25px 10px;
  }

  .list_menu {
    list-style-type: none;
    margin: 0;
    padding: 25px 10px;
    border-right: 1px solid slategray;
  }

  .list_menu li {
    margin-bottom: 15px;
  }

  .list_menu a {
    text-decoration: blink;
    display: flex;
    align-items: center;
  }

  .list_menu span {
    background: #00acee;
    color: white;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 12px;
    line-height: 1.33em;
    border-radius: 3px;
  }

  .block_account {
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    margin: 0 auto;
    display: flex;
  }

  .row_block {
    display: flex;
    border-radius: 5px;
    // padding: 10px;
    margin: 0 -15px;
    // box-shadow: 0 1px 10px 1px #00000012;
    background-color: white;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }

  .right_block {
    flex: 0 0 70%;
    max-width: 70%;
    padding: 0 15px;
  }

  .left_block {
    flex: 0 0 30%;
    max-width: 30%;
    padding: 0 15px;
    // border-right: 1px solid #0000001f;
  }

  .row_block::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    border-radius: 0;
    background: #e5e5e5;
  }

  .row_block::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #999999;
  }

  .right_block,
  .left_block {
    min-height: 300px;
  }
}

.acu_popup_width_small {
  .vs-popup {
    min-width: 1000px;
    min-height: 680px;
    max-height: 750px;
  }
}

.overflow_hid .con-tab.vs-tabs--content {
  overflow-x: unset !important;
}
</style>

<style lang="scss" scoped>
.tabs_block {
  position: relative;
  padding-top: 10px;
}

.access_point_popup {
  .vs-popup {
    // min-height: 300px; //will delete if ok
  }
}
</style>
