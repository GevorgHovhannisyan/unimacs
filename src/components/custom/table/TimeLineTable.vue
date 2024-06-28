<template>
  <div>
    <vs-table  
noDataText="No data available" :data="timeframes" class="bs_table">
      <div slot="header" class="flex flex-wrap-reverse items-center">
        <div class="items-center"></div>
      </div>
      <template slot="thead">
        <vs-th sort-key="name" class="time_table_head">Day</vs-th>
        <vs-th sort-key="time_coverage">Time Coverage</vs-th>
      </template>
      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="product-name font-medium truncate">
                {{ tr.name }}
              </p>
            </vs-td>
            <vs-td>
              <timeLine :array="tr.time" />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import timeLine from "../../../views/schedule/TimeLine";

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      timeframes: [],
    };
  },
  components: {
    timeLine,
  },
  watch: {
    items(items) {
      this.timeframes = this.items;
    },
  },
  created() {
    this.timeframes = this.items;
  },
};
</script>