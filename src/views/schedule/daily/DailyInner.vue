<template>
  <div>
    <vs-popup
      class="holamundo"
      title="Update timeframe"
      :active.sync="editTimePopup"
    >
      <h4 style="text-align: center; margin-bottom: 10px">
        {{ editData.name ? editData.name : "" }}
      </h4>

      <div class="vx-row">
        <div class="vx-col md:w-1/3">
          <flat-pickr
            :config="configdateStartTimePicker"
            v-model="editData.start"
            placeholder="Start Time"
          />
        </div>
        <div class="vx-col md:w-1/3">
          <flat-pickr
            :config="configdateEndTimePicker"
            v-model="editData.end"
            placeholder="End Time"
          />
        </div>
        <div class="vx-col md:w-1/3">
          <vs-checkbox class="custom__checkbox" v-model="updatallDay"
            >24H</vs-checkbox
          >
        </div>
      </div>

      <div class="vx-row">
        <div
          class="vx-col w-full"
          style="display: flex; flex-direction: row-reverse"
        >
          <vs-button class="mr-6 mt-4 unimacs_button" @click="updateInfo"
            >Submit</vs-button
          >
          <!-- <vs-button class="unimacs_button" @click="editTimePopup = false"
            >Cancel</vs-button
          > -->
        </div>
      </div>
    </vs-popup>
    <div class="vx-row">
      <div class="flexi_block">
        <div class="vx-col custom_with flex" style="margin: 0 20px">
          <vs-checkbox style="margin-right: 17px" v-model="allDay"
            >24H</vs-checkbox
          >
        </div>

        <div class="vx-col custom_with flex" style="margin-right: 20%">
          <flat-pickr
            :config="configdateStartTimePicker"
            :disabled="!permissions.addItem"
            v-model="start_time"
            placeholder="Start Time"
            />
            <!-- @input="checkDateTime" -->
        </div>
        <div class="vx-col custom_with">
          <flat-pickr
            :config="configdateEndTimePicker"
            :disabled="!permissions.addItem"
            v-model="end_time"
            placeholder="End Time"
            />
            <!-- @input="checkDateTime" -->
        </div>
      </div>
      <div class="vx-col md:w-1/6 flex" style="padding-left: 0">
        <vs-button
          color="success"
          class="create_new"
          @click="confirmAddTime"
          :disabled="!validTimeline"
        >
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
        <vs-table
noDataText="No data available"
          ref="parent_daily_table"
          class="bs_table"
          :max-items="25"
          :data="schedules"
        >
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
                  <feather-icon
                    icon="EditIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click="() => (sendPopup = true)"
                    v-if="permissions.updateItem"
                    @click.stop="editSchedule(tr)"
                  />
                  <feather-icon
                    icon="TrashIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    class="ml-2"
                    v-if="permissions.destroyItem"
                    @click.stop="confirmDeleteRecord(tr)"
                  />
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
        </vs-table>
        <div class="timeline_block">
          <timeLine v-if="schedules && schedules.length" :array="schedules" />
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
      this.fetchTimeFrame(this.propData);
    },
    updatallDay(val) {
      if (val) {
        this.editData.start = "00:00";
        this.editData.end = "23:59";
      } else {
        this.editData.start = null;
        this.editData.end = null;
      }
    }
  },
  components: {
    flatPickr,
    timeLine
  },
  data() {
    return {
      editPopup: false,
      permissions: this.$parent.permissions,
      activeTab: 0,
      schedules: [],
      editData: {},
      start_time: null,
      end_time: null,
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
      deletedId: null,
      editTimePopup: false,
      updatallDay: false,
      allDay: false
    };
  },
  methods: {
    checkDateTime() {
      if (
        this.start_time &&
        this.end_time &&
        !this.$parent.checkDateTime(this.start_time, this.end_time)
      ) {
        this.end_time = "23:59:59";
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
        accept: this.createTimeFrame,
        acceptText: "Create"
      });
    },
    updateInfo() {
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
          id: this.editData.id,
          name: this.propData.name,
          schedule: this.propData.pid,
          start: this.editData.start,
          end: this.editData.end
        };

        this.$http
          .put(`schedule/timeframe`, obj, {
            headers: { Authorization: localStorage.token }
          })
          .then(res => {
            this.editTimePopup = false;

            const productIndex = this.schedules.findIndex(
              p => p.id == res.data[0].id
            );
            this.schedules[productIndex].start = res.data[0].start;
            this.schedules[productIndex].end = res.data[0].end;
            this.updatallDay = false;
            this.$vs.loading.close();
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Timeframe updated"
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
    createTimeFrame() {
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
          name: 1,
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
            if (this.schedules.length) {
              this.schedules.forEach((item, index) => {
                item.count = index + 1;
                arr.push(item);
              });
            }
            this.schedules = arr;
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Timeframe created"
            });
            this.start_time = null;
            this.end_time = null;

            this.allDay = false;
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
    editSchedule(data) {
      this.editData = { ...data };
      this.editTimePopup = true;
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

      this.deletedId = null;
    },
    fetchTimeFrame(data) {
      if (data.type == "daily") {
        data.name = 1;
      }
      this.$store
        .dispatch("schedule/fetchTimeFrame", data)
        .then(res => {
          let arr = [];
          if (res.data.length) {
            res.data.forEach((item, index) => {
              item.count = index + 1;
              arr.push(item);
            });
          }
          this.schedules = arr;
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
    if (!this.propData.data) {
      this.fetchTimeFrame(this.propData);
    }

    this.$root.$on("fetchTime", () => {
      this.fetchTimeFrame(this.propData);
    });
  }
};
</script>

<style lang="scss" scoped>
.timeline_block {
  text-align: end;
  margin-top: 20px;
}

.custom_with {
  flex: 0 0 22.22%;
  max-width: 22.22%;
  // width: 22.2% !important;
}

.flexi_block {
  display: flex;
  align-items: center;
  width: 65%;
  margin-right: 35px;
}
</style>
