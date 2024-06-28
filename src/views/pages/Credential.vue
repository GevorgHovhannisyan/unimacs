<template>
  <div class="custom_containers">
    <vx-card title="Access Points" class="cr_vx_card">
      <vs-icon class="info_icon" @click="openInfo" icon-pack="material-icons" icon="info" />

      <div class="vx-row aaa">
        <div class="vx-col w-1/2">
          <div class="point_block">
            <div class="inner_point" v-for="(point, index) in access_points" :key="index">
              <div class="ac_save_block" :class="{
                active_bl: point.acus.status == 'active',
                inactive_bl: point.acus.status != 'active',
              }" @click="
  point.acus.status == 'active' ? checkPoint(point) : false
  ">
                <h4>{{ point.name }}</h4>
                <span>{{ point.acus.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="vx-col w-1/2 asd" v-if="show_info_block">
          <h3>Limitations</h3>

          <div class="vx-row date_filter mr-5 limitation_rangepicker">
            <div class="vx-col start_date disable_date_time">
              <flat-pickr class="disable_mob" :config="configdateTimePicker" v-model="data_info.limitations.valid_from"
                placeholder="Valid from" disabled />
            </div>
            <div class="vx-col endDate disable_date_time">
              <flat-pickr class="disable_mob" :config="configdateTimePicker" v-model="data_info.limitations.valid_due"
                placeholder="Due" disabled />
            </div>
          </div>

          <div class="info_form">
            <p>Pass counter</p>

            <span>Expires when pass count will be reached </span>
          </div>

          <div class="vx-row">
            <div class="vx-col ddd">
              <vs-input class="w-full mt-4" label="Passes" name="serial_number" disabled
                v-model="data_info.pass_counter_passes" />
            </div>

            <div class="vx-col ddd">
              <vs-input class="w-full mt-4" label="Status" name="serial_number"
                v-model="data_info.first_use_counter_current" disabled />
            </div>
          </div>

          <vs-divider />

          <vs-tabs>
            <vs-tab v-for="(point, index) in access_points" :key="index" :label="point.name">
              <div>
                <div class="vx-row time_tbl">
                  <div class="vx-col w-full dsa">
                    <div>
                      <TimelineTable class="mt-3" :items="point.timeframes" />
                    </div>
                  </div>
                </div>
              </div>
            </vs-tab>
          </vs-tabs>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import TimelineTable from "@/components/custom/table/TimeLineTable";
import { generateTimeframes } from "@/functions/genSchedule";

export default {
  data() {
    return {
      timeframes: [],

      data_info: {},
      access_points: [],
      show_info_block: false,
      configdateTimePicker: {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
      },
    };
  },
  created() {
    if (localStorage.getItem("credential_code")) {
      this.loginWithAuth();
    } else {
      this.login();
    }
  },
  methods: {
    openInfo() {
      this.show_info_block = !this.show_info_block;
    },
    checkPoint(point) {
      this.$http
        .post(
          `/credential/accessPoint/open/${this.$route.params.code}`,
          { access_point: point.id },
          { headers: { Authorization: localStorage.credential_code } }
        )
        .then((res) => {
          if (res.data.message) {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: res.data.message,
            });
          }

          //   localStorage.setItem("credential_code", res.data.token);

          //   this.fetchAccessPoints();
        })
        .catch((error) => {
          if (error.response.data && error.response.data.message) {
            vm.$vs.notify({
              time: 7000,
              color: "danger",
              title: error.response.data.message,
            });
          }
        });
      // /credential/accessPoint/open/{code}
    },
    fetchAccessPoints() {
      this.$http
        .get(`/credential/accessPoints/${this.$route.params.code}`, {
          headers: { Authorization: localStorage.credential_code },
        })
        .then((res) => {
          this.data_info = res.data;
          const access_rules = res.data.access_rules;

          if (access_rules.length) {
            access_rules.forEach((rule) => {
              this.access_points.push({
                ...rule.access_points,
                timeframes: generateTimeframes(rule.schedules),
              });
            });
          }
        })
        .catch((error) => {
          if (error.response.data && error.response.data.message) {
            vm.$vs.notify({
              time: 7000,
              color: "danger",
              title: error.response.data.message,
            });
          }
        });
    },
    login() {
      this.$http
        .post(`/credential/login/${this.$route.params.code}`)
        .then((res) => {
          localStorage.setItem("credential_code", res.data.token);

          this.fetchAccessPoints();
        })
        .catch((error) => {
          if (error.response.data && error.response.data.message) {
            vm.$vs.notify({
              time: 7000,
              color: "danger",
              title: error.response.data.message,
            });
          }
        });
    },
    loginWithAuth() {
      this.$http
        .post(
          `/credential/login/${this.$route.params.code}`,
          {},
          { headers: { Authorization: localStorage.credential_code } }
        )
        .then((res) => {
          localStorage.setItem("credential_code", res.data.token);

          this.fetchAccessPoints();
        })
        .catch((error) => {
          if (error.response.data && error.response.data.message) {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: error.response.data.message,
            });
            if ((error.response.data.message = "Wrong token and code!")) {
              this.$router.push("/error-404");
            }
          }
        });
    },
  },
  components: {
    flatPickr,
    TimelineTable,
  },
};
</script>

