<template>
  <div class="partitions_sections">
    <div class="row_block">
      <div class="left_block" >
        <div class="vs-row new_rr">
          <div>
            <vs-button
              class="create_new_group unimacs_button unimacs_add_new_btn"
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" />
            </vs-button>
          </div>
          <div
            class="con-input-search vs-table--search cardGroup_search_parent"
          >
            <input
              type="text"
              class="input-search vs-table--search-input cardGroup_search"
            /><i class="vs-icon notranslate icon-scale material-icons null"
              >search</i
            >
          </div>
        </div>
        <ejs-treeview
          id="treeview"
          :fields="field"
        ></ejs-treeview>
      </div>

      <div class="right_block">
        <div class="inner_block_groups"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
      },
    };
  },
  methods: {
  },
};
</script>

<style>
</style>