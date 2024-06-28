<template>
  <div class="auto_task_page">
    <vs-popup class="holamundo cr_task" title="Create Auto Task" :active.sync="addTaskPopup">
      <vs-tabs v-model="auto_task_tab">
        <vs-tab label="Main">
          <Main />
          <div class="vx-col w-full next_tab_btn">
            <vs-button @click="nextToCondition" class="mt-3 unimacs_button">Condition</vs-button>
          </div>
        </vs-tab>
        <vs-tab label="Condition">
          <Condition />
          <div class="vx-col w-full mt-4 condition_btns">
            <vs-button class="mt-4 unimacs_button" @click="auto_task_tab = 0">Main</vs-button>
            <vs-button class="mt-4 unimacs_button" @click="auto_task_tab = 2">Reaction</vs-button>
          </div>
        </vs-tab>
        <vs-tab label="Reaction">
          <Reaction />
          <div class="vx-col w-full prev_tab_btn">
            <vs-button @click="nextToCondition" class="mt-3 unimacs_button">Condition</vs-button>
          </div>
        </vs-tab>
      </vs-tabs>
      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" :disabled="!validToCreate" @click="addAutoTask">Submit</vs-button>
      </div>
    </vs-popup>
    <vs-popup class="holamundo cr_task" title="Edit Auto Task" :active.sync="editTaskPopup" v-if="editTaskPopup">
      <vs-tabs v-model="edit_auto_task_tab">
        <vs-tab label="Main">
          <EditMain />
          <div class="vx-col w-full next_tab_btn">
            <vs-button @click="nextToConditionEdit" class="mt-3 unimacs_button">Condition</vs-button>
          </div>
        </vs-tab>

        <vs-tab label="Condition">
          <EditCondition />
          <div class="vx-col w-full mt-4 condition_btns">
            <vs-button class="mt-4 unimacs_button" @click="edit_auto_task_tab = 0">Main</vs-button>
            <vs-button class="mt-4 unimacs_button" @click="edit_auto_task_tab = 2">Reaction</vs-button>
          </div>
        </vs-tab>
        <vs-tab label="Reaction">
          <EditReaction />
          <div class="vx-col w-full prev_tab_btn">
            <vs-button @click="nextToConditionEdit" class="mt-3 unimacs_button">Condition</vs-button>
          </div>
        </vs-tab>
      </vs-tabs>

      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" @click="editAutoTask" :disabled="!validToEditCreate">Submit</vs-button>
      </div>
    </vs-popup>

    <vs-popup class="holamundo" title="Choose auto task table headers" :active.sync="card_colums">
      <vs-checkbox v-for="(header, index) in auto_task_headers" :key="index" class="mb-4 mt-5 custom__checkbox"
        v-model="header.show" :disabled="header.field === 'actions'">{{ header.headerName }}</vs-checkbox>

      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" @click="changeCardHeaders">Submit</vs-button>
        <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="card_colums = false">Cancel</vs-button>
      </div>
    </vs-popup>

    <vx-card>
      <div>
        <div class="vx-row table_actions">
          <div class="vx-col flex items-center">
            <vs-button @click="addTaskPopup = true" class="mr-4 unimacs_button unimacs_add_new_btn">
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" /> Add Task
            </vs-button>
            <vs-button @click="card_colums = true" class="unimacs_button" icon-pack="material-icons" icon="filter_list">
            </vs-button>

          </div>
          <!--
          <div class="vx-col flex flex-wrap float-right">
            <div class="flex-grow"></div>
            <vs-button class="ml-3" @click="card_colums = true" color="primary" type="border" icon-pack="material-icons"
              icon="filter_list"></vs-button>
          </div>
          <div class="unimacs_add_button mr-1" @click="addTaskPopup = true" style="height: 38px">
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />

            <span class="ml-2 text-base text-primary addNeww">Add New </span>
          </div> -->
          <!-- <vs-dropdown vs-trigger-click class="cursor-pointer hover_class">
            <div
              class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                {{
                    autoTasks.length - currentPage * itemsPerPage > 0
                      ? currentPage * itemsPerPage
                      : autoTasks.length
                }}
                of {{ queriedItems }}</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <vs-dropdown-menu>
              <vs-dropdown-item @click="itemsPerPage = 4">
                <span>4</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 10">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 15">
                <span>15</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 20">
                <span>20</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown> -->

          <v-select v-model="itemsPerPage" :options="[5, 10, 15, 20]" class="select_padding automation_limit"
            name="ap_type" placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'" :clearable="false" :searchable="false" />

        </div>

        <div class="con-input-search vs-table--search">
          <input type="text" class="input-search vs-table--search-input" /><i
            class="vs-icon notranslate icon-scale material-icons null">search</i>
        </div>

        <Table :itemsPerPage="itemsPerPage" :items="autoTasks" :headers="headers" @updateItem="updateTask($event)" />

      </div>
    </vx-card>
  </div>
