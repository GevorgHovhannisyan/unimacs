<template>
  <div>
    <vs-popup
      class="holamundo"
      title="Update Timeframe"
      :active.sync="editTimePopup"
    >
      <div>
        <div class="title_block">
          <h4 style="text-align: center; margin-bottom: 10px">
            {{ editData.name ? editData.name : "" }}
          </h4>
        </div>
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
            <vs-checkbox class="custom__checkbox" v-model="updateallDay"
              >24H</vs-checkbox
            >
          </div>
        </div>

        <div class="vx-row w-full">
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
      </div>
    </vs-popup>
    <div class="vx-row mb-5">
      <div class="vx-col md:w-2/3">
        <span>Date</span>
        <flat-pickr
          class="w-full"
          v-model="editData.name"
          label="Date"
          placeholder="Date"
        />
      </div>
      <div class="vx-col md:w-1/3">
        <vs-button
          class="w-full mt-5 unimacs_button"
          @click.prevent="updateScheduleInfo"
          v-if="permissions.updateItem"
          >Submit</vs-button
        >
      </div>
    </div>
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
            v-model="start_time"
            :disabled="!permissions.addItem"
            placeholder="Start Time"
          />
        </div>
        <div class="vx-col custom_with">
          <flat-pickr
            :config="configdateEndTimePicker"
            v-model="end_time"
            :disabled="!permissions.addItem"
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
                    @click.stop="editSchedule(tr)"
                    v-if="permissions.updateItem"
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
      this.fetchTimeFrame(this.propData);
    },
    updateallDay(val) {
      if (val) {
        this.editData.start = "00:00";
        this.editData.end = "23:59";
      } else {
        this.editData.start = null;
        this.editData.end = null;
      }
    }
  },
  data() {
    return {
      activeTab: 0,
      schedules: [],
      editData: {},
      start_time: null,
      end_time: null,
      editTime: {
        id: null,
        start_time: null,
        end_time: null
      },
      access_rights: [],
      permissions: this.$parent.permissions,

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
      configdateDate: {},
      editTimePopup: false,
      deletedId: null,
      updateallDay: false,
      allDay: false,
      isUpdated: false
    };
  },
  methods: {
    editSchedule(data) {
      this.editData = { ...data };
      this.editTimePopup = true;
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
        name: this.propData.timeframe_name,
        schedule: this.editData.schedule,
        start: this.editData.start,
        end: this.editData.end
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
          this.editTimePopup = false;
          this.updateallDay = false;
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
    updateScheduleInfo() {
      const saveObject = {
        old_name: this.propData.original_name
          ? this.propData.original_name
          : this.propData.name,
        new_name: this.editData.name,
        schedule: this.propData.pid
      };

      this.isUpdated = true;
      this.$store
        .dispatch("schedule/updateTimeFrame", saveObject)
        .then(res => {
          this.$parent.changeScheduleName();
          // this.$parent.correctExpandedItems(res.data[0])
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Schedule updated"
          });
        })
        .catch(err => {
          this.$vs.loading.close();
        });
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
      } else {
        this.$emit("deleteTime", this.propData.id);
      }
      this.schedules = arr;
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
          name: this.editData.name,
          schedule: this.editData.pid,
          start: this.start_time,
          end: this.end_time
        };

        if (this.isUpdated) {
          obj.name = this.editData.name;
        } else {
          obj.name = this.propData.original_name;
        }

        this.$store
          .dispatch("schedule/createTimeFrame", obj)
          .then(res => {
            this.$vs.loading.close();

            this.schedules.push(res.data);

            this.start_time = null;
            this.end_time = null;

            let arr = [];
            if (this.schedules.length) {
              this.schedules.forEach((item, index) => {
                item.count = index + 1;
                arr.push(item);
              });
            }

            this.allDay = false;
            this.schedules = arr;
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
      const sendData = {
        pid: data.pid,
        name: data.original_name
      };

      this.$store
        .dispatch("schedule/fetchTimeFrame", sendData)
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
.timeline_block {
  text-align: end;
  margin-top: 20px;
}

.title_block {
  font-weight: 600;
  margin: 0 0 15px 0;
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
