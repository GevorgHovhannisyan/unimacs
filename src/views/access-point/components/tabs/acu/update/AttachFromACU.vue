<template>
  <vs-popup
    class="holamundo detach_acu_edit"
    title="Detach Hardware"
    :active.sync="popup"
  >
    <div class="vx-row">
      <div class="vx-col md:w-full mb-4">
        <h5>{{ this.propsData.device.name }}</h5>
      </div>

      <div class="vx-col md:w-full">
        <vs-table
noDataText="No data available" ref="table" class="bs_table" :data="hardwares">
          <div slot="header" class="flex flex-wrap-reverse items-center">
            <div class="items-center"></div>
          </div>
          <template slot="thead">
            <vs-th
              v-for="(header, index) in hardwareHeaders"
              :key="index"
              :sort-key="header.key"
              >{{ header.name }}</vs-th
            >
            <vs-th>Actions</vs-th>
          </template>
          <template slot-scope="{ data }">
            <tbody>
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td v-for="(header, index) in hardwareHeaders" :key="index">
                  <p class="product-name font-medium truncate">
                    {{ tr[header.key] ? tr[header.key] : "" }}
                  </p>
                </vs-td>

                <vs-td class="whitespace-no-wrap">
                  <vs-checkbox
                    class="mb-4 mt-5"
                    @change="checkChanges(tr)"
                    :disabled="selectedHardware[tr.id] == tr.id"
                    v-model="selectedHardware[tr.id]"
                  ></vs-checkbox>
                  <!--
                     -->
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
        </vs-table>

        <!-- <Table
          :headers="hardwareHeaders"
          :items="hardwares"
          @input="checkHardware($event)"
        /> -->
      </div>
    </div>

    <div class="vx-row">
      <div
        class="vx-col w-full"
        style="display: flex; flex-direction: row-reverse"
      >
        <vs-button
          class="mr-6 mt-4 unimacs_button"
          @click="detachHardware"
          :disabled="!hardwares.length"
          >Submit</vs-button
        >
        <!-- <vs-button class="mr-6 mt-4 unimacs_cancel_button">Cancel</vs-button> -->
      </div>
    </div>
  </vs-popup>
</template>

<script>
import Table from "@/components/custom/table/CheckboxTable";

export default {
  props: {
    popupActive: {
      type: Boolean,
    },
    apTable: {
      type: Boolean,
    },
    acuTable: {
      type: Boolean,
    },
    propsData: {
      type: Object,
    },
    deviceId: {
      type: Number,
    },
  },
  watch: {
    popupActive(val) {
      this.popup = val;
      this.$emit("popup", val);
    },
    popup(val) {
      this.$emit("popup", val);

      this.selectedHardware = {};
      this.attached_hardware = {};
    },
  },
  computed: {},
  data() {
    return {
      popup: false,
      hardwares: [],
      hardwareHeaders: [{ name: "ACU name", key: "name" }],
      selectedHardware: {},
      attached_hardware: {},
    };
  },
  methods: {
    detachHardware() {
      this.$store
        .dispatch("accessPoint/sendAttachedHardware", {
          device: this.deviceId,
          attached_hardware: this.attached_hardware,
          detach: true,
        })
        .then((res) => {
          this.$vs.loading.close();
          this.popup = false;

          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Hardware Detached",
          });

          setTimeout(() => {
            this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.popups.editACUPopup = false;
          }, 100);
        })
        .catch((err) => {
          this.popup = false;
        });
    },
    checkChanges(items) {
      Object.keys(this.selectedHardware).map((item, index) => {
        this.selectedHardware[parseInt(item)] = false;
      });
      this.selectedHardware[items.id] = true;
      this.checkHardware(items.id);
    },
    checkHardware(event) {
      this.attached_hardware = event;
    },
  },
  created() {
    this.popup = this.popupActive;

    this.hardwares = this.propsData.attach_hard;
  },
  components: {
    Table,
  },
};
</script>

<style lang="scss">
.detach_acu_edit {
  z-index: 99999;
}
</style>
