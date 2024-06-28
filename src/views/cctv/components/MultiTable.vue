<template>
  <div>
    <vs-table
      noDataText="No data available"
      ref="multi_table"
      class="bs_table"
      :max-items="itemsPerPage"
      :search="true"
      :pagination="true"
      :data="data"
      :currentPage="currentPage"
    >
      <div
        slot="header"
        class="flex flex-wrap-reverse items-center actions_part"
      >
        <div class="items-center"></div>
      </div>

      <template slot="thead">
        <vs-th></vs-th>
        <vs-th
          v-for="(header, index) in headers"
          :key="index"
          :sort-key="header.key"
          >{{ header.name }}</vs-th
        >
        <vs-th>View</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <vs-checkbox
                :disabled="selecteds.length > 3 && !tr.selected"
                @change="checkItem($event.target.checked, tr)"
                :value="tr.selected"
              ></vs-checkbox>
            </vs-td>
            <vs-td
              v-for="(header, index) in headers"
              :key="index"
            >

              <div @click="edit(tr)">
                <p class="product-name font-medium truncate">
                  {{ tr[header.key] }}
                </p>
              </div>
            </vs-td>

            <vs-td>
              <vs-icon
                icon-pack="material-icons"
                icon="video_call"
                class="view_icon"
                @click="$root.$emit('showSetCamera', tr)"
              />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>

    <CustomPaging
      @pageChanged="currentPage = $event"
      :total="totalPage"
      v-if="data.length > itemsPerPage ? true : false"
    />
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
      currentPage: 1,
    };
  },
  methods: {
    checkItem(event, item) {
      let find = this.data.find((a) => a.id == item.id);
      if (find) {
        find.selected = event;
      }
      this.$emit("input", this.data);
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
      const cameras = [];
      if (this.items.length) {
        for (let i = 0; i < this.items.length; i++) {
          const camera = { ...this.items[i] };
          cameras.push({
            id: camera.id,
            service_id: camera.service_id,
            name: camera.name,
            device_type_name: camera.device_type_name,
            connection_type: camera.connection_type,
            selected: camera.selected
          });
        }
      }

      this.data = [...cameras];
    },
  },
  components: {
    vSelect,
  },
  computed: {
    queriedItems() {
      return this.$refs.multi_table
        ? this.$refs.multi_table.queriedResults.length
        : this.data.length;
    },
    selecteds() {
      return this.data.length ? this.data.filter((i) => i.selected) : [];
    },
    selectAllIcon() {
      return this.selecteds.length === this.data.length
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
    totalPage() {
      return Math.ceil(this.data.length / 10);
    },
  },
  created() {
    const cameras = [];
    if (this.items.length) {
      for (let i = 0; i < this.items.length; i++) {
        const camera = this.items[i];
        cameras.push({
          id: camera.id,
          service_id: camera.service_id,
          name: camera.name,
          device_type_name: camera.device_type_name,
          connection_type: camera.connection_type,
        });
      }
    }
    this.data = [...cameras];

    this.headerTitle = this.headers.map((item) => {
      return item.name;
    });

    this.headerVal = this.headers.map((item) => {
      return item.key;
    });
  },
};
</script>
