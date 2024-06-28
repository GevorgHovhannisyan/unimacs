<template>
  <vs-table  
noDataText="No data available"
    ref="multi_table"
    class="bs_table mlti_tbl"
    :pagination="items.length > itemsPerPage ? true : false"
    :max-items="itemsPerPage"
    :search="search"
    :data="items"
  >
    <template slot="thead">
      <vs-th
        ><vs-checkbox
          v-model="selectAllCheckBox"
          icon-pack="feather"
          :icon="selectAllIcon"
          style="margin: auto"
          class="check_margin"
        ></vs-checkbox
      ></vs-th>
      <vs-th
        v-for="(header, index) in headers"
        :key="index"
        :sort-key="header.key"
        >{{ header.name }}</vs-th
      >
      <vs-th v-if="actions">Action</vs-th>
    </template>

    <template slot-scope="{ data }">
      <tbody>
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            <vs-checkbox
              @change="checkItem($event.target.checked, tr)"
              :value="tr.selected"
              class="check_td"
            ></vs-checkbox>
          </vs-td>

          <vs-td v-for="(header, index) in headers" :key="index">
            <vs-chip
              v-if="header.key == 'status'"
              class="ag-grid-cell-chip"
              :color="chipColor(tr.status)"
            >
              <span>{{
                tr.status === true || tr.status === "active"
                  ? "Active"
                  : tr.status === false || tr.status === "inactive"
                  ? "Inactive"
                  : tr.status === "pending"
                  ? "Pending"
                  : " "
              }}</span>
            </vs-chip>

            <p class="product-name font-medium truncate" v-else>
              {{ tr[header.key] ? tr[header.key] : "" }}
            </p>
          </vs-td>

          <vs-td class="whitespace-no-wrap" v-if="actions">
            <feather-icon
              icon="EditIcon"
              svgClasses="w-5 h-5 hover:text-primary stroke-current"
              @click.stop="edit(tr)"
              v-if="permissions.updateItem"
            />
            <feather-icon
              icon="TrashIcon"
              svgClasses="w-5 h-5 hover:text-danger stroke-current"
              class="ml-2"
              @click.stop="confirmDeleteRecord(tr)"
              v-if="permissions.destroyItem"
            />
          </vs-td>
        </vs-tr>
      </tbody>
    </template>
  </vs-table>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
    },
    headers: {
      type: Array,
    },
    search: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: Object,
    },
    confirmDeleteMany: {
      type: Function,
    },
    actions: {
      type: Boolean,
    },
    selectedItem: {
      type: Array,
    },
  },
  data() {
    return {
      selectedItems: [],
      itemsPerPage: 10,
    };
  },
  methods: {
    checkItem(event, item) {
      this.$emit("input", { event, item });
    },
    setSelecteds(event) {
      this.$emit("input", event);
    },
    edit(tr) {
      this.$emit("updateItem", tr);
    },
    confirmDeleteRecord(tr) {
      this.$emit("deleteRecord", tr);
    },
  },
  watch: {
    selectedItem(item) {
      this.selectedItems = [];
      this.$emit("input", this.selectedItems);
    },
  },
  computed: {
    selectAllCheckBox: {
      get() {
        return this.selecteds.length;
      },
      set(value) {
        this.$emit("setAll", value);
        // this.data = [...this.items];
      },
    },
    selectAllIcon() {
      return this.selecteds.length === this.items.length
        ? "icon-check"
        : "icon-minus";
    },
    selecteds() {
      return this.items.length ? this.items.filter((i) => i.selected) : [];
    },
    currentPage() {
      return 1;
    },
    queriedItems() {
      return this.$refs.multi_table
        ? this.$refs.multi_table.queriedResults.length
        : this.items.length;
    },
    chipColor() {
      return (value) => {
        if (value === true || value === "active") return "success";
        else if (value === false || value === "inactive") return "danger";
        else if (value === "pending") return "rgb(239 197 48)";
      };
    },
  },
  created() {},
};
</script>

<style lang="scss" >
.mlti_tbl {
  .header-table.vs-table--header {
    width: 100%;
    display: block;
  }

  .vs-table--search {
    margin: unset;
    max-width: unset;
  }

  .vs-table--search-input {
    width: 100%;
  }

  .check_margin {
    margin: unset !important;
    }
.check_td {
  justify-content: left !important; 
}

thead  th:first-child {
    max-width: 50px;
    width: 50px;
}

}
</style>
