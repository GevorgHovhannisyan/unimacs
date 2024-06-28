<template>
  <div>
    <vs-table
      noDataText="No data available"
      ref="logs_table"
      class="bs_table"
      :max-items="itemsPerPage"
      search
      :data="items"
      :pagination="false"
    >
      <div slot="header" class="flex flex-wrap-reverse items-center"></div>
      <template slot="thead">
        <vs-th
          :sort-key="header.key"
          v-for="(header, index) in headers"
          :key="index"
          >{{ header.name }}</vs-th
        >
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td v-for="(header, index) in headers" :key="index">
              <div @dblclick="openDetail(tr)">
                <p class="product-name font-medium truncate">
                  {{ tr[header.key] ? tr[header.key] : "" }}
                </p>
              </div>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
    },
    headers: {
      type: Array,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  computed: {},
  methods: {
    openDetail(event) {
      this.$emit("openDetail", event);
    },
  },
  data() {
    return {
      itemsPerPage: 15,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
