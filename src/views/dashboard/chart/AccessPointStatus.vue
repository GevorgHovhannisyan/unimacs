<template>
  <div class="access_point_status_chart flex">
    <div class="options_block">
      <ul class="options_list">
        <li
          @click="changeTab(type.key)"
          v-for="(type, index) in chartTypes"
          :key="index"
          :class="{
            selected: chartType === type.key,
            green: chartType === 'online',
            red: chartType === 'offline',
            gray: chartType === 'no_hardware',
            blue: chartType === 'active',
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
  online: "#2ccb6f",
  offline: "#e96561",
  active: "#009dc1",
  no_hardware: "#e7ecff",
};
export default {
  props: {
    access_pointData: {
      type: Array,
    },
    statuses: {
      type: Array,
    },
  },

  watch: {
    async access_pointData(data) {
      await this.bindData(data);
    },
    async statuses(data) {
      await this.bindStatuses(data);
    },
  },
  methods: {
    bindData(array) {
      return new Promise((resolve, reject) => {
        let active = 0;
        let no_hardware = 0;

        if (array && array.length) {
          if (array.find((e) => e.acu_status == "active")) {
            active = array.find((e) => e.acu_status == "active").acp_qty;
          }

          if (array.find((e) => e.acu_status == "no_hardware")) {
            no_hardware = array.find(
              (e) => e.acu_status == "no_hardware"
            ).acp_qty;
          }

          this.analytics.active = +active;
          this.analytics.no_hardware = +no_hardware;
        }

        resolve(this.analytics);
      });
    },
    bindStatuses(array) {
      return new Promise((resolve, reject) => {
        let online = 0;
        let offline = 0;

        if (array && array.length) {
          array.forEach((status) => {
            if (status.acus.cloud_status) {
              if (status.acus.cloud_status == "offline") {
                offline++;
              } else if (status.acus.cloud_status == "online") {
                online++;
              }
            }
          });
        }

        this.analytics.online = online;
        this.analytics.offline = offline;
        resolve(this.analytics);
      });
    },
    calcData() {
      const totalSum =
        // +this.analytics.active +
        +this.analytics.no_hardware +
        +this.analytics.online +
        +this.analytics.offline;


      this.analytics.active_percent = this.calculatePercentage(
        this.analytics.active,
        totalSum
      );

      this.analytics.no_hardware_percent = this.calculatePercentage(
        this.analytics.no_hardware,
        totalSum
      );
      this.analytics.online_percent = this.calculatePercentage(
        this.analytics.online,
        totalSum
      );
      this.analytics.offline_percent = this.calculatePercentage(
        this.analytics.offline,
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
  async created() {
    await this.bindData(this.access_pointData).then(() => {
      setTimeout(() => {
        this.bindStatuses(this.statuses).then(() => {
          setTimeout(() => {
            this.calcData();
          }, 500);
        });
      }, 200);
    });
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
        { title: "Online", key: "online" },
        { title: "Offline", key: "offline" },
        { title: "Virtual", key: "no_hardware" },
        { title: "Total", key: "active" },
      ],
      chartType: "online",

      analytics: {
        active: 0,
        no_hardware: 0,
        online: 0,
        offline: 0,

        active_percent: 0,
        no_hardware_percent: 0,
        online_percent: 0,
        offline_percent: 0,
      },
    };
  },
};
</script>

<style></style>
