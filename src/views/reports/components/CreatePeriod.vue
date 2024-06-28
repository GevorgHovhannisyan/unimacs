<template>
  <div>
    <div class="vx-row">
      <div class="vx-col md:w-1/2">
        <vx-card class="mt-base" title="Date period" no-shadow>
          <div class="vx-row">
            <div class="vx-col md:w-1/3">
              <vs-radio
                v-model="period.name"
                vs-name="period"
                vs-value="current_day"
                >Current day</vs-radio
              >
            </div>
            <div class="vx-col md:w-1/3">
              <vs-radio
                v-model="period.name"
                vs-name="radios1"
                vs-value="current_week"
                >Current week</vs-radio
              >
            </div>
            <div class="vx-col md:w-1/3">
              <vs-radio
                v-model="period.name"
                vs-name="radios1"
                vs-value="current_month"
                >Current month</vs-radio
              >
            </div>

            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio
                v-model="period.name"
                vs-name="period"
                vs-value="previous_day"
                >Previous day</vs-radio
              >
            </div>
            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio
                v-model="period.name"
                vs-name="radios1"
                vs-value="previous_week"
                >Previous week</vs-radio
              >
            </div>
            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio
                v-model="period.name"
                vs-name="radios1"
                vs-value="previous_month"
                >Previous month</vs-radio
              >
            </div>
            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio
                v-model="period.name"
                vs-name="radios1"
                vs-value="target_day"
                >Target day</vs-radio
              >
            </div>

            <div
              class="md:w-2/3 mt-3"
              :class="{ disable_date_time: period.name !== 'target_day' }"
            >
              <flat-pickr
                :config="dayTimePicker"
                v-model="period.val.target_day"
                :disabled="period.name !== 'target_day'"
              />
            </div>

            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio
                v-model="period.name"
                vs-name="radios1"
                vs-value="target_month"
                >Target month</vs-radio
              >
            </div>

            <div
              class="md:w-2/3 mt-3"
              :class="{ disable_date_time: period.name !== 'target_month' }"
            >
              <flat-pickr
                :config="monthTimePicker"
                v-model="period.val.target_month"
                :disabled="period.name !== 'target_month'"
              />
            </div>

            <div class="vx-col md:w-1/3 mt-3">
              <vs-radio
                v-model="period.name"
                vs-name="radios1"
                vs-value="target_period"
                >Target period</vs-radio
              >
            </div>
            <div
              class="md:w-1/3 mt-3"
              :class="{ disable_date_time: period.name !== 'target_period' }"
            >
              <flat-pickr
                :config="dayTimePicker"
                v-model="period.val.target_period.start_date"
                :disabled="period.name !== 'target_period'"
              />
            </div>
            <div
              class="md:w-1/3 mt-3"
              :class="{ disable_date_time: period.name !== 'target_period' }"
            >
              <flat-pickr
                :config="dayTimePicker"
                v-model="period.val.target_period.end_date"
                :disabled="period.name !== 'target_period'"
              />
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
              <flat-pickr
                :config="start_from_picker"
                v-model="period.start_time"
              />
            </div>

            <div class="vx-col md:w-1/7">
              <span> to </span>
            </div>

            <div class="vx-col md:w-1/4">
              <flat-pickr
                :config="start_from_picker"
                v-model="period.end_time"
              />
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
        name: "current_day",
        val: {
          target_day: null,
          target_month: null,
          target_period: {
            start_date: null,
            end_date: null,
          },
        },
        start_time: "00:00:00",
        end_time: "23:59:59",
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
  props: {
    configs: {
      type: Object,
    },
  },
  created() {
    if (Object.keys(this.configs).length) {
      this.period = { ...this.configs };
    }

    this.$root.$on("clearReports", () => {
      this.period = {
        name: "current_day",
        val: {
          target_day: null,
          target_month: null,
          target_period: {
            start_date: null,
            end_date: null,
          },
        },
        start_time: "00:00:00",
        end_time: "23:59:59",
      };
    });
  },
  methods: {},
  watch: {
    period: {
      handler: function (period) {
        this.$emit("setperiod", period);
      },
      deep: true,
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
