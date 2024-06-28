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
      <div class="vx-col md:w-full  mt-3">
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
        this.$store.commit("accessPoint/SET_EDIT_POINT_DATA", {
          name: this.active_point,
          data: main_info,
        });
      },
      deep: true,
    },
    active_point(data) {
      let ap_data;

      if (Number.isInteger(+data)) {
        ap_data = this.access_points.find((a) => a.id == +data);
      } else {
        ap_data = {
          ...this.$store.state.accessPoint.edit_acu_data.new_access_points[
            data
          ],
        };
      }
      this.main_info = { ...ap_data };

      if (ap_data.access_point_zone) {
        this.selected_zone = true;
        setTimeout(() => {
          let treeObj = document.getElementById("upd_ap").ej2_instances[0];
          treeObj.selectedNodes = [`${ap_data.access_point_zone}`];
        }, 20);
      } else {
        let treeObj = document.getElementById("upd_ap").ej2_instances[0];

        treeObj.selectedNodes = [];
      }
    },
  },
  computed: {
    active_point() {
      return this.$store.state.accessPoint.edit_active_point;
    },
    access_points() {
      return this.$store.state.accessPoint.edit_acu_data.access_points;
    },
  },
  data() {
    return {
      main_info: {},
      zones: [],
      selected_zone: false,
      ap_groups: [],
      zone_name: null,
      ap_zones: [],
      groupObj: [],
      zoneObj: []
    };
  },
  methods: {
    changeZone() {
      this.$store.commit("accessPoint/SET_EDIT_POINT_DATA", {
        name: this.active_point,
        data: this.main_info,
      });
    },
  },
  created() {
    let access_point;

    if (Number.isInteger(+this.active_point)) {
      access_point = this.access_points.find((a) => a.id == +this.active_point);
    } else {
      access_point = {
        ...this.$store.state.accessPoint.edit_acu_data.new_access_points[
          this.active_point
        ],
      };
    }

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

<style lang="scss" >
.ap_tabb .con-slot-tabs {
  height: 100%;
}
</style>


<style lang="scss">
@import url("../../../../../../../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");
</style>