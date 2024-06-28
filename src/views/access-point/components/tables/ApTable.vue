<template>
  <div>
    <ag-grid-vue
      ref="agGridTablee"
      :gridOptions="gridOptions"
      class="ag-theme-material w-100 my-4 ag-grid-table ap_ag_grid acu_dashboard_tbl"
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
      @column-moved="moved"
      :pagination="true"
      :animateRows="true"
    >
      <!-- :class="{ opacity_resize: opacity_table }" -->
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import CellRendererApActions from "../../renderer/CellRendererApActions";
import CellRendererAcuStatus from "../../renderer/CellRendererAcuStatus";

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
    CellRendererApActions,
    CellRendererAcuStatus,
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
        CellRendererApActions,
        CellRendererAcuStatus,
      },
      opacity_table: false,
    };
  },

  methods: {
    moved(event) {
      // console.log(event);
    },
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

      // }, 300);
    },
    handleWindowResize() {
      this.autoSizeAll();
    },
    autoSizeAll() {
      // setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
      this.$vs.loading.close();
      this.opacity_table = true;
      // }, 400);
    },
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
    // this.$vs.loading.close();
    // setTimeout(() => {

    // this.autoSizeAll();
    // }, 7000);

    this.$root.$on("refreshAcApTable", () => {
      this.opacity_table = false;
      this.autoSizeAll();
      this.$vs.loading.close();
    });
  },
};
</script>
