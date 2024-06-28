<template>
  <vs-popup class="holamundo" title="Attach Hardware" :active.sync="popup">
    <div class="vx-row">
      <div class="vx-col md:w-full mb-4">
        <h5>{{ this.propsData.device.name }}</h5>
      </div>

      <div class="vx-col md:w-full">
        <Table
          :headers="hardwareHeaders"
          :items="hardwares"
          @input="checkHardware($event)"
        />
      </div>
    </div>

    <div class="vx-row w-full" style="margin: 0; justify-content: flex-end">
      <div class="vx-col" style="padding: 0">
        <vs-button
          class="mr-6 mt-4 unimacs_button"
          @click="attachHardware"
          :disabled="!hardwares.length"
          >Submit</vs-button
        >
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

      if (!val) {
        this.hardwares = this.propsData.attach_hard;
      }
    },
  },
  computed: {},
  data() {
    return {
      popup: false,
      hardwares: [],
      hardwareHeaders: [{ name: "ACU name", key: "name" }],
      selectedHardware: null,
      attached_hardware: null,
    };
  },
  methods: {
    attachHardware() {
      this.$store
        .dispatch("accessPoint/sendAttachedHardware", {
          device: this.deviceId,
          attached_hardware: this.attached_hardware,
          detach: false,
        })
        .then((res) => {
          this.$vs.loading.close();
          this.popup = false;

          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Hardware Attached",
          });
        })
        .catch((err) => {
          this.popup = false;
        });
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

