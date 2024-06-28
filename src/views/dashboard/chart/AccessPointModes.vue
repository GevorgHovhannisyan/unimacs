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
            green: chartType === 'unlocked',
            red: chartType === 'locked',
            blue: chartType === 'credential',
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
  unlocked: "#2bca70",
  locked: "#e96561",
  credential: "#009dc1",
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
      let credential = 0;
      let locked = 0;
      let unlocked = 0;

      if (array && array.length) {
        if (array.find((e) => e.access_point_mode == "credential")) {
          credential = array.find(
            (e) => e.access_point_mode == "credential"
          ).acp_qty;
        }

        if (array.find((e) => e.access_point_mode == "locked")) {
          locked = array.find((e) => e.access_point_mode == "locked").acp_qty;
        }

        if (array.find((e) => e.access_point_mode == "unlocked")) {
          unlocked = array.find(
            (e) => e.access_point_mode == "unlocked"
          ).acp_qty;
        }
        const totalSum = +credential + +locked + +unlocked;
        this.analytics.credential = credential;
        this.analytics.locked = locked;
        this.analytics.unlocked = unlocked;

        this.analytics.credential_percent = this.calculatePercentage(
          credential,
          totalSum
        );
        this.analytics.locked_percent = this.calculatePercentage(
          locked,
          totalSum
        );
        this.analytics.unlocked_percent = this.calculatePercentage(
          unlocked,
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
        { title: "Credential", key: "credential" },
        { title: "Locked", key: "locked" },
        { title: "Unocked", key: "unlocked" },
      ],
      chartType: "credential",

      analytics: {
        credential: 0,
        locked: 0,
        unlocked: 0,

        credential_percent: 0,
        locked_percent: 0,
        unlocked_percent: 0,
      },
    };
  },
};
</script>

<style>
</style>
