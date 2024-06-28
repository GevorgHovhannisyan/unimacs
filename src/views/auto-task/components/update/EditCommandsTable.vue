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
        <vs-th> </vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="product-name font-medium truncate">{{ tr.id }}</p>
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">{{ tr.name }}</p>
            </vs-td>

            <vs-td>
              <vs-radio
                vs-name="command"
                :vs-value="tr.id"
                v-model="command"
                @change="$emit('changeCommand', tr.id)"
              ></vs-radio>
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
    selected: {
      type: String | Number,
      default: null,
    },
  },
  data() {
    return {
      command: this.selected,
    };
  },

  created() {
    const task_data = JSON.parse(JSON.stringify(this.task_data));
    this.command = task_data.reaction;
  },
  computed: {
    task_data() {
      return this.$store.state.autoTask.edit_auto_task;
    },
  },
};
</script>