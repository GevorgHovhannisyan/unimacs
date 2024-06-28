<template>
<!-- title="Time Attendance" -->
  <vx-card class="mt-base card_theme"  no-shadow>
    <div class="vx-row">
      <div class="vx-col md:w-1/2">
        <vs-checkbox
          class="mb-3 mt-2"
          v-model="time_attendance.time_attendance_inherited"
          @change="changeToInherit"
          :disabled="!group"
          >Inherited
        </vs-checkbox>
      </div>
    </div>

    <div class="vx-row" style="margin: 5px -1rem 0 -1rem">
      <div class="vx-col md:w-2/3">
        <label for="" class="vs-input--label">Time Attendance schedule</label>
        <v-select
          v-model="time_attendance.time_attendance"
          :options="schedulesOptions"
          @input="changeSchedule"
          class="w-full select_padding"
          placeholder="Time Attendance schedule"
          :disabled="time_attendance.time_attendance_inherited"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div
        class="vx-col md:w-1/3"
        style="padding-left: 5px"
        v-if="editSchedule.type && time_attendance.time_attendance"
      >
        <vs-input
          label="Type"
          class="new_inp"
          :disabled="true"
          v-model="editSchedule.type"
        />
      </div>
    </div>
    <div
      class="vx-row"
      v-if="time_attendance.time_attendance"
      style="padding: 5px 0px 0 13px; margin: 5px -2rem"
    >
      <div class="vx-col w-full" v-if="editSchedule.description">
        <vs-input
          label="Description"
          class="w-full"
          :disabled="true"
          v-model="editSchedule.description"
        />
      </div>
    </div>

    <div class="vx-row mt-5">
      <div
        class="vx-col w-full"
        style="padding-right: 0"
        v-if="time_attendance.time_attendance"
      >
        <div>
          <TimelineTable :items="timeframes" />
        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import timeLine from "@/views/schedule/TimeLine";
import vSelect from "vue-select";
import TimelineTable from "@/components/custom/table/TimeLineTable";
import { generateTimeframes } from "@/functions/scheduleData";

export default {
  data() {
    return {
      timeframes: [],
      schedulesOptions: [],
      time_attendance: {},
      editSchedule: {},
    };
  },
  components: {
    timeLine,
    vSelect,
    TimelineTable,
  },
  computed: {
    edit_data() {
      return this.$store.state.cardholder.edit_cardholder_info;
    },
  },
  watch: {
    time_attendance: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_EDIT_TIME_ATTEND_INFO", newValue);
      },
      deep: true,
    },
  },
  methods: {
    changeToInherit() {
      if (this.time_attendance.time_attendance_inherited) {
        this.$store
          .dispatch("cardGroup/fetchCardGroup", this.group)
          .then((res) => {
            this.time_attendance = { ...res.data.time_attendances };
            this.time_attendance.time_attendance = res.data.time_attendance;
            this.changeSchedule();
            this.time_attendance.time_attendance_inherited = true;
          });
      } else {
        this.time_attendance = {};
      }
    },
    changeSchedule() {
      this.$store.commit(
        "cardholder/SET_EDIT_TIME_ATTEND_INFO",
        this.time_attendance
      );
      if (this.time_attendance.time_attendance) {
        this.$store
          .dispatch(
            "schedule/fetchSchedule",
            this.time_attendance.time_attendance
          )
          .then((res) => {
            this.editSchedule = res.data;

            this.timeframes = [];

            const getSchedule = generateTimeframes(res);

            this.timeframes = getSchedule;
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      } else {
        this.timeframes = [];
      }
    },
  },
  computed: {
    edit_data() {
      return this.$store.state.cardholder.edit_cardholder_info;
    },
    group() {
      return this.$store.state.cardholder.edit_cardholder_info.cardholder_group;
    },
  },
  created() {
    if (this.edit_data.time_attendance) {
      this.time_attendance = this.edit_data.time_attendances;
      this.time_attendance.time_attendance = this.edit_data.time_attendance;
      this.time_attendance.time_attendance_inherited =
        this.edit_data.time_attendance_inherited;
      this.changeSchedule(this.edit_data.time_attendance);
    }

    this.$store
      .dispatch("schedule/fetchSchedules")
      .then((res) => {
        this.schedulesOptions = [
          {
            id: null,
            label: "Select Schedule",
          },
        ];
        if (res.data.length) {
          res.data.forEach((schedule) => {
            this.schedulesOptions.push({
              id: schedule.id,
              label: schedule.name,
            });
          });
        }
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });
  },
};
</script>
