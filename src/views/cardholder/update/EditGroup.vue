<template>
  <div class="add_group_over edit_grp">
    <!-- title="Cardholder Group" -->
    <vx-card class="mt-base card_theme" no-shadow>
      <div class="vx-row">
        <div class="vx-col w-full">
          <div>
            <label for="" class="vs-input--label">Cardholder Group</label>
            <v-select
              v-model="group.cardholder_group"
              :options="card_group_list"
              @input="changeGroup"
              autocomplete="new-password"
              class="select_padding"
              name="port"
              placeholder="Cardholder Group"
              :reduce="(type) => type.id"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
            <span v-if="group_error_message" class="text-danger text-sm">{{
              group_error_message
            }}</span>
          </div>
        </div>
        <div class="vx-col w-full" v-if="selected_group && cardholder_group">
          <vs-input
            label="Description"
            v-model="cardholder_group.description"
            class="w-full new_inp mt-3"
            name="description"
            :disabled="true"
          />
        </div>
      </div>

      <div class="vx-row mt-6" v-if="group_access_rights">
        <div class="vx-col w-full">
          <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
            <vs-tab label="Access Right">
              <div class="w-full">
                <vs-input
                  v-model="group_access_rights.name"
                  class="w-full new_inp mt-4"
                  name="description"
                  :disabled="true"
                />
              </div>

              <Table
                class="mt-3 custom_fix_header"
                :items="access_rules"
                :headers="right_headers"
              />
            </vs-tab>

            <vs-tab label="Time attendance" class="mt-4">
              <span style="font-weight: bold;">Schedule: {{ time_attendances.name }}</span>
              <TimelineTable
                class="mt-3"
                v-if="attendance_timeframes && attendance_timeframes.length"
                :items="attendance_timeframes"
              />
            </vs-tab>

            <vs-tab label="Anti-passback">
              <div class="vx-row mt-3">
                <div class="vx-col w-full">
                  <vs-checkbox
                    class="mb-4 mt-5"
                    v-model="group.antipass_back_inherited"
                    disabled
                    >Inherited</vs-checkbox
                  >
                </div>

                <div class="vx-col">
                  <vs-checkbox
                    class="mb-4 mt-5"
                    v-model="group.enable_antipass_back"
                    disabled
                    >Enable Anti-passback</vs-checkbox
                  >
                </div>
              </div>
            </vs-tab>

            <vs-tab label="Limitations">
              <div class="vx-row">
                <div class="vx-col md:w-full w-full">
                  <vs-checkbox
                    v-model="group.limitation.enable_date"
                    disabled
                    class="w-full checkbox_block mt-3"
                    >Enable Date Limitation</vs-checkbox
                  >
                  <div class="vx-row date_filter mr-5 limitation_rangepicker">
                    <div class="vx-col start_date">
                      <flat-pickr
                        :config="configdateTimePicker"
                        disabled
                        v-model="group.limitation.valid_from"
                        placeholder="Valid from"
                      />
                      <!-- @input="validateLimitations" -->
                    </div>
                    <div class="vx-col endDate">
                      <flat-pickr
                        :config="configdateTimePicker"
                        v-model="group.limitation.valid_due"
                        disabled
                        placeholder="Due"
                      />
                      <!-- @input="validateLimitations" -->
                    </div>
                  </div>
                  <!-- <vs-divider />
                  <vs-tabs
                    v-model="activeTabs"
                    class="tab-action-btn-fill-conatiner"
                  >
                    <vs-tab
                      label="Pass Counter"
                      icon-pack="feather"
                      icon="icon-user"
                    >
                      <div class="tab-text">
                        <vs-checkbox
                          v-model="group.limitation.pass_counter_enable"
                          disabled
                          class="w-full checkbox_block mt-3"
                          >Enable Pass Counter</vs-checkbox
                        >
                        <span
                          >Credentials will expire when pass count will be
                          reached.</span
                        >
                        <div class="counting_block">
                          <vs-input
                            label="Passes"
                            class="count_passers"
                            @input="checkNumber($event, 'pass_counter_passes')"
                            v-model="group.limitation.pass_counter_passes"
                            v-validate="'required'"
                            disabled
                            value="25"
                          />
                          <vs-input
                            label="Current status"
                            class="count_status"
                            v-model="group.limitation.pass_counter_current"
                            value="20"
                            disabled
                          />
                          <a href="">
                            <img
                              :src="
                                require(`@/assets/images/file-icons/reload.png`)
                              "
                            />
                          </a>
                        </div>
                      </div>
                    </vs-tab>

                    <vs-tab
                      label="First Use Counter"
                      icon-pack="feather"
                      icon="icon-user"
                    >
                      <div class="tab-text">
                        <vs-checkbox
                          v-model="group.limitation.first_use_counter_enable"
                          disabled
                          class="w-full checkbox_block mt-3"
                          >Enable Pass Counter</vs-checkbox
                        >
                        <span
                          >Credentials will expire a specified number of days
                          after the first use.</span
                        >
                        <div class="counting_block">
                          <vs-input
                            label="Days"
                            v-model="group.limitation.first_use_counter_days"
                            class="count_passers"
                            disabled
                            v-validate="'required'"
                            @input="
                              checkNumber($event, 'first_use_counter_days')
                            "
                            value="25"
                          />
                          <vs-input
                            label="Current status"
                            class="count_status"
                            value="20"
                            v-model="group.limitation.first_use_counter_current"
                            disabled
                          />
                          <a href="">
                            <img
                              :src="
                                require(`@/assets/images/file-icons/reload.png`)
                              "
                            />
                          </a>
                        </div>
                      </div>
                    </vs-tab>

                    <vs-tab
                      label="Last Use Counter"
                      icon-pack="feather"
                      icon="icon-user"
                    >
                      <div class="tab-text">
                        <vs-checkbox
                          disabled
                          v-model="group.limitation.last_use_counter_enable"
                          class="w-full checkbox_block mt-3"
                          >Enable Pass Counter</vs-checkbox
                        >
                        <span
                          >Credentials will expire when it has not been used
                          for a specified number of days.</span
                        >
                        <div class="counting_block">
                          <vs-input
                            label="Days"
                            v-model="group.limitation.last_use_counter_days"
                            class="count_passers"
                            disabled
                            v-validate="'required'"
                            @input="
                              checkNumber($event, 'last_use_counter_days')
                            "
                            value="25"
                          />
                          <vs-input
                            v-model="group.limitation.last_use_counter_current"
                            label="Current status"
                            class="count_status"
                            value="20"
                            disabled
                          />
                          <a href="">
                            <img
                              :src="
                                require(`@/assets/images/file-icons/reload.png`)
                              "
                            />
                          </a>
                        </div>
                      </div>
                    </vs-tab>
                  </vs-tabs> -->
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
import timeLine from "../../schedule/TimeLine";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import vSelect from "vue-select";
import Table from "../../../components/custom/table/Table";
import TimelineTable from "../../../components/custom/table/TimeLineTable";
import { treeData } from "../../../functions/treeData";

