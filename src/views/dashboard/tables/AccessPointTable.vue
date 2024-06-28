<template>
  <div>
    <ag-grid-vue ref="agGridTable" :gridOptions="gridOptions"
    :class="{opacity_resize: opacity_table}"
      class=" ag-theme-material w-100 mb-4 ag-grid-table ap_ag_grid acu_dashboard_tbl" :columnDefs="headers"
      :defaultColDef="defaultColDef" :rowData="items" colResizeDefault="shift" @rowClicked="onRowClicked"
      domLayout='autoHeight' @grid-ready="onGridReady" :animateRows="true" :suppressDragLeaveHidesColumns="true"
      :enableRtl="$vs.rtl" :suppressAggFuncInHeader="true" :suppressRowClickSelection="true"
      :suppressPaginationPanel="true"
     >
     
    </ag-grid-vue>
    <!-- :pagination="true" -->
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import CellRendererStatus from "./renderer/CellRendererStatus";
import CellRendererMode from "./renderer/CellRendererMode";

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
    CellRendererMode
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
        CellRendererMode
      },
      opacity_table: false
    };
  },
  methods: {
    onRowClicked(card) {
      this.$vs.loading({
        type: "corners",
      });
      this.$parent.$parent.openAccessPointDetail(card.data);
      setTimeout(() => {
        this.$vs.loading.close();
      }, 300);
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
      },100);
    },
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
    setTimeout(() => {
      this.autoSizeAll();
    }, 100);
    this.$root.$on("refreshApTable", () => {
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
.custom-tooltip {
  width: 150px;
  height: 70px;
  border: 1px solid cornflowerblue;
  overflow: hidden;
}

.custom-tooltip p {
  margin: 5px;
  white-space: nowrap;
}

.custom-tooltip p:first-of-type {
  font-weight: bold;
}
</style>
