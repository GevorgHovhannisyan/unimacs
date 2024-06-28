<template>
  <div>
    <vs-popup
      class="holamundo"
      title="Update timeframe"
      :active.sync="editTimePopup"
    >
      <h4 style="text-align: center; margin-bottom: 10px">
        {{ editSchdule.name ? editSchdule.name : "" }}
      </h4>

      <div class="vx-row">
        <div class="vx-col md:w-1/3">
          <flat-pickr
            :config="configdateStartTimePicker"
            v-model="editSchdule.start"
            placeholder="Start Time"
          />
        </div>
        <div class="vx-col md:w-1/3">
          <flat-pickr
            :config="configdateEndTimePicker"
            v-model="editSchdule.end"
            placeholder="End Time"
          />
        </div>
        <div class="vx-col md:w-1/3">
          <vs-checkbox class="custom__checkbox" v-model="updateallDay"
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
      <div class="vx-col md:w-2/3">
        <span>Day</span>

        <vs-input
          v-validate="'required'"
          name="name"
          type="name"
          disabled
          v-model="editData.original_name"
          @input="checkNumber"
          placeholder="Day"
          class="w-full mb-5"
        />
      </div>
      <div class="vx-col md:w-1/3">
        <vs-button
          v-if="permissions.updateItem && schedules && schedules.length"
          class="w-full mt-5 unimacs_button"
          @click.prevent="updateScheduleName"
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
            placeholder="Start Time"
            :disabled="!permissions.addItem || allDay"
          />
        </div>
        <div class="vx-col custom_with">
          <flat-pickr
            :config="configdateEndTimePicker"
            v-model="end_time"
            placeholder="End Time"
            :disabled="!permissions.addItem || allDay"
            />
            <!-- @input="checkDateTime" -->
        </div>
      </div>
      <!-- <div> -->
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
      <!-- </div> -->
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
  computed: {},
  watch: {
    propData(val) {
      this.fetchTimeFrame(this.propData);
    },
    allDay(val) {
      if (val) {
        this.start_time = "00:00";
        this.end_time = "23:59";
      } else {
        this.start_time = null;
        this.end_time = null;
      }
    },
    updateallDay(val) {
      if (val) {
        this.editSchdule.start = "00:00";
        this.editSchdule.end = "23:59";
      } else {
        this.editSchdule.start = null;
        this.editSchdule.end = null;
      }
    }
  },
  data() {
    return {
      editPopup: false,
      activeTab: 0,
      schedules: [],
      permissions: this.$parent.permissions,

      editData: {},
      editSchdule: {},
      start_time: null,
      end_time: null,
      access_rights: [],

      time: null,
      configdateStartTimePicker: {
        enableTime: true,
        time_24hr: true,
        enableSeconds: false,
        noCalendar: true
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
      updated_name: null,
      allDay: false,
      updateallDay: false,
      delayTimer:null
    };
  },
  methods: {
    checkNumber(value) {
      return (this.editData.original_name = +value.replace(/[^+0-9]/g, ""));
    },
    updateScheduleName() {
      const saveObject = {
        old_name: String(this.propData.original_name),
        new_name: String(this.editData.original_name),
        schedule: this.editData.schedule
          ? this.editData.schedule
          : this.editData.pid
      };

      this.$store
        .dispatch("schedule/updateTimeFrame", saveObject)
        .then(res => {
          this.$parent.changeFlexiScheduleName(res.data, this.propData);
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Timeframe updated"
          });
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    },
    confirmAddTime() {
      if(!this.$parent.checkDateTime(this.start_time, this.end_time)) {
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
        this.editSchdule.start,
        this.editSchdule.end
      );

      if (canCreate) {
        this.$vs.loading({
          type: "corners"
        });
        const obj = {
          id: this.editSchdule.id,
          name: this.editSchdule.name,
          schedule: this.editSchdule.schedule,
          start: this.editSchdule.start,
          end: this.editSchdule.end
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
          name: this.editData.original_name,
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
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Timeframe created"
            });
            this.start_time = null;
            this.end_time = null;
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
    checkDateTime() {
      // clearTimeout(this.delayTimer)

      // this.delayTimer = setTimeout(() => {
      //   if (
      //   this.start_time &&
      //   this.end_time &&
      //   !this.$parent.checkDateTime(this.start_time, this.end_time)
      // ) {
      //   this.end_time = "23:59:59";
      // }
      // }, 400);;

    },
    editSchedule(data) {
      this.editSchdule = { ...data };
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
      } else {
        this.$emit("deleteTime", this.propData.id);
      }
      this.schedules = arr;

      this.deletedId = null;
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
  mounted() {
    this.$root.$on("fetchTime", () => {
      this.fetchTimeFrame(this.propData);
    });
  },
  created() {
    this.fetchTimeFrame(this.propData);
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
