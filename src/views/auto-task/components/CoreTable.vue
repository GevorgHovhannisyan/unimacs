<template>
  <vs-table  
noDataText="No data available" ref="multi_table" class="bs_table" :data="data">
    <div slot="header" class="flex flex-wrap-reverse items-center actions_part">
      <div class="items-center"></div>
    </div>

    <template slot="thead">
      <vs-th><vs-checkbox
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
      <vs-th>Action</vs-th>
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
            <div @click="$emit('updateItem', tr)">
              <p class="product-name font-medium truncate">
                {{ tr[header.key] ? tr[header.key] : "" }}
              </p>
            </div>
          </vs-td>

          <vs-td class="whitespace-no-wrap">
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
      default: () => [],
    },
    headers: {
      type: Array,
    },
    search: {
      type: Boolean,
      default: true,
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
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      data: [],
      contextMenus: [],
    };
  },
  methods: {
    checkItem(event, item) {
      this.$emit("input", { event, item });
    },

    correctMenu() {
      this.contextMenus = [
        { name: "Delete", action: "deleteRecord" },
        // { name: "Execute Now", action: "execute" },
        { name: "Enable", action: "enable" },
        { name: "Disable", action: "disable" },
      ];
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