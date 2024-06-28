<template>
  <div>
    <vs-tabs>
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
          <Table
            class="mt-4 miss_ac_tbl"
            :items="zone_ac_points"
            :headers="zone_ac_point_headers"
          />
        </div>
      </vs-tab>

      <vs-tab label="Extra Features" class="features_tabs mt-3">
        <EditExtraFeatures />
      </vs-tab>
    </vs-tabs>
    <div class="vx-row mt-5" v-if="permissions && permissions.updateItem">
      <div class="vx-col w-full" style="text-align: end">
        <vs-button
          class="create_new unimacs_button"
          @click.stop="updateZone"
        >
          Submit
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Table from "../../components/custom/table/Table";

import EditExtraFeatures from "./components/EditExtraFeatures";
export default {
  watch: {
    propsData: {
      handler: function (newValue) {
        this.loc_zone = { ...this.propsData };
        const access_points = this.propsData.access_points;
        let ac_points = [];
        if (access_points.length) {
          access_points.forEach((point, index) => {
            ac_points.push({
              count: index + 1,
              name: point.name,
              acu_name: point.acus ? point.acus.name : "",
              type: point.type,
            });
          });
        }
        this.zone_ac_points = ac_points;
      },
      deep: true,
    },
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
  data() {
    return {
      loc_zone: {},
      zone_ac_point_headers: [
        { key: "count", name: "#" },
        { key: "name", name: "Name" },
        { key: "acu_name", name: "ACU Name" },
        { key: "type", name: "Type" },
        { key: "zone", name: "Zone" },
      ],
      zone_ac_points: [],
    };
  },
  methods: {
    updateZone() {
      const index = this.zoneData.findIndex((z) => z.id == this.activeZone);
      const data = this.zoneData[index];

      const group_zone = {
        id: data.id,
        name: data.name,
        description: data.description,
        parent_id: data.parent_id ? +data.parent_id : null,
         antipass_backs: {
           id: data.antipass_backs.id,
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
        .dispatch("accessPointGroup/updateAccessZone", group_zone)
        .then((res) => {
          this.$vs.loading.close();
          this.$vs.notify({
time: 7000,
            color: "success",
            title: `Location Zone updated`,
          });
          this.$parent.$parent.$parent.$parent.changeItemId(res.data);
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

    const access_points = this.propsData.access_points;
    let ac_points = [];
    if (access_points.length) {
      access_points.forEach((point, index) => {
        ac_points.push({
          count: index + 1,
          name: point.name,
          acu_name: point.acus ? point.acus.name : "",
          type: point.type,
        });
      });
    }
    this.zone_ac_points = ac_points;
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
  props: {
    propsData: {
      type: Object,
    },
    permissions: {
      type: Object,
    },
  },
  components: {
    vSelect,
    EditExtraFeatures,
    Table,
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