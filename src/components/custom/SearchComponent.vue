<template>
  <div class="con-input-search vs-table--search cardGroup_search_parentss">
    <input
      type="text"
      v-model="searchText"
      @input="$emit('searchFunc', searchText)"
      class="input-search vs-table--search-input cardGroup_searchss"
    /><i class="vs-icon notranslate icon-scale material-icons null">search</i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.input-search {
  height: 40px;
  font-size: 13px;
}
</style>
