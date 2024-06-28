<template>
  <div>
    <ag-grid-vue
      ref="agGridTable"
      :class="{opacity_resize: opacity_table}"
      :gridOptions="gridOptions"
      class="ag-theme-material w-100 mt-4 ag-grid-table ev_logs_tbl"
      :columnDefs="headers"
      :defaultColDef="defaultColDef"
      :rowData="items"
      colResizeDefault="shift"
      @rowClicked="onRowClicked"
      domLayout='autoHeight'
      @grid-ready="onGridReady"
      :animateRows="true"
      :enableRtl="$vs.rtl"
      :suppressDragLeaveHidesColumns="true"
      :suppressAggFuncInHeader="true"
      :suppressRowClickSelection="true"
      :suppressPaginationPanel="true"
    >
      <!-- :pagination="true" -->
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";

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
    AgGridVue
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
      opacity_table: false
    };
  },
  methods: {
    onRowClicked(card) {
      this.$vs.loading({
        type: "corners"
      });
      this.$emit("openDetail", card.data);
      setTimeout(() => {
        this.$vs.loading.close();
      }, 300);
    },
    onGridReady(params) {
      // this.$vs.loading({
      //   type: "corners"
      // });
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.opacity_table = false
      // setTimeout(() => {
      //   this.autoSizeAll();
      // }, 400);
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
    }
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
    setTimeout(() => {
      this.autoSizeAll();
    }, 100);
    this.$root.$on("refreshEventTable", () => {
      this.opacity_table = false
        this.autoSizeAll();
        this.$vs.loading.close();
    });
  }
};
</script>

<style lang="scss">
.ev_logs_tbl {
  .ag-body-viewport {
    max-height: 480px;
    overflow: auto;
  }
}
</style>
