<template>
  <div class="week_inner">
    <vs-popup class="holamundo" title="Update Timeframe" :active.sync="editTimePopup">
      <div>
        <div class="title_block">
          <h5 class="mb-5 text-center">{{ week_data[editTime.name] }}</h5>
          <!-- <span>{{ editTime.name ? editTime.name : "ss" }}</span> -->
        </div>
        <div class="vx-row">
          <div class="vx-col md:w-1/3">
            <flat-pickr :config="configdateStartTimePicker" v-model="editTime.start" placeholder="Start Time" />
          </div>
          <div class="vx-col md:w-1/3">
            <flat-pickr :config="configdateEndTimePicker" v-model="editTime.end" placeholder="End Time" />
          </div>

          <div class="vx-col md:w-1/3">
            <vs-checkbox class="custom__checkbox" v-model="updateallDay">24H</vs-checkbox>
          </div>
        </div>
        <div class="vx-row w-full" style="margin: 0">
          <div class="vx-col w-full" style="
              display: flex;
              flex-direction: row-reverse;
              padding: 0;
              margin-top: 15px;
            ">
            <vs-button class="mr-6 mt-4 unimacs_button" @click="updateTimeframe">Submit</vs-button>
          </div>
        </div>
        <!-- <vs-button class="unimacs_button" @click="popupActive = false"
          >Cancel</vs-button
        > -->
      </div>
    </vs-popup>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-input label="Day Of Week" class="w-full mb-5" placeholder="Date" :disabled="true" name="name"
          v-model="editData.timeframe_name" v-validate="'required'" />
      </div>
    </div>
    <div class="vx-row">
      <div class="flexi_block">
        <div class="vx-col custom_with flex" style="margin: 0 20px">
          <vs-checkbox style="margin-right: 17px" v-model="allDay">24H</vs-checkbox>
        </div>

        <div class="vx-col custom_with flex" style="margin-right: 20%">
          <flat-pickr :config="configdateStartTimePicker" v-model="start_time" :disabled="!permissions.addItem"
            placeholder="Start Time" />
        </div>
        <div class="vx-col custom_with">
          <flat-pickr :config="configdateEndTimePicker" v-model="end_time" :disabled="!permissions.addItem"
            placeholder="End Time" />
          <!-- @input="checkDateTime" -->
        </div>
      </div>
      <!-- <div class="vx-col md:w-1/3">
        <flat-pickr
          :config="configdateStartTimePicker"
          v-model="start_time"
          :disabled="!permissions.addItem"
          placeholder="Start Time"
        />
      </div>
      <div class="vx-col md:w-1/3">
        <flat-pickr
          :config="configdateEndTimePicker"
          v-model="end_time"
          :disabled="!permissions.addItem"
          @input="checkDateTime"
          placeholder="End Time"
        />
      </div> -->

      <div class="vx-col md:w-1/6 flex" style="padding-left: 0">
        <vs-button color="success" class="create_new" @click="confirmAddTime" :disabled="!validTimeline">
          <vs-icon icon-pack="material-icons" color="white" icon="add_circle" />
        </vs-button>
      </div>

      <!-- <div class="vx-col md:w-1/3">
        <vs-button
          color="success"
          class="create_new"
          @click="confirmAddTime"
          :disabled="!validTimeline"
        >
          <vs-icon icon-pack="material-icons" color="white" icon="add_circle" />
        </vs-button>
      </div> -->
    </div>

    <div class="vx-row">
      <div class="vx-col md:w-full mt-5">
        <vs-table noDataText="No data available" ref="parent_daily_table" class="bs_table" :max-items="25"
          :data="schedules">
          <div slot="header" class="flex flex-wrap-reverse items-center">
            <div class="items-center"></div>
          </div>

          <template slot="thead">
            <vs-th sort-key="count">#</vs-th>
            <vs-th sort-key="start_time">Start Time</vs-th>
            <vs-th sort-key="end_time">End Time</vs-th>
            <vs-th sort-key="actions">Actions</vs-th>
          </template>

          <template slot-scope="{ data }">
            <tbody>
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  <div @click="editSchedule(tr)">
                    <p class="product-name font-medium truncate">
                      {{ tr.count }}
                    </p>
                  </div>
                </vs-td>

                <vs-td>
                  <div @click="editSchedule(tr)">
                    <p class="product-name font-medium truncate">
                      {{ tr.start ? tr.start.split(":", 2).join(":") : "" }}
                    </p>
                  </div>
                </vs-td>
                <vs-td>
                  <div @click="editSchedule(tr)">
                    <p class="product-name font-medium truncate">
                      {{ tr.end ? tr.end.split(":", 2).join(":") : "" }}
                    </p>
                  </div>
                </vs-td>

                <vs-td class="whitespace-no-wrap">
                  <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click.stop="editSchedule(tr)" v-if="permissions.updateItem" />
                  <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2"
                    @click.stop="confirmDeleteRecord(tr)" v-if="permissions.destroyItem" />
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
        </vs-table>
        <div class="timeline_block">
          <timeLine v-if="schedules && schedules.length" :array="schedules" />

          <!-- <vs-button
            color="primary"
            class="submit_btn mt-5"
            v-if="permissions.updateItem"
            @click.prevent="updateScheduleInfo"
            type="border"
            >Submit</vs-button
          > -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import timeLine from "../TimeLine";
