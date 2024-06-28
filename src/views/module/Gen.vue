<template>
  <div class="parDiv">
    <vs-table  
noDataText="No data available"
      ref="table"
      stripe
      :data="data"
      :max-items="itemsPerPage"
      pagination
    >
      <template slot="header">
        <div class="flex flex-wrap-reverse items-center"></div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown
          vs-trigger-click
          class="cursor-pointer mb-4 mr-4 hover_class"
          v-if="data.length"
        >
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span class="mr-2"
              >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
              {{
                data.length - currentPage * itemsPerPage > 0
                  ? currentPage * itemsPerPage
                  : data.length
              }}
              of {{ itemsCount }}</span
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
      </template>
      <template slot="thead">
        <vs-th v-for="(header, index) in headers" :key="index">{{
          header.label
        }}</vs-th>
        <vs-th>Actions</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :key="tr.id" v-for="(tr, indextr) in data">
          <vs-td :key="indexTd" class="1" v-for="(td, indexTd) in values">
            <span class="section_id" v-if="td.type == 'imageUpload'">
              <img
                v-if="tr[td.name] && tr[td.name].path"
                :src="`${env}/${tr[td.name].path}`"
                alt
                style="max-width: 100px; width: 100%"
              />
              <span v-else>No Photo</span>
            </span>
            <span v-else-if="td.type == 'switchButton'">
              <vs-switch
                class="mb-5"
                color="success"
                v-model="tr[td.name]"
                disabled
              >
                <span slot="on">Active</span>
                <span slot="off">Inactive</span>
              </vs-switch>
            </span>
            <span v-else-if="td.type == 'dateInput'" class="section_id">{{
              dateFormatter(tr[td.name])
            }}</span>

            <span v-else class="section_id">{{
              tr[td.name] && tr[td.name][defaultLng]
                ? tr[td.name][defaultLng]
                : tr[td.name]
            }}</span>
          </vs-td>
          <vs-td>
            <feather-icon
              v-if="permissionEdit"
              icon="Edit3Icon"
              svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer"
              @click="editFunction(data[indextr])"
            />
            <feather-icon
              v-if="permissionDelete"
              icon="Trash2Icon"
              svgClasses="h-5 w-5 hover:text-danger cursor-pointer"
              @click="deleteFunction(data[indextr])"
            />
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>
<script>
export default {
  name: "generator-table",
  props: [
    "data",
    "headers",
    "editFunction",
    "deleteFunction",
    "values",
    "itemsCount",
    "permissionEdit",
    "permissionDelete",
  ],
  data() {
    return {
      env: "http://localhost:4141",
      defaultLng: "en",
      field: {},
      itemsPerPage: 10,
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  computed: {
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
  },
  methods: {
    dateFormatter(date) {
      return this.$moment(date).format("YYYY-mm-DD HH:MM");
    },
  },

  created() {
    this.env = process.env.VUE_APP_BACK;
    this.defaultLng = process.env.VUE_APP_LNG;
  },
};
</script>
<style scoped>
</style>

<style lang="scss">
.module_page {
  padding: 1.5rem !important;
}
.parDiv {
  .vs-con-tbody {
    background: none;
    border: none;
  }
  .tr-table-state-null {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  }
  .vs-table--tbody-table {
    border-collapse: separate;
    padding: 0 1rem;
    border-spacing: 0 1.3rem;
  }
  .tr-values td {
    padding: 20px !important;
  }
}
</style>


