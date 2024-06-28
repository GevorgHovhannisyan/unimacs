<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <label for class="vs-input--label">Interface type</label>

        <v-select
          v-model="reader_data.wg_type"
          :options="interface_types"
          class="select_padding w-full"
          name="status"
          placeholder="Interface type"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />

        <div v-if="!isFloor">
          <vs-input
            label="Name"
            class="mt-3 w-full"
            name="name"
            disabled
            v-model="reader_data.name"
            v-validate="'required'"
          />
        </div>

        <div v-else class="mt-3">
          <label for class="vs-input--label">Reader Type</label>

          <v-select
            v-model="reader_data.type"
            :options="readers_types"
            class="select_padding w-full"
            name="status"
            placeholder="Reader Type"
            :reduce="(type) => type.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-1/3 mt-3 port_mode">
        <label for="" class="vs-input--label">Port</label>

        <v-select
          v-model="reader_data.port"
          :options="ports"
          class="select_padding w-full pport"
          name="port"
          placeholder="Port"
          :reduce="(port) => port.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :selectable="(option) => !option.disabled"
        />
      </div>

      <div class="vx-col w-1/3 mt-3 port_mode">
        <label for="" class="vs-input--label">Mode</label>
        <v-select
          v-model="reader_data.mode"
          disabled
          :options="reader_modes"
          class="select_padding w-full mode"
          name="status"
          placeholder="Mode"
          :reduce="(mode) => mode.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/3 mt-3">
        <label for="" class="vs-input--label">Direction</label>
        <v-select
          v-model="reader_data.direction"
          :options="direction_options"
          class="select_padding w-full"
          name="status"
          placeholder="Direction"
          :reduce="(dirs) => dirs.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :selectable="(option) => !option.disabled"
        />
      </div>
    </div>

    <div class="vx-row mt-3" v-if="reader_data.wg_type !== -1">
      <div class="vx-col w-1/3">
        <vs-checkbox v-model="reader_data.reverse_byte_order"
          >Reverse byte order</vs-checkbox
        >
      </div>
      <div class="vx-col w-1/3">
        <vs-checkbox v-model="reader_data.enable_crc">Enable CRC</vs-checkbox>
      </div>
      <div class="vx-col w-1/3">
        <vs-checkbox v-model="reader_data.enable_buzzer"
          >Enable buzzer
        </vs-checkbox>
      </div>
    </div>

    <div class="vx-row mt-3" v-if="reader_data.wg_type == -1">
      <div class="vx-col w-1/2">
        <label for="" class="vs-input--label">Baud rate</label>
        <v-select
          v-model="reader_data.baud_rate"
          :options="baud_rates"
          class="select_padding w-full"
          name="status"
          placeholder="Baud Rate"
          :reduce="(dirs) => dirs.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/2">
        <label for="" class="vs-input--label">Osdp address</label>
        <v-select
          v-model="reader_data.osdp_address"
          :options="osdp_addresses"
          class="select_padding w-full"
          name="status"
          placeholder="Osdp address"
          :reduce="(dirs) => dirs.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
      <div class="vx-col w-1/2 mt-3">
        <label for="" class="vs-input--label">Card data format flags</label>
        <v-select
          v-model="reader_data.card_data_format_flags"
          :options="card_data_format_flags"
          class="select_padding w-full"
          name="status"
          placeholder="Card data format flags"
          :reduce="(dirs) => dirs.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/2 mt-3">
        <label for="" class="vs-input--label">Keypad mode</label>
        <v-select
          v-model="reader_data.keypad_mode"
          :options="keypad_modes"
          class="select_padding w-full"
          name="status"
          placeholder="Card data format flags"
          :reduce="(dirs) => dirs.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/3 mt-3">
        <label for="" class="vs-input--label">Configuration</label>
        <v-select
          v-model="reader_data.configuration"
          :options="configurations"
          class="select_padding w-full"
          name="status"
          placeholder="Configuration"
          :reduce="(dirs) => dirs.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
      <div class="vx-col w-1/3 mt-3">
        <label for="" class="vs-input--label">Led mode</label>
        <v-select
          v-model="reader_data.led_mode"
          :options="led_modes"
          class="select_padding w-full"
          name="status"
          placeholder="Configuration"
          :reduce="(dirs) => dirs.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/3 mt-3">
        <label for="" class="vs-input--label">Оffline mode</label>
        <v-select
          v-model="reader_data.offline_mode"
          :options="offline_modes"
          class="select_padding w-full"
          name="status"
          placeholder="Configuration"
          :reduce="(dirs) => dirs.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-1/2 mt-5 flex_center">
        <vs-checkbox
          class="mt-3 custom__checkbox"
          v-model="reader_data.enable_osdp_secure_channel"
          >Enable osdp secure channel</vs-checkbox
        >
      </div>
      <div class="vx-col w-1/2 mt-5 flex_center">
        <vs-checkbox
          class="mt-3 custom__checkbox"
          v-model="reader_data.enable_osdp_tracing"
          >Enable osdp tracing
        </vs-checkbox>
      </div>
    </div>

    <!-- <div class="vx-row mt-3">
      <div class="vx-col w-1/2">
        <label for="" class="vs-input--label"
          >This Access Point Exits the Zone below</label
        >
        <treeselect
          class="tree__select"
          :options="groupObj"
          v-model="reader_data.leaving_zone"
        />
      </div>

      <div class="vx-col w-1/2">
        <label for="" class="vs-input--label"
          >This Access Point Enters the Zone below</label
        >
        <treeselect
          class="tree__select"
          :options="groupObj"
          v-model="reader_data.came_to_zone"
        />
      </div>
    </div> -->
  </div>
