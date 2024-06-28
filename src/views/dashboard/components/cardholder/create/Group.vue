<template>
  <div class="add_group_over">
    <!-- title="Cardholder Group" -->
    <vx-card class="mt-base card_theme" no-shadow>
      <div class="vx-row">
        <div class="vx-col w-full">
          <div>
            <label for="" class="vs-input--label mt-4">Cardholder Group</label>

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

        <div
          class="vx-col w-full mt-3"
          v-if="selected_group && cardholder_group"
        >
          <vs-input
            label="Description"
            v-model="cardholder_group.description"
            class="w-full"
            name="description"
            :disabled="true"
          />
        </div>
      </div>

      <div class="vx-row mt-3" v-if="group_access_rights">
        <div class="vx-col w-full">
          <vs-tabs
            v-model="activeTab"
            class="tab-action-btn-fill-conatiner"
            v-if="cardholder_group"
          >
            <vs-tab label="Access Right">
              <div class="w-full">
                <vs-input
                  v-model="group_access_rights.name"
                  class="w-full new_inp mt-4"
                  name="description"
                  :disabled="true"
                />
              </div>
              <div class="mt-4">
                <Table :items="access_rules" :headers="right_headers" />
              </div>
            </vs-tab>

            <vs-tab label="Time attendance" v-if="time_attendances">
              <ul class="time_attendance_ul">
                <li class="font_bold">
                  <div>Schedule:</div>
                  <div>{{ time_attendances.name }}</div>
                </li>
                <li>
                  <div>Description:</div>
                  <div>{{ time_attendances.description }}</div>
                </li>
                <li>
                  <div>Type:</div>
                  <div>{{ time_attendances.type }}</div>
                </li>
              </ul>
              <TimelineTable
                v-if="attendance_timeframes && attendance_timeframes.length"
                :items="attendance_timeframes"
              />
            </vs-tab>

            <vs-tab label="Anti-passback" v-if="antipass_back">
              <div class="vx-row mt-4">
                <div class="vx-col md:w-full">
                  <v-select
                    v-model="cardholder_group.antipass_backs.type"
                    :options="antipass_types"
                    class="w-full select_padding"
                    placeholder="Antpass-back type"
                    @input="changeDescription"
                    disabled
                    :reduce="(type) => type.id"
                    :dir="$vs.rtl ? 'rtl' : 'ltr'"
                  />
                </div>
              </div>
              <div class="vx-row mr-5">
                <div class="vx-col">
                  <div class="antipass_title font_bold">
                    <h1>{{ cardholder_group.antipass_backs.type }}</h1>
                  </div>
                  <div class="antipass_desc">
                    {{ antipass_back_description }}
                  </div>
                </div>
              </div>
              <vs-divider />
              <div class="vx-row timer_block">
                <div class="vx-col md:w-full">
                  <span>Anti-passback reset zone timer</span>
                  <vs-checkbox
                    v-model="cardholder_group.antipass_backs.enable_timer"
                    class="w-full checkbox_block"
                    disabled
                    >Enable Timer</vs-checkbox
                  >
                  <div class="counting_block">
                    <vs-input
                      class="count_passers"
                      label="Period"
                      @input="checkNumber($event, 'time')"
                      v-model="cardholder_group.antipass_backs.time"
                      v-validate="'required'"
                      disabled
                    />

                    <v-select
                      v-model="cardholder_group.antipass_backs.time_type"
                      :options="timeTypes"
                      class="w-full select_padding"
                      disabled
                      placeholder="Time Type"
                      :reduce="(type) => type.id"
                      :dir="$vs.rtl ? 'rtl' : 'ltr'"
                    />
                  </div>
                </div>
              </div>
              <div class="vx-row">
                <div class="vx-col md:w-full">
                  <div class="timer_zone_title font_bold">
                    Timer description
                  </div>
                  <div class="timer_zone_desc">
                    Anti-passback rules will cleared until specified time
                  </div>
                  <vs-button class="ml-auto mt-2 w-full unimacs_button"
                    >Anti-passback reset zone timer
                  </vs-button>
                </div>
              </div>
            </vs-tab>

            <vs-tab label="Limitations">
              <div class="vx-row mt-4">
                <div class="vx-col md:w-full w-full">
                  <vs-checkbox
                    v-model="cardholder_group.limitation_inherited"
                    disabled
                    class="w-full checkbox_block"
                    >Enable Date Limitation</vs-checkbox
                  >
                  <div class="vx-row date_filter mr-5 limitation_rangepicker">
                    <div class="vx-col start_date disable_date_time">
                      <flat-pickr
                        :config="configdateTimePicker"
                        v-model="cardholder_group.limitations.valid_from"
                        placeholder="Valid from"
                        disabled
                      />
                    </div>
                    <div class="vx-col endDate disable_date_time">
                      <flat-pickr
                        :config="configdateTimePicker"
                        v-model="cardholder_group.limitations.valid_due"
                        placeholder="Due"
                        disabled
                      />
                    </div>
                  </div>
                  <vs-divider />
                  <!-- <vs-tabs
                    v-model="limitTab"
                    class="tab-action-btn-fill-conatiner"
                  >
                    <vs-tab
                      label="Pass Counter"
                      icon-pack="feather"
                      icon="icon-user"
                    >
                      <div class="tab-text mt-4">
                        <vs-checkbox
                          v-model="
                            cardholder_group.limitations.pass_counter_enable
                          "
                          disabled
                          class="w-full checkbox_block"
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
                            v-model="
                              cardholder_group.limitations.pass_counter_passes
                            "
                            v-validate="'required'"
                            value="25"
                            disabled
                          />
                          <vs-input
                            label="Current status"
                            class="count_status"
                            v-model="
                              cardholder_group.limitations.pass_counter_current
                            "
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
                      <div class="tab-text mt-4">
                        <vs-checkbox
                          v-model="
                            cardholder_group.limitations
                              .first_use_counter_enable
                          "
                          disabled
                          class="w-full checkbox_block"
                          >Enable Pass Counter</vs-checkbox
                        >
                        <span
                          >Credentials will expire a specified number of days
                          after the first use.</span
                        >
                        <div class="counting_block">
                          <vs-input
                            label="Days"
                            v-model="
                              cardholder_group.limitations
                                .first_use_counter_days
                            "
                            disabled
                            class="count_passers"
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
                            v-model="
                              cardholder_group.limitations
                                .first_use_counter_current
                            "
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
                      <div class="tab-text mt-4">
                        <vs-checkbox
                          v-model="
                            cardholder_group.limitations.last_use_counter_enable
                          "
                          disabled
                          class="w-full checkbox_block"
                          >Enable Pass Counter</vs-checkbox
                        >
                        <span
                          >Credentials will expire when it has not been used
                          for a specified number of days.</span
                        >
                        <div class="counting_block">
                          <vs-input
                            label="Days"
                            v-model="
                              cardholder_group.limitations.last_use_counter_days
                            "
                            class="count_passers"
                            v-validate="'required'"
                            @input="
                              checkNumber($event, 'last_use_counter_days')
                            "
                            disabled
                            value="25"
                          />
                          <vs-input
                            v-model="
                              cardholder_group.limitations
                                .last_use_counter_current
                            "
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
import timeLine from "@/views/schedule/TimeLine";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import vSelect from "vue-select";
import Table from "@/components/custom/table/Table";
import TimelineTable from "@/components/custom/table/TimeLineTable";
import { generateTimeframes } from "@/functions/scheduleData";
export default {
  data() {
    return {
      group_access_rights: null,
      cardholder_group: null,
      schedules: null,
      time_attendances: null,
      attendance_timeframes: [],
      timeframes: [],
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
        htmlAttributes: "hasAttribute",
      },
      weekDays: this.$store.state.weekDays,
      group: {
        limitation: {},
        antipass_backs: {},
        cardholder_group: null,
      },
      group_name: null,
      selected_group: false,
      activeTab: 0,
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
      limitTab: 0,
      access_rules: [],
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
    };
  },
  components: {
    timeLine,
    flatPickr,
    vSelect,
    Table,
    TimelineTable,
  },
  watch: {
    group: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_GROUP_INFO", newValue);
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
        this.$store.commit("cardholder/SET_GROUP_INFO", { ...this.group });
        this.$store.commit("cardholder/SET_ALL_INHERIT");
        let find_group = this.access_rights.find(
          (g) => g.id == +this.group.cardholder_group
        );
        this.setData(find_group);
      } else if (this.access_rights[0]) {
        this.group.cardholder_group = this.access_rights[0].id;
        this.setData(this.access_rights[0]);

        this.$store.commit("cardholder/SET_GROUP_INFO", { ...this.group });
        this.$store.commit("cardholder/SET_ALL_INHERIT");
        this.group_error_message = "Cardholder group can't be null";
      }
    },
    setData(find_group) {
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

      this.$store
        .dispatch("cardGroup/fetchCardGroup", +find_group.id)
        .then((res) => {
          this.cardholder_group = res.data;
          if (res.data.antipass_back) {
            this.antipass_back = res.data.antipass_backs;
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
  },
  created() {
    let card_group =
      this.$store.state.cardholder.cardholder_info.cardholder_group;
    this.$store.dispatch("cardGroup/fetchCardHolderGroups").then((res) => {
      this.access_rights = res.data;
      this.card_group_list = [];

      if (res.data.length) {
        res.data.forEach((item) => {
          this.card_group_list.push({ id: item.id, label: item.name });
        });

        const findParent = res.data.find((c) => c.default);

        if (findParent) {
          this.group.cardholder_group = findParent.id;
          this.changeGroup();
        }
      }

      if (card_group) {
        this.group.cardholder_group = +card_group;

        this.selectedNodeId = this.group.cardholder_group;

        let find_group = this.access_rights.find((g) => g.id == card_group);
        this.setData(find_group);

        this.selected_group = true;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
.add_group_over .con-tab.vs-tabs--content {
  height: 227px;
  // overflow-x: auto;
}
.con-tab.vs-tabs--content {
  // height: 227px;
  // overflow-x: auto;
}
.con-tablex.vs-table--content {
  max-height: 340px;
  height: 100%;
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
.font_bold {
  font-weight: bold;
  margin-top: 15px;
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
  .count_passers {
    margin: 0 0 10px 0;
  }
  img {
    width: 20px;
  }
}
.time_attendance_ul {
  margin: 20px 0;
  li {
    display: flex;
    margin: 5px 0;
    div {
      margin-right: 10px;
    }
  }
  .font_bold {
    div {
      font-weight: bold;
    }
  }
}
</style>
