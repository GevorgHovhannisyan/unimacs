<template>
  <div>
    <div class="filters_parent">
      <div class="show_selecteds">
        <vs-checkbox :disabled="!getSelecteds" v-model="show_selecteds">
          Show only seledted {{ cardSelected }}</vs-checkbox>
      </div>
      <div class="event_filter">
        <label for="" class="vs-input--label">Select a Cardholder Group</label>

        <v-select v-model="group" :options="groups" class="select_padding w-full" name="ap_type"
          placeholder="Group" :reduce="(type) => type.label" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      </div>
    </div>
    <vs-table noDataText="No data available" class="card_h_tbl bs_table" ref="multi_table"
      :pagination="card_list.length > itemsPerPage ? true : false" :max-items="itemsPerPage" :data="card_list" search>
      <div slot="header" class="flex flex-wrap-reverse items-center">
        <div class="items-center"></div>
      </div>
      <template slot="thead">
        <vs-th>
          <vs-checkbox v-model="selectAllCheckBox" icon-pack="feather" :icon="selectAllIcon"
            class="w-full checkbox_block">
          </vs-checkbox>
          <!-- @change="setAll($event)" -->
        </vs-th>
        <vs-th v-for="(header, index) in headers" :key="index" :sort-key="header.key">{{ header.name }}</vs-th>
      </template>
      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <vs-checkbox class="w-full checkbox_block" @input="setCards(tr, $event)" :value="tr.selected">
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
      cardholder_headers: [
        { name: "#", key: "count", show: true },
        { name: "Cardholder", key: "full_name", show: true },
        { name: "Group", key: "group", show: true },
        { name: "Company", key: "company", show: true },
        { name: "Position", key: "position", show: false },
        { name: "Access Right", key: "access_right", show: false },
        { name: "Status", key: "status", show: false },
        { name: "Role", key: "role", show: false },
      ],
      itemsPerPage: 15,
      show_selecteds: false,
      card_list: [],
    };
  },
  methods: {
    setCards(event, value) {
      this.$store.commit("report/EDIT_SET_CARDHOLDERS", { event, value });
    },
    setAll(event) {
      this.$store.commit("report/EDIT_SET_ALL_CARDS", {
        event: event.target.checked,
      });
    },
    filterByType(type) {
      if (type) {
        const filter = this.cardholders.filter((e) => e.group === type);
        this.card_list = [...filter];
      } else {
        this.card_list = [...this.cardholders];
      }
    },
  },
  created() {
    if (!this.cardholders.length) {
      this.$store.dispatch("report/fetchEditCards").then((res) => {
        this.card_list = [...this.cardholders];

        if (this.editedItem.cardholders.length) {
          this.editedItem.cardholders.forEach((event) => {
            this.$store.commit("report/EDIT_SET_CARDHOLDERS", {
              event: { id: event },
              value: true,
            });
          });
        }
      });
    }

    setTimeout(() => {
      this.filterByType(this.group);

      this.show_selecteds = this.showSelected;

      if (this.show_selecteds) {
        this.card_list = [...this.cardSelected];
      }
    }, 10);
  },
  computed: {
    headers() {
      return this.cardholder_headers.filter((h) => h.show);
    },
    cardholders() {
      return this.$store.state.report.edit_cardholders;
    },
    editedItem() {
      return this.$store.state.report.editedReport;
    },
    selectAllIcon() {
      return this.selecteds.length === this.cardholders.length
        ? "icon-check"
        : "icon-minus";
    },
    selecteds() {
      return this.cardholders.length
        ? this.cardholders.filter((i) => i.selected)
        : [];
    },
    selectAllCheckBox: {
      get() {
        return this.selecteds.length;
      },
      set(value) {
        // this.$emit("setAll", value);
        this.$store.commit("report/EDIT_SET_ALL_CARDS", {
          event: value,
          type: this.group,
        });
        // this.data = [...this.items];
      },
    },
    getSelecteds() {
      const count =
        this.cardholders.length &&
        this.cardholders.filter((i) => i.selected).length;

      if (!count) this.show_selecteds = false;

      return count;
    },
    group: {
      get() {
        return this.$store.state.report.edit_group;
      },
      set(value) {
        this.$store.commit("report/EDIT_SET_GROUP", value);
        this.show_selecteds = false;

        if (!value) {
          this.$store.commit("report/EDIT_SET_CARD_SHOW", false);
        }
      },
    },
    groups() {
      return this.$store.state.report.edit_groups;
    },
    cardSelected() {
      return (
        this.cardholders.length &&
        this.cardholders.filter((i) => i.selected).length
      );
    },
    showSelected() {
      return this.$store.state.report.edit_card_show_selected;
    },
  },
  watch: {
    show_selecteds(val) {
      this.$store.commit("report/EDIT_SET_CARD_SHOW", val);

      if (val) {
        const filtered = this.cardholders.filter((e) => e.selected);
        this.card_list = [...filtered];
      } else {
        this.card_list = [...this.cardholders];

        this.filterByType(this.group);
      }
    },
    group(data) {
      this.filterByType(data);

      if (!data) {
        this.$store.commit("report/EDIT_SET_CARD_SHOW", false);
        this.show_selecteds = false;
      }
    },
  },
  components: {
    vSelect,
  },
};
</script>
<style lang="scss" >
.card_h_tbl {
  .vs-con-tbody.vs-table--tbody {
    max-height: 500px;
  }
  .con-tablex.vs-table--content {
    max-height: unset !important;
  }
  
}
</style>