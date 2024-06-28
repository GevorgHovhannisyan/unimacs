<template>
  <div>
    <vs-prompt
      title="Export To Excel"
      class="export-options"
      @cancle="clearFields"
      @accept="exportToExcel"
      accept-text="Export"
      @close="clearFields"
      :active.sync="activePrompt"
    >
      <vs-input
        v-model="fileName"
        placeholder="Enter File Name.."
        class="w-full"
      />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
        <span class="mr-4">Cell Auto Width:</span>
        <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>
      </div>
    </vs-prompt>

    <vs-table  
noDataText="No data available"
      ref="multi_table"
      class="bs_table"
      :pagination="data.length > itemsPerPage ? true : false"
      :max-items="itemsPerPage"
      :search="search"
      :data="data"
    >
      <div
        slot="header"
        class="flex flex-wrap-reverse items-center actions_part"
      >
        <div class="items-center">
          <vs-dropdown
            vs-trigger-click
            class="cursor-pointer "
            v-if="actions"
          >
            <div
              class="
                p-4
                border border-solid
                d-theme-border-grey-light
                rounded-full
                d-theme-dark-bg
                cursor-pointer
                flex
                items-center
                justify-between
                font-medium
              "
            >
              <span class="mr-2"
                >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                {{
                  items.length - currentPage * itemsPerPage > 0
                    ? currentPage * itemsPerPage
                    : items.length
                }}
                of {{ queriedItems }}</span
              >
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <vs-dropdown-menu>
              <vs-dropdown-item @click="itemsPerPage = 4">
                <span>4</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 10">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 15">
                <span>15</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 20">
                <span>20</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <vs-dropdown
          vs-trigger-click
          class="cursor-pointer ml-3"
          v-if="(!permissions || permissions.destroyItem) && actions"
        >
          <div
            class="
              p-3
              shadow-drop
              rounded-lg
              d-theme-dark-light-bg
              cursor-pointer
              flex
              items-end
              justify-center
              text-lg
              font-medium
              w-32
            "
          >
            <span class="mr-2 leading-none">Actions</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>

          <vs-dropdown-menu>
            <vs-dropdown-item @click="confirmDeleteMany">
              <span class="flex items-center">
                <feather-icon
                  icon="TrashIcon"
                  svgClasses="h-4 w-4"
                  class="mr-2"
                />
                <span>Delete</span>
              </span>
            </vs-dropdown-item>
            <vs-dropdown-item
              @click="activePrompt = true"
              :disabled="!data.length"
            >
              <span class="flex items-center">
                <vs-icon
                  icon-pack="material-icons"
                  icon="import_export"
                  svgClasses="h-4 w-4"
                  class="mr-2"
                />
                <span>Export</span>
              </span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
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
            <vs-td
              v-for="(header, index) in headers"
              :key="index"
              @click="alert('ok')"
            >
              <div v-if="header.key == 'status'" @click="edit(tr)">
                <vs-chip
                  class="ag-grid-cell-chip"
                  :color="chipColor(tr.status)"
                >
                  <span>
                    {{
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
              <div v-else @click="edit(tr)">
                <p class="product-name font-medium truncate">
                  {{ tr[header.key] ? tr[header.key] : "" }}
                </p>
              </div>
            </vs-td>

            <vs-td class="whitespace-no-wrap" v-if="actions">
              <feather-icon
                icon="EditIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="edit(tr)"
                v-if="!permissions || permissions.updateItem"
              />
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="confirmDeleteRecord(tr)"
                v-if="!permissions || permissions.destroyItem"
              />
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
      data: [],
      itemsPerPage: 10,
      newMovedItem: null,
      fileName: "",
      formats: ["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      headerTitle: [],
      headerVal: [],
      activePrompt: false,
    };
  },
  methods: {
    checkItem(event, item) {
      this.$emit("input", { event, item });
    },
    exportToExcel() {
      const name = this.fileName
      import("@/vendor/Export2Excel").then((excel) => {
        const list = this.data;
        const data = this.formatJson(this.headerVal, list);
        excel.export_json_to_excel({
          header: this.headerTitle,
          data,
          filename: name,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat,
        });
        this.clearFields();
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    clearFields() {
      this.filename = "";
      this.cellAutoWidth = true;
      this.selectedFormat = "xlsx";
    },

    edit(tr) {
      this.$emit("updateItem", tr);
    },
    confirmDeleteRecord(tr) {
      this.$emit("deleteRecord", tr);
    },
  },
  watch: {
    items() {
      this.data = [...this.items];
    },
  },
  components: {
    vSelect,
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

    this.headerTitle = this.headers.map((item) => {
      return item.name;
    });

    this.headerVal = this.headers.map((item) => {
      return item.key;
    });
  },
};
</script>