import { validateOverlaps } from "@/functions/scheduleOverlaps";

export default {
  props: {
    propData: {
      type: Object
    }
  },
  components: {
    flatPickr,
    timeLine
  },
  watch: {
    allDay(val) {
      if (val) {
        this.start_time = "00:00";
        this.end_time = "23:59";
      } else {
        this.start_time = null;
        this.end_time = null;
      }
    },
    propData(val) {
      this.start_time = this.end_time = null;
      this.fetchTimeFrame(this.propData);
    },
    updateallDay(val) {
      if (val) {
        this.editTime.start = "00:00";
        this.editTime.end = "23:59";
      } else {
        this.editTime.start = null;
        this.editTime.end = null;
      }
    }
  },
  data() {
    return {
      activeTab: 0,
      schedules: [],
      editData: {},
      permissions: this.$parent.permissions,

      start_time: null,
      end_time: null,
      editTime: {
        id: null,
        start_time: null,
        end_time: null
      },
      access_rights: [
        // {
        //   id: 1,
        //   name: "Office 832",
        //   group_name: "Office 832 WorkWeek",
        //   partition_name: null,
        //   qty: 165,
        // },
      ],

      time: null,
      configdateStartTimePicker: {
        enableTime: true,
        time_24hr: true,
        enableSeconds: false,
        noCalendar: true,
        minTime: "00:00",
        maxTime: "23:59"
      },
      configdateEndTimePicker: {
        enableTime: true,
        time_24hr: true,
        enableSeconds: false,
        noCalendar: true,
        minTime: "00:00",
        maxTime: "23:59"
      },

      editTimePopup: false,
      deletedId: null,
      week_data: this.$store.state.week_data,
      updateallDay: false,
      allDay: false
    };
  },
  methods: {
    editSchedule(data) {
      this.editTime = { ...data };
      this.editTimePopup = true;
    },
    checkDateTime() {
      if (
        this.start_time &&
        this.end_time &&
        !this.$parent.checkDateTime(this.start_time, this.end_time)
      ) {
        this.end_time = "23:59:59";
      }
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete timeframe`,
        accept: this.deleteSchedule,
        acceptText: "Delete"
      });
    },
    updateScheduleInfo() { },
    deleteSchedule() {
      this.$parent.deleteTimeFrame(this.deletedId);

      const scheduleIndex = this.schedules.findIndex(
        u => u.id == this.deletedId
      );
      this.schedules.splice(scheduleIndex, 1);

      let arr = [];
      if (this.schedules.length) {
        this.schedules.forEach((item, index) => {
          item.count = index + 1;
          arr.push(item);
        });
      }
      this.schedules = arr;
    },
    updateTimeframe() {
      let filterArr = JSON.parse(JSON.stringify(this.schedules));
      const index = filterArr.findIndex(s => s.id == this.editData.id);
      filterArr.splice(index, 1);
      const canCreate = validateOverlaps(
        filterArr,
        this.editData.start,
        this.editData.end
      );
      if (canCreate) {
        this.$vs.loading({
          type: "corners"
        });
        const obj = {
          id: this.editTime.id,
          name: this.editTime.name,
          schedule: this.editTime.schedule,
          start: this.editTime.start,
          end: this.editTime.end
        };

        this.$http
          .put(`schedule/timeframe`, obj, {
            headers: { Authorization: localStorage.token }
          })
          .then(res => {
            const productIndex = this.schedules.findIndex(
              p => p.id == res.data[0].id
            );

            this.schedules[productIndex].start = res.data[0].start;
            this.schedules[productIndex].end = res.data[0].end;

            this.$vs.loading.close();
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Timeframe updated"
            });
            this.editTimePopup = false;
          })
          .catch(err => {
            this.$vs.loading.close();
          });
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Timeframe overlaps"
        });
      }
    },
    confirmAddTime() {
      if (!this.$parent.checkDateTime(this.start_time, this.end_time)) {
        this.$vs.notify({
          color: "danger",
          title: "End time can't be smaller than start time"
        });
        return false
      }
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `Confirm Create`,
        text: `Do You want to create timeframe`,
        accept: this.createSchedule,
        acceptText: "Create"
      });
    },
    createSchedule() {
      const canCreate = validateOverlaps(
        this.schedules,
        this.start_time,
        this.end_time
      );

      if (canCreate) {
        this.$vs.loading({
          type: "corners"
        });

        const obj = {
          name: this.propData.name,
          schedule: this.propData.pid,
          start: this.start_time,
          end: this.end_time
        };
        this.$store
          .dispatch("schedule/createTimeFrame", obj)
          .then(res => {
            this.$vs.loading.close();

            this.schedules.push(res.data);

            let arr = [];
            this.schedules.forEach((item, index) => {
              item.count = index + 1;
              arr.push(item);
            });
            this.schedules = arr;

            this.start_time = this.end_time = null;

            this.allDay = false;

            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Timeframe created"
            });
          })
          .catch(err => {
            this.$vs.loading.close();
          });
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Timeframe overlaps"
        });
      }
    },
    fetchTimeFrame(data) {
      if (typeof data.id == "string") {
        data.id = data.pid;
        data.timeframe_name = data.name;
        data.name = this.week_data[data.name];
      }
      this.$store
        .dispatch("schedule/fetchTimeFrame", data)
        .then(res => {
          this.editData = { ...data };

          let arr = [];
          if (res.data.length) {
            res.data.forEach((item, index) => {
              item.count = index + 1;
              arr.push(item);
            });
          }
          this.schedules = arr;
          // this.schedules = res.data;
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    }
  },
  computed: {
    types() {
      return this.$store.state.schedule.types;
    },
    validTimeline() {
      return this.start_time && this.end_time;
    }
  },
  created() {
    this.fetchTimeFrame(this.propData);
    this.$root.$on("fetchTime", () => {
      this.fetchTimeFrame(this.propData);
    });
  }
};
</script>

<style lang="scss" scoped>
.week_inner {
  .timeline_block {
    text-align: end;
    margin-top: 20px;
  }
}

.custom_with {
  flex: 0 0 22.22%;
  max-width: 22.22%;
}

.flexi_block {
  display: flex;
  align-items: center;
  width: 65%;
  margin-right: 35px;
}
</style>
