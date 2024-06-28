<template>
  <div style="width: 100%">
    <div class="vx-row w-full justify_butt">
      <div class="vx-col mt-3 w-full">
        <div class="entry_exit">Entry</div>
        <div
          class="man_override_button override_left"
          type="border"
          :class="{ active_btn: entry == 'unlocked' }"
          @click="overrideMode('entry', 'unlocked')"
        >
          Unlock
        </div>
        <div
          class="man_override_button override_center"
          type="border"
          :class="{ active_btn: entry == 'locked' }"
          @click="overrideMode('entry', 'locked')"
        >
          Lock Down
        </div>
        <div
          class="man_override_button override_right"
          type="border"
          :class="{ active_btn: entry == 'credential' }"
          @click="overrideMode('entry', 'credential')"
        >
          Normal
        </div>
      </div>
      <div class="vx-col mt-3 w-full">
        <div class="entry_exit">Exit</div>
        <div
          class="man_override_button override_left"
          type="border"
          @click="overrideMode('exit', 'unlocked')"
          :class="{ active_btn: exit == 'unlocked' }"
        >
          Unlock
        </div>
        <div
          class="man_override_button override_center"
          type="border"
          @click="overrideMode('exit', 'locked')"
          :class="{ active_btn: exit == 'locked' }"
        >
          Lock Down
        </div>
        <div
          class="man_override_button override_right"
          type="border"
          @click="overrideMode('exit', 'credential')"
          :class="{ active_btn: exit == 'credential' }"
        >
          Normal
        </div>
      </div>
    </div>

    <div class="vx-row block_access">
      <div class="vx-col left_btn ap_blue" @click="updateStatus('exit')">
        Single Exit
      </div>

      <div class="vx-col antipanic" @click="updateStatus('antipanic')">
        Antipanic
      </div>

      <div class="vx-col right_btn ap_blue" @click="updateStatus('entry')">
        Single Entry
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    apData: {
      type: Object,
    },
  },
  data() {
    return {
      entry: "unlocked",
      exit: "unlocked",
    };
  },
  methods: {
    overrideMode(type, mode) {
      this[type] = mode;

      const obj = {
        id: this.apData.id,
      };

      if (type == "exit") {
        obj.exit_mode = mode;
      } else if (type == "entry") {
        // obj.entry_mode = mode;
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
    },
    updateStatus(mode) {
      let obj = {
        id: this.apData.id,
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
    },
  },
};
</script>

<style lang="scss" scoped>
.left_btn,
.antipanic,
.right_btn {
  cursor: pointer;
}
.justify_butt {
  //   justify-content: center;
  padding: 0 15px;
}
.override_left {
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
}

.override_right {
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
}

.active_btn {
  background: #00000026;
}

.man_override_button {
  width: 130px;
  height: 45px;
  display: inline-flex;
  border: 2px solid black;
  text-align: center;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.entry_exit {
  width: 60px;
  display: inline-block;
  margin-right: 50px;
}

.antipanic {
  display: flex;
  align-items: center;
  justify-content: center;
  background: green;
  padding: 0 9px;
  border: solid 1px black;
  border-right: none !important;
  position: relative;
  vertical-align: middle;
  height: 40px; /* double the border width */
  box-sizing: border-box;
  width: 48%;
  margin: 0 auto;
  border-radius: 25px;
}
.block_access {
  margin-left: 5px;
  display: table;
  background: rgba(0, 0, 0, 0);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: 0 35px;
  margin-top: 25px;
}
.left_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: green;
  padding: 0 9px;
  border: solid 1px black;
  border-left: none !important;
  position: relative;
  vertical-align: middle;
  height: 40px; /* double the border width */
  box-sizing: border-box;
  width: 23%;
}

.right_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: green;
  padding: 0 9px;
  border: solid 1px black;
  border-right: none !important;
  position: relative;
  vertical-align: middle;
  height: 40px; /* double the border width */
  box-sizing: border-box;
  width: 23%;
}

.left_btn:after,
.left_btn:before {
  right: 100% !important;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-width: 20px 12px 20px 0;
  margin-top: -20px;
}

.right_btn:after,
.right_btn:before {
  left: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-width: 20px 0 20px 12px;
  margin-top: -20px;
}

.left_btn:after {
  border-color: rgba(0, 128, 0, 0);
  border-right-color: #85c0e0;
  margin-right: -1px;
}
.left_btn:before {
  border-color: rgba(0, 0, 0, 0);
  border-right-color: #000000;
}

.right_btn:after {
  border-color: rgba(0, 128, 0, 0);
  border-left-color: #85c0e0;
  margin-left: -1px;
}

.right_btn:before {
  border-color: rgba(0, 0, 0, 0);
  border-left-color: #000000;
}

.man_override_button.isActive {
  color: red;
}

.ap_blue {
  background: #85c0e0;
}
</style>
