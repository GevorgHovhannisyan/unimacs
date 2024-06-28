<template>
  <div class="parent_goup1">
    <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner edit_group_tabs1">
      <vs-tab label="Main Settings">
        <div>
          <div class="vx-row mt-3">
            <div class="vx-col md:w-1/3">
              <vs-input label="Name" class="w-full" placeholder="Name" name="name" v-model="saveObject.name"
                v-validate="'required'" />
            </div>
            <div class="vx-col md:w-2/3">
              <vs-input label="Description" class="w-full" placeholder="Description" name="description"
                v-model="saveObject.description" v-validate="'required'" />
            </div>
          </div>

          <div class="vx-row mt-3">
            <div class="vx-col">
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.default">Default</vs-checkbox>

              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.access_right_inherited"
                @change="changeToInheritRight(false)" :disabled="disableInherit">Inherited</vs-checkbox>
            </div>
          </div>

          <div class="vx-row">
            <div class="vx-col md:w-1/3">
              <label for="" class="vs-input--label">Access Right</label>

              <v-select v-model="saveObject.access_right" :options="right_options" @input="changeRightDescription"
                class="select_padding ar_select" :disabled="saveObject.access_right_inherited" name="access_right"
                placeholder="Access Right" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>

            <div class="vx-col md:w-2/3" v-if="selectedRight && saveObject.access_right">
              <vs-input label="Description" class="w-full new_inp" placeholder="Description" name="description"
                :disabled="true" v-model="selectedRight.description" v-validate="'required'" />
            </div>
          </div>

          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <Table class="ac_right_group_tbl" :items="access_rules" :headers="right_headers" />
            </div>
          </div>
        </div>
      </vs-tab>

      <!-- <vs-tab label="Relations"> </vs-tab> -->

      <vs-tab label="Limitations">
        <div>
          <div class="vx-row">
            <div class="vx-col">
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.limitation_inherited"
                @change="changeToInheritLimit('disable')" :disabled="disableInherit">Inherited</vs-checkbox>
            </div>
          </div>
          <div class="vx-row">
            <div class="vx-col">
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.limitations.enable_date" :disabled="saveObject.limitation_inherited ||
                !features ||
                !features.CardholderDeactivationByDate
                ">Enable Date Limitation</vs-checkbox>
            </div>
          </div>
          <div class="vx-row date_filter mr-5 limitation_rangepicker">
            <div class="vx-col start_date" :class="{ disable_date_time: disableCreateDate }">
              <flat-pickr :disabled="disableCreateDate" v-model="saveObject.limitations.valid_from"
                :config="configdateTimePicker" @input="validateLimitations" placeholder="Valid from" />
            </div>
            <div class="vx-col endDate" :class="{ disable_date_time: disableCreateDate }">
              <flat-pickr v-model="saveObject.limitations.valid_due" :disabled="disableCreateDate"
                :config="configdateTimePicker" @input="validateLimitations" placeholder="Valid Until" />
            </div>
          </div>
          <!-- <vs-divider />

          <vs-tabs v-model="counter_tab" class="tab-action-btn-fill-conatiner">
            <vs-tab label="Pass Counter" icon-pack="feather" icon="icon-user">
              <div class="tab-text mt-5">
                <vs-checkbox class="checkbox_block mb-5" v-model="saveObject.limitations.pass_counter_enable" :disabled="
                  saveObject.limitation_inherited ||
                  !features ||
                  !features.CardholderDeactivationByLimit
                " style="width: 190px">Enable Pass Counter</vs-checkbox>
                <span>Credentials will expire when pass count will be
                  reached.</span>

                <div class="vx-row w-full mt-3">
                  <div class="vx-col 2/3">
                    <div class="counting_block">
                      <vs-input label="Passes" class="count_passers" v-validate="'required'"
                        v-model="saveObject.limitations.pass_counter_passes" value="25" :disabled="
                          !saveObject.limitations.pass_counter_enable ||
                          saveObject.limitation_inherited ||
                          !features ||
                          !features.CardholderDeactivationByLimit
                        " @input="checkNumber($event, 'pass_counter_passes')" />
                      <vs-input label="Current status" class="count_status" value="20" disabled />
                      <a href="" class="refresh_limit">
                        <img :src="
                          require(`@/assets/images/file-icons/reload.png`)
                        " />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </vs-tab>

            <vs-tab label="First Use Counter" icon-pack="feather" icon="icon-user">
              <div class="tab-text mt-5">
                <vs-checkbox class="checkbox_block mb-5" :disabled="
                  saveObject.limitation_inherited ||
                  !features ||
                  !features.CardholderDeactivationByLimit
                " v-model="saveObject.limitations.first_use_counter_enable" style="width: 190px">Enable Pass Counter
                </vs-checkbox>
                <span>Credentials will expire a specified number of days after the
                  first use.</span>

                <div class="vx-row w-full mt-3">
                  <div class="vx-col 2/3">
                    <div class="counting_block">
                      <vs-input label="Days" :disabled="
                        !saveObject.limitations.first_use_counter_enable ||
                        saveObject.limitation_inherited ||
                        !features ||
                        !features.CardholderDeactivationByLimit
                      " v-model="saveObject.limitations.first_use_counter_days" class="count_passers"
                        v-validate="'required'" value="25" @input="checkNumber($event, 'first_use_counter_days')" />
                      <vs-input label="Current status" v-model="
                        saveObject.limitations.first_use_counter_current
                      " class="count_status" value="20" disabled />
                      <a href="" class="refresh_limit">
                        <img :src="
                          require(`@/assets/images/file-icons/reload.png`)
                        " />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </vs-tab>
            <vs-tab label="Last Use Counter" icon-pack="feather" icon="icon-user">
              <div class="tab-text mt-5">
                <vs-checkbox class="checkbox_block mb-5" :disabled="
                  saveObject.limitation_inherited ||
                  !features ||
                  !features.CardholderDeactivationByLimit
                " v-model="saveObject.limitations.last_use_counter_enable" style="width: 190px">Enable Pass Counter
                </vs-checkbox>
                <span>Credentials will expire when it has not been used for a
                  specified number of days.</span>
                <div class="vx-row w-full mt-3">
                  <div class="vx-col 2/3">
                    <div class="counting_block">
                      <vs-input label="Days" v-model="saveObject.limitations.last_use_counter_days"
                        class="count_passers" v-validate="'required'" value="25" :disabled="
                          !saveObject.limitations.last_use_counter_enable ||
                          saveObject.limitation_inherited ||
                          !features ||
                          !features.CardholderDeactivationByLimit
                        " @input="checkNumber($event, 'last_use_counter_days')" />
                      <vs-input v-model="
                        saveObject.limitations.last_use_counter_current
                      " label="Current status" class="count_status" value="20" disabled />
                      <a href="">
                        <img :src="
                          require(`@/assets/images/file-icons/reload.png`)
                        " />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </vs-tab>
          </vs-tabs> -->
        </div>
      </vs-tab>
      <!-- <vs-tab label="Anti-passback">
        <div>
          <div class="vx-row">
            <div class="vx-col w-full">
              <vs-checkbox class="mb-4 mt-5" @change="changeToInheritPass(false)" :disabled="disableInherit"
                v-model="saveObject.antipass_back_inherited">Inherited</vs-checkbox>
            </div>

            <div class="vx-col">
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.enable_antipass_back"
                :disabled="saveObject.antipass_back_inherited">Enable Anti-passback</vs-checkbox>
            </div>
          </div>
        </div>
      </vs-tab>
      <vs-tab label="Time Attendance">
        <div>
          <div class="vx-row">
            <div class="vx-col">
              <vs-checkbox class="mb-4 mt-5" :disabled="disableInherit" v-model="saveObject.time_attendance_inherited"
                @change="changeToInheritTime(false)">Inherited</vs-checkbox>
            </div>
          </div>

          <div class="vx-row">
            <div class="vx-col md:w-1/3">
              <label for="" class="vs-input--label">Schedule name</label>

              <v-select v-model="saveObject.time_attendance" :options="schedulesOptions" @input="changeSchedule"
                :disabled="saveObject.time_attendance_inherited" class="select_padding" name="schedule"
                placeholder="Schedule name" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>

            <div class="vx-col md:w-2/3" v-if="selectedRight">
              <vs-input label="Description" class="w-full new_inp" placeholder="Description" name="description"
                :disabled="true" v-model="selectedRight.description" v-validate="'required'" />
            </div>
          </div>
          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <TimelineTable v-if="timeframes && timeframes.length" :items="timeframes" />
            </div>
          </div>
        </div>
      </vs-tab> -->
    </vs-tabs>
    <div class="vx-col w-full edit_goup_button" style="text-align: end">
      <vs-button class="create_new unimacs_button" @click.stop="createGroupInfo" :disabled="!isFormValid">
        Submit
      </vs-button>
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import timeLine from "../schedule/TimeLine";
import vSelect from "vue-select";
import Table from "../../components/custom/table/Table";
import TimelineTable from "../../components/custom/table/TimeLineTable";
import { generateTimeframes } from "../../functions/scheduleData";
export default {
  props: {
    propsData: {
      type: Object,
    },
    features: {
      type: Object,
    },
    createData: {
      type: Object,
    },
  },
  components: {
    flatPickr,
    timeLine,
    vSelect,
    Table,
    TimelineTable,
  },
  watch: {
    propsData(data) {
      this.fetchGroup();
    },
  },
  data() {
    return {
      editData: {},
      activeTab: 0,
      counter_tab: 0,
      limitation: {},
      disableInherit: false,
      disableAntiPassInherit: false,
      saveObject: {
        name: null,
        description: null,
        limitation_inherited: false,
        limitations: {},
        antipass_back_inherited: false,
        antipass_backs: {},
        access_right_inherited: false,
        time_attendance_inherited: false,
      },

      configdateTimePicker: {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
      },
      right_headers: [
        {
          name: "#",
          key: "count",
        },
        {
          name: "Entry Name",
          key: "entry",
        },
        {
          name: "Schedule",
          key: "schedule",
        },
        {
          name: "Schedule Type",
          key: "schedule_type",
        },
      ],
      right_options: [],
      selectedRight: null,
      schedulesOptions: [],
      timeframes: [],
      weekDays: this.$store.state.weekDays,
      editSchedule: {},
      timeframes: [],
      access_rules: [],
      saveInheritedData: {},
      saveCardInfo: null,
    };
  },
  computed: {
    rights() {
      return this.$store.state.right.rights;
    },
    treeData() {
      return this.$parent.$parent.getTreeData();
    },
    isFormValid() {
      const group = this.saveObject;

      return (
        group.name &&
        (group.access_right || group.access_right_inherited) &&
        ((group.limitations.enable_date &&
          group.limitations.valid_due &&
          group.limitations.valid_from) ||
          !group.limitations.enable_date)

        //   &&((group.limitations.pass_counter_enable &&
        //   group.limitations.pass_counter_passes) ||
        //   !group.limitations.pass_counter_enable) &&
        // ((group.limitations.first_use_counter_enable &&
        //   group.limitations.first_use_counter_days) ||
        //   !group.limitations.first_use_counter_enable) &&
        // ((group.limitations.last_use_counter_enable &&
        //   group.limitations.last_use_counter_days) ||
        //   !group.limitations.last_use_counter_enable)
      );
    },
    disableCreateDate() {
      return (
        !this.saveObject.limitations.enable_date ||
        this.saveObject.limitation_inherited ||
        !this.features ||
        !this.features.CardholderDeactivationByDate
      );
    },
  },
  methods: {
    createGroupInfo() {
      this.$vs.loading({
        type: "corners",
      });

      let copyDate = JSON.parse(JSON.stringify(this.saveObject));

      if (copyDate.limitations.valid_due === "") {
        copyDate.limitations.valid_due = null;
      } else {
        copyDate.limitations.valid_due = this.$moment(
          copyDate.limitations.valid_due
        ).utcOffset(0).format(`YYYY-MM-DD HH:mm`)
      }

      if (copyDate.limitations.valid_from === "") {
        copyDate.limitations.valid_from = null;
      } else {
        copyDate.limitations.valid_from = this.$moment(
          copyDate.limitations.valid_from
        ).utcOffset(0).format(`YYYY-MM-DD HH:mm`)
      }
      const filteredObj = this.delKeys(copyDate)

      this.$store
        .dispatch("cardGroup/createCardGroup", filteredObj)
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: `Cardholders group created`,
          });
          this.$parent.$parent.updateTreeId(res.data.id);
          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    checkNumber(value, field) {
      return (this.saveObject.limitations[field] = +value.replace(
        /[^+0-9]/g,
        ""
      ));
    },
    changeSchedule() {
      if (this.saveObject.time_attendance) {
        this.$store
          .dispatch("schedule/fetchSchedule", this.saveObject.time_attendance)
          .then((res) => {
            this.editSchedule = res.data;
            this.timeframes = [];
            const getSchedule = generateTimeframes(res);
            this.timeframes = getSchedule;
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      } else {
        this.timeframes = [];
      }
    },
    changeRightDescription() {
      if (this.saveObject.access_right) {
        this.$store
          .dispatch("right/fetchRight", this.saveObject.access_right)
          .then((res) => {
            let rule_arr = [];
            let access_rules = res.data.access_rules;
            this.selectedRight = res.data;

            if (access_rules.length) {
              access_rules.forEach((rule, index) => {
                let ind = index + 1;
                rule_arr.push({
                  id: rule.id,
                  count: ind,
                  entry: rule.access_point ? rule.access_points.name : "",
                  schedule: rule.schedule ? rule.schedules.name : "",
                  schedule_type: rule.schedule ? rule.schedules.type : "",
                });
              });
            }

            this.access_rules = rule_arr;
          });
      } else {
        const findDefault = this.rights.find((right) => right.default);
        this.saveObject.access_right = findDefault.id;

        this.access_rules = [];
        this.changeRightDescription();
      }
    },
    fetchGroup() {
      this.initValues();
      let find;
      if (this.treeData.length) {
        // find = this.treeData.find((t) => t.id == this.propsData.id);
        if (this.propsData.pid) {
          this.disableInherit = false;
        } else {
          this.disableInherit = true;
        }
      }
      this.saveObject.name = this.propsData.name;
      this.saveObject.description = this.propsData.description;
      this.saveObject.default = this.propsData.default;
      this.saveObject.parent_id = this.propsData.pid
        ? +this.propsData.pid
        : null;
      if (this.propsData.pid) {
        let id;
        if (Number.isInteger(this.propsData.pid)) {
          id = this.propsData.pid;
        } else if (this.propsData.pid.includes("id_")) {
          id = this.propsData.pid.split("_")[1];
        } else {
          id = this.propsData.pid;
        }

        this.$store.dispatch("cardGroup/fetchCardGroup", +id).then((res) => {
          this.saveCardInfo = res.data;
        });
      }
      if ("inherited" in this.createData) {
        let id;
        if (Number.isInteger(this.propsData.pid)) {
          id = this.propsData.pid;
        } else if (this.propsData.pid.includes("id_")) {
          id = this.propsData.pid.split("_")[1];
        } else {
          id = this.propsData.pid;
        }

        this.$store.dispatch("cardGroup/fetchCardGroup", +id).then((res) => {
          this.saveCardInfo = res.data;

          if (this.createData.inherited) {
            this.changeToInheritLimit(true);
            this.changeToInheritPass(true);
            this.changeToInheritRight(true);
            this.changeToInheritTime(true);
            this.createGroupInfo();
          } else {
            this.changeToInheritLimit("disable");
            this.changeToInheritPass("disable");
            this.changeToInheritRight("disable");
            this.changeToInheritTime("disable");
          }
        });
      }
    },
    initValues() {
      this.saveObject = {
        name: null,
        description: null,
        limitation_inherited: false,
        limitations: {
          enable_date: true,
          valid_due: null,
          valid_from: null,
        },
        antipass_back_inherited: false,
        antipass_backs: {
          type: "disable",
        },
        access_right: null,
        access_right_inherited: false,
        time_attendance_inherited: false,
      };
    },
    validateLimitations() {
      if (
        new Date(this.saveObject.limitations.valid_from) >
        new Date(this.saveObject.limitations.valid_due) &&
        this.saveObject.limitations.valid_due &&
        this.saveObject.limitations.valid_from
      ) {
        this.saveObject.limitations.valid_due =
          this.saveObject.limitations.valid_from;
      }
    },
    changeToInheritLimit(custom) {
      if (this.saveObject.limitation_inherited || custom) {
        this.saveObject.limitations = JSON.parse(
          JSON.stringify(this.saveCardInfo)
        ).limitations;
        this.saveInheritedData.limitations = JSON.parse(
          JSON.stringify(this.saveCardInfo)
        ).limitations;
        if (custom && custom !== "disable") {
          this.saveObject.limitation_inherited = true;
        }
        // });
      } else {
        if ("inherited" in this.createData) {
          this.saveObject.limitations = JSON.parse(
            JSON.stringify(this.saveInheritedData)
          ).limitations;
        } else {
          this.saveObject.limitations = {};
        }
      }
    },
    changeToInheritPass(custom) {
      if (this.saveObject.antipass_back_inherited || custom) {
        this.saveObject.antipass_backs = JSON.parse(
          JSON.stringify(this.saveCardInfo)
        ).antipass_backs;

        this.saveInheritedData.antipass_backs = JSON.parse(
          JSON.stringify(this.saveCardInfo)
        ).antipass_backs;

        if (custom && custom !== "disable") {
          this.saveObject.antipass_back_inherited = true;
        } else {
        }
      } else {
        if ("inherited" in this.createData) {
          this.saveObject.antipass_backs = JSON.parse(
            JSON.stringify(this.saveInheritedData)
          ).antipass_backs;
        } else {
          this.saveObject.antipass_backs = {};
        }
      }
    },
    changeToInheritRight(custom) {
      if (this.saveObject.access_right_inherited || custom) {
        this.saveObject.access_right = JSON.parse(
          JSON.stringify(this.saveCardInfo)
        ).access_right;
        this.saveInheritedData.access_right = JSON.parse(
          JSON.stringify(this.saveCardInfo)
        ).access_right;
        if (custom && custom !== "disable") {
          this.saveObject.access_right_inherited = true;
        }
        this.changeRightDescription();
      } else {
        // if ("inherited" in this.createData) {
        //   this.saveObject.access_right = JSON.parse(
        //     JSON.stringify(this.saveInheritedData)
        //   ).access_right;
        // } else {
        //   this.saveObject.access_right = null;
        // }
        this.saveObject.access_right = null;

        this.changeRightDescription();
      }
    },
    changeToInheritTime(custom) {
      if (this.saveObject.time_attendance_inherited || custom) {
        this.saveObject.time_attendance = JSON.parse(
          JSON.stringify(this.saveCardInfo)
        ).time_attendance;
        this.saveInheritedData.time_attendance = JSON.parse(
          JSON.stringify(this.saveCardInfo)
        ).time_attendance;

        if (custom && custom !== "disable") {
          this.saveObject.time_attendance_inherited = true;
        }

        this.changeSchedule();
      } else {
        if ("inherited" in this.createData) {
          this.saveObject.time_attendance = JSON.parse(
            JSON.stringify(this.saveInheritedData.time_attendance)
          );
        } else {
          this.saveObject.time_attendance = null;
        }
        // this.saveObject.time_attendance = null;
        this.changeSchedule();
      }
    },
    delKeys(cloneObj) {
      const obj = JSON.parse(JSON.stringify(cloneObj))

      if ('time_attendance' in obj) delete obj['time_attendance']
      if ('time_attendance_inherited' in obj) delete obj['time_attendance_inherited']
      if ('antipass_back_inherited' in obj) delete obj['antipass_back_inherited']

      if (obj.limitations) {
        if ('first_use_counter_current' in obj.limitations) delete obj.limitations['first_use_counter_current']
        if ('first_use_counter_days' in obj.limitations) delete obj.limitations['first_use_counter_days']
        if ('first_use_counter_enable' in obj.limitations) delete obj.limitations['first_use_counter_enable']
        if ('last_use_counter_current' in obj.limitations) delete obj.limitations['last_use_counter_current']
        if ('last_use_counter_days' in obj.limitations) delete obj.limitations['last_use_counter_days']
        if ('last_use_counter_enable' in obj.limitations) delete obj.limitations['last_use_counter_enable']
        if ('pass_counter_current' in obj.limitations) delete obj.limitations['pass_counter_current']
        if ('pass_counter_enable' in obj.limitations) delete obj.limitations['pass_counter_enable']
        if ('pass_counter_passes' in obj.limitations) delete obj.limitations['pass_counter_passes']
      }
      return obj
    }
  },
  created() {
    if (this.features && Object.keys(this.features).length) {
      this.group_features = this.features;
    }
    this.fetchGroup();
    this.right_options = [];
    this.$store.dispatch("right/fetchRights").then((res) => {
      if (res.data.length) {
        res.data.forEach((right) => {
          this.right_options.push({
            id: right.id,
            label: right.name,
          });
        });
      }
    });

    this.$store.dispatch("schedule/fetchSchedules").then((res) => {
      this.schedulesOptions = [];
      if (res.data.length) {
        res.data.forEach((schedule) => {
          this.schedulesOptions.push({
            id: schedule.id,
            label: schedule.name,
          });
        });
      }
    });
  },
};
</script>


<style lang="scss">
.edit_group_tabs1 {
  .con-slot-tabs {
    overflow: unset !important;
  }
}
</style>

<style lang="scss" scoped>
.edit_group_tabs1 {
  height: 100%;
  overflow: unset;
  padding-top: 25px;

  .con-slot-tabs {
    overflow: unset !important;
  }
}

.count_status {
  margin-left: 20px;
}

.refresh_limit {
  margin-left: 20px;
  margin-top: 20px;
}

.counting_block {
  display: flex;
  justify-content: center;
  align-items: center;
}

.parent_goup1 {
  height: 100%;

  .counting_block {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .align-items-end {
    align-items: flex-end;
  }

  .edit_goup_button {
    position: relative;
    bottom: 40px;
  }
}

.ac_right_group_tbl {
  .vs-con-tbody.vs-table--tbody {
    max-height: 350px;
  }
}
</style>
