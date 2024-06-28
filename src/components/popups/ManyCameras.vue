<template>
  <vs-popup class="holamundo video_popup" title="Player" :active.sync="popup">
    <div class="vx-row">
      <div
        class="vx-col w-1/2 cctv_view"
        :class="{ active: activeCctv === 'cctv1' }"
      >
        <canvas ref="video_canvas" id="video-canvas1" > </canvas>
        <!--
        <video-player
          ref="cctv1"
          @click.native="disableDefaultAction('cctv1')"
          @dblclick.native="toggleFullscreen('cctv1')"
          :options="cctv1Options"
        /> -->
      </div>
      <div
        class="vx-col w-1/2 cctv_view"
        :class="{ active: activeCctv === 'cctv2' }"
      >
        <video-player
          ref="cctv2"
          @click.native="disableDefaultAction('cctv2')"
          :options="cctv2Options"
          @dblclick.native="toggleFullscreen('cctv2')"
        />
      </div>
      <div
        class="vx-col w-1/2 cctv_view"
        :class="{ active: activeCctv === 'cctv3' }"
      >
        <video-player
          ref="cctv3"
          @click.native="disableDefaultAction('cctv3')"
          :options="cctv3Options"
          @dblclick.native="toggleFullscreen('cctv3')"
        />
      </div>
      <div
        class="vx-col w-1/2 cctv_view"
        :class="{ active: activeCctv === 'cctv4' }"
      >
        <video-player
          ref="cctv4"
          @click.native="disableDefaultAction('cctv4')"
          :options="cctv4Options"
          @dblclick.native="toggleFullscreen('cctv4')"
        />
      </div>
      <div class="vx-col w-1/2 cctv_view"></div>
    </div>

    <div class="vx-col w-full">
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
    </div>
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
      activeCctv: "cctv2",
      cctv1Options: {
        playbackRates: [0.5, 1, 1.5, 2],
        autoplay: true,
        controls: true,
        live: true,
        muted: true,
        sources: [
          {
            src: "http://localhost:3000/stream.m3u8",
            // type: "rtmp/mp4",
          },
        ],
      },
      // https://live-par-1-abr-cdn.livepush.io/live_abr_cdn/emaIqCGoZw-6/index.m3u8
      // rtsp://cam1:password123!@67.85.251.192:60702/profile2
      cctv2Options: {
        playbackRates: [0.5, 1, 1.5, 2],
        autoplay: true,
        controls: false,
        live: true,
        muted: true,
        sources: [
          {
            src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
            // type: "video/mp4",
          },
        ],
      },
      cctv3Options: {
        playbackRates: [0.5, 1, 1.5, 2],
        autoplay: true,
        controls: false,
        live: true,
        muted: true,
        sources: [
          {
            src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
            // type: "video/mp4",
          },
        ],
      },
      cctv4Options: {
        playbackRates: [0.5, 1, 1.5, 2],
        autoplay: true,
        controls: false,
        live: true,
        muted: true,
        sources: [
          {
            src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
            // type: "video/mp4",
          },
        ],
      },
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

    syncViewing() {
      this.cctv1.player.play();
      this.cctv2.player.play();
      this.cctv3.player.play();
      this.cctv4.player.play();
    },
    stopAllPlayers() {
      this.$refs.cctv1.player.pause();
      this.cctv2.player.pause();
      this.cctv3.player.pause();
      this.cctv4.player.pause();
    },
    playPause() {
    },
    changeSpeed(speed) {
      // this.$refs.cctv1.player.setPlaybackRate(speed);
      // this.cctv1Options.playbackRates = 2
    },

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
    let livestream_url = `${process.env.VUE_APP_LIVE_STREAMING}/hls/camera`
    let playbackstream_url =  `${process.env.VUE_APP_LIVE_STREAMING}/hls/playback/camera`;

    // let client = new WebSocket(
    //   `${livestream_url}/899?token=${localStorage.token}`
    // );

    setTimeout(() => {
      let player = new JSMpeg.Player(
        `${livestream_url}/89?token=${localStorage.token}`,
        { canvas: canvas1 }
      );
      // let player3 = new JSMpeg.Player(`${playbackstream_url}/89?token=${localStorage.token}&begin=${1682159924}&end=${1682159944}`, {canvas: canvas1});
    }, 1000);

  },
  created() {
    this.popup = this.popupActive;

    // const jsmpeg = require("jsmpeg");

    // }, 500);
    // let url = "ws://localhost:3333/hls/camera";
    // let client = new WebSocket( `${url}/2` );

    // let player = new jsmpeg(client, { canvas: canvas1 });

    // let player2 = new JSMpeg.Player(${livestream_url}/89?token=${headers.Authorization}, {canvas: canvas2 });
    // let player3 = new JSMpeg.Player(${playbackstream_url}/89?token=${headers.Authorization}&begin=${1682159924}&end=${1682159944}, {canvas: canvas3});
  },
  components: {
    // VideoPlayer,
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/videoPlayer.scss";
</style>
