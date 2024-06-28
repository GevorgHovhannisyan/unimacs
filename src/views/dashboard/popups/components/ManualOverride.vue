<template>
  <div class="vx-col w-full">
    <div class="vx-row">
      <div class="vx-col md:w-1/2">
        <div
          class="unlock ap_green ap_blue cursor_"
          :class="{
            disabled_: apData.acus && apData.acus.cloud_status == 'offline',
          }"
          @click="
            apData.acus && apData.acus.cloud_status == 'offline'
              ? false
              : updateStatus('exit')
          "
        >
          Single Exit
        </div>
        <div
          class="lock ap_red ap_blue cursor_"
          :class="{
            disabled_: apData.acus && apData.acus.cloud_status == 'offline',
          }"
          @click="
            apData.acus && apData.acus.cloud_status == 'offline'
              ? false
              : updateStatus('entry')
          "
        >
          Single Entry
        </div>
      </div>
      <div class="vx-col md:w-1/2">
        <div
          class="unlock ap_green cursor_"
          :class="{
            disabled_: apData.acus && apData.acus.cloud_status == 'offline',
          }"
          @click="
            apData.acus && apData.acus.cloud_status == 'offline'
              ? false
              : updateStatus('unlocked')
          "
        >
          Unlock
        </div>
        <div
          class="lock ap_red cursor_"
          :class="{
            disabled_: apData.acus && apData.acus.cloud_status == 'offline',
          }"
          @click="
            apData.acus && apData.acus.cloud_status == 'offline'
              ? false
              : updateStatus('locked')
          "
        >
          Lock down
        </div>
      </div>
    </div>

    <div class="vx-row">
      <div
        class="vx-col md:w-full credential_block cursor_"
        :class="{
          disabled_: apData.acus && apData.acus.cloud_status == 'offline',
        }"
        @click="
          apData.acus && apData.acus.cloud_status == 'offline'
            ? false
            : updateStatus('credential')
        "
      >
        Normal
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
  methods: {
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
            if (res.data.message == "Update Pending") {
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
.credential_block {
  background: green;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // border: 2px solid black;
  border-radius: 5px;
  color: black;
  font-weight: bold;
  margin: 10px 15px 0;
  height: 40px;
}

.open_once,
.lock,
.unlock,
.credential_block {
  color: white;
  text-align: center;
}
.ap_blue {
  // background: #85c0e0;
}

.ap_green {
  height: 40px;
  // background: green;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 2px solid black;
}
.ap_red {
  // background: red;
  height: 40px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 2px solid black;
}
.manual__override {
  > .vx-col {
    // border: 2px solid #d4cccc;
    margin: 10px 15px 0;
    padding: 15px;
  }
}

.cursor_ {
  cursor: pointer;
}

.disabled_ {
  cursor: not-allowed;
}
</style>
