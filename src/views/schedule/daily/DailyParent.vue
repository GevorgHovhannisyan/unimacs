<template>
  <div class="daily_parent">
    <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
      <vs-tab label="Main Settings">
        <div class="vx-row mt-3">
          <div class="vx-col md:w-2/3">
            <vs-input
              label="Name"
              class="w-full"
              placeholder="Name"
              name="name"
              v-validate="'required'"
              v-model="editData.name"
            />
          </div>
          <div class="vx-col md:w-1/3">
            <vs-input
              label="Type"
              class="w-full "
              v-model="editData.type"
              :disabled="true"
              name="type"
            />
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col md:w-2/3">
            <vs-input
              label="Description"
              class="w-full mt-3"
              placeholder="Description"
              v-model="editData.description"
              name="description"
              v-validate="'required'"
            />
          </div>
          <div class="vx-col md:w-1/3 update_name">
            <vs-button
              v-if="permissions.updateItem"
              class="submit_btn mt-8 w-full unimacs_button"
              @click.prevent="updateScheduleInfo"
              >Update
            </vs-button>
          </div>
        </div>

        <div class="vx-row ">
          <div class="vx-col md:w-full mt-5">
            <Table
              :items="
                editData.timeframes && editData.timeframes.length
                  ? editData.timeframes
                  : []
              "
              :headers="time_headers"
            />

            <div class="timeline_block">
              <timeLine
                v-if="editData.timeframes && editData.timeframes.length"
                :array="editData.timeframes"
              />
            </div>
          </div>
        </div>
      </vs-tab>

      <vs-tab label="Relations">
        <Table class="mt-3" :items="relations" :headers="rel_headers" />
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import timeLine from "../TimeLine";
import Table from "../../../components/custom/table/Table";

export default {
  props: {
    propData: {
      type: Object,
    },
  },
  watch: {
    propData(data) {
      this.fetchSchedules(data);
    },
  },
  components: {
    timeLine,
    Table,
  },
  data() {
    return {
      activeTab: 0,
      schedules: [],
      editData: {},
      permissions: this.$parent.permissions,

      relations: [],
      time_headers: [
        { name: "#", key: "count" },
        { name: "Start Time", key: "start" },
        { name: "End Time", key: "end" },
      ],
      rel_headers: [
        { name: "#", key: "count" },
        { name: "Access Rights Name", key: "access_right" },
        { name: "Cardholder Group Name", key: "cardholder_group_name" },
        { name: "Cardholder Quantity", key: "cardholders_qty" },
      ],
    };
  },
  watch: {
    propData(val) {
      this.fetchSchedule(this.propData);
      this.fetchScheduleRelation(this.propData.id);
    },
  },
  computed: {
    types() {
      return this.$store.state.schedule.types;
    },
  },
  methods: {
    updateScheduleInfo() {
      const obj = {
        id: this.editData.id,
        name: this.editData.name,
        description: this.editData.description,
      };
      this.$parent.updScheduleInfo(obj);
    },
    fetchSchedule(data) {
      this.$store
        .dispatch("schedule/fetchSchedule", data.id)
        .then((res) => {
          let timeframe = res.data;
          if (timeframe.timeframes.length) {
            timeframe.timeframes.forEach((time, index) => {
              time.count = index + 1;
              time.start = time.start ? time.start.split(":", 2).join(":") : "";
              time.end = time.end ? time.end.split(":", 2).join(":") : "";
            });
          }
          this.editData = timeframe;
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
     fetchScheduleRelation(id) {
      this.$store
        .dispatch("schedule/fetchScheduleRelation", id)
        .then((res) => {
          let arr = [];
          if (res.data.length) {
            res.data.forEach((item, index) => {
              item.count = index + 1;

              arr.push(item);
            });
          }
          this.relations = arr;
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
  },
  created() {
    this.fetchSchedule(this.propData);
    this.fetchScheduleRelation(this.propData.id);

  },
};
</script>


<style lang="scss" scoped>
.schedule-vue-sample
  .e-schedule:not(.e-device)
  .e-agenda-view
  .e-content-wrap
  table
  td:first-child {
  width: 90px;
}

.schedule-vue-sample .e-schedule .e-agenda-view .e-resource-column {
  width: 100px;
}

.update_name {
  text-align: right;
  margin-top: 3px;
}

.timeline_line {
  position: relative;
  width: 100%;
}
.timeline_item_small {
  background: #66c666;
  border-right: 1px solid white;
  height: 100%;
  font-size: 8px;
  text-align: center;
  color: white;
  position: absolute;
}
.daily_parent
.timeline_block {
  text-align: end;
  margin-top: 20px;
} 
</style>