<template>
  <div>
    <ag-grid-vue ref="agGridTable" :gridOptions="gridOptions"
      class="ag-theme-material w-100 mb-4 mt-1 ag-grid-table acu_dashboard_tbl auto_task_tbl ap_ag_grid"
      :class="{opacity_resize: opacity_table}" :columnDefs="headers" :defaultColDef="defaultColDef" :rowData="items"
      colResizeDefault="shift" @grid-ready="onGridReady" :animateRows="true" domLayout='autoHeight'
      :suppressDragLeaveHidesColumns="true" :enableRtl="$vs.rtl" :suppressAggFuncInHeader="true"
      @cell-clicked="onCellClicked" :suppressPaginationPanel="true">
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import CellRendererStatus from "./renderer/CellRendererStatus";
import CellRendererActions from "./renderer/CellRendererActions";

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
    CellRendererStatus,
    CellRendererActions,
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
      },
      components: {
        CellRendererStatus,
        CellRendererActions,
      },
      opacity_table: false
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
    this.$root.$on("refreshAutoTaskTable", () => {
      this.opacity_table = false
      setTimeout(() => {
        this.autoSizeAll();
        this.$vs.loading.close();
      }, 100);
    });
  },
};
</script>

<style>
.auto_task_tbl {
  top: -40px;
  position: relative;
}
</style>
