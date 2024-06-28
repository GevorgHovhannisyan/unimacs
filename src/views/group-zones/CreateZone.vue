<template>
  <div>
    <vs-tabs v-model="tabCount">
      <vs-tab label="Main Settings">
        <div>
          <div class="vx-row mt-3">
            <div class="vx-col md:w-1/3">
              <vs-input
                label="Name"
                class="w-full"
                placeholder="Name"
                name="name"
                v-model="loc_zone.name"
                v-validate="'required'"
              />
            </div>
            <div class="vx-col md:w-2/3">
              <vs-input
                label="Description"
                class="w-full"
                placeholder="Description"
                name="description"
                v-model="loc_zone.description"
                v-validate="'required'"
              />
            </div>
          </div>
        </div>
      </vs-tab>

      <vs-tab label="Extra Features" class="features_tabs">
        <CreateExtraFeatures />
      </vs-tab>
    </vs-tabs>
    <div class="vx-row mt-5">
      <div class="vx-col w-full" style="text-align: end">
        <vs-button
          class="create_new unimacs_button"
          @click.stop="createGroupInfo"
          :disabled="!this.loc_zone.name"
        >
          Submit
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import CreateExtraFeatures from "./components/CreateExtraFeatures";
export default {
  data() {
    return {
      loc_zone: {},
      tabCount: 0
    };
  },
  watch: {
    loc_zone: {
      handler: function (data, oldVal) {
        this.$store.commit("accessPointGroup/SET_ZONE_INFO", data);
      },
      deep: true,
    },
    activeZone() {
      const item = this.zoneData.find((z) => z.id == this.activeZone);
      this.loc_zone = JSON.parse(JSON.stringify(item));
    },
  },
  methods: {
    createGroupInfo() {
      const index = this.zoneData.findIndex((z) => z.id == this.activeZone);
      const data = this.zoneData[index];
      const group_zone = {
        name: data.name,
        description: data.description,
        parent_id: data.pid ? +data.pid : null,
        antipass_backs: {
          type: data.antipass_backs.type,
          enable_timer: data.antipass_backs.enable_timer,
          time: data.antipass_backs.time,
          time_type: data.antipass_backs.time_type,
        },
        apb_reset_timer: data.apb_reset_timer
          ? this.checkLength(data.apb_reset_timer)
            ? JSON.stringify(data.apb_reset_timer)
            : null
          : null,
        people_limits_min: data.people_limits_min
          ? this.checkLength(data.people_limits_min)
            ? JSON.stringify(data.people_limits_min)
            : null
          : null,
        people_limits_max: data.people_limits_max
          ? this.checkLength(data.people_limits_max)
            ? JSON.stringify(data.people_limits_max)
            : null
          : null,
      };
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("accessPointGroup/createAccessZone", group_zone)
        .then((res) => {
          setTimeout(() => {
            this.$parent.$parent.$parent.$parent.savedZone(res.data);
            this.$vs.loading.close();
            this.$vs.notify({
time: 7000,
              color: "success",
              title: `Location Zone Created`,
            });

          this.tabCount = 0

          }, 300);

        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    checkLength(obj) {
      if (Object.keys(obj).length) {
        return true;
      }
      return false;
    },
    initValues() {},
  },
  created() {
    this.loc_zone = { ...this.propsData };
  },
  props: {
    propsData: {
      type: Object,
    },
  },
  components: {
    vSelect,
    CreateExtraFeatures,
  },
  computed: {
    antipass_types() {
      return this.$store.state.antipass_types;
    },
    zoneData() {
      return this.$store.state.accessPointGroup.zones;
    },
    activeZone() {
      return this.$store.state.accessPointGroup.active_zone;
    },
  },
};
</script>

<style lang="scss" scoped>
.features_tabs {
  .vs-tabs-position-top .vs-tabs--ul {
    display: flex;
    flex-direction: column;
  }
}
</style>