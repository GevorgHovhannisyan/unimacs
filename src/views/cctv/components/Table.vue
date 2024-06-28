<template>
  <div>
    <vs-table
      noDataText="No data available"
      class="access_left_table bs_table"
      ref="parent_daily_table"
      :data="items"
      :search="search"
    >
      <div slot="header" class="flex flex-wrap-reverse items-center">
        <div class="items-center"></div>
      </div>

      <template slot="thead">
        <vs-th sort-key="name">Name</vs-th>
        <!-- <vs-th sort-key="description">Description</vs-th> -->
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr
            :data="tr"
            :key="indextr"
            v-for="(tr, indextr) in data"
            :class="{ selected_primary: selectedItem === tr.id }"
          >
            <vs-td>
              <span
                @contextmenu.prevent="$refs.menu.open($event, tr)"
                @click.stop="openRule(tr)"
              >
                <p class="product-name font-medium truncate">
                  {{ tr.name }}
                </p>
              </span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <vue-context ref="menu" v-slot="{ data }">
      <template v-if="data" @click="createRule(data)">
        <li>
          <a @click.prevent="editItem(data)"> Edit {{ data.name }} </a>
        </li>
        <li>
          <a @click.prevent="remove(data)"> Delete {{ data.name }} </a>
        </li>

        <!-- <li v-if="type === 'cctv'">
          <a @click.prevent="hideSelected(data)" v-if="!showHiddens"> Hide Selected </a>
          <a @click.prevent="showCameras(data)" v-else> Show Selected </a>
        </li>

        <li v-if="type === 'cctv'">
          <a @click.prevent="showHidden(data)"  v-if="!showHiddens"> Show Hidden </a>
          <a @click.prevent="showUnHidden(data)" v-else> Show Cameras </a>
        </li> -->
      </template>
    </vue-context>
  </div>
</template>

<script>
import { VueContext } from "vue-context";

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    permissions: {
      type: Object,
    },
    selectedItem: {
      type: Number,
    },
    search: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "cctv",
    },
    showHiddens: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueContext,
  },
  methods: {
    openRule(tr) {
      this.$emit("openRule", tr);
    },
    createRule(tr) {
      this.$emit("createRule", tr);
    },
    remove(data) {
      this.$emit("remove", data);
    },
    hideSelected(data) {
      this.$emit("hideSelected", data);
    },
    showHidden(data) {
      this.$emit("showHidden", data);
    },
    showUnHidden(data) {
      this.$emit("showUnHidden", data);
    },
    showCameras(data) {
      this.$emit("showCameras", data);
    },
    editItem(data) {
      this.$emit("editItem", data);
    },
  },
};
</script>

<style lang="scss">
.no_title {
  opacity: 0.5;
}
</style>
