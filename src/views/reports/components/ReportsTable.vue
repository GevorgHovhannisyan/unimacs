<template>
  <div>
    <ag-grid-vue ref="agGridTable" :gridOptions="gridOptions" :class="{ opacity_resize: opacity_table }"
      class=" ag-theme-material w-100 mb-4 ag-grid-table ap_ag_grid acu_dashboard_tbl" :columnDefs="headers"
      :defaultColDef="defaultColDef" :rowData="items" colResizeDefault="shift" @rowClicked="onRowClicked"
      domLayout='autoHeight' @grid-ready="onGridReady" :animateRows="true" :enableRtl="$vs.rtl"
      :suppressDragLeaveHidesColumns="true" :suppressAggFuncInHeader="true" :suppressPaginationPanel="true"
      :suppressRowClickSelection="true">
      <!-- :pagination="true" -->
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import CellRendererActions from "../renderer/CellRendererActions";
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  components: {
    AgGridVue,
    CellRendererActions
  },
  data() {
    return {
      gridApi: null,
      gridColumnApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        lockPinned: true
      },
      itemsPerPage: 10,
      components: {
        CellRendererActions
      },
      opacity_table: false
    };
  },
  methods: {
    onRowClicked(card) {
      this.$vs.loading({
        type: "corners"
      });
      this.$emit("editReport", card.data);
      //   this.$parent.$parent.openDetail(card.data);
      setTimeout(() => {
        this.$vs.loading.close();
      }, 300);
    },
    onGridReady(params) {
      this.$vs.loading({
        type: "corners"
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
      this.gridApi.sizeColumnsToFit({
        defaultMinWidth: 150,
        columnLimits: [{ key: "actions", minWidth: 150 }]
      });
      setTimeout(() => {
        this.opacity_table = true
        this.$vs.loading.close();
      }, 100);
    }
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
    setTimeout(() => {
      this.autoSizeAll();
    }, 100);
    this.$root.$on("refreshEventTable", () => {
      this.opacity_table = false
      setTimeout(() => {
        this.autoSizeAll();
        this.$vs.loading.close();
      }, 100);
    });
  }
};
</script>
