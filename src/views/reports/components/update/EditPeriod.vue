<template>
  <div>
    <div class="vx-row">
      <div class="vx-col md:w-1/2">
        <vx-card class="mt-base" title="Date period" no-shadow>
          <div class="vx-row">
            <div class="vx-col md:w-1/3">
              <vs-radio v-model="period.key" vs-name="period" vs-value="current_day">Current day</vs-radio>
            </div>
            <div class="vx-col md:w-1/3">
              <vs-radio v-model="period.key" vs-name="radios1" vs-value="current_week">Current week</vs-radio>
            </div>
            <div class="vx-col md:w-1/3">
              <vs-radio v-model="period.key" vs-name="radios1" vs-value="current_month">Current month</vs-radio>
            </div>

            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio v-model="period.key" vs-name="period" vs-value="previous_day">Previous day</vs-radio>
            </div>
            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio v-model="period.key" vs-name="radios1" vs-value="previous_week">Previous week</vs-radio>
            </div>
            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio v-model="period.key" vs-name="radios1" vs-value="previous_month">Previous month</vs-radio>
            </div>
            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio v-model="period.key" vs-name="radios1" vs-value="target_day">Target day</vs-radio>
            </div>

            <div class="md:w-2/3 mt-3">
              <flat-pickr :config="dayTimePicker" v-model="period.val.target_day"
                :disabled="period.key !== 'target_day'" />
            </div>

            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio v-model="period.key" vs-name="radios1" vs-value="target_month">Target month</vs-radio>
            </div>

            <div class="md:w-2/3 mt-3">
              <flat-pickr :config="monthTimePicker" v-model="period.val.target_month"
                :disabled="period.key !== 'target_month'" />
            </div>

            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio v-model="period.key" vs-name="radios1" vs-value="target_period">Target period</vs-radio>
            </div>
            <div class="md:w-1/3 mt-3">
              <flat-pickr :config="dayTimePicker" v-model="period.val.target_period.start_date"
                :disabled="period.key !== 'target_period'" />
            </div>
            <div class="md:w-1/3 mt-3">
              <flat-pickr :config="dayTimePicker" v-model="period.val.target_period.end_date"
                :disabled="period.key !== 'target_period'" />
            </div>
          </div>
        </vx-card>
      </div>

      <div class="vx-col md:w-1/2">
        <vx-card class="mt-base" title="Time period" no-shadow>
          <div class="vx-row time_periodd">
            <div class="vx-col md:w-1/6">
              <span> Start from </span>
            </div>

            <div class="vx-col md:w-1/3">
              <flat-pickr :config="start_from_picker" v-model="period.start_time" />
            </div>

            <div class="vx-col md:w-1/7">
              <span> to </span>
            </div>

            <div class="vx-col md:w-1/4">
              <flat-pickr :config="start_from_picker" v-model="period.end_time" />
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>



<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js";
import "flatpickr/dist/plugins/monthSelect/style.css";

export default {
  data() {
    return {
      period: {
        key: "current_day",
        val: {
          target_day: null,
          target_month: null,
          target_period: {
            start_date: null,
            end_date: null,
          },
        },
        start_time: null,
        end_time: null,
      },
      dayTimePicker: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      monthTimePicker: {
        plugins: [
          new monthSelectPlugin({
            shorthand: true, //defaults to false
            dateFormat: "M.Y", //defaults to "F Y"
            altFormat: "F Y", //defaults to "F Y"
          }),
        ],
      },

      start_from_picker: {
        enableTime: true,
        time_24hr: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "00:00:00",
        maxTime: "23:59:59",
      },
    };
  },
  created() {
    let period = {
      key: "current_day",
      val: {
        target_day: null,
        target_month: null,
        target_period: {
          start_date: null,
          end_date: null,
        },
      },
      start_time: null,
      end_time: null,
    };
    if (Object.keys(this.configs).length) {
      if (this.configs.start_time) period.start_time = this.configs.start_time;
      if (this.configs.end_time) period.end_time = this.configs.end_time;

      period.key = this.configs.key;
      if (period.key == "target_day" || period.key == "target_month") {
        period.val[this.configs.key] =
          typeof this.configs.val == "string"
            ? this.configs.val
            : this.configs.val[this.configs.key];
      }
      if (this.configs.key == "target_period") {
        period.val[this.configs.key] = {
          ...(this.configs.val[this.configs.key]
            ? this.configs.val[this.configs.key]
            : this.configs.val),
        };
      }
    }
    this.period = { ...period };
  },
  methods: {},
  computed: {
    edit_period() {
      return this.$store.state.report.edit_period;
    },
  },
  watch: {
    period: {
      handler: function (period) {
        this.$emit("setperiod", period);
      },
      deep: true,
    },
  },
  props: {
    configs: {
      type: Object,
    },
  },
  components: {
    flatPickr,
  },
};
</script>

<style lang="scss" scoped>
.time_periodd {
  display: flex;
  align-items: center;
}
</style>