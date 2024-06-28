<template>
  <div>
    <div class="filters_parent">
      <div class="show_selecteds">
        <vs-checkbox :disabled="!getSelecteds" v-model="show_selecteds">
          Show only seledted {{ apSelected }}</vs-checkbox
        >
      </div>
      <div class="event_filter">
        <label for="" class="vs-input--label">Select a Location Zone</label>

        <v-select
          v-model="loc_zone"
          :options="loc_zones"
          class="select_padding w-full"
          name="ap_type"
          placeholder="Location zone"
          :reduce="(type) => type.label"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
    </div>

    <vs-table
      noDataText="No data available"
      class="point_tbl bs_table"
      ref="multi_table"
      search
      :pagination="access_list.length > itemsPerPage ? true : false"
      :max-items="itemsPerPage"
      :data="access_list"
    >
      <div slot="header" class="flex flex-wrap-reverse items-center">
        <div class="items-center"></div>
      </div>
      <template slot="thead">
        <vs-th>
          <vs-checkbox
            v-model="selectAllCheckBox"
            icon-pack="feather"
            :icon="selectAllIcon"
            class="w-full checkbox_block"
          >
          </vs-checkbox>
        </vs-th>

        <vs-th
          v-for="(header, index) in headers"
          :key="index"
          :sort-key="header.key"
          >{{ header.name }}</vs-th
        >
      </template>
      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <vs-checkbox
                class="w-full checkbox_block"
                @input="setEvents(tr, $event)"
                :value="tr.selected"
              >
              </vs-checkbox>
            </vs-td>
            <vs-td v-for="(header, index) in headers" :key="index">
              <p class="product-name font-medium truncate">
                {{ tr[header.key] ? tr[header.key] : "" }}
              </p>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import vSelect from "vue-select";

export default {
  data() {
    return {
      // access_points: [],
      access_point_headers: [
        { name: "#", key: "count", show: true },
        { name: "Access Point", key: "access_point", show: true },
        { name: "Location zone", key: "location_zone", show: true },
        { name: "ACU name", key: "acu_name", show: true },
        { name: "Type", key: "type", show: false },
        { name: "Groups", key: "groups", show: false },
        { name: "Status", key: "status", show: false },
        { name: "Mode", key: "mode", show: false },
        { name: "Lock status", key: "lock_status", show: false },
        { name: "Door status", key: "door_status", show: false },
        { name: "Location", key: "location", show: false },
        { name: "Zone leave", key: "zone_leave", show: false },
        { name: "Zone coming", key: "zone_coming", show: false },
      ],
      itemsPerPage: 15,
      show_selecteds: false,
      access_list: [],
    };
  },
  methods: {
    setEvents(event, value) {
      this.$store.commit("report/EDIT_SET_ACCESS_POINTS", { event, value });
    },
    setAll(event) {
      this.$store.commit("report/EDIT_SET_ALL_POINTS", {
        event: event.target.checked,
      });
    },
    filterByType(type) {
      if (type) {
        const filter = this.access_points.filter(
          (e) => e.location_zone === type
        );
        this.access_list = [...filter];
      } else {
        this.access_list = [...this.access_points];
      }
    },
  },
  computed: {
    headers() {
      return this.access_point_headers.filter((h) => h.show);
    },
    access_points() {
      return this.$store.state.report.edit_access_points;
    },
    editedItem() {
      return this.$store.state.report.editedReport;
    },
    selectAllIcon() {
      return this.selecteds.length === this.access_points.length
        ? "icon-check"
        : "icon-minus";
    },
    selecteds() {
      return this.access_points.length
        ? this.access_points.filter((i) => i.selected)
        : [];
    },
    selectAllCheckBox: {
      get() {
        return this.selecteds.length;
      },
      set(value) {
        // this.$emit("setAll", value);
        this.$store.commit("report/EDIT_SET_ALL_POINTS", {
          event: value,
          type: this.loc_zone,
        });
        // this.data = [...this.items];
      },
    },
    getSelecteds() {
      const count =
        this.access_points.length &&
        this.access_points.filter((i) => i.selected).length;

      if (!count) this.show_selecteds = false;

      return count;
    },
    loc_zone: {
      get() {
        return this.$store.state.report.edit_loc_zone;
      },
      set(value) {
        this.$store.commit("report/EDIT_SET_LOC", value);

        if (!value) {
          this.$store.commit("report/EDIT_SET_AP_SHOW", false);
          this.show_selecteds = false;
        }
      },
    },
    loc_zones() {
      return this.$store.state.report.edit_loc_zones;
    },
    apSelected() {
      return (
        this.access_points.length &&
        this.access_points.filter((i) => i.selected).length
      );
    },
    showSelected() {
      return this.$store.state.report.edit_ap_show_selected;
    },
  },
  created() {
    if (!this.access_points.length) {
      this.$store.dispatch("report/fetchEditPoints").then((res) => {
        this.access_list = [...this.access_points];
        if (this.editedItem.access_points.length) {
          this.editedItem.access_points.forEach((event) => {
            this.$store.commit("report/EDIT_SET_ACCESS_POINTS", {
              event: { id: event },
              value: true,
            });
          });
        }

        setTimeout(() => {
          this.filterByType(this.loc_zone);

          this.show_selecteds = this.showSelected;

          if (this.show_selecteds) {
            this.access_list = [...this.apSelected];
          }
        }, 20);
      });
    } else {
      setTimeout(() => {
        this.filterByType(this.loc_zone);

        this.show_selecteds = this.showSelected;

        if (this.show_selecteds) {
          this.access_list = [...this.apSelected];
        }
      }, 10);
    }
  },
  watch: {
    show_selecteds(val) {
      this.$store.commit("report/EDIT_SET_AP_SHOW", val);

      if (val) {
        const filtered = this.access_points.filter((e) => e.selected);
        this.access_list = [...filtered];
      } else {
        this.access_list = [...this.access_points];

        this.filterByType(this.loc_zone);
      }
    },
    loc_zone(data) {
      this.filterByType(data);
      this.show_selecteds = false;

      if (!data) {
        this.$store.commit("report/EDIT_SET_AP_SHOW", false);
        // this.show_selecteds = false;
      }
    },
  },
  components: {
    vSelect,
  },
};
</script>
<style lang="scss" >
.point_tbl {
  .vs-con-tbody.vs-table--tbody {
    max-height: 500px;
  }

  .con-tablex.vs-table--content {
    max-height: unset !important;
  }
}
</style>
