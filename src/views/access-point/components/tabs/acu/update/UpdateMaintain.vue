<template>
  <div>
    <AttachHardwarePopup
      v-if="attachHardData"
      :popupActive="attachHardwarePopup"
      @popup="attachHardwarePopup = $event"
      :propsData="attachHardData"
      :deviceId="deviceId"
    />
    <div class="vx-row mt-3">
      <div class="vx-col md:w-full">
        <h3>FW ver: {{ acu_data ? acu_data.fw_version : "" }}</h3>
      </div>
    </div>

    <div class="vx-row mt-3">
      <div class="vx-col md:w-1/2">
        <vs-button
          @click="changeMaintain('restart', 'restart')"
          class="w-full mt-5 unimacs_button"
        >
          Restart device</vs-button
        >
      </div>
      <div class="vx-col md:w-1/2 mt-6">
        <span>Restart device</span>
      </div>
      <div class="vx-col md:w-1/2" @click="changeMaintain('reset', 'reset')">
        <vs-button class="w-full mt-5 unimacs_button"> Reset partial</vs-button>
      </div>
      <div class="vx-col md:w-1/2 mt-6">
        <span>Resets all except Connection</span>
      </div>
      <div class="vx-col md:w-1/2">
        <vs-button
          class="w-full mt-5 unimacs_button"
          @click="changeMaintain('reset_to_factory', 'reset full')"
        >
          Reset full</vs-button
        >
      </div>
      <div class="vx-col md:w-1/2 mt-6">
        <span>Resets all to factory defaults</span>
      </div>
      <vs-divider />
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import AttachHardwarePopup from "./AttachFromACU";
export default {
  watch: {
    maintain: {
      handler: function(data) {
        if (Object.keys(data).length) {
          // this.$store.commit("accessPoint/UPDATE_MAIN", data);
        }
      },
      deep: true
    }
  },
  computed: {
    updateTypes() {
      return this.$store.state.accessPoint.updateTypes;
    }
  },
  data() {
    return {
      maintain: {},
      attachHardwarePopup: false,
      attachHardData: null,
      deviceId: null,
      acu_data: this.$store.state.accessPoint.edit_acu_data
    };
  },
  methods: {
    deactivateAcu() {
      const acu = this.$store.state.accessPoint.edit_acu_data;
      this.$store.dispatch("accessPoint/deactivateAcu", acu).then(response => {
        this.$vs.notify({
time: 7000,
          color: "success",
          title: "ACU deactivated"
        });
      });
    },
    acuDynamicAction() {
      const acu = this.$store.state.accessPoint.edit_acu_data;
      this.$store
        .dispatch("accessPoint/acuAction", { acu, name: this.acuName })
        .then(() => {
          if (this.acuName === "reset_to_factory" || this.acuName === "reset") {
            this.$root.$emit("closeUpdatePopup");
          }
          this.$vs.notify({
time: 7000,
            color: "success",
            title: `ACU updated`
          });
        });
    },
    changeMaintain(name, actionName) {
      this.acuName = name;
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `Confirm ${actionName}`,
        text: `Do You want to ${actionName} Acu`,
        accept: this.acuDynamicAction,
        acceptText: "Submit"
      });
    },
    detachACU() {
      const acu = this.$store.state.accessPoint.edit_acu_data;
      this.attachHardwarePopup = true;
      this.$store.dispatch("accessPoint/fetchAttachHardware").then(res => {
        this.attachHardData = { attach_hard: res.data, device: acu };
        this.deviceId = acu.id;
      });
    }
  },

  components: { vSelect, AttachHardwarePopup }
};
</script>

<style lang="scss" scoped>
.icon_bl {
  span.vs-button--text {
    display: flex;
    align-items: center;
  }
}
.check_icon {
  position: relative;
  top: 2px;
}
</style>
