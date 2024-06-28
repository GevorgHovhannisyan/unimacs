<template>
  <vs-popup class="holamundo video_popup" title="Player" :active.sync="popup" v-if="popup">
    <div class="vx-row video_row">
      <div class="vx-col cctv_view" :class="{
        active: activeCamera === 'camera_1',
        full_screen_playback: videoFullScreen.camera_1,
        hidden_camera: cameraIsHidden(1),
      }" @click="activeCamera = 'camera_1'">
        <div class="hasVideo" v-if="!camera_1">
          {{ videoErrors.camera_1 ? videoErrors.camera_1 : "Loading ..." }}
        </div>
        <canvas :id="`camera_1`" @dblclick="showFullScreen('camera_1')" v-show="camera_1" style="width: 100%"></canvas>
      </div>
      <div class="vx-col cctv_view" :class="{
        active: activeCamera === 'camera_2',
        full_screen_playback: videoFullScreen.camera_2,
        hidden_camera: cameraIsHidden(2),
      }" @click="activeCamera = 'camera_2'">
        <div class="hasVideo" v-if="!camera_2">
          {{ videoErrors.camera_2 ? videoErrors.camera_2 : "Loading ..." }}
        </div>
        <canvas :id="`camera_2`" @dblclick="showFullScreen('camera_2')" v-show="camera_2" style="width: 100%"></canvas>
      </div>
      <div class="vx-col cctv_view" :class="{
        active: activeCamera === 'camera_3',
        full_screen_playback: videoFullScreen.camera_3,
        hidden_camera: cameraIsHidden(3),
      }" @click="activeCamera = 'camera_3'">
        <div class="hasVideo" v-if="!camera_3">
          {{ videoErrors.camera_3 ? videoErrors.camera_3 : "Loading ..." }}
        </div>
        <canvas :id="`camera_3`" @dblclick="showFullScreen('camera_3')" v-show="camera_3" style="width: 100%"></canvas>
      </div>
      <div class="vx-col cctv_view" :class="{
        active: activeCamera === 'camera_4',
        full_screen_playback: videoFullScreen.camera_4,
        hidden_camera: cameraIsHidden(4),
      }" @click="activeCamera = 'camera_4'">
        <div class="hasVideo" v-if="!camera_4">
          {{ videoErrors.camera_4 ? videoErrors.camera_4 : "Loading ..." }}
        </div>
        <canvas :id="`camera_4`" @dblclick="showFullScreen('camera_4')" v-show="camera_4" style="width: 100%"></canvas>
      </div>
    </div>
    <div class="vx-col w-full">
      <div class="actions_btns other_actions">
        <vs-icon @click="screenShot" icon-pack="material-icons" icon="photo_camera" class="cursor-pointer" />
        <span @click="syncViewing">
          <vs-icon icon-pack="material-icons" icon="trending_flat" class="cursor-pointer" />
          <vs-icon icon-pack="material-icons" icon="trending_flat" class="cursor-pointer" />
        </span>
        <vs-icon icon-pack="material-icons" icon="double_arrow" @click="downloadStreamReverse"
          class="cursor-pointer reverse_" />
        <vs-icon icon-pack="material-icons" icon="play_arrow" @click="playPause" class="cursor-pointer" v-if="!playing" />

        <vs-icon icon-pack="material-icons" icon="pause" @click="playPause" class="cursor-pointer" v-else />
        <vs-icon icon-pack="material-icons" icon="stop" @click="stopPlayer" class="cursor-pointer" />
        <span @click="changeSpeed(2)" class="cursor-pointer"> 2x</span>
        <vs-icon icon-pack="material-icons" icon="skip_next" class="cursor-pointer" />
        <div>
          <vs-button @click="downloadStream">Download</vs-button>
        </div>
      </div>
    </div>
  </vs-popup>
</template>

<script>
import { screenShot } from "@/functions/canvasHelper";

