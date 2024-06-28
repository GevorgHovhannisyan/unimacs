<template>
  <div class="access_point_status_chart flex ">
    <div class="options_block">
      <ul class="options_list">
        <li
          @click="changeTab(type.key)"
          v-for="(type, index) in chartTypes"
          :key="index"
          :class="{
            selected: chartType === type.key,
            green: chartType === 'presense',
            red: chartType === 'absent_no_reason',
            yellow: chartType === 'absent_by_reason',
          }"
        >
          {{ type.title }}
        </li>
      </ul>
    </div>
    <div class="apex_custom">
      <span>{{ analytics[chartType] }}</span>
      <apexchart
        type="radialBar"
        height="200"
        :options="chartOptions"
        :series="[series]"
      ></apexchart>
    </div>
  </div>
</template>

<script>
const colors = {
  presense: "#2ccb6f",
  absent_no_reason: "#e96561",
  absent_by_reason: "#ffc755",
};

export default {
  props: {
    modesData: {
      type: Array,
    },
  },

  watch: {
    modesData(data) {
      this.bindData(data);
    },
  },
  methods: {
    bindData(array) {
      let presense = 0;
      let absent_no_reason = 0;
      let absent_by_reason = 0;

      if (array && array.length) {
        if (array.find((e) => e.cardholder_presense == "presense")) {
          presense = array.find(
            (e) => e.cardholder_presense == "presense"
          ).cardholder_qty;
        }

        if (array.find((e) => e.cardholder_presense == "absent_no_reason")) {
          absent_no_reason = array.find(
            (e) => e.cardholder_presense == "absent_no_reason"
          ).cardholder_qty;
        }

        if (array.find((e) => e.cardholder_presense == "absent_by_reason")) {
          absent_by_reason = array.find(
            (e) => e.cardholder_presense == "absent_by_reason"
          ).cardholder_qty;
        }
        const totalSum = +presense + +absent_no_reason + +absent_by_reason;
        this.analytics.presense = presense;
        this.analytics.absent_no_reason = absent_no_reason;
        this.analytics.absent_by_reason = absent_by_reason;
        this.analytics.presense_percent = this.calculatePercentage(
          presense,
          totalSum
        );
        this.analytics.absent_no_reason_percent = this.calculatePercentage(
          absent_no_reason,
          totalSum
        );
        this.analytics.absent_by_reason_percent = this.calculatePercentage(
          absent_by_reason,
          totalSum
        );

        this.series = this.analytics[`${this.chartType}_percent`];
      }
    },
    calculatePercentage(num1, num2) {
      if (num2 !== 0) {
        return (num1 / num2) * 100;
      } else {
        return 0;
      }
    },
    changeTab(key) {
      this.chartType = key;
      this.series = [this.analytics[`${key}_percent`]];
    },
  },
  created() {
    this.bindData(this.modesData);
  },
  data() {
    return {
      series: [0],
      chartOptions: {
        chart: {
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
              margin: 0,
              size: "60%",
              background: "none",
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: "front",
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24,
              },
            },
            dataLabels: {
              show: true,

              value: {
                formatter: function (val) {
                  return val;
                },
                color: "#111",
                fontSize: "36px",
                show: false,
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
        labels: [""],
        colors: [
          () => {
            return colors[this.chartType];
          },
        ],
      },

      chartTypes: [
        { title: "Presense", key: "presense" },
        { title: "Absent / no reason", key: "absent_no_reason" },
        { title: "Absent / by reason", key: "absent_by_reason" },
      ],
      chartType: "presense",

      analytics: {
        presense: 0,
        absent_no_reason: 0,
        absent_by_reason: 0,

        presense_percent: 0,
        absent_no_reason_percent: 0,
        absent_by_reason_percent: 0,
      },
    };
  },
};
</script>

<style>
</style>
