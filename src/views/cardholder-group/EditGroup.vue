<template>
  <div class="parent_goup">
    <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner edit_group_tabs">
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

          <div class="vx-row">
            <div class="vx-col">
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.default">Default</vs-checkbox>

              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.access_right_inherited" @change="changeToInheritRight"
                :disabled="disableInherit">Inherited</vs-checkbox>
            </div>
          </div>

          <div class="vx-row">
            <div class="vx-col md:w-1/3">
              <label for="" class="vs-input--label">Access Right</label>
              <v-select v-model="saveObject.access_right" :options="right_options" class="select_padding"
                @input="changeRightDescription" name="access_right" placeholder="Access Right" :disabled="disabledRight"
                :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>

            <div class="vx-col md:w-2/3" v-if="selectedRight">
              <vs-input label="Description" class="w-full new_inp" placeholder="Description" name="description"
                :disabled="true" v-model="selectedRight.description" v-validate="'required'" />
            </div>
          </div>
          <!-- (!features || !features.CardholderGroupAccessRight) -->

          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <Table class="ac_right_group_tbl" :items="access_rules" :headers="right_headers" />
            </div>
          </div>
        </div>
      </vs-tab>

      <vs-tab label="Relations">
        <Table class="mt-4 relation_table_group" :items="relations" :headers="relation_headers" :actions="false" />
      </vs-tab>

      <vs-tab label="Limitations">
        <div>
          <div class="vx-row">
            <div class="vx-col">
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.limitation_inherited" @change="changeToInheritLimit"
                :disabled="disableInherit">Inherited</vs-checkbox>
            </div>
          </div>
          <div class="vx-row">
            <div class="vx-col">
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.limitations.enable_date" :disabled="
                saveObject.limitation_inherited ||
                !features ||
                !features.CardholderDeactivationByDate
              ">Enable Date Limitation</vs-checkbox>
            </div>
          </div>
          <div class="vx-row date_filter mr-5 limitation_rangepicker">
            <div :class="{ disable_date_time: disabledTimeDate }" class="vx-col start_date">
              <flat-pickr :disabled="disabledTimeDate" v-model="saveObject.limitations.valid_from"
                :config="configdateTimePicker" @input="validateLimitations" placeholder="Valid from" />
            </div>
            <div :class="{ disable_date_time: disabledTimeDate }" class="vx-col endDate">
              <flat-pickr v-model="saveObject.limitations.valid_due" :disabled="disabledTimeDate"
                :config="configdateTimePicker" @input="validateLimitations" placeholder="Valid Until" />
            </div>
          </div>
          <!-- <vs-divider /> -->

          <!-- <vs-tabs v-model="counter_tab" class="tab-action-btn-fill-conatiner">
            <vs-tab label="Pass Counter" icon-pack="feather" icon="icon-user">
              <div class="tab-text mt-5">
                <vs-checkbox class="checkbox_block mb-5" v-model="saveObject.limitations.pass_counter_enable" :disabled="
                  saveObject.limitation_inherited ||
                  !features ||
                  !features.CardholderDeactivationByLimit
                " style="width: 190px">Enable Pass Counter</vs-checkbox>
                <span class="">Credentials will expire when pass count will be
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
                <span class="">Credentials will expire a specified number of days after the
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
          </vs-tabs> -->
        </div>
      </vs-tab>
      <!-- <vs-tab label="Anti-passback">
        <div>
          <div class="vx-row">
            <div class="vx-col w-full">
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.antipass_back_inherited" @change="changeToInheritPass"
                :disabled="disableInherit">Inherited</vs-checkbox>
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
              <vs-checkbox class="mb-4 mt-5" v-model="saveObject.time_attendance_inherited"
                @change="changeToInheritTime" :disabled="disableInherit">Inherited</vs-checkbox>
            </div>
          </div>

          <div class="vx-row">
            <div class="vx-col md:w-1/3">
              <label for="" class="vs-input--label">Schedule name</label>
              <v-select v-model="saveObject.time_attendance" :options="schedulesOptions" @input="changeSchedule"
                :disabled="saveObject.time_attendance_inherited" class="select_padding" name="schedule"
                placeholder="Schedule name" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
            <div class="vx-col md:w-2/3" v-if="saveObject.time_attendances">
              <vs-input label="Description" class="w-full new_inp" placeholder="Description" name="description"
                :disabled="true" v-model="saveObject.time_attendances.description" v-validate="'required'" />
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
      <vs-button class="create_new" color="success" @click.stop="updateGroupInfo" :disabled="!isFormValid">
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
      this.fetchEditGroup();
    },
  },
  data() {
    return {
      editData: {},
      activeTab: 0,
      counter_tab: 0,
      limitation: {},
      // disableInherit: false,
      saveObject: {
        limitation_inherited: false,
        limitations: {},
        antipass_back_inherited: false,
        antipass_backs: {},
        access_right_inherited: false,
        time_attendance_inherited: false,
      },
      right_options: [],

      configdateTimePicker: {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
      },

      antipass_back_description: "",
      time_types: [
        {
          label: "Minutes",
          id: "minutes",
        },
        {
          label: "Seconds",
          id: "seconds",
        },
      ],
      selectedRight: null,
      schedulesOptions: [],
      timeframes: [],
      weekDays: this.$store.state.weekDays,
      editSchedule: {},
      timeframes: [],
      access_rules: [],
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
      relations: [],
      relation_headers: [
        {
          name: "Full Name",
          key: "name",
        },
        {
          name: "Company",
          key: "company",
        },
      ],
    };
  },
  computed: {
    disabledRight() {
      return this.saveObject.access_right_inherited;
    },
    rights() {
      return this.$store.state.right.rights;
    },
    antipass_types() {
      return this.$store.state.antipass_types;
    },
    treeData() {
      return this.$parent.$parent.getTreeData();
    },
    features() {
      return localStorage.getItem("features") &&
        JSON.parse(localStorage.features).Cardholder
        ? JSON.parse(localStorage.features).Cardholder
        : null;
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
        //   &&
        // ((group.limitations.pass_counter_enable &&
        //   group.limitations.pass_counter_passes) ||
        //   !group.limitations.pass_counter_enable) &&
        // ((group.limitations.first_use_counter_enable &&
        //   group.limitations.first_use_counter_days) ||
        //   !group.limitations.first_use_counter_enable) &&
        // ((group.limitations.last_use_counter_enable &&
        //   group.limitations.last_use_counter_days) ||
        //   !group.limitations.last_use_counter_enable)

        // &&
        // ((group.limitations &&
        //   group.limitations.enable_date &&
        //   group.limitations.valid_due &&
        //   group.limitations.valid_from) ||
        //   (group.limitations.pass_counter_enable &&
        //     group.limitations.pass_counter_passes) ||
        //   (group.limitations.first_use_counter_enable &&
        //     group.limitations.first_use_counter_days) ||
        //   (group.limitations.last_use_counter_enable &&
        //     group.limitations.last_use_counter_days) ||
        //   group.limitations.limitation_inherited)
      );
    },
    disabledTimeDate() {
      return (
        !this.saveObject.limitations.enable_date ||
        this.saveObject.limitation_inherited ||
        !this.features ||
        !this.features.CardholderDeactivationByDate
      );
    },
    disableInherit(){
      return !this.propsData.parent_id
    }
  },
  methods: {
    updateGroupInfo() {
      const find = this.treeData.length
        ? this.treeData.find(
          (i) =>
            i.name === this.saveObject.name && +i.id !== +this.saveObject.id
        )
        : null;

      if (find) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: `Already exists cardholder group with name ${this.saveObject.name}`,
        });
      } else {
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
          .dispatch("cardGroup/updateCardGroup", filteredObj)
          .then((res) => {
            this.$vs.loading.close();
            // this.$parent.$parent.refreshTree(res.data.id);
            this.$parent.$parent.refreshTree(this.saveObject.id);

            this.$vs.notify({
              time: 7000,
              color: "success",
              title: `Cardholders group updated`,
            });
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      }
    },
    delKeys(cloneObj) {
      const obj = JSON.parse(JSON.stringify(cloneObj))

      if ('time_attendance' in obj) delete obj['time_attendance']
      if ('time_attendances' in obj) delete obj['time_attendances']
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
    },
    checkTime(value) {
      return (this.saveObject.antipass_backs.time = +value.replace(
        /[^+0-9]/g,
        ""
      ));
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
        // this.saveObject.time_attendance = null;
      }
    },
    changeDescription() {
      let findType = this.antipass_types.find(
        (s) => s.id == this.saveObject.antipass_backs.type
      );
      if (findType) {
        this.antipass_back_description = findType.description;
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
    fetchEditGroup() {
      this.$store
        .dispatch("cardGroup/fetchCardGroup", this.propsData.id)
        .then((res) => {
          this.timeframes = [];
          this.saveObject = res.data;
          if (this.saveObject.valid_from) {
            this.saveObject.valid_from = this.$moment(
              this.saveObject.valid_from
            ).utcOffset(4).format("YYYY-MM-DD HH:mm");
          }
          if (this.saveObject.valid_due) {
            this.saveObject.valid_due = this.$moment(
              this.saveObject.valid_from
            ).utcOffset(4).format("YYYY-MM-DD HH:mm");
          }

          if (this.treeData.length) {
            let find_group = this.treeData.find(
              (g) => g.id == this.propsData.id
            );
            // this.disableInherit = find_group.pid ? false : true;
          }
          if (res.data.access_right) {
            this.changeRightDescription();
          }

          if (res.data.time_attendance) {
            this.changeSchedule();
          }

          this.fetchRelations();
        });
    },
    validateLimitations() {
      let valid_from = this.saveObject.limitations.valid_from;
      let valid_due = this.saveObject.limitations.valid_due;

      if (
        new Date(valid_from) > new Date(valid_due) &&
        valid_from &&
        valid_due
      ) {
        valid_from = this.$moment(valid_from)
          .subtract(1, "months")
          .endOf("month")
          .format("yyyy-MM-DD hh:MM");
        valid_due = this.$moment(valid_due).format("yyyy-MM-DD hh:MM");
      }
    },
    changeToInheritLimit() {
      if (this.saveObject.limitation_inherited) {
        this.$store
          .dispatch("cardGroup/fetchCardGroup", +this.propsData.parent_id)
          .then((res) => {
            this.saveObject.limitations = { ...res.data.limitations };
            this.saveObject.limitation_inherited = true;
          });
      } else {
        this.saveObject.limitations = {};
      }
    },
    changeToInheritPass() {
      if (this.saveObject.antipass_back_inherited) {
        this.$store
          .dispatch("cardGroup/fetchCardGroup", +this.propsData.parent_id)
          .then((res) => {
            this.saveObject.antipass_backs = { ...res.data.antipass_backs };
            this.saveObject.antipass_back_inherited = true;
          });
      } else {
        this.saveObject.antipass_backs = {};
      }
    },
    changeToInheritRight() {
      if (this.saveObject.access_right_inherited) {
        this.$store
          .dispatch("cardGroup/fetchCardGroup", +this.propsData.parent_id)
          .then((res) => {
            this.saveObject.access_right = res.data.access_right;
            this.saveObject.access_right_inherited = true;
            this.changeRightDescription();
          });
      } else {
        this.saveObject.access_right = null;
        this.changeRightDescription();
      }
    },
    changeToInheritTime() {
      if (this.saveObject.time_attendance_inherited) {
        this.$store
          .dispatch("cardGroup/fetchCardGroup", +this.propsData.parent_id)
          .then((res) => {
            this.saveObject.time_attendance = res.data.time_attendance;
            this.saveObject.time_attendance_inherited = true;
            this.changeSchedule();
          });
      } else {
        this.saveObject.time_attendance = null;
        this.changeSchedule();
      }
    },
    fetchRelations() {
      this.$store
        .dispatch("cardGroup/fetchRelations", this.propsData.id)
        .then((res) => {
          if (res.data.length) {
            res.data.forEach((rel) => {
              rel.name = rel.last_name
                ? rel.first_name + " " + rel.last_name
                : rel.first_name;
            });
          }
          this.relations = res.data;
        });
    },
  },
  created() {
    if (this.features && Object.keys(this.features).length) {
      this.group_features = this.features;
    }

    this.fetchEditGroup();
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

    this.fetchRelations();

    this.$store.dispatch("schedule/fetchSchedules").then((res) => {
      this.schedulesOptions = [
        /*   {
          id: null,
          label: "Select Schedule",
        },*/
      ];
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

<style lang="scss" >
.edit_group_tabs {
  height: 100%;
  padding-top: 25px;
  overflow: unset;
}

.count_status {
  margin-left: 20px;
}

.refresh_limit {
  margin-left: 20px;
  margin-top: 20px;
}

.edit_group_tabs .con-slot-tabs {
  height: 100%;
}

.parent_goup {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: inherit;

  .con-slot-tabs {
    overflow: unset;
  }

  .enable_time {
    align-items: center;
    display: flex;
  }

  .counting_block {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .align-items-end {
    align-items: flex-end;
  }

  .antipass_back_type {
    text-transform: capitalize;
    font-size: 18px;
  }

  .edit_goup_button {
    position: relative;
    text-align: end;
    padding-top: 20px;
    margin-top: auto;
  }
}

.ac_right_group_tbl {
  .vs-con-tbody.vs-table--tbody {
    max-height: 350px;
  }
}

.relation_table_group {
  .vs-con-tbody.vs-table--tbody {
    max-height: 340px;

    .vs-table--thead {
      th {
        top: 0;
        z-index: 1;
        position: sticky;
      }
    }
  }

  td {
    span p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 350px;
    }
  }

  ::-webkit-scrollbar-thumb {
    background-color: #7367f0;
    width: 8px !important;
    height: 8px !important;
    border-radius: 3px !important;
  }

  ::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
    background: white;
    border-radius: 3px !important;
  }
}
</style>
