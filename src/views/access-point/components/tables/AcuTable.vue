<template>
  <div>
    <ag-grid-vue
      ref="agGridTablee"
      :gridOptions="gridOptions"
      class="ag-theme-material w-100 my-4 ag-grid-table ap_ag_grid acu_dashboard_tbl"
      :class="{ opacity_resize: opacity_table }"
      :columnDefs="headers"
      :defaultColDef="defaultColDef"
      :rowData="items"
      colResizeDefault="shift"
      domLayout="autoHeight"
      @grid-ready="onGridReady"
      :enableRtl="$vs.rtl"
      @cell-clicked="onCellClicked"
      :suppressDragLeaveHidesColumns="true"
      :suppressAggFuncInHeader="true"
      :suppressPaginationPanel="true"
      :suppressRowClickSelection="true"
      :pagination="true"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import CellRendererAcuActions from "../../renderer/CellRendererAcuActions";
import CellRendererCloudStatus from "../../renderer/CellRendererCloudStatus";
import CellRendererStatus from "../../renderer/CellRendererStatus";

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
    CellRendererAcuActions,
    CellRendererCloudStatus,
    CellRendererStatus,
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        lockPinned: true,
      },
      components: {
        CellRendererAcuActions,
        CellRendererCloudStatus,
        CellRendererStatus,
      },
      opacity_table: false,
    };
  },

  methods: {
    onCellClicked(cell) {
      if (cell.column.colId !== "actions") {
        this.$vs.loading({
          type: "corners",
        });
        this.$emit("updateItem", cell.data);
        setTimeout(() => {
          this.$vs.loading.close();
        }, 200);
      }
    },
    onGridReady(params) {
      // this.$vs.loading({
      //   type: "corners",
      // });
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      // setTimeout(() => {
        this.autoSizeAll();
      // }, 200);
    },
    handleWindowResize() {
      this.autoSizeAll();
    },
    autoSizeAll() {
      // this.gridApi.sizeColumnsToFit();
      setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
        this.opacity_table = true;
        this.$vs.loading.close();
      }, 100);
    },
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
    // setTimeout(() => {
    //   // this.autoSizeAll();
    // }, 200);
    this.$root.$on("refreshAcuTable", () => {
      this.opacity_table = false;
        this.autoSizeAll();
        this.$vs.loading.close();
    });
  },
};
</script>
