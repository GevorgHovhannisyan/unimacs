<template>
  <div class="live_monitor_1_parent live_monitor_parents" :class="{
    absolute_dashboard:
      monitor_settings &&
      monitor_settings.miniature_position !== 'fixed' &&
      monitor_settings.enable_cctv,

    no_cctv: !monitor_settings.enable_cctv,
  }">
    <div class="live_monitor_1_parent live_monitor_parents">
      <div class="vx-col mt-3 cameras_dashboard" v-if="monitor_settings && monitor_settings.enable_cctv">
        <v-select v-model="cameraId" :options="access_point_cameras" class="select_padding" name="addresss" label="name"
          autocomplete="new-password" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      </div>
      <div class="xl:flex-row lg:flex-col live_monitor" :class="{
        vertical_monitor: checkPosition('vertical'),
        horizontal_monitor: checkPosition('horizontal'),
      }">
        <div class="w-2/3 video_block_dashboard" ref="video_block_dashboard" v-if="monitor_settings.enable_cctv"
          @dblclick="fullScreenEnabled" :class="{
            success: successEnter === true,
            failed: successEnter === false,
            no_event: successEnter === null && !isFullScreen,
          }">
          <h4 class="title dashboard_title" v-if="getCameraName">
            {{ getCameraName }}
          </h4>
          <div class="play_video">
            <LiveStream monitor="2" :cameraId="cameraId" v-if="cameraId" @setCamera="cameraId = $event" :dashboard="true"
              @fullscreen="fullScreenEnabled" class="dashboard_mon_2" />

            <!-- <video-player ref="player" :options="playerOptions" /> -->
          </div>
        </div>
        <VueDragResize v-if="monitor_settings &&
          monitor_settings.miniature_position !== 'fixed' &&
          monitor_settings.enable_miniature &&
          monitor_settings.enable_cctv
          " :isActive="true" v-on:dragstop="resize" :isResizable="false" class="w-1/3 vue_custom_drag"
          :x="monitor_2_settings.miniature_drag_pos.left" :y="monitor_2_settings.miniature_drag_pos.top"
          :preventActiveBehavior="true" :parentLimitation="true" :parentW="miniatureW" :parentH="miniatureH">
          <div class="info_block_dashboard" ref="vue_custom_drag" :class="{
            success: successEnter === true,
            failed: successEnter === false,
            no_event: successEnter === null,
            vertical: checkPosition('vertical'),
            horizontal: checkPosition('horizontal'),
          }">
            <MonitorList :monitor_settings="monitor_settings" :monitor_data="monitor_data" :fieldsShown="fieldsShown"
              :short_info="short_info" :avatarSrc="avatarSrc" :carSrc="carSrc" />
          </div>
        </VueDragResize>

        <div v-else-if="monitor_settings.enable_miniature ||
          monitor_settings.miniature_position == 'fixed' ||
          !monitor_settings.enable_cctv
          " class="info_block_dashboard" :class="{
    success: successEnter === true,
    no_event: successEnter === null,
    failed: successEnter === false,
    vertical: checkPosition('vertical'),
    horizontal: checkPosition('horizontal'),
  }">
          <MonitorList :monitor_settings="monitor_settings" :monitor_data="monitor_data" :fieldsShown="fieldsShown"
            :short_info="short_info" :avatarSrc="avatarSrc" :carSrc="carSrc" />
        </div>
      </div>

      <ManualOverride :fieldsShown="fieldsShown" :monitor_1_settings="monitor_2_settings"
        v-if="monitor_2_settings && monitor_2_settings.access_point" />
    </div>
  </div>
</template>
<script>
import MonitorList from "../../../components/custom/MonitorList.vue";

import vSelect from "vue-select";
import LiveStream from "./LiveStream";
import ManualOverride from "./ManualOverride.vue";

