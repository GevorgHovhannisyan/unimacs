<template>
  <div>
    <vs-table  
noDataText="No data available"
      ref="logs_table"
      :max-items="itemsPerPage"
      class="dash_evev bs_table"
      :data="items"
      :sst="true"
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
            <vs-td
              v-for="(header, index) in headers"
              :key="index"
              style="position: relative"
            >
              <div class="td_inner" @dblclick="openDetail(tr)">
                <p
                  class="product-name font-medium truncate"
                  v-if="header.key !== 'direction'"
                >
                  {{ tr[header.key] ? tr[header.key] : "" }}
                </p>
                <p class="product-name font-medium truncate" v-else>
                  {{ getDirection(tr[header.key]) }}
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
    itemsPerPage: {
      type: Number,
    },
  },
  computed: {
    getDirection() {
      return (tr) => {
        if (tr.length) {
          const lower = tr.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        }
      };
    },
  },
  methods: {
    openDetail(event) {
      this.$emit("openDetail", event);
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="scss">
.dash_evev .vs-con-tbody.vs-table--tbody,
.dash_evev .vs-table.vs-table--tbody-table {
  max-height: 550px;
  position: relative;
}

.td_inner:before {
  display: block;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.td_inner * {
  position: relative;
  z-index: 2;
}
</style>
