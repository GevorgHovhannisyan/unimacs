<template>
  <div class="relative">
    <div class="live_stream_block" :class="{ hasVideo: !canPriview, no_dashboard: monitor === 'device' }">
      <div v-if="!cameraId" style="text-align: center;">No camera</div>
      <div class="pending_video" v-else-if="!canPriview">
        {{ videoError ? videoError : "Loading... Please wait" }}
      </div>
      <canvas class="live_priview" :class="{ full_scrren_stream: isFullScreen }" :id="`dashboard_live_stream_${monitor}`"
        style="width: 100%" v-show="canPriview" @dblclick="showFullScreen"></canvas>
    </div>
    <div class="cam_name" :class="{ camera_name: canPriview }">
      {{ cameraName }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cameraId: {
      type: Number,
    },
    monitor: {
      type: String,
      default: "1",
    },
    cameraName: {
      type: String,
      default: null,
    },
    dashboard: {
      type: Boolean,
      default: false,
    },

  },
  watch: {
    async cameraId() {

      const settings = JSON.parse(JSON.stringify(this.settingsStore));

      const dashboard_settings =
        settings && settings.dashboard_settings
          ? settings.dashboard_settings[`ap_monitor_${this.monitor}`]
          : null;
      if (dashboard_settings) {
        const monitor_settings =
          settings.dashboard_settings[`ap_monitor_${this.monitor}`];

        if (monitor_settings.camera !== this.cameraId) {
          monitor_settings.camera = this.cameraId;
          this.$emit("setCamera", monitor_settings.camera);
          // this.$parent.$parent.$parent.setSettings(settings);
          await this.$store.dispatch("setSettings", settings)
        }
      }

      this.videoError = null;

      setTimeout(() => {
        if (this.player) {
          this.player.destroy();
          this.player = null;
          this.streamVideo();
        }
      }, 300);
    },
  },
  async created() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    const data = await this.$http.get(`/account/getUserData`, {
      headers: { Authorization: localStorage.token },
    });

    const settings = JSON.parse(JSON.stringify(this.settingsStore)) || null;


    if (settings) {

      const dashboard_settings =
        settings && settings.dashboard_settings
          ? settings.dashboard_settings[`ap_monitor_${this.monitor}`]
          : null;
      if (dashboard_settings) {
        if (settings.dashboard_settings[`ap_monitor_${this.monitor}`]) {
          const monitor_settings =
            settings.dashboard_settings[`ap_monitor_${this.monitor}`];

          if (monitor_settings.camera !== this.cameraId) {
            monitor_settings.camera = this.cameraId;
            this.$emit("setCamera", monitor_settings.camera);
            await this.$store.dispatch("setSettings", settings)

            // this.$parent.$parent.$parent.setSettings(settings);
          }
        } else {
        }
      }
    }

    setTimeout(() => {
      this.streamVideo();
    }, 300);
  },
  data() {
    return {
      canPriview: false,
      player: null,
      videoError: null,
      isFullScreen: false,
    };
  },
  computed:{
    settingsStore() {
      return this.$store.state.settings
    }
  },
  methods: {
    streamVideo() {
      this.canPriview = false;
      this.videoError = null;
      if (this.cameraId) {
        let canvas1 = document.getElementById(
          `dashboard_live_stream_${this.monitor}`
        );
        this.$store
          .dispatch("report/checkLiveStream", this.cameraId)
          .then(() => {
            let livestream_url = `${process.env.VUE_APP_LIVE_STREAMING}/hls/camera`;
            const url = `${livestream_url}/${this.cameraId}?token=${localStorage.token}`;

            const onVideoDecode = () => {
              this.canPriview = true;
              return false;
            };
            this.player = new JSMpeg.Player(url, {
              canvas: canvas1,
              onVideoDecode: onVideoDecode,
              poster:
                "https://citrontours.ae/wp-content/uploads/2022/09/gallery-img-worlds-of-adventure-1.jpg",
            });
          })
          .catch((err) => {
            const message =
              err && err.response.data && err.response.data.message
                ? err.response.data.message
                : null;

            if (message && message === "Camera is Inactive") {
              this.canPriview = false;
              this.videoError = message;
            }
          });
      }
    },
    showFullScreen() {
      if (this.dashboard) {
        this.$emit("fullscreen");
      } else {
        this.isFullScreen = !this.isFullScreen;

        if (this.isFullScreen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "unset";
        }
      }
    },
  },
  mounted() {
    this.$root.$on("closeStream", () => {
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }
    });
  },
  destroyed() {
    this.$root.$off("closeStream");
  },
};
</script>

<style lang="scss">
.live_preview {
  .vs-popup--content {
    .hasVideo {
      margin-top: 21%;
    }
  }

  .full_scrren_stream {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999999999;
  }
}

.no_dashboard {
  padding-bottom: 15px;

  .live_priview {
    &.full_scrren_stream {
      object-fit: unset;
      height: 100%;
    }

    height: 500px;
    object-fit: contain;
  }
}
</style>
