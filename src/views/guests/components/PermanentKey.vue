<template>
  <div class="vx-row">
    <div class="vx-col w-full">
      <div class="free_slots_block">
        <div
          class="slot_item"
          v-for="(slot, index) in slotCounts.count"
          :key="index"
          :class="{
            filled: slot <= slotCounts.saved,
            bordered: slot === slotCounts.saved + 1,
            empty: slot > slotCounts.saved + 1,
          }"
        ></div>
      </div>

      <div class="vx-col w-full mt-3">
        <vs-input
          class="w-full"
          v-model="guestData.first_name"
          label="Key name"
          name="lp_number"
        />
      </div>
      <div class="vx-col w-full mt-3">
        <label for="" class="vs-input--label">Access Points</label>

        <v-select
          multiple
          v-model="guestData.access_points"
          :options="points"
          class="select_padding w-full"
          name="model"
          placeholder="Access Points"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :reduce="(access_point) => access_point.id"
        />
      </div>

      <div class="vx-col w-full week_d mt-3">
        <vs-checkbox
          class="week_item"
          v-for="(day, index) in weekDays"
          :key="index"
          v-model="guestData.days_of_week[day.key]"
          >{{ day.name }}</vs-checkbox
        >
      </div>

      <div class="vx-row mt-3">
        <label for="" class="vs-input--label w-full ml-4"
          >Start of action</label
        >

        <div class="vx-col w-1/2">
          <flat-pickr
            class="w-full"
            placeholder="Date"
            :config="configdateTimePicker"
            v-model="guestData.start_time"
          />
        </div>
        <div class="vx-col w-1/2">
          <flat-pickr
            class="w-full"
            placeholder="Time"
            :config="configdateTimePicker"
            v-model="guestData.end_time"
          />
        </div>
      </div>

      <div class="vx-col w-full mt-3">
        <label for="" class="vs-input--label">Select access point</label>

        <v-select
          v-model="guestData.selected_access_point"
          :options="selected_points"
          class="select_padding w-full"
          name="model"
          placeholder="Access Point"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :reduce="(access_point) => access_point.id"
        />
      </div>
    </div>

    <div class="vx-col w-full mt-3">
      <vs-button
        class="view_alarm unimacs_button w-full"
        @click="
          guestData.set_key = true;
          $parent.$parent.setPermamentKey();
        "
      >
        Set key
      </vs-button>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/plugins/monthSelect/style.css";

export default {
  props: {
    points: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    guestData: {
      handler: function (data, oldVal) {
        this.$emit("setKey", data);
      },
      deep: true,
    },
  },
  data() {
    return {
      configdateDatePicker: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      configdateTimePicker: {
        enableTime: true,
        time_24hr: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "00:00:00",
        maxTime: "23:59:59",
      },
      slotCounts: {
        count: 0,
        saved: 0,
      },
      guestData: {
        status: false,
        days_of_week: {},
        access_points: [],
        duration: 0,
        start_date: null,
        start_time: null,
        selected_access_point: null,
        set_key: false,
      },
      weekDays: [
        { name: "Mon", key: 1 },
        { name: "Tue", key: 2 },
        { name: "Wed", key: 3 },
        { name: "Thu", key: 4 },
        { name: "Fri", key: 5 },
        { name: "Sat", key: 6 },
        { name: "Sun", key: 7 },
      ],
    };
  },
  computed: {
    access_points() {
      return this.$store.state.access_points;
    },
    selected_points() {
      let selected_points = [];
      if (this.guestData.access_points) {
        for (let i = 0; i < this.guestData.access_points.length; i++) {
          const findPoint = this.points.find(
            (point) => point.id == this.guestData.access_points[i]
          );
          selected_points.push(findPoint);
        }
      }
      return selected_points;
    },
  },
  created() {
    this.$store.dispatch("cardholder/getGuestLimit").then((response) => {
      this.slotCounts.count = response.data.guest_count;
      this.slotCounts.saved = response.data.created_guests_count;
    });
  },
  components: {
    vSelect,
    flatPickr,
  },
};
</script>

<style lang="scss" >
.week_d {
  display: flex;
  justify-content: space-between;

  .week_item {
    display: flex;
    flex-direction: column-reverse;

    .checkbox_x {
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>