<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <label for="" class="vs-input--label">Access Point</label>
        <v-select v-model="settings.access_point" :options="access_points" class="select_padding" name="ap_type"
          placeholder="Access Point" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      </div>

      <div class="vx-col w-full">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="settings.enable_cctv">Enable CCTV</vs-checkbox>
      </div>

      <div class="vx-col w-full">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="settings.enable_miniature">Show a thumbnail of a photo in
          full screen mode
        </vs-checkbox>
      </div>

      <div class="vx-col w-full">
        <label for="" class="vs-input--label">Show photo and description</label>
        <v-select v-model="settings.show_photo_car" :options="photoCarOptions" class="select_padding" name="ap_type"
          placeholder="Show photo and description" :reduce="(type) => type.key" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      </div>

      <div class="vx-col w-full mt-3">
        <label for="" class="vs-input--label">Miniature orientation</label>
        <v-select v-model="settings.miniature_orientation" :options="miniature_orientations" class="select_padding"
          name="ap_type" placeholder="Miniature orientation" :reduce="(type) => type.key"
          :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      </div>

      <!-- <div class="vx-col w-full mt-3">
        <label for="" class="vs-input--label">Miniature position</label>
        <v-select
          v-model="settings.miniature_position"
          :options="miniature_positions"
          class="select_padding"
          name="ap_type"
          placeholder="Miniature position"
          :reduce="(type) => type.key"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div> -->

      <div class="vx-col w-full">
        <vs-input class="w-full mt-4" label="Event view delay,s" @input="checkNumber($event)" v-model="settings.delay" />
      </div>

      <div class="vx-col w-full">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="settings.enable_sound">Enable sound in alarm
          event</vs-checkbox>
      </div>

      <div class="vx-col w-full">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="settings.enable_short_info">Enable Cardholder short
          info</vs-checkbox>
      </div>

      <div class="md:w-full vx-col monitor_ac_block">
        <vs-button class="mt-4 unimacs_button" @click="changeSettings">Submit</vs-button>
        <vs-button class="mr-6 mt-4 unimacs_cancel_button"
          @click="$parent.$parent.monitor2SettingsPopups = false">Cancel</vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";

export default {
  props: {
    popup: {
      type: Boolean,
    },
  },
  data() {
    return {
      settings: {
        access_point: null,
        delay: 0,
        enable_sound: false,
        enable_short_info: false,
        show_photo_car: "car_cardholder",
        miniature_position: "fixed",
        miniature_orientation: "vertical",
        miniature_drag_pos: { left: 23, top: 52 },
        enable_cctv: true,
        enable_miniature: true,
      },
      access_points: [{ id: null, label: "All Access Points" }],
      saveSettings: null,
      photoCarOptions: [
        { label: "Car", key: "car" },
        { label: "Cardholder", key: "cardholder" },
        { label: "Car & Cardholder", key: "car_cardholder" },
      ],
      miniature_positions: [
        { label: "Fixed", key: "fixed" },
        { label: "Left top", key: "left_top" },
        { label: "Left bottom", key: "left_bottom" },
        { label: "Rigth top", key: "rigth_top" },
        { label: "Rigth bottom", key: "rigth_bottom" },
      ],
      miniature_orientations: [
        { label: "Horizontal", key: "horizontal" },
        { label: "Vertical", key: "vertical" },
      ],
    };
  },
  methods: {
    async setSettings(event) {
      // localStorage.dashboard_settings = JSON.stringify(this.settings);
      await this.$store.dispatch("setSettings", event)
      this.$root.$emit("configsChanged");
      // await this.$store.dispatch("setSettings", event).then((res) => {
      // this.saveSettings = res.data.settings
      //   ? JSON.parse(res.data.settings)
      //   : null;
      // this.$root.$emit("configsChanged");
      // localStorage.setItem("settings", JSON.stringify(this.saveSettings));
      // });
    },

    async changeSettings() {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      const orient = settings.dashboard_settings.ap_monitor_2.miniature_orientation



      settings.dashboard_settings.ap_monitor_2 = this.settings;

      if (orient != this.settings.miniature_orientation) {
        settings.dashboard_settings.ap_monitor_2.miniature_drag_pos.left = 0
        settings.dashboard_settings.ap_monitor_2.miniature_drag_pos.top = 0
      }

      await this.$store.dispatch("setSettings", settings)
      this.$root.$emit("configsChanged");

      // await this.$parent.$parent.setSettings(settings);

      this.$parent.$parent.monitor2SettingsPopups = false;

      // this.$root.$emit("emptyFirstMonitor");

      this.$vs.notify({
        time: 7000,
        color: "success",
        title: "Monitor settings updated",
      });
    },
    checkNumber(value) {
      return (this.settings.delay = +value.replace(/[^+0-9]/g, ""));
    },
  },
  computed: {
    access_points_list() {
      return this.$store.state.accessPoint.access_points;
    },
    settingsStore() {
      return this.$store.state.settings
    }
  },
  components: {
    vSelect,
  },
  async created() {
    // if (localStorage.dashboard_settings_2) {
    //   this.settings = JSON.parse(localStorage.dashboard_settings_2);
    // }
    this.$vs.loading();
    let access_points = [
      {
        id: null,
        label: "All Access Points",
      },
    ];
    const settings = JSON.parse(JSON.stringify(this.settingsStore)) || null;

    if (!settings) {
      await this.$store.dispatch("setSettings", {
        dashboard_settings: {
          ap_monitor_2: this.settings,
        },
      })


      // this.setSettings({
      //   dashboard_settings: {
      //     ap_monitor_2: this.settings,
      //   },
      // });
    } else {
      if (settings.dashboard_settings) {
        const conf = settings.dashboard_settings;
        if (settings.dashboard_settings.ap_monitor_2) {
          this.settings = JSON.parse(JSON.stringify(conf.ap_monitor_2));
        } else {
          settings.dashboard_settings.ap_monitor_2 = JSON.parse(
            JSON.stringify(this.settings)
          );
          await this.$store.dispatch("setSettings", settings)

          // this.setSettings(settings);
        }
      } else {
        settings.dashboard_settings = {
          ap_monitor_2: JSON.parse(JSON.stringify(this.settings)),
        };
        await this.$store.dispatch("setSettings", settings)


        // this.setSettings(settings);
      }
    }
    setTimeout(() => {
      this.$vs.loading.close();
    }, 300);

    this.$store.dispatch("accessPoint/fetchAccessPoint").then(async (res) => {
      const points = res.data.data || res.data
      if (points.length) {
        points.forEach((point) => {
          access_points.push({ id: point.id, label: point.name });
        });
        const ac_point = this.settings.access_point;
        if (ac_point && !points.find((ap) => ap.id == ac_point)) {
          this.settings.access_point = null;

          settings.dashboard_settings.ap_monitor_2.access_point = null;
          await this.$store.dispatch("setSettings", settings)

          // this.setSettings(settings);
        }
      } else {
        this.settings.access_point = null;

        settings.dashboard_settings.ap_monitor_2.access_point = null;
        await this.$store.dispatch("setSettings", settings)

        // this.setSettings(settings);
      }
      this.access_points = access_points;
    });
    // })
    // .catch(() => this.$vs.loading.close());
  },
};
</script>

<style lang="scss">
.monitor_ac_block {
  display: flex;
  flex-direction: row-reverse;
}
</style>
