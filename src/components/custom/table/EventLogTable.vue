<template>
  <div>
    <vs-table
      noDataText="No data available"
      ref="logs_table"
      class="bs_table ev_log_tbl"
      :max-items="itemsCount"
      :pagination="true"
      :search="search"
      :currentPage="currentPage"
      :data="items"
    >
      <div slot="header" class="flex flex-wrap-reverse items-center"></div>
      <template slot="thead">
        <vs-th
          :sort-key="header.key"
          v-for="(header, index) in headers"
          :key="index"
          >{{ header.name }}</vs-th
        >
        <vs-th> View </vs-th>
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

            <vs-td>
              <vs-icon
                v-if="hasPlayback(tr)"
                icon-pack="material-icons"
                icon="video_call"
                @click="showCameras(tr)"
                class="view_icon"
                style="font-size: 25px"
              />
              <span v-else>No data</span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <!-- <CustomPaging
        @pageChanged="currentPage = $event"
        class="mt-3"
        :total="totalPage"
        v-if="10 < items.length ? true : false"
      /> -->
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
    pagination: {
      type: Boolean,
    },
    search: {
      type: Boolean,
      default: true,
    },
    itemsCount: {
      type: Number,
      default: 10,
    }
  },
  methods: {
    openDetail(event) {
      this.$emit("openDetail", event);
    },
    showCameras(item) {
      this.$emit("openReportCameras", item);
    },
  },
  data(){
    return {
      currentPage: 1
    }
  },
  computed: {
    totalPage(){
      return Math.ceil(this.items.length / this.itemsCount);

    },
    hasPlayback() {
      return (event) => {
        const ac_data = event.access_point_data;
        if (ac_data && ac_data.camera_set) {
          return true;
        }
        return false;
      };
    },
  },
};
</script>

<style lang="scss">
.ev_log_tbl {
  .con-pagination-table {
    display: none;
  }
}
</style>
