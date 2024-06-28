<template>
  <div>
    <vs-table  
noDataText="No data available" ref="table" class="bs_table" :data="items">
      <div slot="header" class="flex flex-wrap-reverse items-center">
        <div class="items-center"></div>
      </div>
      <template slot="thead">
        <vs-th
          v-for="(header, index) in headers"
          :key="index"
          :sort-key="header.key"
          >{{ header.name }}</vs-th
        >
        <vs-th class="check_in_event">
          <vs-checkbox  v-model="selectedAll" @change="checkAllEvents"></vs-checkbox>
        </vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="index" v-for="(tr, index) in data">
            <vs-td>
              <p class="product-name font-medium truncate">{{tr.id}}</p>
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">{{tr.name}}</p>
            </vs-td>


            <vs-td>
              <vs-checkbox
              :value="checkedEvents[tr.id]"
                v-model="checkedEvents[tr.id]"
                @change="checkEvent"
              ></vs-checkbox>
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
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkedEvents: {},
      selectedAll: false,
    };
  },
  methods: {
    checkAllEvents() {
      this.items.forEach((item) => {
        this.checkedEvents[item.id] = this.selectedAll;
      });
      this.$emit('checkEvent', this.checkedEvents)
    },
    checkEvent() {
      this.$emit('checkEvent', this.checkedEvents)
    }
  }
};
</script>

<style lang="scss">
.check_in_event {
  .vs-table-text {
    justify-content: center;
  }
}
</style>