export default {
  props: {
    monitorData: {
      type: Object,
    },
    monitor_2_settings: {
      type: Object,
    },
    monitorFileds: {
      type: Array,
      default: () => [],
    },
    access_points: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      avatarSrc: "no_avatar.svg",
      carSrc: "/no_car.svg",
      short_info: false,
      monitor_settings: false,
      monitor_data: null,
      successEnter: null,
      fieldsShown: {},
      access_point: null,
      access_point_cameras: [],
      cameraId: null,
      cameraName: null,
      isFullScreen: false,
      miniatureW: 0,
      miniatureH: 0,
    };
  },
  computed: {
    parseData() {
      return (date) => {
        const time_zone = date.time_zone || null;
        if (time_zone) {
          return this.$moment(date.date * 1000)
            .tz(time_zone)
            .format(`YYYY-MM-DD HH:mm:ss ( dddd )`);
        } else {
          return this.$moment(date.date * 1000).format(
            `YYYY-MM-DD HH:mm:ss ( dddd )`
          );
        }
      };
    },
    checkPosition() {
      return (position) => {
        if (this.monitor_settings) {
          if (this.monitor_settings.miniature_orientation === position) {
            return true;
          } else {
            return false;
          }
        } else {
          if (position === "vertical") return true;
        }
      };
    },
    cameras() {
      return this.$store.state.cctv.cameras;
    },
    getCameraName() {
      if (this.monitor_2_settings.access_point && this.access_points.length) {
        const find = this.access_points.find(
          (point) => point.id == this.monitor_2_settings.access_point
        );
        if (find) {
          return find.name;
        }
      }

      return null;
    },
    settingsStore() {
      return this.$store.state.settings
    }
  },
  mounted() {
    // this.$root.$on("emptySecondMonitor", () => {
    //   this.monitor_data = null;
    //   this.avatarSrc = "no_avatar.svg";
    //   this.carSrc = "/no_car.svg";
    // });
  },
  watch: {
    monitor_2_settings(newVal, oldVal) {
      this.monitor_settings = JSON.parse(
        JSON.stringify(this.monitor_2_settings)
      );
      const short_info = this.monitor_settings
        ? this.monitor_settings.enable_short_info
        : false;
      this.short_info = short_info;
      if (newVal && oldVal && newVal.access_point != oldVal.access_point) {
        this.fetchAccessPoints();
      }
      // this.getMiniatureSize();
      this.updateZoomLevel();
    },
    monitorData(data) {
      this.emptyMonitor();
      this.correctData();
    },
    monitorFileds(data) {
      this.arrayToFiledsObj(this.monitorFileds);
    },
    cameraId() {
      const findCam = this.access_point_cameras.find(
        (c) => c.id == this.cameraId
      );
      if (findCam) {
        this.cameraName = findCam.name;
      }
    },
  },
  methods: {

    emptyMonitor() {
      this.monitor_data = null;
      this.avatarSrc = "no_avatar.svg";
      this.carSrc = "/no_car.svg";
    },
    arrayToFiledsObj(settings) {
      this.fieldsShown = {};
      if (settings.length) {
        settings.map((item) => {
          this.fieldsShown[item.key] = item.show;
        });
      }
    },
    async resize({ left, top }) {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));

      let t = top;
      let l = left;
      // if (left > 450) {
      //   if (top > 250) {
      //     t = 330;
      //     l = 600;
      //   } else {
      //     t = 60;
      //     l = 610;
      //   }
      // }

      settings.dashboard_settings.ap_monitor_2.miniature_drag_pos = {
        left: l,
        top: t,
      };
      await this.$store.dispatch("setSettings", settings)

      // this.$parent.$parent.setSettings(settings);

      // this.width = newRect.width;
      // this.height = newRect.height;
      // this.top = newRect.top;
      // this.left = newRect.left;
    },
    async fetchAccessPoints() {
      const camera = this.getCameraFromSettings();
      if (this.monitor_2_settings && this.monitor_2_settings.access_point) {
        const access_point = this.monitor_2_settings.access_point;
        this.$store
          .dispatch("cctv/fetchCamerasAccessPoint", access_point)
          .then((res) => {
            this.access_point_cameras = res.data;
            if (!this.access_point_cameras.length) {
              this.cameraId = null;
              this.cameraName = null;
            }
            //  else if (camera) {
            //   const findCam = res.data.find((c) => c.id == camera);
            //   if (findCam) {
            //     this.cameraId = findCam.id;
            //     this.cameraName = findCam.name;
            //   } else {
            //     this.cameraId = res.data[0].id;
            //     this.cameraName = this.cameras[0].name;
            //   }
            // }
            else {
              let findMain;

              for (let i = 0; i < res.data.length; i++) {
                const camera = res.data[i];

                if (camera.camera_camera_sets && camera.camera_camera_sets[0]) {
                  if (camera.camera_camera_sets[0].main) {
                    findMain = camera;
                    break;
                  }
                }
              }

              if (findMain) {
                this.cameraId = findMain.id;
                this.cameraName = findMain.name;
              } else {
                this.cameraId = res.data[0].id;
                this.cameraName = this.cameras[0].name;
              }
            }
            // this.cameraId = res.data[0].id;
          })
          .catch(async () => {


            const settings = JSON.parse(JSON.stringify(this.settingsStore));
            if (
              settings &&
              settings.dashboard_settings &&
              settings.dashboard_settings.ap_monitor_2
            ) {
              const ap_point =
                settings.dashboard_settings.ap_monitor_2.access_point;
              const points = this.$parent.$parent.access_points;
              if (
                ap_point &&
                points.data.length &&
                !points.data.find((p) => p.id == ap_point)
              ) {
                settings.dashboard_settings.ap_monitor_2.access_point = null;
                await this.$store.dispatch("setSettings", settings)

              } else {
                settings.dashboard_settings.ap_monitor_2.access_point = null;
                await this.$store.dispatch("setSettings", settings)

              }
            }
          });
      } else {
        this.$store
          .dispatch("cctv/fetchCameras", {
            params: {
              hidden: false,
            },
          })
          .then(() => {
            this.access_point_cameras = this.cameras;

            if (!this.access_point_cameras.length) {
              this.cameraId = null;
              this.cameraName = null;
            } else if (camera) {
              const findCam = this.cameras.find((c) => c.id == camera);
              if (findCam) {
                this.cameraId = findCam.id;
                this.cameraName = findCam.name;
              } else {
                this.cameraId = this.cameras[0].id;
                this.cameraName = this.cameras[0].name;
              }
            } else {
              this.cameraId = this.cameras[0].id;
              this.cameraName = this.cameras[0].name;
            }

            // this.cameraId = this.cameras[0].id;
          });
      }
    },
    getCameraFromSettings() {


      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      const camera =
        settings &&
          settings.dashboard_settings &&
          settings.dashboard_settings.ap_monitor_2 &&
          settings.dashboard_settings.ap_monitor_2.camera
          ? settings.dashboard_settings.ap_monitor_2.camera
          : null;

      return camera;
    },
    correctData() {
      if (this.monitorData && this.monitorData.cardholder) {
        if (this.monitorData.cardholder.avatar) {
          const avatar = JSON.parse(this.monitorData.cardholder.avatar);
          this.avatarSrc = `${process.env.VUE_APP_BACK}/${avatar.path}`;
        }
        if (
          this.monitorData.cardholder.car_infos &&
          this.monitorData.cardholder.car_infos.avatar
        ) {
          const car_avatar = JSON.parse(
            this.monitorData.cardholder.car_infos.avatar
          );
          this.carSrc = `${process.env.VUE_APP_BACK}/${car_avatar.path}`;
        }
      }
      this.monitor_data = JSON.parse(JSON.stringify(this.monitorData));
      this.monitor_settings = JSON.parse(
        JSON.stringify(this.monitor_2_settings)
      );

      const short_info = this.monitor_settings
        ? this.monitor_settings.enable_short_info
        : false;
      this.short_info = short_info;

      if (this.monitor_data && this.monitor_data.event) {
        const event = this.monitor_data.event;
        if (event.includes("Access denied")) {
          this.successEnter = false;
        } else {
          this.successEnter = true;
        }
      }
    },
    async fullScreenEnabled() {
      this.isFullScreen = !this.isFullScreen;

      const position = this.isFullScreen ? "left_top" : "fixed";

      const settings = JSON.parse(JSON.stringify(this.settingsStore));

      if (
        settings.dashboard_settings &&
        settings.dashboard_settings.ap_monitor_2
      ) {
        settings.dashboard_settings.ap_monitor_2.miniature_position = position;
        await this.$store.dispatch("setSettings", settings)
        this.$parent.$parent.updateMonitors();

      }
    },
    getMiniatureSize() {
      const sett = this.monitor_2_settings;
      let height;
      let width;

      if (sett.show_photo_car === "car_cardholder") {
        if (sett.miniature_orientation == "horizontal") {
          width = 500;
          height = 180;
        } else {
          height = 500;
          width = 180;
        }
      }

      this.miniatureW = width;
      this.miniatureH = height;
    },
    updateZoomLevel() {
      const sett = this.monitor_2_settings;
      const monitor = this.$refs.video_block_dashboard;
      const miniature = this.$refs.vue_custom_drag;

      if (miniature) {
        let width;
        let height;
        // if (sett.show_photo_car === "car_cardholder") {

        if (sett.miniature_orientation == "horizontal") {
          if (sett.show_photo_car === "car_cardholder") {
            width = monitor.offsetWidth - miniature.offsetHeight - 80;
            height = monitor.offsetHeight;
          } else {
            width = monitor.offsetWidth - miniature.offsetHeight / 2;
            height = monitor.offsetHeight;
          }
        } else {
          height = monitor.offsetHeight - miniature.offsetHeight / 2;
          width = monitor.offsetWidth + 60;
        }
        // }
        this.miniatureW = width;
        this.miniatureH = height;
      }
    },
  },
  mounted() {
    // Attach the resize event listener to monitor changes in browser zoom level
    window.addEventListener("resize", this.updateZoomLevel);

    // Initialize zoom level
    this.updateZoomLevel();
  },
  beforeDestroy() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener("resize", this.updateZoomLevel);
  },
  created() {
    this.emptyMonitor();
    this.arrayToFiledsObj(this.monitorFileds);
    this.fetchAccessPoints();
    this.correctData();
    // this.getMiniatureSize();
  },
  components: {
    MonitorList,
    vSelect,
    LiveStream,
    ManualOverride,
  },
};
</script>