</template>

<script>
import Table from "./TaskTable";
import Main from "./components/Main.vue";
import Condition from "./components/Condition.vue";
import Reaction from "./components/Reaction.vue";

import EditMain from "./components/update/EditMain.vue";
import EditCondition from "./components/update/EditCondition.vue";
import EditReaction from "./components/update/EditReaction.vue";
import vSelect from "vue-select";
import moduleAutoTask from "@/store/auto-task/moduleAutoTask";

export default {
  computed: {
    autoTasks() {
      return this.$store.state.autoTask.auto_tasks;
    },
    autoTaskData() {
      return this.$store.state.autoTask;
    },
    queriedItems() {
      return this.autoTasks.length;
    },
    currentPage: {
      get() {
        return 1;
      },
    },
    headers() {
      return this.task_headers.filter((h) => h.show);
    },
    validToCreate() {
      return (
        this.autoTaskData.task_data.access_point &&
        this.autoTaskData.task_data.acu &&
        this.autoTaskData.task_data.name
      );
    },
    validToEditCreate() {
      return (
        this.autoTaskData.edit_auto_task.access_point &&
        this.autoTaskData.edit_auto_task.acu &&
        this.autoTaskData.edit_auto_task.name
      );
    },
    settingsStore() {
      return this.$store.state.settings
    }
  },
  data() {
    return {
      edit_auto_task_tab: 0,
      auto_task_tab: 0,
      addTaskPopup: false,
      editTaskPopup: false,
      auto_task_headers: [
        {
          field: "created_at",
          headerName: "Create Date",
          filter: true,
          show: true,
        },
        { field: "name", headerName: "Name", filter: true, show: true },
        {
          field: "access_point_name",
          headerName: "Access Point",
          filter: true,
          show: true,
        },
        {
          field: "task_level",
          headerName: "Task Level",
          filter: true,
          show: true,
        },
        {
          field: "status",
          headerName: "Status",
          filter: true,
          show: true,
          cellRendererFramework: "CellRendererStatus",
        },
        {
          field: "actions",
          headerName: "Actions",
          show: true,
          cellRendererFramework: "CellRendererActions",
          pinned: "right",
          lockPinned: true,
          lockPosition: "right",
          cellClass: "locked-col",
          maxWidth: 120,
          minWidth: 120,
          width: 120,
          suppressSizeToFit: true
        },
      ],
      task_headers: [],
      deletedItem: null,
      itemsPerPage: 10,
      contextMenus: [
        {
          name: "Enable",
          action: "enableTasks",
        },
        {
          name: "Disable",
          action: "disableTasks",
        },
        {
          name: "Delete",
          action: "deleteTasks",
        },
      ],
      card_colums: false,
      successMessage: false,
      settings: null,
    };
  },
  methods: {
    addAutoTask() {
      const auto_task_data = {
        name: this.autoTaskData.task_data.name,
        access_point: this.autoTaskData.task_data.access_point,
        acu: this.autoTaskData.task_data.acu,
        reaction: this.autoTaskData.task_data.reaction,
        reaction_type: this.autoTaskData.task_data.reaction_type,
        reaction_access_points:
          this.autoTaskData.task_data.reaction_access_points,
        conditions: {},
        enable: this.autoTaskData.task_data.enable,
      };

      if (this.autoTaskData.conditions.length) {
        const conditions = this.autoTaskData.conditions;
        for (let i = 0; i < conditions.length; i++) {
          if (conditions[i].condition_type === "time") {
            auto_task_data.conditions.TmBeginCondition =
              conditions[i].TmBeginCondition;
            auto_task_data.conditions.TmEndCondition =
              conditions[i].TmEndCondition;
            auto_task_data.conditions.DaysOfWeek = conditions[i].DaysOfWeek;
            auto_task_data.conditions.repeat = conditions[i].repeat;
          } else if (conditions[i].condition_type === "event") {
            auto_task_data.conditions.EventsCondition =
              conditions[i].EventsCondition;
          } else if (conditions[i].condition_type === "direction") {
            auto_task_data.conditions.EventsDirection =
              conditions[i].EventsDirection;
          }
        }
      }
      this.$store.dispatch("autoTask/addAutoTask", auto_task_data).then(() => {
        this.addTaskPopup = false;
        this.$store.dispatch("autoTask/fetchAutoTasks");

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Auto task schedule created ",
        });
      });
    },
    editAutoTask() {
      const auto_task_data = {
        id: this.autoTaskData.edit_auto_task.id,
        name: this.autoTaskData.edit_auto_task.name,
        access_point: this.autoTaskData.edit_auto_task.access_point,
        acu: this.autoTaskData.edit_auto_task.acu,
        reaction: this.autoTaskData.edit_auto_task.reaction,
        reaction_type: this.autoTaskData.edit_auto_task.reaction_type,
        reaction_access_points:
          this.autoTaskData.edit_auto_task.reaction_access_points,
        conditions: {},
        enable: this.autoTaskData.edit_auto_task.enable,
      };

      if (this.autoTaskData.edit_conditions.length) {
        const conditions = this.autoTaskData.edit_conditions;
        for (let i = 0; i < conditions.length; i++) {
          if (conditions[i].condition_type === "time") {
            auto_task_data.conditions.TmBeginCondition =
              conditions[i].TmBeginCondition;
            auto_task_data.conditions.TmEndCondition =
              conditions[i].TmEndCondition;
            auto_task_data.conditions.DaysOfWeek = conditions[i].DaysOfWeek;
            auto_task_data.conditions.repeat = conditions[i].repeat;
          } else if (conditions[i].condition_type === "event") {
            auto_task_data.conditions.EventsCondition =
              conditions[i].EventsCondition;
          } else if (conditions[i].condition_type === "direction") {
            auto_task_data.conditions.EventsDirection =
              conditions[i].EventsDirection;
          }
        }
      }

      this.updateRequest(auto_task_data);
    },
    updateTask(event) {
      this.$store.dispatch("autoTask/fetchAutoTask", event.id).then(() => {
        this.editTaskPopup = true;
      });
    },
    deleteRecord(event) {
      event.one = true;
      this.deletedItem = event;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete auto task schedule`,
        accept: this.deleteTask,
        acceptText: "Delete",
      });
    },
    deleteTask() {
      this.$store
        .dispatch("autoTask/deleteAutoTask", this.deletedItem)
        .then(() => {
          this.successMessage = true;
          if (this.deletedItem.one) {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Auto task schedule deleted",
            });
          }
          this.$store.dispatch("autoTask/fetchAutoTasks");
        });
    },
    executeTask(data) {
      this.$store.dispatch("autoTask/fetchAutoTask", data.id).then((res) => {
        const task = res.data;

        const task_data = {
          conditions: task.conditions,
          name: task.name,
          access_point: task.access_point,
          acu: task.acu,
          reaction: task.reaction,
          reaction_type: task.reaction_type,
          reaction_access_points: task.reaction_access_points,
          enable: task.enable,
          one_time: true,
        };

        const conditions = task.conditions;
        const reaction_points = task.reaction_access_points;
        if (conditions && JSON.parse(conditions)) {
          task_data.conditions = JSON.parse(conditions);
          task_data.conditions.TmBeginCondition =
            task_data.conditions.TmEndCondition = this.$moment(
              new Date()
            ).format(`HH:mm:ss`);
          task_data.conditions.repeat = false;
        }
        if (
          reaction_points &&
          JSON.parse(reaction_points) &&
          JSON.parse(reaction_points).length
        ) {
          task_data.reaction_access_points = JSON.parse(reaction_points);
        }


        this.$store.dispatch("autoTask/addAutoTask", task_data).then(() => {
          this.$store.dispatch("autoTask/fetchAutoTasks");

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Auto task schedule executed",
          });
        });
      });
    },
    nextToCondition() {
      this.auto_task_tab = 1;
    },
    nextToConditionEdit() {
      this.edit_auto_task_tab = 1;
    },
    disableTask(task) {
      const task_data = {
        ...task,
        enable: false,
      };
      this.updateRequest(task_data);
    },
    async enable(task) {
      const task_data = {
        ...task,
        enable: true,
      };
      await this.updateRequest(task_data);
    },
    updateRequest(auto_task_data) {
      this.$store
        .dispatch("autoTask/updateAutoTask", auto_task_data)
        .then((res) => {
          this.editTaskPopup = false;
          this.successMessage = true;

          if (res.data.message && res.data.message === "update Pending") {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Auto task update pending",
            });
          }
          this.$store.dispatch("autoTask/fetchAutoTasks");
        });
    },
    checkItem({ event, item }) {
      this.$store.commit("autoTask/CHECK_ITEM", { event, item });
    },
    setAllChecked(value) {
      this.$store.commit("autoTask/SET_ALL_CHECKED", { event: value });
    },
    callDynamicMethod(action) {
      const selecteds = this.autoTasks.filter((t) => t.selected);
      if (selecteds.length) {
        if (action == "enableTasks") {
          selecteds.forEach((task) => {
            this.enable(task);
          });
          setTimeout(() => {
            if (this.successMessage) {
              this.$vs.notify({
                time: 7000,
                color: "success",
                title: "Auto task schedule(s) enabled ",
              });
              this.successMessage = false;
            }
          }, 100);
        }

        if (action == "disableTasks") {
          selecteds.forEach((task) => {
            this.disableTask(task);
          });
          setTimeout(() => {
            if (this.successMessage) {
              this.$vs.notify({
                time: 7000,
                color: "success",
                title: "Auto task schedule(s) disabled ",
              });
              this.successMessage = false;
            }
          }, 100);
        }

        if (action == "deleteTasks") {
          selecteds.forEach((task) => {
            this.deletedItem = task;
            this.deleteTask();
          });
          setTimeout(() => {
            if (this.successMessage) {
              this.$vs.notify({
                time: 7000,
                color: "success",
                title: "Auto task schedule(s) deleted",
              });
            }

            this.successMessage = false;
          }, 100);
        }
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Please select atleast one auto task",
        });
      }
    },
    async changeCardHeaders() {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.table_headers.auto_task_header = this.auto_task_headers;
      this.task_headers = JSON.parse(JSON.stringify(this.auto_task_headers));
      await this.$store.dispatch("setSettings", settings)
      // this.setSettings(settings);
      this.card_colums = false;
      this.$root.$emit("refreshAutoTaskTable");
    },
  },
  watch: {
    addTaskPopup(val) {
      if (!val) {
        this.auto_task_tab = 0;
        this.$store.commit("autoTask/CLEAR_TASK_DATA");
        this.$root.$emit("clear-task-data");
      }
    },
    editTaskPopup(val) {
      if (!val) {
        this.edit_auto_task_tab = 0
      }
    }
  },
  components: {
    Table,
    vSelect,
    Condition,
    Main,
    Reaction,
    EditMain,
    EditCondition,
    EditReaction,
  },
 async created() {
    if (!moduleAutoTask.isRegistered) {
      this.$store.registerModule("autoTask", moduleAutoTask);
      moduleAutoTask.isRegistered = true;
    }
    this.task_headers = JSON.parse(JSON.stringify(this.auto_task_headers));

    // this.getSettings().then((res) => {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));

      // this.settings = settings;
      if (!settings) {
        await this.$store.dispatch("setSettings",  {
          table_headers: {
            auto_task_header: this.auto_task_headers,
          },
        })

        // this.setSettings({
        //   table_headers: {
        //     auto_task_header: this.auto_task_headers,
        //   },
        // });
        this.task_headers = JSON.parse(JSON.stringify(this.auto_task_headers));
      } else {
        if (settings.table_headers) {
          if (settings.table_headers.auto_task_header) {
            this.task_headers = JSON.parse(
              JSON.stringify(settings.table_headers.auto_task_header)
            );
            this.auto_task_headers = JSON.parse(
              JSON.stringify(this.task_headers)
            );
          } else {
            const saveSettings = { ...settings };

            saveSettings.table_headers.auto_task_header =
              this.auto_task_headers;

            this.task_headers = JSON.parse(
              JSON.stringify(this.auto_task_headers)
            );
            await this.$store.dispatch("setSettings",  saveSettings)
            // this.setSettings(saveSettings);
          }
        } else {
          const saveSettings = { ...settings };
          saveSettings.table_headers = {
            auto_task_header: this.auto_task_headers,
          };

          this.task_headers = JSON.parse(
            JSON.stringify(this.auto_task_headers)
          );
          await this.$store.dispatch("setSettings",  saveSettings)
          // this.setSettings(saveSettings);
        }
      }
    // });

    this.$store.dispatch("autoTask/fetchAutoTasks");
    this.$store.dispatch("autoTask/fetchControllers");
    this.$store.dispatch("autoTask/fetchEventCommands");

    this.$root.$on("executeTask", (data) => {
      this.executeTask(data);
    });

    this.$root.$on("enableTask", (data) => {
      this.enable(data);
    });

    this.$root.$on("disableTask", (data) => {
      this.disableTask(data);
    });
    this.$root.$on("deleteRecordTask", (data) => {
      this.deleteRecord(data);
    });
  },
};
</script>

<style lang="scss">
.auto_task_page {
  .con-input-search.vs-table--search {
    margin-right: 210px;
    position: relative;
    top: -52px;

    input {
      padding: 10px 28px;
      font-size: 12px;
    }
  }

  .table_actions {
    flex-direction: row-reverse;
    margin-bottom: 14px;
    position: relative;
    padding: 0 1.5rem;

    .vx-col {
      padding: 0 5px !important;
    }

    .hover_class {
      margin-right: auto;
      top: 0 !important;
    }
  }

  .card_drop_menu {
    width: 38px;
    height: 38px;
    color: rgb(115, 103, 240);
    border: 1px solid rgb(115, 103, 240);
    border-radius: 14%;

    .leading-none i {
      margin-top: 2px;
    }
  }
}

.next_tab_btn {
  justify-content: flex-end;
  display: flex;
}

.prev_tab_btn {
  justify-content: flex-start;
  display: flex;
}

.condition_btns,
.condition_actions {
  display: flex;
  justify-content: space-between;
}

.automation_limit {
  position: absolute;
  left: 15px;
  width: 100px;
}
</style>
