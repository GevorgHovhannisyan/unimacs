<template>
  <vx-card>
    <div class="guest__keys_page">
      <vs-tabs>
        <vs-tab label="Main">
          <div class="vx-row main_guest_tab">
            <div class="vx-col w-1/3 left_block mt-3">
              <div class="left_part">
                <span class="title">Basic Access Schedule</span>
                <span class="description"
                  >Access to all guest keys will be granted within a given
                  schedule</span
                >
              </div>
            </div>
            <div class="vx-col w-1/3 right_block ">
              <div class="flex flex-col">
                <span class="title">Duration</span>
                <span class="description">
                  Key will operate for this time limit. Enter up to four values,
                  in minutes, using commas to separate them.
                </span>
              </div>
            </div>
            <div class="vx-col w-1/3 right_block last">
              <div class="limit_part">
                <span class="title">Time Limit</span>
                <span class="description">Key operating time.</span>
              </div>
            </div>
          </div>
          <div class="vx-row main_guest_tab mt-1">
            <div class="vx-col w-1/3 left_block">
              <div class="schedule">
                <v-select
                  v-model="main_data.schedule_id"
                  :options="schedules"
                  class="select_padding guest_sel w-full"
                  name="status"
                  placeholder="Schedule"
                  :reduce="(source) => source.id"
                  :dir="$vs.rtl ? 'rtl' : 'ltr'"
                />
              </div>

              <div class="require_name flex items-center">
                <vs-checkbox
                  class="custom__checkbox"
                  v-model="main_data.require_name_of_guest"
                >
                  Name Required
                </vs-checkbox>
              </div>
            </div>
            <div class="vx-col w-1/3 right_block dur">
              <vs-input
                class="w-full"
                placeholder="Duration"
                v-model="main_data.time_keys"
                @input="checkNumber($event)"
              />
            </div>
            <div class="vx-col w-1/3 right_block last">
              <v-select
                v-model="main_data.day_keys"
                :options="daily_keys"
                class="select_padding guest_sel w-full"
                name="status"
                placeholder="Daily keys"
                :reduce="(source) => source.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
            </div>
          </div>
        </vs-tab>
        <!-- <vs-tab label="API Integration" disabled> </vs-tab> -->
      </vs-tabs>
      <div class="submit_btn">
        <vs-button class="view_alarm unimacs_button" @click="updateCompnay">
          Submit
        </vs-button>
      </div>
    </div>
  </vx-card>
</template>

<script>
import vSelect from "vue-select";
import moduleSchedule from "@/store/schedule/moduleSchedule.js";
import moduleCompany from "@/store/company/moduleCompany.js";

export default {
  data() {
    return {
      schedules: [],
      main_data: {},
      daily_keys: [
        { label: "No limit", id: "no_limit" },
        { label: "Up to 5 days", id: "up_to_5_days" },
        { label: "Up to 10 days", id: "up_to_10_days" },
        { label: "Up to 1 month", id: "up_to_1_month" },
      ],
      company: localStorage.user ? JSON.parse(localStorage.user).company : null,
    };
  },
  created() {
    if (!moduleSchedule.isRegistered) {
      this.$store.registerModule("schedule", moduleSchedule);
      moduleSchedule.isRegistered = true;
    }

    if (!moduleCompany.isRegistered) {
      this.$store.registerModule("company", moduleCompany);
      moduleCompany.isRegistered = true;
    }

    this.$store
      .dispatch("schedule/fetchSchedules", { type: "weekly" })
      .then((res) => {
        this.schedules = [];
        if (res.data.length) {
          res.data.forEach((schedule) => {
            this.schedules.push({
              id: schedule.id,
              label: schedule.name,
            });
          });
        }
        this.$vs.loading.close();
      });

    this.$http
      .get(`clientCompany`, {
        headers: { Authorization: localStorage.token },
      })
      .then((res) => {
        this.main_data = res.data;
      });
  },
  methods: {
    updateCompnay() {
      const payload = {
        id: this.company,
        schedule_id: this.main_data.schedule_id,
        time_keys: this.main_data.time_keys,
        require_name_of_guest: this.main_data.require_name_of_guest,
        day_keys: this.main_data.day_keys,
      };

      this.$store.dispatch("company/updateCompany", payload).then(() => {
        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Company updated",
        });
      });
    },
    checkNumber(value) {
      this.main_data.time_keys = value.replace(/[^\d,]|\.(?=.*\.)/g, "");
    },
  },
  components: {
    vSelect,
  },
};
</script>

<style lang="scss">
.guest__keys_page {
  box-shadow: 0 4px 20px 0 #00000014;

  .con-tab.vs-tabs--content {
    overflow-x: unset !important;
  }

  .main_guest_tab {
    .description {
      font-size: 12px;
    }

    .left_block {
      .left_part {
        display: flex;
        flex-direction: column;

        .title {
          font-weight: 700;
        }

        .description {
          // margin-top: 10px;
          // height: 35px;

          @media screen and (max-width: 1400px) {
            // height: 52px;
          }
        }
      }

      .schedule {
        // margin-top: 5px;
      }

      .require_name {
        margin-top: 20px;
      }
    }

    .right_block {
      display: flex;
      flex-direction: column;

      .title {
        font-weight: 700;
      }

      .description {
      }

      .limit_part {
        display: flex;
        flex-direction: column;
      }

      &.dur input {
        padding: 0.3rem 0.4rem 0.3rem 0.5rem !important;
        min-height: 38px !important;
      }
    }

    .last .description {
      @media screen and (max-width: 1400px) {
        // height: 57px;
      }
    }
  }

  .con-vs-tabs,
  .con-slot-tabs {
    overflow: visible;
  }

  .submit_btn {
    text-align: right;
  }

  .ul-tabs.vs-tabs--ul {
    box-shadow: unset;
    -webkit-box-shadow: unset;
  }
}
</style>
