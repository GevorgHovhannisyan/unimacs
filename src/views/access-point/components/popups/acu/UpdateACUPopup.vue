<template>
  <div>
    <vs-popup class="holamundo deivce_popups" title="Add Device" :active.sync="addDevicePopup">
      <AddDevicePopup :popupActive="addDevicePopup" />
    </vs-popup>
    <vs-popup class="holamundo resource_popup" title="Add resources" :active.sync="addResourcesPopup">
      <ResourcePopup :resources="resources" v-if="addResourcesPopup" type="update" />
    </vs-popup>
    <vs-popup class="holamundo access_point_popup acu_sel" title="Create Access Point" :active.sync="ap_name_popup">
      <vs-input label="Name" class="w-full" placeholder="Name" name="name" v-model="ap_name" v-validate="'required'" />

      <v-select v-model="ap_type" :options="point_types" class="select_padding mt-4" name="ap_type"
        placeholder="Access Point type" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'"
        :selectable="(option) => !option.disabled" />

      <div class="vx-row w-full" style="margin: 0">
        <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse; padding: 0">
          <vs-button class="mt-5 unimacs_button" :disabled="!isFormValid" @click="addAPName">
            Submit
          </vs-button>
        </div>
      </div>
    </vs-popup>
    <div class="card_acu_edit">
      <div class="block_account">
        <div class="row_block">
          <div class="left_block">
            <div class="vx-col edit_tree_block">
              <div class="acu_configs">
                <vs-button @click="expandAll" class="mt-3 acu_conf_btns">
                  <vs-icon class="acu_conf_icons" icon-pack="material-icons" icon="expand_more" />
                </vs-button>

                <vs-button @click="collapseAll" class="mt-3 acu_conf_btns">
                  <vs-icon class="acu_conf_icons" icon-pack="material-icons" icon="chevron_right" />
                </vs-button>

                <vs-button :disabled="disableAddButton" style="padding: 0px 30px !important" @click="contextMenuOpen"
                  class="mt-3 acu_conf_btns">
                  <vs-icon class="acu_conf_icons" icon-pack="material-icons" icon="add" />
                </vs-button>
              </div>
              <div class="tree_blocks">
                <div class="mt-5" style="background: white">
                  <ejs-treeview id="edit_acu_tree" ref="edit_acu_tree" :nodeSelected="nodeSelected"
                    :nodeClicked="nodeclicked" :fields="fields" v-if="fields.dataSource.length">
                    <ejs-contextmenu id="acuu_menutree" target="#edit_acu_tree" :items="menuItems"
                      :beforeOpen="beforeopen" :select="menuclicks"></ejs-contextmenu>
                  </ejs-treeview>
                </div>
              </div>
            </div>
          </div>
          <div class="right_block">
            <div class="inner_block">
              <div class="vx-col edit_tabs_block" v-if="canCreate">
                <keep-alive>
                  <component :propsData="propsData" :is="acuComponent"></component>
                </keep-alive>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="vx-col mt-5 buttons_group" v-if="findOfType !== 'relay_boards'">
        <vs-button @click="updateAcu" class="unimacs_button ml-3">
          Submit
        </vs-button>
        <vs-button class="ml-5 unimacs_cancel_button" @click="$parent.$parent.popups.editACUPopup = false">
          Cancel
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import updateACU from "../../acu/UpdateACU";
import time_zones from "@/assets/json_files/time_zones.json";

import updateAP from "../../access-point/UpdateAP";
import createDevice from "../device-config/DeviceConfig";
import vSelect from "vue-select";
import ResourcePopup from "../access-point/UpdateResourcePopup";
import { treeData } from "@/functions/treeData";
// import { validateTypes } from "@/functions/acuValidator";
import { uid } from "uid";

import RFID from "../../readers/update/RFID";
import KEYPAD from "../../readers/update/KEYPAD";
import FINGER from "../../readers/update/FINGERPRINT";
import FACE from "../../readers/update/FACE";

import Loop_sensor from "../../readers/update/Loop_sensor";
import Door_sensor from "../../readers/update/Door_sensor";
import Exit_button from "../../readers/update/Exit_button";
import Open_button from "../../readers/update/Open_button";
import Open_relay from "../../readers/update/Open_relay";
import Emergency_open from "../../readers/update/Emergency_open";
import Turnstile_ready from "../../readers/update/Turnstile_ready";
import Entry_button from "../../readers/update/Entry_button";
import Entry_relay from "../../readers/update/Entry_relay";
import Exit_relay from "../../readers/update/Exit_relay";
import Pass_control from "../../readers/update/Pass_control";

import Lock from "../../readers/update/Lock";
import Alarm_out from "../../readers/update/Alarm_out";
import Block_Turnstile from "../../readers/update/Block_Turnstile";
import Fire_Alarm_in from "../../readers/update/Fire_Alarm_in";
import Door_Ajar_Alarm_out from "../../readers/update/Door_Ajar_Alarm_out";
import Door_Forced_open_Alarm_out from "../../readers/update/Door_Forced_open_Alarm_out";

