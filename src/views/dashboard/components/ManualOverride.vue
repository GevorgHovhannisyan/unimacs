<template>
  <div
    class="vx-row manual__override_dash"
    v-if="fieldsShown['manual_override']"
  >
    <div class="ml-2 " @click="updateStatus('exit')"><OneExit /></div>
    <div class="ml-2" @click="overrideMode('exit', 'locked')">
      <Lock />
    </div>
    <div class="ml-2" @click="overrideMode('exit', 'unlocked')">
      <UnLock />
    </div>
    <div @click="overrideMode('exit', 'credential')">
      <Door />
    </div>
    <div  @click="updateStatus('antipanic')">
      <Antipanic />
    </div>

    <div
      class="ml-2"
      @click="overrideMode('exit', 'locked')"
      v-if="
        getType &&
        (getType === 'gate' ||
          getType === 'gateway' ||
          getType === 'turnstile_two_side')
      "
    >
      <Lock />
    </div>
    <div
      class="ml-2"
      @click="overrideMode('exit', 'unlocked')"
      v-if="
        getType &&
        (getType === 'gate' ||
          getType === 'gateway' ||
          getType === 'turnstile_two_side')
      "
    >
      <UnLock />
    </div>
    <div
      @click="overrideMode('exit', 'credential')"
      v-if="
        getType &&
        (getType === 'gate' ||
          getType === 'gateway' ||
          getType === 'turnstile_two_side')
      "
    >
      <Door />
    </div>
    <div  v-if="getType && getType === 'floor'">23 Floor</div>

    <div class="ml-2 right_btn" v-if="getType && getType === 'floor'">Send</div>

    <div
      class="ml-2 "
      v-if="!getType || getType !== 'floor'"
      @click="updateStatus('entry')"
    >
      <OneEntry />
    </div>
  </div>
</template>

<script>
import Lock from "../icons/Lock";
import UnLock from "../icons/UnLock";
import Door from "../icons/Door";
import OneExit from "../icons/OneExit.vue";
import OneEntry from "../icons/OneEntry.vue";
import Antipanic from "../icons/Antipanic.vue";

export default {
  props: {
    fieldsShown: {
      type: Object,
      default: () => {},
    },

    monitor_1_settings: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    access_points() {
      return this.$store.state.accessPoint.access_points;
    },
    getType() {
      if (this.monitor_1_settings && this.monitor_1_settings.access_point) {
        const findAcPoint = this.access_points.find(
          (p) => p.id == this.monitor_1_settings.access_point
        );
        if (findAcPoint) {
          return findAcPoint.type;
        }
      }
      return null;
    },
  },
  methods: {
    overrideMode(type, mode) {
      if (this.monitor_1_settings && this.monitor_1_settings.access_point) {
        const obj = {
          id: this.monitor_1_settings.access_point,
        };

        if (type == "exit") {
          obj.exit_mode = mode;
        } else if (type == "entry") {
          obj.entry_mode = mode;
          obj.mode = mode;
        }

        this.$vs.loading({
          type: "corners",
        });
        this.$http
          .put(`accessPoint/updateMode`, obj, {
            headers: { Authorization: localStorage.token },
          })
          .then((res) => {
            this.$vs.loading.close();
            if (res.data && res.data.message) {
              if (res.data.message == "update Pending") {
                this.$vs.notify({
                  time: 7000,
                  color: "success",
                  title: res.data.message,
                });
              } else {
                this.$vs.notify({
                  time: 7000,
                  color: "success",
                  title: res.data.message,
                });
              }
            } else {
              this.$vs.notify({
                time: 7000,
                color: "success",
                title: "Access Point Mode updated",
              });
            }
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      }
    },
    updateStatus(mode) {
      if (this.monitor_1_settings && this.monitor_1_settings.access_point) {
        let obj = {
          id: this.monitor_1_settings.access_point,
        };
        if (mode == "exit" || mode == "entry") {
          obj.mode = "open_once";
          obj.direction = mode;
        } else {
          obj.mode = mode;
        }
        this.$vs.loading({
          type: "corners",
        });
        this.$http
          .put(`accessPoint/updateMode`, obj, {
            headers: { Authorization: localStorage.token },
          })
          .then((res) => {
            this.$vs.loading.close();
            if (res.data && res.data.message) {
              if (res.data.message == "update Pending") {
                this.$vs.notify({
                  time: 7000,
                  color: "success",
                  title: res.data.message,
                });
              } else {
                this.$vs.notify({
                  time: 7000,
                  color: "success",
                  title: res.data.message,
                });
              }
            } else {
              this.$vs.notify({
                time: 7000,
                color: "success",
                title: "Access Point Mode updated",
              });
            }
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      }
    },
  },
  components: {
    Lock,
    UnLock,
    Door,
    OneExit,
    OneEntry,
    Antipanic,
  },
};
</script>

<style></style>
