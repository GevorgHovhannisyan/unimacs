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
            green: chartType === 'active',
            gray: chartType === 'no_hardware',
            yellow: chartType === 'pending',
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
  active: "#2ccb6f",
  pending: "#ffc755",
  no_hardware: "#e7ecff",
};

export default {
  props: {
    acuData: {
      type: Array,
    },
  },

  watch: {
    acuData(data) {
      this.bindData(data);
    },
  },
  methods: {
    bindData(array) {
      let active = 0;
      let pending = 0;
      let no_hardware = 0;

      if (array && array.length) {
        if (array.find((e) => e.acu_status == "active")) {
          active = array.find((e) => e.acu_status == "active").acu_qty;
        }

        if (array.find((e) => e.acu_status == "pending")) {
          pending = array.find((e) => e.acu_status == "pending").acu_qty;
        }

        if (array.find((e) => e.acu_status == "no_hardware")) {
          no_hardware = array.find(
            (e) => e.acu_status == "no_hardware"
          ).acu_qty;
        }
        const totalSum = +active + +pending + +no_hardware;

        this.analytics.active = active;
        this.analytics.pending = pending;
        this.analytics.no_hardware = no_hardware;

        this.analytics.active_percent = this.calculatePercentage(
          active,
          totalSum
        );
        this.analytics.pending_percent = this.calculatePercentage(
          pending,
          totalSum
        );
        this.analytics.no_hardware_percent = this.calculatePercentage(
          no_hardware,
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
    this.bindData(this.acuData);
  },
  data() {
    return {
      series: [75],
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
        { title: "Active", key: "active" },
        { title: "Wait to config", key: "pending" },
        { title: "Virtual device", key: "no_hardware" },
      ],
      chartType: "active",

      analytics: {
        active: 0,
        pending: 0,
        no_hardware: 0,

        active_percent: 0,
        pending_percent: 0,
        no_hardware_percent: 0,
      },
    };
  },
};
</script>

<style>
</style>
