<template>
  <div>
    <ag-grid-vue ref="agGridTable" :class="{opacity_resize: opacity_table}" :gridOptions="gridOptions"
      class="ag-theme-material w-100 mb-4 ag-grid-table acu_dashboard_tbl" :columnDefs="headers" :defaultColDef="defaultColDef"
      :rowData="items" colResizeDefault="shift" @rowClicked="onRowClicked" @grid-ready="onGridReady" :animateRows="true"
      :enableRtl="$vs.rtl" :suppressDragLeaveHidesColumns="true" :suppressAggFuncInHeader="true"
      :suppressRowClickSelection="true" :enableBrowserTooltips="true" :suppressPaginationPanel="true">
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import '../../../../node_modules/ag-grid-community/dist/styles/ag-grid.css';
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    AgGridVue,
    // CustomTooltip,
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        // tooltipComponent: 'CustomTooltip',
        minWidth: 100,
      },
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      itemsPerPage: 10,
      opacity_table: false
    };
  },
  methods: {
    onRowClicked(card) {
      this.$vs.loading({
        type: "corners",
      });
      this.$parent.$parent.openDetail(card.data);
      setTimeout(() => {
        this.$vs.loading.close();
      }, 200);
    },
    onGridReady(params) {
      this.$vs.loading({
        type: "corners",
      });
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      setTimeout(() => {
        this.autoSizeAll();
      }, 100);
    },
    handleWindowResize() {
      this.autoSizeAll();
    },
    autoSizeAll() {
      this.gridApi.sizeColumnsToFit();
      setTimeout(() => {
        this.opacity_table = true
        this.$vs.loading.close();
      }, 100);
    },
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
    setTimeout(() => {
      this.autoSizeAll();
    }, 100);
    this.$root.$on("refreshActivityTable", () => {
      this.opacity_table = false
      setTimeout(() => {
        this.autoSizeAll();
        this.$vs.loading.close();
      }, 100);
    });
  },
};
</script>
