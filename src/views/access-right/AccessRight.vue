<template>
  <div class="access_right_page">
    <div class="vx-row new_padd">
      <vs-popup
        class="holamundo add_ac_rule"
        title="Create Access Rule"
        :active.sync="newAccessRule"
      >
        <div class="access_rule_popup vx-row">
          <div class="created_by_block vx-col md:w-1/2">
            <v-select
              v-model="addSelectBy"
              :options="created"
              class="selectExample select_padding mt-4"
              @input="changeTypeRule"
              name="select_by"
              placeholder="Select by"
              :reduce="(created) => created.id"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
            <MultiTable
              v-if="addSelectBy == 'point' || addSelectBy == 'point_group'"
              :items="
                addSelectBy == 'point'
                  ? entries
                  : addSelectBy == 'point_group'
                  ? point_groups
                  : []
              "
              :headers="point_headers"
              :permissions="permissions"
              @input="checkItem($event)"
              @setAll="setAllChecked($event)"
              :actions="false"
            />
            <!-- :selectedItem="selectedItem" -->
            <!-- @input="selectedEntries = $event" -->

            <div v-else-if="addSelectBy == 'location_zone'">
              <ejs-treeview
                id="tree_access_right"
                :nodeSelected="nodeSelected"
                v-if="field.dataSource.length"
                :fields="field"
                :allowMultiSelection="true"
              >
              </ejs-treeview>
            </div>
          </div>
          <div
            class="choose_schedule_block vx-col md:w-1/2"
            v-if="addData && selectedEntries.length"
          >
            <v-select
              v-model="addData.id"
              :options="schedulesOptions"
              class="mt-4 mb-3 select_padding"
              name="schedule"
              @input="fetchSchedules"
              placeholder="Choose schedule"
              :reduce="(addData) => addData.id"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
            <vs-textarea
              label="Description"
              v-model="addData.description"
              v-if="addData.id"
              :disabled="true"
              class="access_description"
            />

            <TimelineTable
              v-if="timeframes && timeframes.length"
              :items="timeframes"
            />

            <!-- <div class="vx-col md:w-full checkbox_holidays">
              <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="add_access_holidays">Disable Access on Holidays
              </vs-checkbox>
            </div> -->
          </div>

          <div
            class="actions_block md:w-full vx-col"
            style="display: flex; flex-direction: row-reverse"
          >
            <vs-button
              class="mr-6 mt-4 unimacs_cancel_button"
              @click="newAccessRule = false"
              >Cancel</vs-button
            >
            <vs-button
              class="mr-6 mt-4 unimacs_button"
              @click="addAccessRule"
              :disabled="!isSchedule"
              >Submit
            </vs-button>
          </div>
        </div>
      </vs-popup>
      <vs-popup
        class="holamundo ed_ac_rule"
        title="Edit Access Rule"
        :active.sync="accessRule"
      >
        <div class="access_rule_popup vx-row">
          <div class="created_by_block vx-col md:w-1/2">
            <v-select
              v-model="createdBy"
              disabled
              :options="edit_created"
              @input="changeEditTypeRule"
              class="select_padding mb-3"
              name="select_by"
              placeholder="Select by"
              :reduce="(created) => created.id"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />

            <Table
              :items="
                createdBy == 'edit_point'
                  ? entries
                  : addSelectBy == 'edit_point_group'
                  ? point_groups
                  : []
              "
              :headers="rule_headers"
              v-if="
                createdBy == 'edit_point' || createdBy == 'edit_point_group'
              "
            />

            <div v-else-if="createdBy == 'location_zone'">
              <ejs-treeview
                id="edit_tree_access_right"
                :nodeSelected="nodeSelected"
                v-if="edit_field.dataSource.length"
                :fields="field"
                :allowMultiSelection="true"
                disabled
              >
              </ejs-treeview>
            </div>
          </div>
          <div
            class="choose_schedule_block vx-col md:w-1/2"
            v-if="editSchedule"
          >
            <v-select
              v-model="editSchedule.id"
              :options="schedulesOptions"
              class="select_padding mb-3"
              name="coose_schedule"
              placeholder="Choose schedule"
              :reduce="(schedule) => schedule.id"
              @input="scheduleChangdes"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
            <vs-textarea
              class="access_description"
              placeholder="Description..."
              v-model="editSchedule.description"
              disabled="true"
            >
            </vs-textarea>

            <TimelineTable
              v-if="timeframes && timeframes.length"
              :items="timeframes"
            />
            <!-- <div class="vx-col md:w-full checkbox_holidays">
              <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="access_holidays">Disable Access on Holidays
              </vs-checkbox>
            </div> -->
          </div>

          <div
            class="actions_block md:w-full vx-col"
            style="display: flex; flex-direction: row-reverse"
          >
            <vs-button
              class="mr-6 mt-4 unimacs_button"
              @click="sumbitAccessRule"
              :disabled="!isScheduleEdit"
              >Submit
            </vs-button>
            <vs-button
              class="mr-6 mt-4 unimacs_cancel_button"
              @click="accessRule = false"
              >Cancel</vs-button
            >
          </div>
        </div>
      </vs-popup>
      <vs-popup
        class="holamundo"
        title="Create Access Right"
        :active.sync="createPopup"
      >
        <div>
          <vs-input
            label="Name"
            class="w-full"
            name="name"
            v-model="right.name"
            v-validate="'required'"
          />

          <vs-input
            label="Description"
            class="w-full mt-5"
            name="description"
            v-model="right.description"
            v-validate="'required'"
          />
          <vs-checkbox
            class="mb-4 mt-5 custom__checkbox"
            v-model="right.default"
            >Default</vs-checkbox
          >

          <div class="vx-row w-full" style="margin: 0">
            <div
              class="vx-col w-full"
              style="padding: 0; display: flex; flex-direction: row-reverse"
            >
              <vs-button
                class="mt-4 unimacs_button"
                @click="createRight"
                :disabled="!isFormValid"
                >Submit</vs-button
              >
            </div>
          </div>
        </div>
      </vs-popup>
      <div class="block_account">
        <div class="row_block">
          <div class="left_block">
            <div class="vx-col">
              <div class="vx-row" style="height: 0">
                <div class="vx-col add_right_button">
                  <vs-button
                    class="mr-4 unimacs_button unimacs_add_new_btn"
                    @click="checkRightResource"
                  >
                    <feather-icon
                      icon="PlusIcon"
                      svgClasses="h-4 w-4 mr-1"
                    />Add New
                  </vs-button>

                  <div
                    class="
                      con-input-search
                      vs-table--search
                      cardGroup_search_parentss
                    "
                  >
                    <input
                      type="text"
                      v-model="searchText"
                      @input="rightSearch($event)"
                      class="
                        input-search
                        vs-table--search-input
                        cardGroup_searchss
                      "
                    /><i
                      class="vs-icon notranslate icon-scale material-icons null"
                      >search</i
                    >
                  </div>
                </div>
              </div>
              <TableContext
                class="ac_right_table"
                :selectedItem="selectedRight"
                :items="filteredRightItems"
                :permissions="permissions"
                @openRule="openRule($event)"
                @createRule="createRule($event)"
                @remove="remove($event)"
                :search="false"
              />
            </div>
          </div>
          <div class="right_block">
            <div class="inner_block">
              <div class="vx-col" v-if="currComponent">
                <div>
                  <vs-tabs
                    v-model="activeTab"
                    class="tab-action-btn-fill-conatiner"
                  >
                    <vs-tab label="Main Settings">
                      <div class="vx-row mt-3">
                        <div class="vx-col md:w-1/2">
                          <vs-input
                            label="Name"
                            class="w-full"
                            placeholder="Name"
                            name="name"
                            v-validate="'required'"
                            v-model="access_right.name"
                          />
                        </div>
                        <div class="vx-col md:w-1/2">
                          <vs-input
                            label="Description"
                            class="w-full"
                            placeholder="Description"
                            name="description"
                            v-model="access_right.description"
                            v-validate="'required'"
                          />
                        </div>
                      </div>
                      <div class="vx-row">
                        <div class="vx-col md:w-full mt-5">
                          <div class="vx-row">
                            <div class="vx-col md:w-full fl_button mb-5">
                              <vs-checkbox
                                class="mb-4 mt-5 custom__checkbox"
                                v-model="access_right.default"
                                >Default
                              </vs-checkbox>

                              <vs-button
                                class="unimacs_button unimacs_add_new_btn"
                                @click="createAccessRule"
                              >
                                <feather-icon
                                  icon="PlusIcon"
                                  svgClasses="h-4 w-4 mr-1"
                                />Add New
                              </vs-button>
                            </div>
                          </div>

                          <Table
                            :items="access_right.access_rules"
                            :headers="entry_headers"
                            :actions="true"
                            @updateItem="editAccessRight($event)"
                            @deleteRecord="confirmDeleteRight($event)"
                          />
                        </div>
                      </div>
                    </vs-tab>
                    <vs-tab label="Relations">
                      <Table
                        class="mt-4"
                        :items="relations"
                        :headers="right_headers"
                      />
                    </vs-tab>
                  </vs-tabs>
                </div>
              </div>
            </div>
            <div class="vx-col w-full mt-5" style="text-align: right; padding: 0 20px" v-if="currComponent">
              <vs-button class="unimacs_button" :disabled="!access_right.name" @click="updateRight">Submit</vs-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import moduleSchedule from "@/store/schedule/moduleSchedule.js";
