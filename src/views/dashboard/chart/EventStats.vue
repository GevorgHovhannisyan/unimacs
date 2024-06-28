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
            green: chartType === 'users',
            red: chartType === 'alarms',
            yellow: chartType === 'systems',
            blue: chartType === 'cardholders',
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
  alarms: "#e96561",
  systems: "#ffc755",
  cardholders: "#009dc1",
  users: "#2bca70",
};
export default {
  props: {
    eventsData: {
      type: Array,
    },
  },
  watch: {
    eventsData() {
      this.correctData(this.eventsData);
    },
  },
  methods: {
    correctData(array) {
      let cardholders = 0;
      let users = 0;
      let systems = 0;
      let alarms = 0;
      if (array && array.length) {
        array.forEach((event) => {
          if (event.event_type == "CARDHOLDER") {
            cardholders = event.event_qty;
          } else if (event.event_type == "CARDHOLDER-ALARM") {
            alarms = event.event_qty;
          } else if (event.event_type == "USER") {
            users = event.event_qty;
          } else if (event.event_type == "SYSTEM") {
            systems = event.event_qty;
          }
        });
      }
      const totalSum = +cardholders + +users + +systems + +alarms;

      this.analytics.cardholders = cardholders;
      this.analytics.users = users;
      this.analytics.systems = systems;
      this.analytics.alarms = alarms;
      this.analytics.cardholders_percent = this.calculatePercentage(
        cardholders,
        totalSum
      );
      this.analytics.users_percent = this.calculatePercentage(users, totalSum);
      this.analytics.systems_percent = this.calculatePercentage(
        systems,
        totalSum
      );
      this.analytics.alarms_percent = this.calculatePercentage(
        alarms,
        totalSum
      );
      this.series = this.analytics[`${this.chartType}_percent`];
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
    this.correctData(this.eventsData);
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
        // fill: {
        //   type: "gradient",
        //   gradient: {
        //     shade: "dark",
        //     type: "horizontal",
        //     gradientToColors: ["#ABE5A1"],
        //     stops: [0, 100],
        //   },
        // },
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
        { title: "Alarm", key: "alarms" },
        { title: "System", key: "systems" },
        { title: "Cardholders", key: "cardholders" },
        { title: "Users", key: "users" },
      ],
      chartType: "alarms",

      analytics: {
        cardholders: 0,
        users: 0,
        systems: 0,
        alarms: 0,

        cardholders_percent: 0,
        users_percent: 0,
        systems_percent: 0,
        alarms_percent: 0,
      },
    };
  },
};
</script>

<style>
</style>
