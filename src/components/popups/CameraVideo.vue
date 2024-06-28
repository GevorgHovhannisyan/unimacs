<template>
  <vs-popup class="holamundo video_popup" title="Player" :active.sync="popup">
    <div class="vx-row">
      <div
        class="vx-col w-full cctv_view"
        :class="{ active: activeCctv === 'cctv1' }"
      >
        <canvas ref="video_canvas" id="video-canvas1"> </canvas>
      </div>
    </div>

    <!-- <div class="vx-col w-full">
      <div class="actions_btns other_actions">
        <vs-icon
          @click="screenShot"
          icon-pack="material-icons"
          icon="photo_camera"
        />
        <span @click="syncViewing">
          <vs-icon icon-pack="material-icons" icon="trending_flat" />
          <vs-icon icon-pack="material-icons" icon="trending_flat" />
        </span>
        <vs-icon icon-pack="material-icons" icon="double_arrow" />
        <vs-icon
          icon-pack="material-icons"
          icon="play_arrow"
          @playPause="playPause"
        />
        <vs-icon
          icon-pack="material-icons"
          icon="stop"
          @click="stopAllPlayers"
        />
        <span @click="changeSpeed(2)">2x</span>
        <vs-icon icon-pack="material-icons" icon="skip_next" />
      </div>
    </div> -->
  </vs-popup>
</template>

<script>
import html2canvas from "html2canvas";
import "video.js/dist/video-js.css";
import "video.js/dist/video.js";
export default {
  props: {
    popupActive: {
      type: Boolean,
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
  },
  computed: {},
  data() {
    return {
      player: null,
      popup: false,
    };
  },
  methods: {
    handleDoubleClick(cctv) {
    },
    toggleFullscreen(cctv) {
      const videoPlayer = this.$refs[cctv].$refs.video;
      if (!this.isFullscreen) {
        videoPlayer.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
    disableDefaultAction(cctv) {
      this.activeCctv = cctv;
      return false;
    },
    screenShot() {
      const FileSaver = require("file-saver");

      const videoPlayer =
        this.$refs[this.activeCctv].$el.children[0].children[0];

      html2canvas(videoPlayer).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        var arr = imgData.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], "screen", { type: mime });
        // Save Blob file
        FileSaver.saveAs(file, "myFile.png");
      });
    },

    syncViewing() {},
    stopAllPlayers() {},
    playPause() {},
    changeSpeed(speed) {},

    onPlay() {
      this.isPlaying = true;
    },
    onPause() {
      this.isPlaying = false;
    },
  },
  mounted() {
    // setTimeout(() => {
    let canvas1 = document.getElementById("video-canvas1");
    let livestream_url = `${process.env.VUE_APP_LIVE_STREAMING}/hls/camera`;
    // let playbackstream_url =  `${process.env.VUE_APP_LIVE_STREAMING}/hls/playback/camera`;


    setTimeout(() => {
      let player = new JSMpeg.Player(
        `${livestream_url}/89?token=${localStorage.token}`,
        { canvas: canvas1,   preserveDrawingBuffer: true, }
      );
      // let player3 = new JSMpeg.Player(`${playbackstream_url}/89?token=${localStorage.token}&begin=${1682159924}&end=${1682159944}`, {canvas: canvas1});
    }, 300);
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
