<template>
  <div>
    <div class="table_notif_block">
      <Table
        :headers="notif_headers"
        :items="list"
        :currentPage="page"
        @openDetail="openDetail($event)"
      />
      <CustomPaging
        @pageChanged="page = $event"
        class="mt-3 mb-3"
        :total="totalPage"
        v-if="10 < propsData.count ? true : false"
      />
    </div>

    <div class="vx-row reverse_row">
      <div class="vx-col">
        <vs-button
          class="view_alarm unimacs_cancel_button"
          @click="$emit('close_notif_popup')"
        >
          Cancel
        </vs-button>
      </div>
      <div class="vx-col">
        <vs-button class="unimacs_button" @click="confirmAll">
          Confirm all
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/custom/table/NotifTable";
export default {
  props: {
    propsData: {
      type: Object,
    },
  },
  components: {
    Table,
  },
  watch: {
    page(data) {
      this.$parent.$parent.getNotifs({ page: data, page_items_count: 10 });
    },
    propsData() {
      let arr = this.propsData.data;
      if (arr.length) {
        arr.forEach((item) => {
          if (item.access_points) {
            item.access_point = item.access_points.name;
          }
        });
      }

      this.list = arr;
    },
  },
  data() {
    return {
      notif_headers: [
        { name: "Date/time", key: "createDate" },
        { name: "Confirmed", key: "confirmed" },
        { name: "Access Point", key: "access_point" },
        { name: "Event", key: "event" },
      ],
      totalPage: 0,
      page: 1,
      list: [],
    };
  },
  methods: {
    openDetail(notif) {
      this.$root.$emit("openNotif", notif);
    },
    confirmAll() {
      this.$vs.loading({
        type: "corners",
      });
      this.$http
        .put(
          `notification/confirm`,
          {},
          {
            headers: { Authorization: localStorage.token },
          }
        )
        .then((res) => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Notifications confirmed",
          });

          this.$emit("close_notif_popup");

          this.$root.$emit("nullableNotifs");
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
  },
  created() {
    let arr = this.propsData.data;
    if (arr.length) {
      arr.forEach((item) => {
        if (item.access_points) {
          item.access_point = item.access_points.name;
        }
      });
    }

    this.list = arr;
    this.totalPage = Math.ceil(this.propsData.count / 15);
  },
};
</script>

<style scoped lang="scss">
.reverse_row {
  display: flex;
  flex-direction: row-reverse;
}
.confirm_btn {
  margin-left: auto;
}

.confirm_btn button {
  margin-left: auto;
  display: block;
}

.table_notif_block {
  height: inherit;
}
</style>
