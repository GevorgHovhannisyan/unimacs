<template>
  <vs-table  
noDataText="No data available"
    ref="multi_table"
    class="bs_table"
    :data="data"
  >
    <div slot="header" class="flex flex-wrap-reverse items-center actions_part">
      <div class="items-center">
      </div>
    </div>

    <template slot="thead">
      <vs-th
        ><vs-checkbox
          v-model="selectAllCheckBox"
          icon-pack="feather"
          :icon="selectAllIcon"
          style="margin: auto"
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
            ></vs-checkbox>
          </vs-td>
          <vs-td v-for="(header, index) in headers" :key="index">
            <div v-if="header.key == 'status'" @click="$emit('updateItem', tr)">
              <vs-chip class="ag-grid-cell-chip" :color="chipColor(tr.status)">
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
            </div>
            <div v-else @click="$emit('updateItem', tr)">
              <p class="product-name font-medium truncate">
                {{ tr[header.key] ? tr[header.key] : "" }}
              </p>
            </div>
          </vs-td>

          <vs-td class="whitespace-no-wrap" v-if="actions">
            <vs-dropdown
              vs-trigger-click
              @click="correctMenu(tr)"
              class="cursor-pointer ml-3"
              vs-custom-content
            >
              <div class="p-3 cursor-pointer">
                <span class="mr-2 leading-none"
                  ><vs-icon
                    style="font-size: 25px"
                    icon-pack="material-icons"
                    icon="reorder"
                /></span>
              </div>

              <vs-dropdown-menu class="card_tbl_menu_inner">
                <vs-dropdown-item
                  @click.prevent="$emit(action.action, tr)"
                  v-for="(action, index) in contextMenus"
                  :key="index"
                >
                  <span class="flex items-center">
                    <span>{{ action.name }}</span>
                  </span>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
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
    dropDown: {
      type: Boolean,
      default: true,
    },
    // itemsPerPage: {
    //   type: Number,
    //   default: 10,
    // },
  },
  data() {
    return {
      data: [],
      // itemsPerPage: 10,
      contextMenus: [],
    };
  },
  methods: {
    checkItem(event, item) {
      this.$emit("input", { event, item });
    },

    correctMenu() {
      this.contextMenus = [];
      if (!this.permissions || this.permissions.updateItem) {
        this.contextMenus.push(
          { name: "Edit", action: "updateItem" },
          { name: "Activate", action: "activate" },
          { name: "Deactivate", action: "deActivate" },
          { name: "Move to Group", action: "moveToGroup" }
        );
      }

      if (!this.permissions || this.permissions.destroyItem) {
        this.contextMenus.push({ name: "Delete", action: "deleteRecord" });
      }
    },
  },
  watch: {
    items() {
      this.data = [...this.items];
    },
  },
  computed: {
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
    selecteds() {
      return this.items.length ? this.items.filter((i) => i.selected) : [];
    },
    selectAllIcon() {
      return this.selecteds.length === this.items.length
        ? "icon-check"
        : "icon-minus";
    },
    selectAllCheckBox: {
      get() {
        return this.selecteds.length;
      },
      set(value) {
        this.$emit("setAll", value);
        // this.data = [...this.items];
      },
    },
  },
  created() {
    this.data = [...this.items];
  },
};
</script>
<style lang="scss" >
.card_tbl_menu_inner .vs-dropdown--custom.vs-dropdown--menu {
  width: 150px;
}
</style>