import { generateTimeframes } from "../../../functions/scheduleData";
export default {
  data() {
    return {
      group_access_rights: null,
      access_rules: [],
      schedules: null,
      time_attendances: null,
      attendance_timeframes: [],
      timeframes: [],
      weekDays: this.$store.state.weekDays,
      group: {
        limitation: {},
        antipass_backs: {},
        cardholder_group: null,
      },
      group_name: null,
      selected_group: false,
      activeTab: 0,
      activeTabs: 0,
      antipass_back: null,
      antipass_back_description: null,
      timeTypes: [
        {
          label: "Seconds",
          id: "seconds",
        },
        {
          label: "Minutes",
          id: "minutes",
        },
      ],
      configdateTimePicker: {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
      },
      right_headers: [
        {
          name: "Entry Name",
          key: "entry",
        },
        {
          name: "Schedule",
          key: "schedule",
        },
      ],
      card_group_list: [],
      group_error_message: null,
      cardholder_group: null,
    };
  },
  components: {
    timeLine,
    flatPickr,
    vSelect,
    Table,
    TimelineTable,
  },
  props: {
    editData: {
      type: Object,
    },
  },
  watch: {
    group: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_EDIT_GROUP_INFO", newValue);
      },
      deep: true,
    },
  },
  computed: {
    antipass_types() {
      return this.$store.state.antipass_types;
    },
  },
  methods: {
    changeGroup() {
      this.group_error_message = null;
      this.selected_group = true;
      if (this.group.cardholder_group) {
        this.$store.commit("cardholder/SET_EDIT_GROUP_INFO", { ...this.group });
        this.$store.commit("cardholder/SET_ALL_INHERIT");
        let find_group = this.access_rights.find(
          (g) => g.id == +this.group.cardholder_group
        );
        this.setData(find_group);
      } else if (this.access_rights[0]) {
        this.$store.commit("cardholder/SET_EDIT_GROUP_INFO", { ...this.group });
        this.$store.commit("cardholder/SET_ALL_INHERIT");
        this.group.cardholder_group = this.access_rights[0].id;
        this.setData(this.access_rights[0]);

        this.group_error_message = "Cardholder group can't be null";
      }
    },

    changeDescription() {
      let findType = this.antipass_types.find(
        (s) => s.id == this.group.antipass_backs.type
      );
      if (findType) {
        this.antipass_back_description = findType.description;
      }
    },
    checkNumber(value, field) {
      return (this.group.limitation[field] = +value.replace(/[^+0-9]/g, ""));
    },
    setData(find_group) {
      this.$store
        .dispatch("cardGroup/fetchCardGroup", +find_group.id)
        .then((res) => {
          this.cardholder_group = res.data;
          this.group.antipass_back_inherited = res.data.antipass_back_inherited;
          this.group.enable_antipass_back = res.data.enable_antipass_back;
          if (res.data.antipass_back) {
            this.group.antipass_backs = res.data.antipass_backs;
          }
          if (res.data.limitation) {
            this.group.limitation = res.data.limitations;
          }
        });

      if (find_group.time_attendance) {
        this.$store
          .dispatch("schedule/fetchSchedule", find_group.time_attendance)
          .then((res) => {
            this.time_attendances = res.data;
            this.attendance_timeframes = [];
            const getSchedule = generateTimeframes(res);
            this.attendance_timeframes = getSchedule;
          });
      }

      this.$store
        .dispatch("right/fetchRight", +find_group.access_right)
        .then((res) => {
          let rule_arr = [];
          let access_rules = res.data.access_rules;

          this.group_access_rights = res.data;

          if (access_rules.length) {
            access_rules.forEach((rule) => {
              rule_arr.push({
                entry: rule.access_point ? rule.access_points.name : "",
                schedule: rule.schedule ? rule.schedules.name : "",
              });
            });
          }

          this.access_rules = rule_arr;
        });
    },
  },
  created() {
    let card_group =
      this.$store.state.cardholder.edit_cardholder_info.cardholder_group;

    this.card_group_list = [];
    this.$store.dispatch("cardGroup/fetchCardHolderGroups").then((res) => {
      this.access_rights = res.data;
      if (res.data.length) {
        res.data.forEach((item) => {
          this.card_group_list.push({ id: item.id, label: item.name });
        });
      }

      if (card_group) {
        this.group.cardholder_group = +card_group;

        let find_group = this.access_rights.find((g) => g.id == card_group);
        this.setData(find_group);

        this.selected_group = true;
      }
    });
  },
};
</script>