<style lang="scss">
#app {
  height: 100%;
}

.layout--full-page {
  height: 100%;
}

.start_date {
  margin-bottom: 15px;
}

.custom_containers {
  max-width: 1440px;
  margin: 0 auto;
  margin: 55px auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.point_block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 -15px;
  flex-wrap: wrap;
}

.dsa {
  padding: 0 !important;
}

.asd {
  >h3 {
    margin-bottom: 15px;
  }
}

.info_form {
  margin: 15px 0;
  display: flex;
  align-items: center;

  span {
    padding-left: 15px;
  }
}

.notranslate {
  position: absolute;
  top: -22px;
  left: 170px;
  font-size: 23px;
}

.inner_point {
  cursor: pointer;
  margin-bottom: 20px;
  //background-color: rgb(170, 170, 170);
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0 15px;
}

.ac_save_block {
  padding: 20px;

  >h4 {
    color: white;
    font-size: 16px;
    line-height: 1.33em;
    margin-bottom: 15px;
    text-transform: uppercase;
  }

  span {
    color: white;
    font-size: 14px;
    line-height: 1.33em;
  }
}

.start_date,
.endDate {
  width: 50%;

  input {
    width: 100%;
  }
}

.ddd {
  width: 50%;
}

@media (max-width: 1100px) {
  .inner_point {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .info_form {
    flex-direction: column;
    justify-content: end;
    align-items: end;
    margin: 15px 0 0;

    span {
      padding-left: 0;
      margin-top: 5px;
    }
  }
}

@media (max-width: 991px) {
  .cr_vx_card {
    .vx-card__header {
      margin-top: 40px;
    }
  }

  .start_date,
  .endDate {
    width: 100%;

    input {
      width: 100%;
    }
  }

  .ddd {
    width: 100%;
  }

  .aaa {
    flex-direction: column;

    >.vx-col {
      width: 100% !important;
    }
  }

  .inner_point {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .info_form {
    flex-direction: column;
    justify-content: end;
    align-items: end;
    margin: 15px 0 0;

    span {
      padding-left: 0;
      word-break: break-all;
      margin-top: 5px;
    }
  }
}

.active_bl {
  background-color: green;
  border-radius: 4px;
}

.inactive_bl {
  background-color: #00000085;
  border-radius: 4px;
}

.info_icon {
  cursor: pointer;
}

.time_tbl .con-tablex.vs-table--content {
  height: 280px;
}

.flatpickr-calendar.hasTime.animate {
  display: none;
}

.disable_mob {
  pointer-events: none !important;
}
</style>
