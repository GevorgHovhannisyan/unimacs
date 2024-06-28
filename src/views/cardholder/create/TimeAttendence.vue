<template>
  <div>
    <!-- title="Time attendence" -->
    <vx-card class="mt-base card_theme"  no-shadow>
      <div class="vx-row">
        <div class="vx-col md:w-1/2">
          <!-- checkbox_block -->
          <vs-checkbox
            class="w-full  custom__checkbox"
            v-model="time_attendence.time_attendance_inherited"
            @change="changeToInherit"
            :disabled="!group"
            >Inherited</vs-checkbox
          >
        </div>
      </div>

      <div class="vx-row" style="margin: 5px -1rem 0 -1rem">
        <div class="vx-col md:w-2/3">
          <label for="" class="vs-input--label">Time Attendance schedule</label>
          <v-select
            v-model="time_attendence.time_attendance"
            :options="schedulesOptions"
            class="w-full select_padding"
            :disabled="time_attendence.time_attendance_inherited"
            @input="changeSchedule"
            placeholder="Time Attendance schedule"
            :reduce="(type) => type.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
        <div
          class="vx-col md:w-1/3"
          style="padding-left: 0"
          v-if="editSchedule.type && time_attendence.time_attendance"
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
        style="padding: 5px 0px 0 13px; margin: 5px -2rem"
        v-if="time_attendence.time_attendance"
      >
        <div class="vx-col w-full" v-if="editSchedule.description">
          <vs-input
            label="Descriptionss"
            class="w-full"
            :disabled="true"
            v-model="editSchedule.description"
          />
        </div>
      </div>

      <div class="vx-row time_tbl">
        <div
          class="vx-col w-full"
          style="padding-right: 5px"
          v-if="time_attendence.time_attendance"
        >
          <div>
            <TimelineTable class="mt-3" :items="timeframes" />
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import timeLine from "../../schedule/TimeLine";
import vSelect from "vue-select";
import TimelineTable from "../../../components/custom/table/TimeLineTable";
import { generateTimeframes } from "../../../functions/scheduleData";

export default {
  data() {
    return {
      timeframes: [],
      schedulesOptions: [],
      time_attendence: {
        time_attendance_inherited: false,
        time_attendance: null,
      },
      editSchedule: {},
      week_data: this.$store.state.week_data,
    };
  },
  components: {
    timeLine,
    vSelect,
    TimelineTable,
  },
  watch: {
    time_attendence: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_TIME_ATTEND_INFO", newValue);
      },
      deep: true,
    },
  },
  computed: {
    group() {
      return this.$store.state.cardholder.cardholder_info.cardholder_group;
    },
  },
  methods: {
    changeToInherit() {
      if (this.time_attendence.time_attendance_inherited) {
        this.$store
          .dispatch("cardGroup/fetchCardGroup", this.group)
          .then((res) => {
            this.time_attendence = { ...res.data.time_attendences };
            this.time_attendence.time_attendance = res.data.time_attendance;
            this.changeSchedule();
            this.time_attendence.time_attendance_inherited = true;
          });
      } else {
        this.time_attendence = {};
      }
    },
    changeSchedule() {
      if (this.time_attendence.time_attendance) {
        this.$store
          .dispatch(
            "schedule/fetchSchedule",
            this.time_attendence.time_attendance
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
    // initValues() {
    //   this.time_attendence = {};
    // },
  },
  created() {
    this.time_attendence.time_attendance_inherited =
      this.$store.state.cardholder.cardholder_info.time_attendance_inherited;
    this.time_attendence.time_attendance =
      this.$store.state.cardholder.cardholder_info.time_attendance;

    if (this.time_attendence.time_attendance_inherited) {
      this.changeToInherit();
    }

    this.changeSchedule();

    this.$store
      .dispatch("schedule/fetchSchedules")
      .then((res) => {
        this.schedulesOptions = [
          /*  {
            id: null,
            label: "Select Schedule",
          },*/
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

    // this.$root.$on("clearCardholderForm", () => {
    //   this.initValues();
    // });
  },
};
</script>

<style>
.time_tbl .con-tablex.vs-table--content {
  height: 280px;
}

</style>