</template>

<script>
import vSelect from "vue-select";
import { zoneTree } from "@/functions/treeData";
import Treeselect from "@riophae/vue-treeselect";
import { checkPorts, checkDirPorts } from "@/functions/checkInputOutput";
export default {
  data() {
    return {
      reader_data: {},
      zones: [],
      reader_type: {
        0: "RFID",
        1: "KEYPAD",
        2: "FINGERP",
        3: "FACE",
      },
      osdp_addresses: [],
      direction_options: [],
      ports: [],
      port_items: [
        // { id: 1, label: "Port 1" },
        // { id: 2, label: "Port 2" },
        // { id: 3, label: "Port 3" },
        // { id: 4, label: "Port 4" },
      ],
      groupObj: [],
    };
  },
  watch: {
    reader_data: {
      handler: function (reader_data, oldVal) {
        this.$store.commit("accessPoint/SET_EDIT_READER_DATA", {
          data: reader_data,
        });
      },
      deep: true,
    },
    active_reader(data) {
      let access_point;
      let reader;

      if (this.isFloor) {
        this.reader_data = {
          ...this.$store.state.accessPoint.edit_acu_data.readers,
        };

        this.reader_data.name = this.reader_type[this.reader_data.type];
      } else {
        if (Number.isInteger(+this.active_point)) {
          access_point = this.access_points.find(
            (a) => a.id == +this.active_point
          );
          if (Number.isInteger(+data)) {
            reader = access_point.readers.find(
              (r) => r.id == +this.active_reader
            );
          } else if (
            access_point.new_readers &&
            access_point.new_readers[data]
          ) {
            reader = { ...access_point.new_readers[data] };
          } else {
            return;
          }
        } else {
          access_point =
            this.$store.state.accessPoint.edit_acu_data.new_access_points[
              this.active_point
            ];
          reader = { ...access_point.readers[data] };
        }

        if (!reader.data) {
          this.reader_data = { ...reader, name: this.reader_type[reader.type] };
        } else if (reader.reader_info) {
          this.reader_data = {
            ...reader.reader_info,
            name: reader.reader_info.data.device,
          };
        } else if (reader.data && !reader.reader_info) {
          this.reader_data = {
            ...reader,
            name: reader.data.device,
          };
        }
      }
      this.setPorts();
      this.setDirectionPorts();
    },
  },
  methods: {
    setDirectionPorts() {
      const data = this.$store.state.accessPoint.edit_acu_data;
      this.direction_options = [];

      const ports = checkDirPorts(data, this.active_point, this.active_reader);
      for (let i = 0; i < this.directions.length; i++) {
        if (ports.includes(this.directions[i].id)) {
          this.direction_options.push({
            ...this.directions[i],
            disabled: true,
          });
        } else {
          this.direction_options.push(this.directions[i]);
        }
      }
    },

    setPorts() {
      const data = this.$store.state.accessPoint.edit_acu_data;
      const ports = checkPorts(data, this.active_reader);
      this.ports = [];
      for (let i = 0; i < this.port_items.length; i++) {
        if (ports.includes(this.port_items[i].id)) {
          this.ports.push({ ...this.port_items[i], disabled: true });
        } else {
          this.ports.push(this.port_items[i]);
        }
      }
    },
    checkNumber(value, field) {
      return (this.reader_data[field] = +value.replace(/[^+0-9]/g, ""));
    },
    initValues() {
      this.zones = [];
      this.reader_data = {
        wg_type: 0,
        port: null,
        name: null,
        direction: null,
        mode: null,
        reverse_byte_order: false,
        enable_crc: false,
        enable_buzzer: false,
        baud_rate: null,
        card_data_format_flags: null,
        keypad_mode: null,
        configuration: null,
        led_mode: null,
        offline_mode: null,
        enable_osdp_secure_channel: false,
        enable_osdp_tracing: false,
        osdp_address: null,
      };

      this.$http
        .get(`accessPointZone`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          if (res.data.length) {
            this.groupObj = zoneTree(res.data);

            res.data.forEach((zone) => {
              this.zones.push({ id: zone.id, label: zone.name });
            });
          }
        });
    },
  },
  computed: {
    interface_types() {
      return this.$store.state.accessPoint.interface_types;
    },
    reader_modes() {
      return this.$store.state.accessPoint.reader_modes;
    },
    directions() {
      return this.$store.state.accessPoint.directions;
    },
    baud_rates() {
      return this.$store.state.accessPoint.baud_rates;
    },
    card_data_format_flags() {
      return this.$store.state.accessPoint.card_data_format_flags;
    },
    keypad_modes() {
      return this.$store.state.accessPoint.keypad_modes;
    },
    configurations() {
      return this.$store.state.accessPoint.configurations;
    },
    led_modes() {
      return this.$store.state.accessPoint.led_modes;
    },
    offline_modes() {
      return this.$store.state.accessPoint.offline_modes;
    },
    active_reader() {
      return this.$store.state.accessPoint.edit_active_reader;
    },
    active_point() {
      return this.$store.state.accessPoint.edit_active_point;
    },
    access_points() {
      return this.$store.state.accessPoint.edit_acu_data.access_points;
    },
    readers_types() {
      return this.$store.state.accessPoint.readers_types;
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
  },
  created() {
    const dataReader = this.$store.state.accessPoint.edit_acu_data;

    if (dataReader.model === "AIR-CR") {
      this.port_items = [
        { id: 1, label: "Internal" },
        { id: 2, label: "External" },
      ];
    } else if (dataReader.model === "Icon") {
      this.port_items = [
        { id: 1, label: "Wiegant port 1" },
        { id: 2, label: "Wiegant port 2" },
      ];
    } else if (dataReader.model === "Icon-PRO") {
      this.port_items = [
        { id: 1, label: "Wiegant port 1" },
        { id: 2, label: "Wiegant port 2" },
      ];
    } else if (dataReader.model === "AIR-CB") {
      this.port_items = [{ id: 1, label: "External" }];
    }

    this.$http
      .get(`accessPointZone`, {
        headers: { Authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data.length) {
          this.groupObj = zoneTree(res.data);

          res.data.forEach((zone) => {
            this.zones.push({ id: zone.id, label: zone.name });
          });
        }
      });

    let address = [];
    for (let i = 1; i < 129; i++) {
      address.push({ id: i, label: i });
    }
    this.osdp_addresses = address;

    let access_point;
    let reader;

    if (this.isFloor) {
      this.reader_data = {
        ...this.$store.state.accessPoint.edit_acu_data.readers,
      };

      this.reader_data.name = this.reader_type[this.reader_data.type];
    } else {
      if (Number.isInteger(+this.active_point)) {
        access_point = this.access_points.find(
          (a) => a.id == +this.active_point
        );
        if (Number.isInteger(+this.active_reader)) {
          reader = {
            ...access_point.readers.find((r) => r.id == +this.active_reader),
          };
        } else {
          reader = { ...access_point.new_readers[this.active_reader] };
        }
      } else {
        access_point =
          this.$store.state.accessPoint.edit_acu_data.new_access_points[
            this.active_point
          ];
        reader = { ...access_point.readers[this.active_reader] };
      }

      if (!reader.data) {
        this.reader_data = { ...reader, name: this.reader_type[reader.type] };
      } else if (reader.reader_info) {
        this.reader_data = {
          ...reader.reader_info,
          name: reader.reader_info.data.device,
        };
      } else if (reader.data && !reader.reader_info) {
        this.reader_data = {
          ...reader,
          name: reader.data.device,
        };
      }
    }
    this.setPorts();
    this.setDirectionPorts();
  },
  components: {
    vSelect,
    Treeselect,
  },
};
</script>

<style lang="scss">
@import url("../../../../../../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");
</style>
