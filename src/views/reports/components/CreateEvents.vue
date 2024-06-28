<template>
  <div>
    <div class="filters_parent">
      <div class="show_selecteds">
        <vs-checkbox :disabled="!getSelecteds" v-model="show_selecteds">
          Show only seledted {{ eventSelected }}</vs-checkbox>
      </div>
      <div class="event_filter">
        <label for="" class="vs-input--label">Select a Event Type</label>

        <v-select v-model="event_type" :options="event_types" class="select_padding w-full" name="ap_type"
          placeholder="Event Type" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      </div>
    </div>
    <vs-table noDataText="No data available" ref="multi_table" class="event_tbl bs_table"
      :pagination="event_list.length > itemsPerPage ? true : false" :max-items="itemsPerPage" :data="event_list" search>
      <div slot="header" class="flex flex-wrap-reverse items-center">
        <div class="items-center"></div>
      </div>
      <template slot="thead">
        <!-- @change="setAll($event)" -->
        <vs-th>
          <vs-checkbox v-model="selectAllCheckBox" icon-pack="feather" :icon="selectAllIcon"
            class="w-full checkbox_block">
          </vs-checkbox>
        </vs-th>

        <vs-th v-for="(header, index) in event_headers" :key="index" :sort-key="header.key">{{ header.name }}</vs-th>
      </template>
      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <vs-checkbox class="w-full checkbox_block" @input="setEvents(tr, $event)" :value="tr.selected">
              </vs-checkbox>
            </vs-td>
            <vs-td v-for="(header, index) in event_headers" :key="index">
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
      event_headers: [
        { name: "#", key: "count" },
        { name: "Event", key: "event" },
        { name: "Event Type", key: "event_type" },
        { name: "Event Source", key: "event_source" },
      ],
      permissions: {},
      itemsPerPage: 15,
      show_selecteds: false,
      event_list: [],
    };
  },
  components: {
    vSelect,
  },
  watch: {
    show_selecteds(val) {
      this.$store.commit("report/SET_SHOW", val);

      if (val) {
        const filtered = this.events.filter((e) => e.selected);
        this.event_list = [...filtered];
      } else {
        this.event_list = [...this.events];

        this.filterByType(this.event_type);
      }
    },
    event_type(data) {
      this.show_selecteds = false;

      this.filterByType(data);

      if (!data) {
        this.$store.commit("report/SET_SHOW", false);
        // this.show_selecteds = false;
      }
    },
  },
  methods: {
    setEvents(event, value) {
      this.$store.commit("report/SET_EVENTS", { event, value });
    },
    setAll(event) {
      this.$store.commit("report/SET_ALL_EVENT", {
        event: event.target.checked,
      });
    },

    filterByType(type) {
      if (type) {
        const filter = this.events.filter((e) => e.event_type === type);
        this.event_list = [...filter];
      } else {
        this.event_list = [...this.events];
      }
    },
  },
  computed: {
    events() {
      return this.$store.state.report.event_list;
    },
    currentPage() {
      return 1;
    },
    queriedItems() {
      return this.$refs.multi_table
        ? this.$refs.multi_table.queriedResults.length
        : this.events.length;
    },
    selectAllIcon() {
      return this.selecteds.length === this.events.length
        ? "icon-check"
        : "icon-minus";
    },
    selecteds() {
      return this.events.length ? this.events.filter((i) => i.selected) : [];
    },
    showSelected() {
      return this.$store.state.report.event_show_selected;
    },
    selectAllCheckBox: {
      get() {
        return this.selecteds.length;
      },
      set(value) {
        this.$store.commit("report/SET_ALL_EVENT", {
          event: value,
          type: this.event_type,
        });
      },
    },
    event_type: {
      get() {
        return this.$store.state.report.event_type;
      },
      set(value) {
        this.$store.commit("report/SET_TYPE", value);

        if (!value) {
          this.$store.commit("report/SET_SHOW", false);
          this.show_selecteds = false;
        }
      },
    },
    getSelecteds() {
      const count =
        this.events.length && this.events.filter((i) => i.selected).length;
      if (!count) this.show_selecteds = false;

      return count;
    },
    eventSelected() {
      return this.events.length && this.events.filter((i) => i.selected).length;
    },
    event_types() {
      return this.$store.state.report.event_types;
    },
  },
  created() {
    if (!this.events.length) {
      this.$store.dispatch("report/fetchEvents").then((res) => {
        this.event_list = [...this.events];
      });
    } else {
      this.event_list = [...this.events];
    }
    setTimeout(() => {
      this.filterByType(this.event_type);

      this.show_selecteds = this.showSelected;

      if (this.show_selecteds) {
        this.event_list = [...this.eventSelected];
      }
    }, 10);

    this.$root.$on("clearReports", () => {
      this.$store.commit("report/SET_ALL_EVENT", false);
    });
  },
};
</script>

<style lang="scss" >
.event_tbl {
  .vs-con-tbody.vs-table--tbody {
    max-height: 500px;
  }
  .con-tablex.vs-table--content {
    max-height: unset !important;
  }
  
}

.show_selecteds {
  margin-bottom: -10px;
}

.filters_parent {
  margin-bottom: -52px;
  padding-left: 10px;
  width: 83%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.event_filter {
  width: 28%;
}
</style>