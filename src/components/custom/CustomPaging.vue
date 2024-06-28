<template>
  <div
    class="vs-row mt-3 custom_paging"
    style="justify-content: space-between; display: flex; width: 100%"
  >
    <div
      class="vs-col vs-pagination--mb vs-xs-12 vs-sm-12 vs-lg-6"
      style="
        justify-content: flex-start;
        display: flex;
        align-items: center;
        margin-left: 0%;
        width: 100%;
      "
    ></div>
    <div
      class="vs-col vs-pagination--mb vs-xs-12 vs-sm-12 vs-lg-6"
      style="
        justify-content: flex-end;
        display: flex;
        align-items: center;
        margin-left: 0%;
        width: 100%;
      "
    >
      <div class="con-vs-pagination vs-pagination-primary">
        <nav class="vs-pagination--nav">
          <button
            class="vs-pagination--buttons btn-prev-pagination vs-pagination--button-prev"
            :disabled="currentPage === 1"
            :class="{ disabled: currentPage === 1 }"
            @click="currentPage--"
          >
            <i class="vs-icon notranslate icon-scale material-icons null"
              >chevron_left</i
            >
          </button>
          <ul class="vs-pagination--ul">
            <li
              class="item-pagination vs-pagination--li"
              :class="{ 'is-current': item === currentPage }"
              v-for="(item, index) in pages"
              :key="index"
              @click="goToPage(item)"
            >
              <span> {{ item }} </span>
              <div class="effect"></div>
            </li>
          </ul>
          <button
            class="vs-pagination--buttons btn-next-pagination vs-pagination--button-next"
            :disabled="currentPage === total"
            :class="{ disabled: currentPage === total }"
            @click="currentPage++"
          >
            <i class="vs-icon notranslate icon-scale material-icons null"
              >chevron_right</i
            ></button
          ><!---->
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentPage: 1,
      // totalPages: 6,
    };
  },
  computed: {
    pages() {
      const range = 2; // Number of pages to show before and after the current page
      const totalPages = this.total;
      const currentPage = this.currentPage;
      const pagesArray = [];

      let startPage = Math.max(1, currentPage - range);
      let endPage = Math.min(totalPages, currentPage + range);

      if (startPage > 1) {
        pagesArray.push(1);
        if (startPage > 2) {
          pagesArray.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pagesArray.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pagesArray.push("...");
        }
        pagesArray.push(totalPages);
      }

      return pagesArray;
    },
  },
  methods: {
    goToPage(page) {
      if (page !== "...") {
        this.currentPage = page;
        // this.$emit('pageChanged', page)
        // Perform necessary actions when the page is changed
        // For example, fetch data for the new page
      }
    },
    resetPage(page){
      this.currentPage = page
    }
  },
  watch: {
    currentPage() {
      this.$emit("pageChanged", this.currentPage);
    },
  },
};
</script>

<style>
</style>
