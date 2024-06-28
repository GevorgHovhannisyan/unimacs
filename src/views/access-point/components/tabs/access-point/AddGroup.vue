<template>
  <div>
    <div class="vx-row">
      <div class="vx-col md:w-full">
        <div class="vx-row">
          <div class="vx-col w-full">
            <div>
              <label for="" class="vs-input--label">Access Point Zone</label>
              <treeselect
               class="tree__select"
                :options="zoneObj"
                v-model="main_info.access_point_zone"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="vx-col md:w-full mt-3">
        <label for="" class="vs-input--label">Access Point Group</label>
        <treeselect
         class="tree__select"
          :options="groupObj"
          v-model="main_info.access_point_group"
        />
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Treeselect from "@riophae/vue-treeselect";
import { zoneTree } from "@/functions/treeData";

export default {
  watch: {
    main_info: {
      handler: function (main_info) {
        if(main_info.access_point_zone === undefined) {
          main_info.access_point_zone = null
        }
        this.$store.commit("accessPoint/SET_POINT_DATA", {
          name: this.active_point,
          data: main_info,
        });
      },
      deep: true,
    },
    active_point(data) {
      this.main_info = { ...this.access_points[data] };

      if (this.access_points[data].access_point_zone) {
        // this.selected_zone = true;
        setTimeout(() => {
          let treeObj = document.getElementById("zone_tree").ej2_instances[0];
          treeObj.selectedNodes = [
            `${this.access_points[data].access_point_zone}`,
          ];
        }, 20);
      } else {
        let treeObj = document.getElementById("zone_tree").ej2_instances[0];

        treeObj.selectedNodes = [];
      }
    },
  },
  computed: {
    active_point() {
      return this.$store.state.accessPoint.active_point;
    },
    access_points() {
      return this.$store.state.accessPoint.acu_data.access_points;
    },
  },
  data() {
    return {
      main_info: {},
      zones: [],
      ap_groups: [],
      zone_name: null,
      groupObj: [],
      ap_zones: [],
      zoneObj: []
    };
  },
  methods: {
    changeZone() {
      this.$store.commit("accessPoint/SET_POINT_DATA", {
        name: this.active_point,
        data: this.main_info,
      });
    },
  },
  created() {
    const access_point = this.access_points[this.active_point];

    this.$store.dispatch("accessPoint/fetchAccessPointGroup").then((res) => {
      this.ap_groups = [];
      this.$vs.loading.close();
      if (res.data.length) {
        this.groupObj = zoneTree(res.data);
        res.data.forEach((group) => {
          this.ap_groups.push({ id: group.id, label: group.name });
        });
      }
    });

    this.$store.dispatch("accessPointGroup/fetchAccessZones").then((res) => {
      this.zones = res.data;

      let ap_zones = [];
      if (res.data.length) {
        this.zoneObj = zoneTree(res.data);
        res.data.forEach((zone) => {
          ap_zones.push({ id: zone.id, label: zone.name });
        });
      }

      this.ap_zones = ap_zones;
    });
    this.main_info = { ...access_point };
  },
  components: {
    vSelect,
    Treeselect,
  },
};
</script>


<style lang="scss">
@import url("../../../../../../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");
</style>