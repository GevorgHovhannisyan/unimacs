<template>
  <div>
    <!-- rowSelection="multiple" -->

  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import CellRendererActions from "./renderer/CellRendererActions";

export default {
  components: {
    'ag-grid-vue': AgGridVue
  },
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
  watch: {
    headers() {
      this.columnDefs = JSON.parse(JSON.stringify(this.headers));
      let findAction = this.columnDefs.find(f => f.field === "actions")
      findAction.cellRendererFramework = "CellRendererActions"
    },

    items() {
      this.data = JSON.parse(JSON.stringify(this.items));
    }
  },
  data() {
    return {
     
    };
  },
  methods: {
    onRowClicked(card) {
      this.$emit("updateItem", card.data);
    }
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.columnDefs = JSON.parse(JSON.stringify(this.headers));
    let findAction = this.columnDefs.find(f => f.field === "actions")
    findAction.cellRendererFramework = "CellRendererActions"
    this.data = JSON.parse(JSON.stringify(this.items));
  },
  components: {
    CellRendererActions
  }
};
</script>

<style></style>