import vSelect from "vue-select";
import moduleRight from "@/store/access-right/moduleAccess.js";
import TimelineTable from "../../components/custom/table/TimeLineTable";
import Table from "../../components/custom/table/Table";
import TableContext from "../../components/custom/table/TableContext";
import timeLine from "../schedule/TimeLine";
import MultiTable from "../../components/custom/table/Multi";
import moduleAccessPointGroup from "@/store/group-zones/moduleAccessPoint.js";
import { generateTimeframes } from "../../functions/scheduleData";
import { treeData } from "../../functions/treeData";

export default {
  components: {
    timeLine,
    vSelect,
    TimelineTable,
    Table,
    TableContext,
    MultiTable,
  },
  data() {
    return {
      currComponent: false,
      schedule: null,
      right: {
        name: null,
        description: null,
      },
      createdBy: "edit_point",
      accessRuleTable: [],
      created: [
        {
          label: "Access Point",
          id: "point",
        },
        {
          label: "Location Zone",
          id: "location_zone",
        },
      ],

      edit_created: [
        {
          label: "Access Point",
          id: "edit_point",
        },
        {
          label: "Access Point Group",
          id: "edit_point_group",
        },
        {
          label: "Location Zone",
          id: "edit_location_zone",
        },
      ],

      // access_description: "",
      accessRule: false,
      newAccessRule: false,
      access_holidays: false,
      access_right: {},
      deletedId: null,
      activeTab: 0,
      createPopup: false,
      schedulesOptions: [],
      editSchedule: {},
      addData: {},
      timeframes: [],
      entries: [],
      point_groups: [],
      loc_zones: [],
      selectedItem: [],
      addSelectBy: "point",
      selectedEntries: [],
      add_access_holidays: false,
      access_rule: {},
      deletedRule: null,
      deletedRigth: null,
      relations: [],
      right_headers: [
        { name: "Cardholder Group Name", key: "name" },
        { name: "Cardholder Quantity", key: "card_qty" },
      ],
      rule_headers: [{ name: "name", key: "name" }],
      entry_headers: [
        { name: "#", key: "count" },
        { name: "Entry Name", key: "entry_name", width: 360 },
        { name: "Schedule", key: "schedule_name", width: 410 },
      ],
      point_headers: [
        {
          name: "Name",
          key: "name",
        },
      ],
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
      },
      selectedRight: null,
      searchText: null,
      filteredRightItems: [],
    };
  },
  watch: {
    createPopup(value) {
      if (!value) {
        this.initValues();
      }
    },
    newAccessRule(popup) {
      if (!popup) {
        this.addData = {};
        this.timeframes = [];
        this.add_access_holidays = false;
        this.selectedItem = [];
      }
    },
  },
  computed: {
    rights() {
      return this.$store.state.right.rights;
    },
    rightsTable() {
      let rights = [];
      this.rights.map((r) => {
        rights.push({
          id: r.id,
          name: r.name,
          description: r.description,
        });
      });

      return rights;
    },
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },
    isFormValid() {
      return this.right.name;
    },
    isSchedule() {
      return this.addData.id;
    },
    isScheduleEdit() {
      return this.editSchedule.id;
    },
  },

  methods: {
    checkRightResource() {
      this.$store
        .dispatch("checkResource", { resource: "AccessRight" })
        .then((res) => {
          if (res.data.success) {
            this.createPopup = true;
          } else {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Access Right resource limit has been reached",
            });
          }
        });
    },
    checkItem({ event, item }) {
      let find = this.entries.find((a) => a.id == item.id);
      if (find) {
        find.selected = event;
      }

      this.selectedEntries = this.entries.filter((a) => a.selected);
    },
    setAllChecked(value) {
      this.entries.map(function (x) {
        x.selected = value;
      });
      this.selectedEntries = this.entries.filter((a) => a.selected);
    },
    addAccessRule() {
      let sendData = {
        access_right: this.access_right.id,
        schedule: this.addData.id,
        access_in_holidays: !this.add_access_holidays,
      };

      if (this.addSelectBy == "point") {
        sendData.access_point = this.selectedEntries.map((e) => e.id);
      } else if (this.addSelectBy == "point_group") {
        sendData.access_group = this.selectedEntries.map((e) => e.id);
      } else if (this.addSelectBy == "location_zone") {
        sendData.access_zone = this.selectedEntries.map((e) => +e);
      }

      this.$store.dispatch("right/addAccessRule", sendData).then((res) => {
        this.newAccessRule = false;

        if (res.data.length) {
          res.data.forEach((rule, index) => {
            let count = index + 1;
            rule.count = count;

            rule.entry_name = rule.access_point ? rule.access_points.name : "";
            rule.access_holidays = rule.access_in_holidays
              ? "Enable"
              : "Disable";
            rule.schedule_name = this.schedulesOptions.find(
              (s) => s.id == rule.schedule
            ).label;
            this.access_right.access_rules.push(rule);
          });
        }

        if (this.access_right.access_rules.length) {
          this.access_right.access_rules.forEach((rule, index) => {
            rule.count = index + 1;
          });
        }

        this.entries = [];
        this.selectedEntries = [];
        this.addData.id = null;
        this.addData.description = null;
        this.timeframes = [];
        this.add_access_holidays = false;
        this.addSelectBy = "point";

        var treeObj =
          document.getElementById("tree_access_right").ej2_instances[0];
        treeObj.selectedNodes = [];
        // this.addData = {};
      });
    },
    createRule() {
      this.createAccessRule();
      // this.openRule(data);
    },
    updateRight() {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("right/updateRight", this.access_right)
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Access Right updated",
          });

          this.filteredRightItems = JSON.parse(JSON.stringify(this.rights));

          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    createAccessRule() {
      this.newAccessRule = true;
      this.selectedEntries = [];
      this.entries = [];
      this.getEntries();
    },
    confirmDeleteRight(data) {
      this.deletedRule = data;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.access_points.name} access rule`,
        accept: this.deleteRule,
        acceptText: "Delete",
      });
    },
    deleteRule() {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("right/deleteRule", this.deletedRule)
        .then((res) => {
          this.$vs.loading.close();

          if (res.data.message && res.data.message == "Delete pending") {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: res.data.message,
            });
          } else {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Access Rule deleted",
            });
          }

          const rightIndex = this.access_right.access_rules.findIndex(
            (u) => u.id == this.deletedRule.id
          );

          this.access_right.access_rules.splice(rightIndex, 1);
          if (this.access_right.access_rules.length) {
            this.access_right.access_rules.forEach((rule, index) => {
              rule.count = index + 1;
            });
          }
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    editAccessRight(rigth) {
      this.access_rule = rigth;
      this.accessRuleTable = [];
      this.$http
        .get(`/accessRight/accessRule/${rigth.id}`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          this.access_holidays = !res.data.access_in_holidays;
          this.$http
            .get(`/accessPoint/${res.data.access_point}`, {
              headers: { Authorization: localStorage.token },
            })
            .then((res) => {
              this.accessRule = true;
              this.entries = [res.data];
            });
        });
      this.accessRuleTable.push({ name: rigth.access_points.name });

      this.getSchedule(rigth.schedule);

      this.getEntries();
      // this.access_description = rigth.schedules.description;
    },
    openRule(data) {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("right/fetchRight", data.id)
        .then((res) => {
          this.selectedRight = data.id;
          let rightItem = res.data;
          if (rightItem.access_rules && rightItem.access_rules.length) {
            rightItem.access_rules.forEach((rule) => {
              rule.entry_name = rule.access_points
                ? rule.access_points.name
                : "";
              rule.access_holidays = rule.access_in_holidays
                ? "Enable"
                : "Disable";
              rule.schedule_name = rule.schedules ? rule.schedules.name : "";
            });
          }

          if (res.data.access_rules.length) {
            res.data.access_rules.forEach((rule, index) => {
              rule.count = index + 1;
            });
          }

          this.access_right = res.data;
          this.$vs.loading.close();
          this.relations = [];
          this.currComponent = true;

          this.$store.dispatch("right/fetchRelations", data.id).then((res) => {
            if (res.data.length) {
              res.data.forEach((rel) => {
                this.relations.push({
                  name: rel.cardholder_group_name
                    ? rel.cardholder_group_name
                    : "",
                  card_qty: rel.cardholders_qty ? rel.cardholders_qty : "",
                });
              });
            }
          });
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    sumbitAccessRule() {
      let submitRuleData = {
        schedule: this.editSchedule.id,
        access_in_holidays: !this.access_holidays,
        id: this.access_rule.id,
      };

      this.$store
        .dispatch("right/editAccessRule", submitRuleData)
        .then((res) => {
          if (res.data.message) {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: res.data.message,
            });

            this.accessRule = false;
          } else {
            let right = this.access_right.access_rules.find(
              (p) => p.id == res.data.id
            );

            right.schedule_name = this.editSchedule.name;
            right.schedule = res.data.schedule;

            right.access_holidays = res.data.access_in_holidays
              ? "Enable"
              : "Disable";
            this.accessRule = false;
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Access Rule updated",
            });
          }
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    getSchedule(id) {
      if (id) {
        this.$store
          .dispatch("schedule/fetchSchedule", id)
          .then((res) => {
            this.editSchedule = res.data;
            this.addData = res.data;
            this.timeframes = [];
            const getSchedule = generateTimeframes(res);
            this.timeframes = getSchedule;
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      }
    },
    remove(data) {
      this.deletedRigth = data;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.name} access rigth`,
        accept: this.deleteRigth,
        acceptText: "Delete",
      });
    },
    deleteRigth() {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("right/deleteRight", this.deletedRigth)
        .then((res) => {
          this.$vs.loading.close();
          if (res.data.message && res.data.message == "success") {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Access Right deleted",
            });
            this.filteredRightItems = JSON.parse(JSON.stringify(this.rights));

            if (this.rights.length) {
              this.openRule(this.rights[0]);
            }
          } else {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: res.data.message,
            });
          }
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    fetchSchedules() {
      if (this.addData.id) {
        this.getSchedule(this.addData.id);
      } else {
        this.timeframes = [];
      }
    },
    scheduleChangdes() {
      if (this.editSchedule.id) {
        this.getSchedule(this.editSchedule.id);
      } else {
        this.timeframes = [];
        this.editSchedule.description = "";
      }
    },
    createRight() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("right/createRight", this.right)
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Access Right created",
          });
          this.filteredRightItems = JSON.parse(JSON.stringify(this.rights));

          this.openRule(res.data);
          this.$vs.loading.close();
          this.createPopup = false;
          this.initValues();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    // deleteRight() {
    //   this.$vs.loading({
    //     type: "corners",
    //   });

    //   this.$store
    //     .dispatch("right/deleteRight", this.deletedId)
    //     .then((res) => {
    //       if (res.data.message && res.data.message == "success") {
    //         this.$vs.notify({
    time: 7000,
    //           color: "success",
    //           title: "Access Right deleted ",
    //         });
    //         this.filteredRightItems = JSON.parse(JSON.stringify(this.rights));
    //       } else {
    //         this.$vs.notify({
    time: 7000,
    //           color: "success",
    //           title: res.data.message,
    //         });
    //       }

    //       this.deletedId = null;

    //       this.$vs.loading.close();
    //     })
    //     .catch((err) => {
    //       this.$vs.loading.close();
    //     });
    // },
    initValues() {
      this.right = {
        name: null,
        description: null,
      };
    },
    getEntries() {
      this.$store.dispatch("right/fetchAccessPoint").then((res) => {
        if (res.data.length) {
          res.data.forEach((item) => {
            item.selected = false;
          });
        }
        this.entries = res.data;

        if (
          this.access_right &&
          this.access_right.access_rules &&
          this.access_right.access_rules.length
        ) {
          this.access_right.access_rules.forEach((rule) => {
            const inedx = this.entries.findIndex(
              (u) => u.id == rule.access_point
            );
            this.entries.splice(inedx, 1);
          });
        }
      });
    },
    getPointGroups() {
      this.$store
        .dispatch("accessPointGroup/fetchAccessPointGroups")
        .then((res) => {
          this.point_groups = res.data;
        });
    },
    getZones() {
      this.$store.dispatch("accessPointGroup/fetchAccessZones").then((res) => {
        if (res.data.length) {
          this.field.dataSource = treeData(res.data);
        } else {
          this.field.dataSource.push({
            name: "No Cardholders Group",
            id: "nogroup",
          });
        }

        this.loc_zones = res.data;
      });
    },
    nodeSelected(event) {
      var treeObj =
        document.getElementById("tree_access_right").ej2_instances[0];

      const selecteds = treeObj.selectedNodes;
      this.selectedEntries = treeObj.selectedNodes;
    },
    changeTypeRule() {
      this.selectedEntries = [];

      if (this.addSelectBy == "point") {
        this.getEntries();
      } else if (this.addSelectBy == "point_group") {
        this.getPointGroups();
      } else if (this.addSelectBy == "location_zone") {
        this.getZones();
      }
    },
    changeEditTypeRule() {
      if (this.createdBy == "edit_point") {
        this.getEntries();
      } else if (this.createdBy == "edit_point_group") {
        this.getPointGroups();
      } else if (this.createdBy == "edit_location_zone") {
        this.getZones();
      }
    },
    rightSearch() {
      var lowSearch = this.searchText.toLowerCase();
      const keys = ["name", "description"];

      const matched = this.rights.filter((val) =>
        keys.some((key) => String(val[key]).toLowerCase().includes(lowSearch))
      );
      this.filteredRightItems = matched;
    },
  },
  created() {
    this.$vs.loading({
      type: "corners",
    });

    if (!moduleSchedule.isRegistered) {
      this.$store.registerModule("schedule", moduleSchedule);
      moduleSchedule.isRegistered = true;
    }
    if (!moduleRight.isRegistered) {
      this.$store.registerModule("right", moduleRight);
      moduleRight.isRegistered = true;
    }
    if (!moduleAccessPointGroup.isRegistered) {
      this.$store.registerModule("accessPointGroup", moduleAccessPointGroup);
      moduleAccessPointGroup.isRegistered = true;
    }

    this.$store.dispatch("right/fetchRights").then((res) => {
      this.$vs.loading.close();
      if (this.rights.length) {
        this.openRule(this.rights[0]);
      }

      this.filteredRightItems = JSON.parse(JSON.stringify(this.rights));
    });

    this.$store
      .dispatch("schedule/fetchSchedules")
      .then((res) => {
        this.schedulesOptions = [
          /*  {
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
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });
  },
};
</script>

<style lang="scss" >
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";

.ac_right_table {
  margin-top: 80px;

  .con-input-search.vs-table--search {
    width: 100%;
    min-width: 150px;
    margin: 0 0 0 80px;
    max-width: 100%;

    input {
      width: 100%;
    }
  }
}

.access_right_page {
  .inner_block {
    padding: 25px 10px;
  }

  .list_menu {
    list-style-type: none;
    margin: 0;
    padding: 25px 10px;
    border-right: 1px solid slategray;
  }

  .list_menu li {
    margin-bottom: 15px;
  }

  .list_menu a {
    text-decoration: blink;
    display: flex;
    align-items: center;
  }

  .list_menu span {
    background: #00acee;
    color: white;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 12px;
    line-height: 1.33em;
    border-radius: 3px;
  }

  .block_account {
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    margin: 0 auto;
  }

  .row_block {
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    padding: 10px;
    margin: 0 -15px;
    box-shadow: 0 1px 10px 1px #00000012;
    background-color: white;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .right_block {
    flex: 0 0 70%;
    max-width: 70%;
    padding: 0 15px;
  }

  .left_block {
    flex: 0 0 30%;
    max-width: 30%;
    padding: 0 15px;
  }

  .row_block::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    border-radius: 0;
    background: #e5e5e5;
  }

  .row_block::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #999999;
  }

  .con-input-search.vs-table--search {
    margin-right: 0;
  }

  .cardGroup_search_parentss {
    margin-left: unset;
    flex: 1;
    max-width: unset;

    input {
      width: 100%;
    }

    i {
      top: 13px;
    }
  }

  .cardGroup_searchss {
    padding: 10px 28px;
    font-size: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.fl_button {
  justify-content: space-between;
  align-items: center;
  display: flex;
}

.add_ac_rule .vs-popup,
.ed_ac_rule .vs-popup {
  width: 70%;
}

.access_rule_popup {
  .actions_block {
    right: 0;
  }
}

.add_ac_rule .vs-popup--content,
.ed_ac_rule .vs-popup--content {
  height: 100%;
}

.access_rule_popup {
  height: 100%;
  display: flex;
  position: relative;
  justify-content: space-between;
}

.access_right_page {
  .add_right_button {
    width: 100%;
    display: flex;
    position: relative;
    top: 30px;
  }

  .e-dlg-container.e-dlg-center-center {
    display: none !important;
  }

  .left_side_table {
    margin-top: 10px;
  }

  .actions_block {
    text-align: right;
    width: 100%;
  }

  .access_description {
    margin-top: 15px;
  }

  .access_left_table {
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

  // @media screen and (max-width: 1199px) {
  .vs-table--content {
    overflow: hidden;
  }
}

.access_right_page .right_block .vs-con-tbody.vs-table--tbody {
  max-height: 350px;
}

.created_by_block {
  border-right: 1px solid #0000005e;
  height: 95%;
}

.new_padd {
  padding: 0 13.8px 0 11.8px;
}
</style>
