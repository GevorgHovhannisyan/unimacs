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
            empty: slot > slotCounts.saved + 1
          }"
        ></div>
      </div>

      <div class="vx-col w-full mt-1">
        <vs-input
          class="w-full"
          v-model="guestData.first_name"
          label="Key name"
          name="lp_number"
        />
      </div>

      <div class="vx-col w-full mt-2">
        <label for="" class="vs-input--label">Period</label>

        <v-select
          v-model="guestData.period"
          :options="[
            { id: 'hours', label: 'Hours' },
            { id: 'days', label: 'Days' }
          ]"
          class="select_padding w-full"
          name="model"
          @input="changePeriod"
          placeholder="Period"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :reduce="period => period.id"
        />
      </div>

      <div class="vx-col w-full mt-2">
        <label for="" class="vs-input--label">Access Points</label>

        <v-select
          v-if="showAccessPoints"
          multiple
          v-model="guestData.access_points"
          :options="points"
          class="select_padding w-full"
          name="model"
          placeholder="Access Points"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          @input="changed"
          :reduce="access_point => access_point.id"
        />
      </div>

      <div class="vx-col w-full" v-if="guestData.period === 'hours'">
        <label for="" class="vs-input--label">Duration</label>

        <v-select
          v-model="guestData.duration"
          :options="durations"
          class="select_padding w-full"
          name="model"
          placeholder="Duration"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="vx-col w-full" v-if="guestData.period === 'hours'">
        <label for="" class="vs-input--label">Activation date</label>
        <flat-pickr
          class="w-full"
          v-model="guestData.start_date"
          :config="configdateDatePicker"
          placeholder="Activation date"
        />
      </div>

      <div class="vx-col w-full" v-if="guestData.period === 'hours'">
        <label for="" class="vs-input--label">Activation time</label>

        <flat-pickr
          class="w-full"
          :config="configdateTimePicker"
          v-model="guestData.start_time"
          placeholder="Activation time"
        />
      </div>

      <div class="vx-row mt-3" v-else>
        <label for="" class="vs-input--label w-full ml-4"
          >Start of action</label
        >

        <div class="vx-col w-1/2">
          <flat-pickr
            class="w-full"
            v-model="guestData.start_date"
            :config="configdateDatePicker"
            placeholder="Start of action"
          />
        </div>
        <div class="vx-col w-1/2">
          <flat-pickr
            class="w-full"
            :config="configdateTimePicker"
            v-model="guestData.start_time"
          />
        </div>

        <label for="" class="vs-input--label w-full ml-4 mt-3"
          >End of action</label
        >

        <div class="vx-col w-1/2">
          <flat-pickr
            class="w-full"
            :config="configdateDatePicker"
            placeholder="End of action"
            v-model="guestData.end_date"
          />
        </div>
        <div class="vx-col w-1/2">
          <flat-pickr
            class="w-full"
            :config="configdateTimePicker"
            v-model="guestData.end_time"
          />
        </div>
      </div>
    </div>
    <div class="vx-col w-1/2 ml-1 mt-2">
      <vs-checkbox v-model="guestData.status">Status</vs-checkbox>
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
      default: () => []
    },
    durations: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    guestData: {
      handler: function(data, oldVal) {
        this.$emit("setKey", data);
      },
      deep: true
    }
  },
  data() {
    return {
      configdateDatePicker: {
        enableTime: false,
        dateFormat: "Y-m-d"
      },
      configdateTimePicker: {
        enableTime: true,
        time_24hr: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "00:00:00",
        maxTime: "23:59:59"
      },
      slotCounts: {
        count: 12,
        saved: 5
      },
      guestData: {
        status: false,
        access_points: [],
        period: "hours",
        duration: 0,
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null
      },
      showAccessPoints: true,
      duration_options: []
    };
  },
  methods: {
    changed() {
      this.showAccessPoints = false;
      setTimeout(() => {
        this.showAccessPoints = true;
      }, 0);
    },
    changePeriod(period) {
      this.guestData = JSON.parse(JSON.stringify(this.editGuestData));
      this.guestData.period = period;
      const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (this.guestData.period === "days") {
        const concatStart =
          this.$moment(this.guestData.start_date).format("YYYY-MM-DD") +
          " " +
          this.guestData.start_time;
        const concatEnd =
          this.$moment(this.guestData.end_date).format("YYYY-MM-DD") +
          " " +
          this.guestData.end_time;

        const new_timestamp_start = this.$moment.utc(concatStart).toDate();
        const new_timestamp_end = this.$moment.utc(concatEnd).toDate();

        const correctStartTime = this.$moment(new_timestamp_start).format(
          "HH:mm:ss"
        );
        const correctEndTime = this.$moment(new_timestamp_end).format(
          "HH:mm:ss"
        );

        this.guestData.end_date = this.$moment(this.guestData.end_date)
          .tz(time)
          .format("YYYY-MM-DD");
        this.guestData.start_date = this.$moment(this.guestData.start_date)
          .tz(time)
          .format("YYYY-MM-DD");

        this.guestData.end_time = correctEndTime;
        this.guestData.start_time = correctStartTime;
      } else {
        const concatStart =
          this.$moment(this.guestData.start_date).format("YYYY-MM-DD") +
          " " +
          this.guestData.start_time;

        const new_timestamp_start = this.$moment.utc(concatStart).toDate();
        const correctStartTime = this.$moment(new_timestamp_start).format(
          "HH:mm:ss"
        );

        this.guestData.start_date = this.$moment(this.guestData.start_date)
          .tz(time)
          .format("YYYY-MM-DD");
        this.guestData.start_time = correctStartTime;
      }

      this.guestData.access_points = [];
      if (
        this.guestData.access_rights &&
        this.guestData.access_rights.access_rules &&
        this.guestData.access_rights.access_rules.length
      ) {
        this.guestData.access_rights.access_rules.forEach(rule => {
          this.guestData.access_points.push(rule.access_point);
        });
      }
    }
  },
  computed: {
    editGuestData() {
      return this.$store.state.cardholder.edit_cardholder_info;
    },
    access_points() {
      return this.$store.state.access_points;
    }
  },
  created() {
    this.$store.dispatch("cardholder/getGuestLimit").then(response => {
      this.slotCounts.count = response.data.guest_count;
      this.slotCounts.saved = response.data.created_guests_count;
    });

    this.guestData = JSON.parse(JSON.stringify(this.editGuestData));

    const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.guestData.period === "days") {
      const concatStart =
        this.$moment(this.guestData.start_date).format("YYYY-MM-DD") +
        " " +
        this.guestData.start_time;
      const concatEnd =
        this.$moment(this.guestData.end_date).format("YYYY-MM-DD") +
        " " +
        this.guestData.end_time;

      const new_timestamp_start = this.$moment.utc(concatStart).toDate();
      const new_timestamp_end = this.$moment.utc(concatEnd).toDate();

      const correctStartTime = this.$moment(new_timestamp_start).format(
        "HH:mm:ss"
      );
      const correctEndTime = this.$moment(new_timestamp_end).format("HH:mm:ss");

      this.guestData.end_date = this.$moment(new_timestamp_end)
      .format("YYYY-MM-DD");
      this.guestData.start_date = this.$moment(new_timestamp_start)
      .format("YYYY-MM-DD");

      this.guestData.end_time = correctEndTime;
      this.guestData.start_time = correctStartTime;
    } else {
      const concatStart =
        this.$moment(this.guestData.start_date).format("YYYY-MM-DD") +
        " " +
        this.guestData.start_time;

      const new_timestamp_start = this.$moment.utc(concatStart).toDate();
      const correctStartTime = this.$moment(new_timestamp_start).format(
        "HH:mm:ss"
      );

      this.guestData.start_date = this.$moment(new_timestamp_start).format(
        "YYYY-MM-DD"
      );
      this.guestData.start_time = correctStartTime;
    }

    this.guestData.access_points = [];
    if (
      this.guestData.access_rights &&
      this.guestData.access_rights.access_rules &&
      this.guestData.access_rights.access_rules.length
    ) {
      this.guestData.access_rights.access_rules.forEach(rule => {
        this.guestData.access_points.push(rule.access_point);
      });
    }
  },
  components: {
    vSelect,
    flatPickr
  }
};
</script>