<style lang="scss">
@import "../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
.add_group_over .con-tab.vs-tabs--content {
  // height: 227px;
  overflow-x: auto;
}

.con-tab.vs-tabs--content {
  // height: 227px;
  // overflow-x: auto;
}
.con-tablex.vs-table--content {
  max-height: 340px;
  // height: 100%;
}

.con-tablex.vs-table--content::-webkit-scrollbar-thumb {
  background-color: #7367f0;
  width: 8px !important;
  height: 8px !important;
  border-radius: 3px !important;
}
.con-tablex.vs-table--content::-webkit-scrollbar {
  width: 5px !important;
  height: 5px !important;
  background: white;
  border-radius: 3px !important;
}

.schedule_popup {
  z-index: 99999;
}

.checkbox_block {
  flex: 0 0 100%;
  margin-bottom: 15px;
}
.counting_block {
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  .count_passers,
  .count_status {
    flex: 0 0 40%;
  }
  img {
    width: 20px;
  }
}
.font_bold {
  font-weight: bold;
  margin-top: 10px;
}

.custom_fix_header {
  // height: 340px;
  .vs-con-tbody.vs-table--tbody {
    overflow: auto;
    max-height: 340px;
  }
  .vs-table.vs-table--tbody-table {
    border-collapse: collapse;
    width: 100%;
  }
  .vs-table--thead th {
    top: 0;
    z-index: 1;
    position: sticky;
    background: #212744;
  }
}

// .new_inp .vs-input--input {
//   padding-top: 11px !important;
//   padding-bottom: 11px !important;
// }
</style>