export default {
  props: {
    popupActive: {
      type: Boolean,
    },
    cameraSet: {
      type: Object,
      default: () => { },
    },
    cameraEvent: {
      type: Object,
      default: () => { },
    },
  },
  watch: {
    popupActive(val) {
      this.popup = val;
      this.$emit("popup", val);
    },
    popup(val) {
      if (!val) {
        this.destroyCameras();
      }
      this.$emit("popup", val);
    },
    cameraSet() {
      this.destroyCameras();
      this.initErrors();
      this.setCameras();
    },
  },
  computed: {
    playing() {
      if (this[this.activeCamera]) {
        if (this[this.activeCamera].paused) {
          return false;
        }
      } else {
        return false;
      }

      return true;
    },
    cameraIsHidden() {
      return (camera) => {
        const full_screen = this.videoFullScreen;
        if (camera === 1) {
          return (
            full_screen.camera_2 || full_screen.camera_3 || full_screen.camera_4
          );
        } else if (camera === 2) {
          return (
            full_screen.camera_1 || full_screen.camera_3 || full_screen.camera_4
          );
        } else if (camera === 3) {
          return (
            full_screen.camera_1 || full_screen.camera_2 || full_screen.camera_4
          );
        } else if (camera === 4) {
          return (
            full_screen.camera_1 || full_screen.camera_2 || full_screen.camera_3
          );
        }
      };
    },
  },
  data() {
    return {
      popup: false,
      activeCamera: "camera_1",
      camera_1: null,
      camera_2: null,
      camera_3: null,
      camera_4: null,

      videoData: [],
      videoErrors: {},
      videoFullScreen: {
        camera_1: null,
        camera_2: null,
        camera_3: null,
        camera_4: null,
      },
    };
  },
  mounted() {
    this.initErrors();
    this.setCameras();
  },
  methods: {
    streamVideo(camera, { start, end }) {
      this.initErrors();
      const params = {
        begin: start,
        end: end,
      };

      const onEnded = (event) => { };

      this.$store
        .dispatch("report/checkVideoResource", { camera: camera.id, params })
        .then((res) => {
          if (res.data.url) {
            let playbackstream_url = `${process.env.VUE_APP_LIVE_STREAMING}/hls/playback/camera`;
            let canvas = document.getElementById(`camera_${camera.number}`);

            this[`camera_${camera.number}`] = new JSMpeg.Player(
              `${playbackstream_url}/${camera.id}?token=${localStorage.token}&begin=${start}&end=${end}`,
              {
                canvas,
                loop: false,
                preserveDrawingBuffer: true,
                reconnectInterval: 0,
                onEnded: onEnded,
                id: camera.id,
                start,
                end,
                // onVideoDecode:onVideoDecoder,
              }
            );
          }
        })
        .catch((err) => {
          const message =
            err && err.response.data && err.response.data.message
              ? err.response.data.message
              : null;

          if (message && message === "There are no streams") {
            this.videoErrors[`camera_${camera.number}`] = message;
          }
        });
    },
    setCameras() {
      if (this.cameraSet && this.cameraSet.cameras.length) {
        const cameras = JSON.parse(JSON.stringify(this.cameraSet.cameras));

        for (let i = 0; i < cameras.length; i++) {
          const camera = cameras[i];
          camera.number = i + 1;
          this.streamVideo(camera, {
            start: this.cameraSet.before_event_tms,
            end: this.cameraSet.after_event_tms,
          });
        }
        this.setNoCameras(cameras.length);
      }
    },
    destroyCameras() {
      if (this.camera_1) {
        if ("paused" in this.camera_1) {
          this.camera_1.destroy();
        }
        this.camera_1 = null;
      }
      if (this.camera_2) {
        if ("paused" in this.camera_2) {
          this.camera_2.destroy();
        }
        this.camera_2 = null;
      }
      if (this.camera_3) {
        if ("paused" in this.camera_3) {
          this.camera_3.destroy();
        }
        this.camera_3 = null;
      }
      if (this.camera_4) {
        if ("paused" in this.camera_4) {
          this.camera_4.destroy();
        }
        this.camera_4 = null;
      }
    },
    handleDoubleClick(cctv) { },
    disableDefaultAction(cctv) {
      this.activeCamera = cctv;
      return false;
    },
    screenShot() {
      var jpg = this[this.activeCamera].renderer.canvas.toDataURL(
        "image/jpeg",
        0.7
      );
      screenShot(jpg);
    },

    async syncViewing() {
      this.destroyCameras();
      setTimeout(() => {
        this.setCameras();
      }, 400);
    },
    stopPlayer() {
      if (this[this.activeCamera]) {
        this[this.activeCamera].destroy();
        this[this.activeCamera] = null;
        this.videoErrors[this.activeCamera] = "Stream stoped";
      }
    },
    downloadStream(reverse) {
      if (this[this.activeCamera] && this[this.activeCamera].options) {
        this.$vs.loading();
        const camera = this[this.activeCamera].options;
        const id = camera.id;
        let name = ''
        if (this.cameraSet.cameras && this.cameraSet.cameras.length) {
          const findCam = this.cameraSet.cameras.find(i => i.id == id);
          if (findCam) {
            name = findCam.name
          }
        }
        const date = this.cameraEvent.date.split(':').join('-')
        let download_url = `${process.env.VUE_APP_RTSP_URL}/hls/download/camera/${camera.id}/?begin=${camera.start}&end=${camera.end}&token=${localStorage.token}&reverse=NO`;
        // let download_url = `${process.env.VUE_APP_RTSP_URL}/hls/download/camera/${camera.id}/${camera.start}/${camera.end}/${localStorage.token}/NO`;

        fetch(download_url, {
          headers: { Authorization: localStorage.token },
        })
          .then((response) => response.blob())
          .then((blob) => {
            this.$vs.loading.close();

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${name} - ${date}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          })
          .catch(() => {
            this.$vs.loading.close();
          });
      }
    },
    downloadStreamReverse() {
      this.downloadStream(true);
    },
    playPause() {
      if (this[`${this.activeCamera}`]) {
        if (this[`${this.activeCamera}`].paused) {
          this[`${this.activeCamera}`].play();
        } else {
          this[`${this.activeCamera}`].stop();
        }
      } else {
        const cameras = JSON.parse(JSON.stringify(this.cameraSet.cameras));

        const getCameraNum = this.activeCamera.split("_")[1];
        const cameraByIndex = cameras[getCameraNum - 1];
        let camera = cameraByIndex;

        camera.number = getCameraNum;
        this.streamVideo(camera, {
          start: this.cameraSet.before_event_tms,
          end: this.cameraSet.after_event_tms,
        });
      }
    },
    changeSpeed(speed) { },
    initErrors() {
      this.videoErrors = {
        camera_1: false,
        camera_2: false,
        camera_3: false,
        camera_4: false,
      };
    },
    showFullScreen(cam) {
      const camera = document.querySelector(`.${cam}`);
      this.videoFullScreen[cam] = !this.videoFullScreen[cam];
      // if (camera.classList.contains("full_screen_playback")) {
      //   camera.classList.remove("full_screen_playback");
      // } else {
      //   camera.classList.add("full_screen_playback");

      // }
    },
    setNoCameras(length) {
      const text = "No camera";
      if (length === 0) {
        this.videoErrors.camera_1 = text;
        this.videoErrors.camera_2 = text;
        this.videoErrors.camera_3 = text;
        this.videoErrors.camera_4 = text;
      } else if (length === 1) {
        this.videoErrors.camera_2 = text;
        this.videoErrors.camera_3 = text;
        this.videoErrors.camera_4 = text;
      } else if (length === 2) {
        this.videoErrors.camera_3 = text;
        this.videoErrors.camera_4 = text;
      } else if (length === 3) {
        this.videoErrors.camera_4 = text;
      }
    },
  },
  created() {
    this.popup = this.popupActive;
  },
  components: {
    // VideoPlayer,
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/videoPlayer.scss";
</style>