import DeviceDragAndDrop from "../AddDeviceDragDrop.vue";
import AddDevicePopup from "../AddDeviceDragDrop";

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
      this.$emit("popup", val);
    },
    ap_name_popup(val) {
      if (!val) {
        this.initAPInfo();
      }
    },
  },
  computed: {
    acu_edit_tree() {
      return this.$store.state.accessPoint.acu_edit_tree;
    },
    ap_types() {
      return this.$store.state.accessPoint.points_types;
    },
    isFormValid() {
      return this.ap_name && this.ap_type;
    },
    active_point() {
      return this.$store.state.accessPoint.edit_active_point;
    },
    acu_data() {
      return this.$store.state.accessPoint.edit_acu_data;
    },
    reader_types() {
      return this.$store.state.accessPoint.reader_types;
    },
    extDevice() {
      return this.$store.state.accessPoint.edit_acu_data.ext_devices;
    },
    acu_controllers() {
      return this.$store.state.accessPoint.acu_model.controllers;
    },
    isFloor() {
      let model = this.$store.state.accessPoint.edit_acu_data.model;
      let elevator_mode =
        this.$store.state.accessPoint.edit_acu_data.elevator_mode;

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
          } else {
            return (t.disabled = false);
          }
        });
      } else {
        types.map((t) => {
          if (t.label === "Floor") {
            return (t.disabled = true);
          } else {
            return (t.disabled = false);
          }
        });
      }
      return types;
    },
  },
  data() {
    return {
      findOfType: null,
      fields: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
        htmlAttributes: "hasAttribute",
      },
      menuItems: [
        { text: "Add Access Points" },
        { text: "Add Devices" },
        { text: "Add Resources" },
        { text: "Delete" },
      ],
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
      reader: {
        0: "RFID",
        1: "KEYPAD",
        2: "FINGER",
        3: "FACE",
      },
      reader_type: {
        RFID: 0,
        KEYPAD: 1,
        FINGER: 2,
        FACE: 3,
      },
      // deviceCounter: 0,
      addDevicePopup: false,
      disableAddButton: true,
    };
  },
  methods: {
    nodeSelected(event) {
      const data = event.nodeData;
    },
    showToast(text) {
      this.$vs.notify({
        time: 7000,
        color: "danger",
        title: `Invalid ${text} Parameter`,
      });
    },
    updateAcu() {
      const data = { ...this.$store.state.accessPoint.edit_acu_data };
      let saveObj = JSON.parse(JSON.stringify(data));
      let error = false
      if (data.access_points.length) {
        saveObj.access_points.forEach((point) => {
          let new_point = point;
          if (
            new_point.new_readers &&
            Object.keys(new_point.new_readers).length
          ) {
            for (const i in new_point.new_readers) {
              let new_reader = new_point.new_readers[i];
              if (new_reader.data.title == "readers") {
                if (new_reader.reader_info["id"]) {
                  delete new_reader.reader_info["id"];
                } else if (new_reader.id) {
                  delete new_reader["id"];
                }
                const item = new_reader.reader_info;
                if (new_reader.reader_info.wg_type === -1) {
                  let readerObj = this.ocdpBind(item);
                  new_point.readers.push(readerObj);
                } else {
                  let readerObj = this.wgBind(item);
                  new_point.readers.push(readerObj);
                }
              } else {
                if (new_reader.reader_info && new_reader.reader_info["id"]) {
                  delete new_reader.reader_info["id"];
                } else if (new_reader.id) {
                  delete new_reader["id"];
                }
                new_point.resources[new_reader.name] = new_reader.reader_info;

                // if (this.isFloor) {
                const findExtDev = data.ext_devices.find(
                  (d) => d.id == new_reader.reader_info.component_source
                );
                if (new_reader.reader_info.component_source != 0) {
                  if (findExtDev && findExtDev.address) {
                    new_point.resources[new_reader.name].ext_device_address =
                      +findExtDev.address;
                  }
                } else {
                  new_point.resources[new_reader.name].ext_device_address = 0;
                }
                // }
              }
            }
          }
        });
      }
      if (
        saveObj.new_access_points &&
        Object.keys(saveObj.new_access_points).length
      ) {
        for (const key in saveObj.new_access_points) {
          delete saveObj.new_access_points[key]["id"];
          let access_point = { ...saveObj.new_access_points[key] };
          let readers = [];
          let resources = {};

          if (
            access_point.readers &&
            Object.keys(access_point.readers).length
          ) {
            for (const i in access_point.readers) {
              if (access_point.readers[i].data.title == "readers") {
                delete access_point.readers[i].reader_info["id"];
                const item = access_point.readers[i].reader_info;
                if (access_point.readers[i].reader_info.wg_type === -1) {
                  let readerObj = this.ocdpBind(item);
                  readers.push(readerObj);
                } else {
                  let readerObj = this.wgBind(item);
                  readers.push(readerObj);
                }
              } else {
                delete access_point.readers[i].reader_info["id"];
                resources[access_point.readers[i].name] =
                  access_point.readers[i].reader_info;

                // if (this.isFloor) {
                const findExtDev = data.ext_devices.find(
                  (d) =>
                    d.id == access_point.readers[i].reader_info.component_source
                );
                if (access_point.readers[i].reader_info.component_source != 0) {
                  if (findExtDev && findExtDev.address) {
                    access_point.readers[i].ext_device_address =
                      +findExtDev.address;
                  }
                } else {
                  access_point.readers[i].ext_device_address = 0;
                }
                // }
              }
            }
          }
          access_point.readers = readers;
          access_point.resources = resources;
          access_point.type = access_point.real_type;
          saveObj.access_points.push(access_point);
        }
      }

      if (saveObj.access_points.length) {
        for (let i = 0; i < saveObj.access_points.length; i++) {
          const readerArr = [];
          if (
            saveObj.access_points[i].readers &&
            saveObj.access_points[i].readers.length
          ) {
            for (let j = 0; j < saveObj.access_points[i].readers.length; j++) {
              const reader_data = saveObj.access_points[i].readers[j];
              if (!reader_data.deleted) {
                let new_data = { ...reader_data };
                if (reader_data.wg_type == -1) {
                  new_data.osdp_data = this.checkDataOsdp(reader_data);
                } else {
                  // new_data.came_to_zone = reader_data.came_to_zone;
                  // new_data.leaving_zone = reader_data.leaving_zone;
                  new_data.direction = reader_data.direction;
                  new_data.enable_buzzer = reader_data.enable_buzzer;
                  new_data.enable_crc = reader_data.enable_crc;
                  new_data.mode = reader_data.mode;
                  new_data.name = reader_data.name;
                  new_data.port = reader_data.port;
                  new_data.reverse_byte_order = reader_data.reverse_byte_order;
                  new_data.type = reader_data.type;
                  new_data.wg_type = reader_data.wg_type;
                  new_data.osdp_data = null;
                }
                readerArr.push(new_data);
              }
            }

            saveObj.access_points[i].readers = readerArr;
          }

          // if (this.isFloor) {
          if (
            saveObj.access_points[i].resources &&
            Object.keys(saveObj.access_points[i].resources).length
          ) {
            const resources = saveObj.access_points[i].resources;

            for (const key in resources) {
              const findExtDev = data.ext_devices.find(
                (d) => d.id == resources[key].component_source
              );
              if (resources[key].component_source != 0) {
                if (findExtDev && findExtDev.address) {
                  saveObj.access_points[i].resources[key].ext_device_address =
                    +findExtDev.address;
                }
              } else {
                saveObj.access_points[i].resources[key].ext_device_address = 0;
              }
            }
          }
          // }
        }
      }
      if (this.isFloor) {
        let reader = {};
        if (data.readers) {
          if (typeof data.readers.id !== "string") {
            reader.id = data.readers.id;
          }
          if (data.readers.wg_type == -1) {
            reader.type = data.readers.type;
            reader.osdp_address = data.readers.osdp_address;
            reader.direction = data.readers.direction;
            reader.mode = data.readers.mode;
            reader.port = data.readers.port;
            reader.wg_type = data.readers.wg_type;
            reader.enable_buzzer = data.readers.enable_buzzer;
            reader.enable_crc = data.readers.enable_crc;
            reader.name = data.readers.name;
            reader.leaving_zone = data.readers.leaving_zone;
            reader.came_to_zone = data.readers.came_to_zone;

            reader.osdp_data = this.checkDataOsdp(data.readers);
          } else {
            reader.came_to_zone = data.readers.came_to_zone;
            reader.direction = data.readers.direction;
            reader.enable_buzzer = data.readers.enable_buzzer;
            reader.enable_crc = data.readers.enable_crc;
            reader.leaving_zone = data.readers.leaving_zone;
            reader.mode = data.readers.mode;
            reader.name = data.readers.name;
            reader.port = data.readers.port;
            reader.reverse_byte_order = data.readers.reverse_byte_order;
            reader.type = data.readers.type;
            reader.wg_type = data.readers.wg_type;
            reader.osdp_data = null;
          }
        } else {
          reader.type = 0;
          reader.port = 1;
          reader.wg_type = 0;
          reader.mode = 0;
          reader.direction = 0;
          reader.enable_buzzer = true;
          reader.enable_crc = true;
          reader.reverse_byte_order = true;
        }
        saveObj.readers = reader;
      }
      if (
        saveObj.time &&
        saveObj.time.time_zone &&
        typeof saveObj.time.time_zone !== "number"
      ) {
        const timeZone = time_zones.find(
          (t) => t.value === saveObj.time.time_zone
        );
        const firstSplit = timeZone.label.split("(GMT")[1];
        saveObj.time.time_zone_unix = firstSplit.split(")")[0];
      }


      if (saveObj.access_points && saveObj.access_points.length) {
        let shouldBreak = false;
        for (let i = 0; i < saveObj.access_points.length; i++) {
          const point = saveObj.access_points[i];

          if (point.resources && Object.keys(point.resources).length) {
            for (const key in point.resources) {
              const resource = point.resources[key];
              if (resource.data.title === 'inputs') {
                if (!('condition' in resource) || resource.condition == null) {
                  console.log('chkaa');
                  resource.condition = null
                  error = true;
                  this.showToast('Condition')
                  shouldBreak = true;
                  break;
                }
                if (!('input' in resource) || resource.input == null) {
                  resource.input = null
                  error = true;
                  this.showToast('Input')
                  shouldBreak = true;
                  break;
                }
              } else if (resource.data.title === 'outputs') {

                if (!('component_source' in resource) || resource.component_source == null) {
                  resource.component_source = null
                  error = true;
                  this.showToast('Component Source')
                  break;
                } else if (('component_source' in resource)) {
                  // if (resource.component_source === 0) {
                  if (!resource.output) {
                    error = true;
                    this.showToast('Output')
                    shouldBreak = true;
                    break;
                  }
                  if (!('relay_mode' in resource) || resource.relay_mode == null) {
                    error = true;
                    this.showToast('Relay Mode')
                    shouldBreak = true;
                    break;
                  }
                  if ('relay_mode' in resource && resource.relay_mode === 1) {
                    if (!('impulse_time' in resource) || resource.impulse_time == null) {
                      error = true;
                      this.showToast('Impulse Duration')
                      shouldBreak = true;
                      break;
                    }
                  }
                  if (!('entry_exit_open_durations' in resource) || resource.entry_exit_open_durations == null) {
                    resource.component_source = null
                    error = true;
                    this.showToast('Hold Duration')
                    shouldBreak = true;
                    break;
                  }

                  // }
                }
                // if()
              }
            }
          }
          if (shouldBreak) {
            // Break out of the outer loop
            break;
          }
        }
      }
      if (error) return false



      // // TODO END

      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("accessPoint/updateACU", saveObj)
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "ACU Updated",
          });
          const params = {
            page: this.page,
            page_items_count: this.page_items_count,
          };
          this.$store.dispatch("accessPoint/fetchACUs", params).then((res) => {
            this.$vs.loading.close();
          });

          const pointParams = {
            page: this.page_point,
            page_items_count: this.page_items_count_point,
          };

          this.$store
            .dispatch("accessPoint/fetchAccessPoint", pointParams)
            .then((res) => {
              this.$vs.loading.close();
            });

          this.$parent.$parent.popups.editACUPopup = false;
          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    checkDataOsdp(reader_data) {
      const data = {};
      if (reader_data.baud_rate) {
        data.baud_rate = reader_data.baud_rate;
      } else if (reader_data.osdp_data && reader_data.osdp_data.baud_rate) {
        data.baud_rate = reader_data.osdp_data.baud_rate;
      } else {
        data.baud_rate = null;
      }

      if ("card_data_format_flags" in reader_data) {
        data.card_data_format_flags = reader_data.card_data_format_flags;
      } else if (
        reader_data.osdp_data &&
        reader_data.osdp_data !== "null" &&
        "card_data_format_flags" in reader_data.osdp_data
      ) {
        data.card_data_format_flags =
          reader_data.osdp_data.card_data_format_flags;
      } else {
        data.card_data_format_flags = null;
      }

      if ("keypad_mode" in reader_data) {
        data.keypad_mode = reader_data.keypad_mode;
      } else if (
        reader_data.osdp_data &&
        reader_data.osdp_data !== "null" &&
        "keypad_mode" in reader_data.osdp_data
      ) {
        data.keypad_mode = reader_data.osdp_data.keypad_mode;
      } else {
        data.keypad_mode = null;
      }

      if ("configuration" in reader_data) {
        data.configuration = reader_data.configuration;
      } else if (
        reader_data.osdp_data &&
        reader_data.osdp_data !== "null" &&
        "configuration" in reader_data.osdp_data
      ) {
        data.configuration = reader_data.osdp_data.configuration;
      } else {
        data.configuration = null;
      }

      if ("led_mode" in reader_data) {
        data.led_mode = reader_data.led_mode;
      } else if (
        reader_data.osdp_data &&
        reader_data.osdp_data !== "null" &&
        "led_mode" in reader_data.osdp_data
      ) {
        data.led_mode = reader_data.osdp_data.led_mode;
      } else {
        data.led_mode = null;
      }

      if ("offline_mode" in reader_data) {
        data.offline_mode = reader_data.offline_mode;
      } else if (
        reader_data.osdp_data &&
        reader_data.osdp_data !== "null" &&
        "offline_mode" in reader_data.osdp_data
      ) {
        data.offline_mode = reader_data.osdp_data.offline_mode;
      } else {
        data.offline_mode = null;
      }

      if ("enable_osdp_secure_channel" in reader_data) {
        data.enable_osdp_secure_channel =
          reader_data.enable_osdp_secure_channel;
      } else if (
        reader_data.osdp_data &&
        reader_data.osdp_data !== "null" &&
        "enable_osdp_secure_channel" in reader_data.osdp_data
      ) {
        data.enable_osdp_secure_channel =
          reader_data.osdp_data.enable_osdp_secure_channel;
      } else {
        data.enable_osdp_secure_channel = false;
      }

      if ("enable_osdp_tracing" in reader_data) {
        data.enable_osdp_tracing = reader_data.enable_osdp_tracing;
      } else if (
        reader_data.osdp_data &&
        reader_data.osdp_data !== "null" &&
        "enable_osdp_tracing" in reader_data.osdp_data
      ) {
        data.enable_osdp_tracing = reader_data.osdp_data.enable_osdp_tracing;
      } else {
        data.enable_osdp_tracing = false;
      }
      return data;
    },
    nodeclicked(args) {
      var treeObj = document.getElementById("edit_acu_tree").ej2_instances[0];
      let item = treeObj.getNode(args.node);
      const treeData = treeObj.getTreeData();
      let findType = { ...treeData.find((d) => d.id == item.id) };
      this.findOfType = findType.item_type;
      if (findType.item_type == "acu") {
        this.canCreate = true;
        this.disableAddButton = true;
        this.acuComponent = "updateACU";
      } else if (findType.item_type == "access_point") {
        this.acuComponent = null;
        this.canCreate = false;
        this.disableAddButton = false;
      } else if (findType.item_type == "access_point_inner") {
        let id = item.id;
        const split = item.id.split("_", 2);
        if (split[1]) {
          id = split[1];
        }
        this.disableAddButton = false;
        this.$store.commit("accessPoint/CHANGE_EDIT_ACTIVE_POINT", id);
        let type = findType.type ? findType.type : findType.data.info.type;

        if (type == "turnstile_one_side" || type == "turnstile_two_side") {
          type = "turnstile";
        }
        this.fetchResources(type);
        this.acuComponent = null;
        this.canCreate = true;
        this.acuComponent = "updateAP";
      } else if (findType.item_type == "readers") {
        this.disableAddButton = true;
        this.canCreate = false;
        this.acuComponent = null;
        const reader_name = findType.data.name
          ? findType.data.name
          : findType.name;
        let get_parent = treeData.find((d) => d.id == item.parentID);
        const split = get_parent.id.split("_", 2);
        let id = get_parent.id;
        if (split[1]) {
          id = split[1];
        }

        if (get_parent.item_type == "acu") {
          id = null;
        }
        this.$store.commit("accessPoint/CHANGE_EDIT_ACTIVE_POINT", id);
        this.$store.commit(
          "accessPoint/CHANGE_EDIT_ACTIVE_READER",
          findType.id
        );

        setTimeout(() => {
          this.acuComponent = reader_name;
          this.canCreate = true;
        }, 50);
        this.$root.$emit("fetchSource");
      } else if (findType.item_type == "relay_boards") {
        this.disableAddButton = true;
        this.canCreate = true;
        this.acuComponent = "createDevice";
        this.$store.commit("accessPoint/CHANGE_ACTIVE_DEVICE", findType.id);
      } else if (findType.item_type == "ext_device") {
        this.disableAddButton = false;
      } else {
        this.disableAddButton = true;
        this.canCreate = false;
        this.acuComponent = null;
      }
    },
    beforeopen: function (args) {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
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
          document.getElementById("acuu_menutree").ej2_instances[0];

        if (targetNode.classList.contains("access_point")) {
          contentmenutree.enableItems(["Add Access Points"], true);
        } else {
          contentmenutree.enableItems(["Add Access Points"], false);
        }
        if (targetNode.classList.contains("device")) {
          contentmenutree.enableItems(["Add Devices"], true);
        } else {
          contentmenutree.enableItems(["Add Devices"], false);
        }

        if (targetNode.classList.contains("resource")) {
          // if (this.isFloor) {
          //   if (this.extDevice.length) {
          contentmenutree.enableItems(["Add Resources"], true);
          //   } else {
          //     contentmenutree.enableItems(["Add Resources"], false);
          //   }
          // } else {
          //   contentmenutree.enableItems(["Add Resources"], true);
          // }
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
    menuclicks: function (args) {
      const acu_data = this.$store.state.accessPoint.edit_acu_data;
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];

      var treeNodes = treevalidate.getTreeData();

      if (args.item.text == "Delete") {
        let deleteItem = treevalidate.getNode(targetNodeId);
        let tree_item = treeNodes.find((i) => i.id == deleteItem.id);

        if (
          (tree_item.item_type == "readers" &&
            (tree_item.name == "RFID" ||
              tree_item.name == "KEYPAD" ||
              tree_item.name == "FINGER" ||
              tree_item.name == "FACE")) ||
          tree_item.item_type == "relay_boards"
        ) {
          if (acu_data.status == "active") {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Delete pending",
            });
            treevalidate.removeNodes([targetNodeId]);
          } else if (acu_data.status !== "active") {
            treevalidate.removeNodes([targetNodeId]);
          }

          this.$store.commit("accessPoint/DELETE_EDIT_TREE_ITEM", {
            ...tree_item,
          });
        } else {
          if (!Number.isInteger(tree_item.id) && tree_item.id.includes("ap_")) {
            tree_item.id = +tree_item.id.split("_", 2)[1];
          }

          this.$store.commit("accessPoint/DELETE_EDIT_TREE_ITEM", {
            ...tree_item,
          });

          treevalidate.removeNodes([targetNodeId]);

          treevalidate.selectedNodes = [0];

          this.canCreate = false;
        }
      }
      if (args.item.text == "Add Devices") {
        // this.deviceCounter = 0;
        this.addDevicePopup = true;
      }
      if (args.item.text == "Add Resources") {
        if (this.isFloor) {
          if (!this.extDevice.length) {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Add an extention device",
            });
            return false;
          }
        }
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
      if (args.item.text == "Add Access Points") {
        const apModel = this.acu_controllers[acu_data.model];

        let canCreateCnt = 0;
        if (this.isFloor) {
          canCreateCnt = apModel.floor_count;
        } else {
          canCreateCnt = apModel.access_points_count;
        }

        let sumCnt = 0;

        if (acu_data.access_points.length) {
          sumCnt += acu_data.access_points.length;
        }

        if (acu_data.new_access_points) {
          sumCnt += Object.keys(acu_data.new_access_points).length;
        }

        if (sumCnt >= canCreateCnt) {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "You can't create more access points",
          });
        } else {
          this.ap_name_popup = true;
        }
      }
    },
    addAPName() {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];

      const treeData = treevalidate.getTreeData();
      const findPoint = treeData.find((d) => d.item_type === "access_point");

      const deviceType = {
        name: this.ap_name,
        id: uid(12),
        pid: findPoint.id,
        item_type: "access_point_inner",
        hasAttribute: { class: "resource delete" },
        real_type: this.ap_type,
      };

      if (
        this.ap_type === "turnstile_two_side" &&
        (this.acu_data.model === "Icon" || this.acu_data.model === "Icon-PRO")
      ) {
        let canCreate = true;

        if (this.acu_data.access_points && this.acu_data.access_points.length) {
          const ap = this.acu_data.access_points;
          if (ap.length) {
            for (let i = 0; i < ap.length; i++) {
              if (ap[i].type === "turnstile_two_side") {
                canCreate = false;
              }
            }
          }
        }

        if (
          this.acu_data.new_access_points &&
          Object.keys(this.acu_data.new_access_points).length
        ) {
          const ap = this.acu_data.new_access_points;
          for (const key in ap) {
            if (ap[key].real_type === "turnstile_two_side") {
              canCreate = false;
            }
          }
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
      this.$store.commit("accessPoint/SET_EDIT_POINT", {
        ...deviceType,
      });
      this.fetchResources(deviceType.type);

      this.$store.commit("accessPoint/CHANGE_EDIT_ACTIVE_POINT", deviceType.id);
      treevalidate.selectedNodes = [`${deviceType.id}`];
      this.acuComponent = "updateAP";
    },
    createResources(obj) {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
      if (obj.length) {
        obj.forEach((item) => {
          const res = {};
          res.name = item.device;
          res.id = uid(12);
          res.data = item;
          res.pid = treevalidate.selectedNodes[0];
          res.item_type = "readers";
          res.hasAttribute = { class: "delete" };
          this.$store.commit("accessPoint/SET_EDIT_READER", res);
          this.$store.commit("accessPoint/CHANGE_EDIT_ACTIVE_READER", res.id);
          this.$store.commit("accessPoint/SET_EDIT_READER_DATA", {
            data: { ...res },
          });
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
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
      treevalidate.selectedNodes = [];
      this.canCreate = false;
      this.acuComponent = null;
    },
    isValid(obj) {
      return obj.name && obj.model;
    },
    setExtDevice(device) {
      let find = this.fields.dataSource.find((d) => d.id == device.ext_board);
      for (const i in device) {
        find[i] = device[i];
      }
    },
    fetchResources(type) {
      this.$store.dispatch("accessPoint/fetchResource", type).then((res) => {
        let resources = res.data.resources;

        let access_point;
        if (Number.isInteger(+this.active_point)) {
          access_point = this.acu_data.access_points.find(
            (a) => a.id == +this.active_point
          );
          if (
            access_point.resources &&
            Object.keys(access_point.resources).length
          ) {
            for (const i in access_point.resources) {
              if (this.reader_types[i] !== "readers") {
                delete resources[this.reader_types[i]][i];
              }
            }
          }

          if (
            access_point.new_readers &&
            Object.keys(access_point.new_readers).length
          ) {
            for (const i in access_point.new_readers) {
              const name = access_point.new_readers[i].name
              const type = this.reader_types[name]
              if (
                type !== "readers"
              ) {
                delete resources[type][name];
                // delete resources[access_point.new_readers[i].name][
                //   access_point.new_readers[i].name
                // ];
              }
            }
          }
        } else {
          access_point = this.acu_data.new_access_points[this.active_point];

          if (
            access_point.readers &&
            Object.keys(access_point.readers).length
          ) {
            for (const i in access_point.readers) {
              if (
                this.reader_types[access_point.readers[i].name] !== "readers"
              ) {
                delete resources[
                  this.reader_types[access_point.readers[i].name]
                ][access_point.readers[i].name];
              }
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
      });
    },
    getTreeItem(id) {
      return this.$store.state.accessPoint.acuCreateTree.find(
        (acu) => acu.id == id
      ).item_type;
    },
    createDevices(obj) {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
      if (obj.length) {
        obj.forEach((item) => {
          const res = {};
          res.name = item.device;
          res.id = uid(12);
          res.item_type = "relay_boards";
          res.pid = "ext_device";
          res.board = item.device;
          res.hasAttribute = { class: "delete" };
          treevalidate.addNodes([res], "ext_device", null);
          this.$store.commit("accessPoint/ADD_DEVICE", res);
        });
      }
    },
    wgBind(item) {
      const wgObj = {
        type: this.reader_type[item.name],
        direction: 'direction' in item ? item.direction : null,
        mode: item.mode,
        port: 'port' in item ? item.port : null,
        wg_type: item.wg_type,
        enable_buzzer: item.enable_buzzer ? item.enable_buzzer : false,
        enable_crc: item.enable_crc ? item.enable_crc : false,
        reverse_byte_order: item.reverse_byte_order
          ? item.reverse_byte_order
          : false,
        name: item.name,
        // leaving_zone: item.leaving_zone ? item.leaving_zone : null,
        // came_to_zone: item.came_to_zone ? item.came_to_zone : null,
      };
      return wgObj;
    },
    ocdpBind(item) {
      const osdp = {
        type: this.reader_type[item.name],
        osdp_address: item.osdp_address,
        direction: item.direction,
        mode: item.mode,
        port: item.port,
        wg_type: item.wg_type,
        name: item.name,
        leaving_zone: item.leaving_zone,
        came_to_zone: item.came_to_zone,
        osdp_data: {},
      };

      if ("baud_rate" in item) {
        osdp.baud_rate = item.baud_rate;
      } else {
        osdp.baud_rate = null;
      }

      if ("card_data_format_flags" in item) {
        osdp.card_data_format_flags = item.card_data_format_flags;
      } else {
        osdp.card_data_format_flags = null;
      }

      if ("keypad_mode" in item) {
        osdp.keypad_mode = item.keypad_mode;
      } else {
        osdp.keypad_mode = null;
      }

      if ("configuration" in item) {
        osdp.configuration = item.configuration;
      } else {
        osdp.configuration = null;
      }

      if ("led_mode" in item) {
        osdp.led_mode = item.led_mode;
      } else {
        osdp.led_mode = null;
      }

      if ("enable_osdp_secure_channel" in item) {
        osdp.enable_osdp_secure_channel = item.enable_osdp_secure_channel;
      } else {
        osdp.enable_osdp_secure_channel = false;
      }

      if ("enable_osdp_tracing" in item) {
        osdp.enable_osdp_tracing = item.enable_osdp_tracing;
      } else {
        osdp.enable_osdp_tracing == false;
      }

      return osdp;
    },
    subscribeSocket(acu_id) {
      const user = localStorage.user ? JSON.parse(localStorage.user) : null;

      if (user) {
        this.sockets.subscribe(
          `reader_delete/${user.company}/${user.id}/acu/${acu_id}`,
          (data) => {
            const socket_data = JSON.parse(data);

            this.$store.commit("accessPoint/DELETE_EDIT_READER", {
              ...socket_data,
            });

            // var treevalidate =
            //   document.getElementById("edit_acu_tree").ej2_instances[0];

            // treevalidate.removeNodes([`${socket_data.id}`]);

            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Reader deleted",
            });
          }
        );
      }
    },
    subscribePointUpdateSocket(acu_id) {
      const user = localStorage.user ? JSON.parse(localStorage.user) : null;

      if (user) {
        this.sockets.subscribe(
          `access_point_update/${user.company}/${user.id}/acu/${acu_id}`,
          (data) => {
            const socket_data = JSON.parse(data);

            this.refreshTree(
              socket_data,
              "access_point",
              "Access access_point updated"
            );
          }
        );
      }
    },
    subscribeExtDeviceDeleteSocket(acu_id) {
      const user = localStorage.user ? JSON.parse(localStorage.user) : null;

      if (user) {
        this.sockets.subscribe(
          `ext_brd_delete/${user.company}/${user.id}/acu/${acu_id}`,
          (data) => {
            const socket_data = JSON.parse(data);
            this.$store.commit("accessPoint/DELETE_EDIT_EXT_DEVICE", {
              ...socket_data,
            });

            // var treevalidate =
            //   document.getElementById("edit_acu_tree").ej2_instances[0];

            // treevalidate.removeNodes([`ext_${socket_data.id}`]);

            treevalidate.selectedNodes = [`acu_${acu_id}`];

            this.canCreate = true;
            this.acuComponent = "updateACU";

            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Extension device deleted",
            });
          }
        );
      }
    },
    subscribeExtDeviceUpdateSocket(acu_id) {
      const user = localStorage.user ? JSON.parse(localStorage.user) : null;

      if (user) {
        this.sockets.subscribe(
          `ext_brd_update/${user.company}/${user.id}/acu/${acu_id}`,
          (data) => {
            const socket_data = JSON.parse(data);

            this.refreshTree(
              socket_data,
              "relay_boards",
              "Extension device updated"
            );
          }
        );
      }
    },
    refreshTree(socket_data, item_type, message) {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
      this.$vs.loading({
        type: "corners",
      });
      let treeData = [...treevalidate.getTreeData()];
      this.fields.dataSource = [];

      if (item_type === "relay_boards") {
        let board = treeData.find(
          (i) =>
            i.item_type === "relay_boards" && i.id == "ext_" + socket_data.id
        );
        if (board && board.name) {
          board.name = socket_data.name;
        }
      } else if (item_type === "access_point") {
        let ac_point = treeData.find(
          (i) =>
            i.item_type === "access_point_inner" &&
            i.id == "ap_" + socket_data.id
        );
        if (ac_point && ac_point.name) {
          ac_point.name = socket_data.name;
        }
      }

      setTimeout(() => {
        this.fields.dataSource = treeData;

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: message,
        });

        this.$vs.loading.close();
      }, 350);
    },
    changeExtName(data) {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];

      let treeData = [...treevalidate.getTreeData()];

      this.$vs.loading({
        type: "corners",
      });
      let ap = treeData.find(
        (i) =>
          i.item_type === "relay_boards" &&
          i.id == this.$store.state.accessPoint.active_device
      );

      if (ap) {
        ap.name = data.name;
      }

      this.fields.dataSource = [];

      setTimeout(() => {
        this.fields.dataSource = treeData;

        this.$vs.loading.close();
      }, 350);
    },
    expandAll() {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
      treevalidate.expandAll();
    },
    collapseAll() {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
      treevalidate.collapseAll();
    },
    contextMenuOpen() {
      var treevalidate =
        document.getElementById("edit_acu_tree").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];

      let item = treevalidate.getNode(targetNodeId);
      const treeData = treevalidate.getTreeData();
      let findType = { ...treeData.find((d) => d.id == item.id) };
      const type = findType.item_type;

      if (type === "ext_device") {
        this.addDevicePopup = true;
      } else if (type === "access_point") {
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
    this.fields.dataSource = treeData(this.acu_edit_tree);

    this.subscribeSocket(this.acu_data.id);
    this.subscribeExtDeviceDeleteSocket(this.acu_data.id);
    this.subscribeExtDeviceUpdateSocket(this.acu_data.id);
    this.subscribePointUpdateSocket(this.acu_data.id);

    this.popup = this.popupActive;
    this.canCreate = true;
    this.disableAddButton = true;
    this.acuComponent = "updateACU";
  },
  components: {
    updateACU,
    updateAP,
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
    DeviceDragAndDrop,
    Open_button,
    AddDevicePopup,
    KEYPAD,
    FINGER,
    FACE,
    Loop_sensor,
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

<style lang="scss" scoped>
.card_acu_edit {
  .vs-popup--content {
    flex-direction: column;
    align-items: flex-end;
  }

  .row_block,
  .block_account {
    padding: 0;
  }

  .row_block {
    height: 500px;
  }

  .inner_block {
    padding: 0;
    height: 100%;
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
  }

  .row_block {
    display: flex;
    // justify-content: space-between;
    border-radius: 5px;
    // padding: 10px;
    margin: 0 -15px;
    // box-shadow: 0 1px 10px 1px #00000012;
    background-color: white;
    overflow-x: hidden;
    overflow-y: auto;
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

.edit_tabs_block {
  position: relative;
  // box-shadow: 3px -2px 6px 2px #cac6c6;
  padding-top: 10px;
  height: 100%;
  padding-left: 30px;
}

.edit_tree_block {
  // box-shadow: 5px 2px 10px 5px #cac6c6;
  overflow: auto;

  height: 100% !important;
  min-height: 600px;
  max-height: 600px;
}

.buttons_group {
  display: flex;
  flex-direction: row-reverse;
}

.popup_width_small {
  .custom_block_shadow {
    height: 100%;
    min-height: 600px;
    max-height: 600px;
  }

  // .vs-popup {
  //   min-width: 1000px;
  //   min-height: 680px;
  //   max-height: 750px;
  // }
}

.access_point_popup {
  z-index: 99999;

  .vs-popup {
    // min-height: 300px; // will delete if ok
  }
}

.deivce_popups {
  z-index: 99999;
}
</style>
