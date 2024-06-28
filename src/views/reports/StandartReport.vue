<template>
  <div>
    <vs-prompt title="Export To Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
      accept-text="Export" @close="clearFields" :active.sync="activePrompt">
      <vs-input v-model="fileName" placeholder="Enter File Name.." class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
        <span class="mr-4">Cell Auto Width:</span>
        <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>
      </div>
    </vs-prompt>

    <vs-prompt title="Export To Excel" class="export-options" @cancle="clearFields" @accept="exportToExcelReport"
      accept-text="Export" @close="clearFields" :active.sync="activePromptReport">
      <vs-input v-model="fileNameReport" placeholder="Enter File Name.." class="w-full" />
      <v-select v-model="selectedFormatReport" :options="formats" class="my-4" />
      <div class="flex">
        <span class="mr-4">Cell Auto Width:</span>
        <vs-switch v-model="cellAutoWidthReport">Cell Auto Width</vs-switch>
      </div>
    </vs-prompt>
    <VideoPlayer :popupActive="popupActive" :cameraSet="camera_set" :cameraEvent="camera_event" v-if="popupActive"
      @popup="popupActive = $event" />

    <vs-popup class="holamundo" title="Report" :active.sync="userLogPopup">
      <EventInfo :userLogPopupData="userLogPopupData" v-if="userLogPopupData" />
    </vs-popup>

    <vs-popup class="holamundo report_executes" title="Report" :active.sync="events_popup">
      <div class="flex items-center justify-between">
        <v-select v-model="items_per_page_exec" :options="[10, 50, 100, 500, 1000]" class="select_padding  w-1/6" name="report_type"
          placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        <div class="exec_window">
          <div class="con-input-search vs-table--search cardGroup_search_parentss standart_rep">
            <input type="text" v-model="searchText" @input="reportSearch()" placeholder="Search within the current page"
              class="input-search vs-table--search-input cardGroup_searchss" /><i
              class="vs-icon notranslate icon-scale material-icons null">search</i>
          </div>

          <v-select v-model="report_type" :options="report_types" class="select_padding w-1/4" name="report_type"
            placeholder="Report type" :reduce="(type) => type.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

          <vs-button class="mr-6 mt-4 unimacs_button" @click="activePromptReport = true">Export</vs-button>
        </div>
      </div>

      <EventsTable class="report_event_tbl" :items="filteredReports" :search="false" :pagination="true"
        :headers="event_headers" :itemsCount="items_per_page_exec" @openDetail="openDetail($event)"
        @openReportCameras="openReportCameras($event)" />

      <CustomPaging @pageChanged="execute_page = $event" class="mt-3" :total="totalReportsPage"
        v-if="items_per_page_exec < reports_count ? true : false" />

      <vs-button class="mr-6 mt-4 unimacs_button" @click="
        events_popup = false;
      activeTab = 4;
      edit_activeTab = 4;
      ">Back</vs-button>
    </vs-popup>
    <vs-popup class="holamundo report_pop" title="Report manager" :active.sync="report_popup">
      <vs-tabs class="report_tabs" v-model="activeTab">
        <vs-tab label="Period">
          <div class="per_tab">
            <Period @setperiod="configs = $event" :configs="configs" />
          </div>
        </vs-tab>

        <vs-tab label="Event">
          <div class="ev_tab">
            <Event />
          </div>
        </vs-tab>
        <vs-tab label="Access Point">
          <div>
            <AccessPoint />
          </div>
        </vs-tab>
        <vs-tab label="Cardholders">
          <div>
            <Cardholders />
          </div>
        </vs-tab>

        <vs-tab label="Save as template">
          <div>
            <SaveTemplate @saveReport="saveReport" />
          </div>
        </vs-tab>
      </vs-tabs>
      <div class="vx-row flex items-center justify-center mt-2" v-if="activeTab === 0">
        <div class="vx-col flex flex-col">
          <span class="mt-3" style="font-size: 20px">{{
            reportDate.start
          }}</span>
          <span class="mt-3" style="font-size: 20px">{{ reportDate.end }}</span>
        </div>
      </div>
      <div class="rep_btns">
        <vs-button class="mr-6 mt-4 unimacs_button" @click="executeReport" :disabled="!isValid">Execute</vs-button>
        <vs-button class="mr-6 mt-4 unimacs_cancel_button" color="#b49b13"
          @click="report_popup = false">Cancel</vs-button>
      </div>
    </vs-popup>
    <vs-popup class="holamundo report_pop" title="Report manager" :active.sync="edit_report_popup"
      v-if="edit_report_popup">
      <vs-tabs class="report_tabs" v-model="edit_activeTab">
        <vs-tab label="Period">
          <div>
            <EditPeriod @setperiod="edit_configs = $event" :configs="edit_configs" v-if="edit_report_popup" />
          </div>
        </vs-tab>

        <vs-tab label="Event">
          <div>
            <EditEvent v-if="edit_activeTab == 1" />
          </div>
        </vs-tab>
        <vs-tab label="Access Point">
          <div>
            <EditAccessPoint v-if="edit_activeTab == 2" />
          </div>
        </vs-tab>
        <vs-tab label="Cardholders">
          <div>
            <EditCardholders v-if="edit_activeTab == 3" />
          </div>
        </vs-tab>

        <vs-tab label="Save as template">
          <div>
            <EditSaveTemplate @saveReport="updateReportItem" :saveType="saveType" />
          </div>
        </vs-tab>
      </vs-tabs>
      <div class="vx-row flex items-center justify-center mt-2" v-if="edit_activeTab == 0">
        <div class="vx-col flex flex-col">
          <span style="font-size: 20px" class="mt-3">{{
            editReportDate.start
          }}</span>
          <span style="font-size: 20px" class="mt-3">{{
            editReportDate.end
          }}</span>
        </div>
      </div>
      <div class="rep_btns">
        <vs-button class="mr-6 mt-4 unimacs_button" @click="update_executeReport"
          :disabled="!editFormValid">Execute</vs-button>
        <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="edit_report_popup = false">Cancel</vs-button>
      </div>
    </vs-popup>

    <vx-card class="report_card py-6">
      <div class="report_actions">
        <v-select v-model="itemsPerPage" :options="[10, 15, 20]" class="select_padding report_lim mr-3" name="ap_type"
          placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'" :clearable="false" :searchable="false" />
        <div class="flex items-center">
          <vs-button class="unimacs_button mr-3" @click="activePrompt = true"
            :disabled="!reports.data.length">Export</vs-button>

          <vs-button class="unimacs_button unimacs_add_new_btn" @click="report_popup = true; type = 'add'"
            v-if="permissions.addItem">
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" />Add New
          </vs-button>
        </div>
      </div>
      <Table class="rep_tbl" :headers="report_headers" @editReport="updateReport($event)" :items="reports.data" />
      <CustomPaging @pageChanged="page = $event" class="mt-3" :total="totalPage"
        v-if="itemsPerPage < reports.count ? true : false" />
    </vx-card>
  </div>
</template>

<script>
import moduleReport from "@/store/report/moduleReport";
import Table from "./components/ReportsTable.vue";
import VideoPlayer from "../../components/popups/VideoPlayer.vue";
// import Table from "@/components/custom/table/Table";
import EventsTable from "@/components/custom/table/EventLogTable";
import Period from "./components/CreatePeriod";
import Event from "./components/CreateEvents";
import AccessPoint from "./components/CreateAccessPoint";
import Cardholders from "./components/CreateCardholder";
import EditPeriod from "./components/update/EditPeriod";
import EditEvent from "./components/update/EditEvents";
import EditAccessPoint from "./components/update/EditAccessPoint";
import EditCardholders from "./components/update/EditCardholder";
import EditSaveTemplate from "./EditSaveTemplate";
import SaveTemplate from "./SaveTemplate";
import EventInfo from "./EventPopup";
import vSelect from "vue-select";
import { correctDate, correctEditDate } from "@/functions/reportDate";
export default {
  data() {
    return {
      deleteReport: null,
      event_logs: [],
      report_headers: [
        {
          headerName: "#",
          field: "count",
          filter: true,
          pinned: "left",
          lockPinned: true,
          lockPosition: "left",
          cellClass: "locked-col",
          minWidth: 100,
          width: 100,
          suppressSizeToFit: true,
        },
        {
          headerName: "Created",
          field: "createDate",
          filter: true,
          minWidth: 70,
          width: 70,
        },
        {
          headerName: "Report Name",
          field: "name",
          filter: true,
          minWidth: 70,
          width: 70,
        },
        {
          headerName: "Description",
          field: "description",
          filter: true,
          minWidth: 80,
          width: 80,
        },
        {
          headerName: "Author",
          field: "author",
          filter: true,
          minWidth: 80,
          width: 80,
        },
        {
          headerName: "Actions",
          field: "actions",
          filter: false,
          cellRendererFramework: "CellRendererActions",
          pinned: "right",
          lockPinned: true,
          lockPosition: "right",
          cellClass: "locked-col",
          minWidth: 120,
          width: 120,
          suppressSizeToFit: true,
        },
      ],
      // components: {
      //   CellRendererActions,
      // },
      contextMenuActions: [
        { name: "Copy", action: "copy" },
        { name: "Edit", action: "edit" },
        { name: "Delete", action: "delete" },
      ],
      report_popup: false,
      events_popup: false,
      configs: {
        name: "current_day",
        val: {
          target_day: null,
          target_month: null,
          target_period: {
            start_date: null,
            end_date: null,
          },
        },
        start_time: "00:00:00",
        end_time: "23:59:59",
      },
      edit_configs: {},
      event_headers: [
        {
          name: "#",
          key: "id",
        },
        { name: "Date", key: "date" },
        { name: "Access Point", key: "access_point" },
        { name: "Event", key: "event" },
        { name: "Subject", key: "subject" },
      ],
      itemsPerPage: 15,
      totalPage: 0,
      page: 1,
      userLogPopup: false,
      userLogPopupData: null,
      activeTab: 0,

      edit_report_popup: false,
      edit_activeTab: 0,
      saveType: null,
      report_type: 1,
      report_types: [
        { id: 1, label: "Standart report" },
        { id: 2, label: "Detail cardholder info" },
      ],
      activePrompt: false,
      activePromptReport: false,
      fileName: "",
      fileNameReport: "",
      formats: ["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      cellAutoWidthReport: true,
      selectedFormat: "xlsx",
      selectedFormatReport: "xlsx",
      headerTitle: [],
      headerVal: [],
      filteredReports: [],
      searchText: null,
      popupActive: false,
      camera_set: null,
      camera_event: null,
      execute_page: 1,
      reports_count: 0,
      totalReportsPage: 0,
      items_per_page_exec: 10
    };
  },
  watch: {
    edit_report_popup(val) {
      if (!val) {
        this.$store.commit("report/CLEAR_EVENTS");
        this.$store.commit("report/CLEAR_FILTERS");
      }
    },
    itemsPerPage() {
      const params = {
        page: this.page,
        page_items_count: this.itemsPerPage,
      };
      this.fetchReports(params);
    },
    page() {
      const params = {
        page: this.page,
        page_items_count: this.itemsPerPage,
      };
      this.fetchReports(params);
    },
    report_popup(val) {
      if (!val) {
        this.activeTab = 0;
        this.configs = {};
        this.$root.$emit("clearReports");
        this.$store.commit("report/CLEAR_FILTERS");
      }
    },
    async execute_page(val) {
      if (this.type === 'update') {
        await this.update_executeReport()
      } else {
        await this.executeReport()
      }
    },
   async items_per_page_exec(){
      if (this.type === 'update') {
        await this.update_executeReport()
      } else {
        await this.executeReport()
      }
    }
  },
  methods: {
    reportSearch() {
      var lowSearch = this.searchText.toLowerCase();
      const keys = ["id", "date", "access_point", "event", "subject"];
      const matched = this.event_logs.filter((val) =>
        keys.some((key) => String(val[key]).toLowerCase().includes(lowSearch))
      );

      this.filteredReports = matched;
    },
    deleteReportItem(event) {
      this.deleteReport = event;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${event.name} Report `,
        accept: this.deleteItem,
        acceptText: "Delete",
      });
    },
    deleteItem() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("report/deleteReport", this.deleteReport.id)
        .then((res) => {
          const sum = this.reports.count % this.itemsPerPage;
          if (!sum) {
            this.totalPage = Math.floor(this.reports.count / this.itemsPerPage);
          } else {
            this.totalPage =
              Math.floor(this.reports.count / this.itemsPerPage) + 1;
          }
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Report Deleted",
          });
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    copyReport(event) {
      this.$store.dispatch("report/fetchReport", event.id).then((res) => {
        this.saveType = "copy";
        this.edit_report_popup = true;
      });
    },
    updateReport(event) {
      this.type = "update";
      this.$store.dispatch("report/fetchReport", event.id).then((res) => {
        if (res.data.period) {
          res.data.period.val = res.data.period.value;
          res.data.period.start_time = res.data.start_time;
          res.data.period.end_time = res.data.end_time;
        }
        this.edit_configs = res.data.period;
        this.saveType = "edit";

        this.edit_report_popup = true;
      });
    },
    saveReport() {
      const report_data = this.$store.state.report;

      const name = report_data.template.name;
      const description = report_data.template.description;
      const event_find = report_data.event_list.length
        ? report_data.event_list.filter((e) => e.selected)
        : [];

      const events = event_find.length ? event_find.map((e) => +e.id) : [];

      const access_points_find = report_data.access_points.length
        ? report_data.access_points.filter((e) => e.selected)
        : [];

      const access_points = access_points_find.length
        ? access_points_find.map((e) => +e.id)
        : [];

      const cardholders_find = report_data.cardholders.length
        ? report_data.cardholders.filter((e) => e.selected)
        : [];

      const cardholders = cardholders_find.length
        ? cardholders_find.map((e) => +e.id)
        : [];

      let period = {};

      if (
        this.configs.name !== "target_day" &&
        this.configs.name !== "target_month" &&
        this.configs.name !== "target_period"
      ) {
        period = {
          key: this.configs.name,
          value: true,
        };
      } else {
        period = {
          key: this.configs.name,
        };
        if (this.configs.name == "target_period") {
          period.value = this.configs.val[this.configs.name];
        } else {
          period.value = this.configs.val[this.configs.name];
        }
      }

      const object = {
        name: name,
        description: description,
        period: period,
        start_time: this.configs.start_time,
        end_time: this.configs.end_time,
        events: events,
        access_points: access_points,
        cardholders: cardholders,
      };

      this.$store.dispatch("report/SAVE_REPORT", object).then((res) => {
        const sum = this.reports.count % this.itemsPerPage;
        if (!sum) {
          this.totalPage = Math.floor(this.reports.count / this.itemsPerPage);
        } else {
          this.totalPage =
            Math.floor(this.reports.count / this.itemsPerPage) + 1;
        }

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Report created",
        });
        this.report_popup = false;
        this.activeTab = 0;
      });
    },
    updateReportItem() {
      const report_data = this.$store.state.report;

      const name = report_data.edit_template.name;
      const description = report_data.edit_template.description;

      const event_find = report_data.edit_event_list.length
        ? report_data.edit_event_list.filter((e) => e.selected)
        : [];

      const events = event_find.length
        ? event_find.map((e) => +e.id)
        : report_data.editedReport.events.length
          ? report_data.editedReport.events
          : [];

      const access_points_find = report_data.edit_access_points.length
        ? report_data.edit_access_points.filter((e) => e.selected)
        : [];

      const access_points = access_points_find.length
        ? access_points_find.map((e) => +e.id)
        : report_data.editedReport.access_points.length
          ? report_data.editedReport.access_points
          : [];

      const cardholders_find = report_data.edit_cardholders.length
        ? report_data.edit_cardholders.filter((e) => e.selected)
        : [];

      const cardholders = cardholders_find.length
        ? cardholders_find.map((e) => +e.id)
        : report_data.editedReport.cardholders.length
          ? report_data.editedReport.cardholders
          : [];

      let period = {};
      if (
        this.edit_configs.key !== "target_day" &&
        this.edit_configs.key !== "target_month" &&
        this.edit_configs.key !== "target_period"
      ) {
        period = {
          key: this.edit_configs.key,
          value: true,
        };
      } else {
        period = {
          key: this.edit_configs.key,
        };
        if (this.edit_configs.key == "target_period") {
          period.value = this.edit_configs.val[this.edit_configs.key];
        } else {
          period.value = this.edit_configs.val[this.edit_configs.key];
        }
      }

      let object = {
        id: report_data.editedReport.id,
        name: name,
        description: description,
        period: period,
        start_time: this.edit_configs.start_time,
        end_time: this.edit_configs.end_time,
        events: events,
        access_points: access_points,
        cardholders: cardholders,
      };

      if (this.saveType == "edit") {
        this.$store.dispatch("report/updateReport", object).then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Report updated",
          });
          this.edit_report_popup = false;
          this.edit_activeTab = 0;

          const params = {
            page: this.page,
            page_items_count: this.itemsPerPage,
          };
          this.fetchReports(params);
        });
      } else {
        delete object.id;
        this.$store.dispatch("report/SAVE_REPORT", object).then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Report copied",
          });
          this.edit_report_popup = false;
          this.edit_activeTab = 0;
        });
      }
    },
    openDetail(trData) {
      let event = this.saveLogs.find((l) => l.id == trData.id);
      let save = { ...event };
      if (save.cardholder) {
        save.cardholder = JSON.parse(save.cardholder);
        if (save.cardholder.avatar) {
          save.cardholder.image = `${process.env.VUE_APP_BACK}/${save.cardholder.avatar.path}`;
        }
      }
      if (save.credential) {
        save.credential = JSON.parse(save.credential);
      }
      if (save.access_point) {
        save.access_point = JSON.parse(save.access_point);
      }

      if (save.access_right) {
        save.access_right = JSON.parse(save.access_right);
      }
      this.userLogPopupData = save;
      this.userLogPopup = true;
    },

    async executeReport() {
      const report_data = this.$store.state.report;
      const params = {};
      if (report_data.access_points.length) {
        const acc_points = report_data.access_points.filter((a) => a.selected);
        if (acc_points && acc_points.length) {
          params.access_points = acc_points.map((item) => item.id);
        }
      }
      if (report_data.cardholders.length) {
        // params.cardholders = report_data.cardholders.filter((c) => c.selected);

        const cards = report_data.cardholders.filter((a) => a.selected);
        if (cards && cards.length) {
          params.cardholders = cards.map((item) => item.id);
        }
      }
      if (report_data.event_list.length) {
        const events = report_data.event_list.filter((a) => a.selected);

        if (events && events.length) {
          params.events = events.map((item) => item.id);
        }
      }

      params.start_time = this.configs.start_time;
      params.end_time = this.configs.end_time;
      if (
        this.configs.name !== "target_day" &&
        this.configs.name !== "target_month" &&
        this.configs.name !== "target_period"
      ) {
        params.period = {
          key: this.configs.name,
          value: true,
        };
      } else {
        params.period = {
          key: this.configs.name,
        };
        if (this.configs.name == "target_period") {
          params.period.value = this.configs.val[this.configs.name];
          params.period = JSON.stringify(params.period);
        } else {
          params.period.value = this.configs.val[this.configs.name];
        }
      }

      params.page = this.execute_page
      params.page_items_count = this.items_per_page_exec

      await this.fetchExecute(params)
    },
    async update_executeReport() {
      const report_data = this.$store.state.report; // .editedReport
      const params = {};

      if (report_data.edit_access_points.length) {
        const filter = report_data.edit_access_points.filter((a) => a.selected);
        params.access_points = filter.map((a) => +a.id);
      } else if (report_data.editedReport.access_points.length) {
        params.access_points = report_data.editedReport.access_points;
      } else {
        params.access_points = [];
      }

      if (report_data.edit_cardholders.length) {
        const filter = report_data.edit_cardholders.filter((a) => a.selected);
        params.cardholders = filter.map((c) => +c.id);
      } else if (report_data.editedReport.cardholders.length) {
        params.cardholders = report_data.editedReport.cardholders;
      } else {
        params.cardholders = [];
      }

      if (report_data.edit_event_list.length) {
        const filter = report_data.edit_event_list.filter((a) => a.selected);
        params.events = filter.map((e) => +e.id);
      } else if (report_data.editedReport.events.length) {
        params.events = report_data.editedReport.events;
      } else {
        params.events = [];
      }

      params.start_time = this.edit_configs.start_time;
      params.end_time = this.edit_configs.end_time;
      if (
        this.edit_configs.key !== "target_day" &&
        this.edit_configs.key !== "target_month" &&
        this.edit_configs.key !== "target_period"
      ) {
        params.period = {
          key: this.edit_configs.key,
          value: true,
        };
      } else {
        params.period = {
          key: this.edit_configs.key,
        };
        if (this.edit_configs.key == "target_period") {
          params.period.value = this.edit_configs.val[this.edit_configs.key];
          params.period = JSON.stringify(params.period);
        } else {
          params.period.value = this.edit_configs.val[this.edit_configs.key];
        }
      }
      params.page = this.execute_page
      params.page_items_count = this.items_per_page_exec

      await this.fetchExecute(params)
      // this.$http
      //   .get(`/standardReport/execute`, {
      //     headers: { Authorization: localStorage.token },
      //     params,
      //   })
      //   .then((res) => {
      //     const events = res.data.count ? res.data.data : res.data;
      //     let event_arr = [];

      //     if (events.length) {
      //       events.forEach((event, index) => {
      //         this.$store.commit("report/saveLogs", { id: index, ...event });
      //         let eventObj = {};

      //         eventObj.id = index + 1;

      //         // eventObj.date = event.date;
      //         eventObj.event_type = event.event_type;
      //         eventObj.event = event.event;
      //         eventObj.result = event.result;
      //         eventObj.event_source = event.event_source;
      //         eventObj.direction = event.direction;
      //         if (event.cardholder) {
      //           event.cardholder = JSON.parse(event.cardholder);
      //           eventObj.full_name = event.cardholder.last_name
      //             ? event.cardholder.first_name +
      //             " " +
      //             event.cardholder.last_name
      //             : event.cardholder.first_name;

      //           eventObj.subject = eventObj.full_name

      //           if (event.cardholder.email) {
      //             eventObj.email = event.cardholder.email;
      //           }
      //           if (event.cardholder.status) {
      //             eventObj.status = event.cardholder.status;
      //           }

      //           eventObj.company = event.cardholder.company_name;

      //           if (event.cardholder.phone) {
      //             eventObj.phone = event.cardholder.phone;
      //           }

      //           // if(event.cardholder.cardholder_groups){
      //           eventObj.cardholder_groups = event.cardholder.cardholder_groups;
      //           // }
      //         }

      //         if (event.credential) {
      //           event.credential = JSON.parse(event.credential);
      //           eventObj.credential = event.credential.type;
      //         }

      //         if (event.access_right) {
      //           event.access_right = JSON.parse(event.access_right);
      //           eventObj.access_right = event.access_right.name;
      //         }
      //         if (event.access_point) {
      //           event.access_point = JSON.parse(event.access_point);
      //           eventObj.access_point = event.access_point.name;
      //           eventObj.access_point_data = event.access_point;

      //           eventObj.zone = event.access_point.zone;
      //         }

      //         let time_zone = null;
      //         if (event.access_point) {
      //           time_zone = event.access_point.time_zone;
      //         }
      //         const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
      //         var isFirefox = typeof InstallTrigger !== "undefined";
      //         var isSafari =
      //           navigator.vendor &&
      //           navigator.vendor.indexOf("Apple") > -1 &&
      //           navigator.userAgent &&
      //           navigator.userAgent.indexOf("CriOS") == -1 &&
      //           navigator.userAgent.indexOf("FxiOS") == -1;

      //         var is_OSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

      //         let correct_date;
      //         if (isFirefox || isSafari || is_OSX) {
      //           const local = this.$moment
      //             .utc(event.date, "YYYY-MM-DD HH:mm:ss")
      //             .tz(time_zone ? time_zone : time);
      //           const momentFormat = this.$moment(
      //             local,
      //             "YYYY-MM-DD HH:mm:ss"
      //           ).format("YYYY-MM-DD HH:mm:ss");
      //           correct_date = momentFormat;
      //         } else {
      //           correct_date = this.$moment(event.date + " GMT+0000")
      //             .tz(time_zone ? time_zone : time)
      //             .format(`YYYY-MM-DD HH:mm:ss`);
      //         }
      //         eventObj.date = correct_date; // new

      //         event_arr.push(eventObj);
      //       });
      //       this.event_logs = event_arr;
      //       this.filteredReports = JSON.parse(JSON.stringify(event_arr));

      //       if (!this.events_popup) {
      //         this.events_popup = true
      //       }
      //     } else {
      //       this.$vs.notify({
      //         time: 7000,
      //         color: "danger",
      //         title: "There are no reports for the specified parameters",
      //       });
      //     }
      //   });
    },
    fetchReports(params) {
      this.$store.dispatch("report/fetchReports", params).then((res) => {
        const sum = res.data.count % this.itemsPerPage;
        if (!sum) {
          this.totalPage = Math.floor(res.data.count / this.itemsPerPage);
        } else {
          this.totalPage = Math.floor(res.data.count / this.itemsPerPage) + 1;
        }
      });
    },
    exportToExcel() {
      const name = this.fileName;

      import("@/vendor/Export2Excel").then((excel) => {
        const list = this.reports.data;
        const data = this.formatJson(this.headerVal, list);

        excel.export_json_to_excel({
          header: this.headerTitle,
          data,
          filename: name,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat,
        });
        this.clearFields();
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    exportToExcelReport() {
      const name = this.fileNameReport;
      let headers;
      let headerTitleReport;
      if (this.report_type === 1) {
        headers = this.headerValReport;
        headerTitleReport = this.headerTitleReport;
      } else if (this.report_type === 2) {
        headers = [
          ...this.headerValReport,
          "direction",
          "cardholder_groups",
          "company",
          "access_right",
        ];
        headerTitleReport = [
          ...this.headerTitleReport,
          "Direction",
          "Cardholder Group",
          "Company",
          "Access Right",
        ];
      }

      import("@/vendor/Export2Excel").then((excel) => {
        const list = this.filteredReports;
        const data = this.formatJson(headers, list);

        excel.export_json_to_excel({
          header: headerTitleReport,
          data,
          filename: name,
          autoWidth: this.cellAutoWidthReport,
          bookType: this.selectedFormatReport,
        });
        this.clearFields();
      });
    },
    clearFields() {
      this.filename = "";
      this.fileNameReport = "";

      this.cellAutoWidth = true;
      this.selectedFormat = "xlsx";
      this.selectedFormatReport = "xlsx";
    },
    openReportCameras(event) {
      const ac_data = event.access_point_data;
      if (ac_data && ac_data.camera_set) {
        this.camera_set = ac_data.camera_set;
        this.camera_event = event;
        this.popupActive = true;
      }
    },
    fetchExecute(params) {
      this.$http
        .get(`/standardReport/execute`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((res) => {
          const events = res.data.count ? res.data.data : res.data;
          this.reports_count = res.data.count
          let event_arr = [];

          if (events.length) {
            events.forEach((event, index) => {
              const cloneEvent = JSON.parse(JSON.stringify(event));
              // this.$store.commit("report/saveLogs", { id: index, ...event });

              let eventObj = {};

              // if (event.event_type == "ACCESS") {
              eventObj.id = index + 1;

              // eventObj.date = event.date;
              eventObj.event_type = event.event_type;
              eventObj.event = event.event;
              eventObj.result = event.result;
              eventObj.event_source = event.event_source;
              eventObj.direction = event.direction;

              if (event.cardholder) {
                event.cardholder = JSON.parse(event.cardholder);
                eventObj.full_name = event.cardholder.last_name
                  ? event.cardholder.first_name +
                  " " +
                  event.cardholder.last_name
                  : event.cardholder.first_name;
                eventObj.subject = eventObj.full_name;

                if (event.cardholder.email) {
                  eventObj.email = event.cardholder.email;
                }
                if (event.cardholder.status) {
                  eventObj.status = event.cardholder.status;
                }

                if (event.cardholder.company_name) {
                  eventObj.company = event.cardholder.company_name;
                }

                if (event.cardholder.phone) {
                  eventObj.phone = event.cardholder.phone;
                }

                if (event.cardholder.cardholder_groups) {
                  eventObj.cardholder_groups = event.cardholder
                    .cardholder_groups
                    ? event.cardholder.cardholder_groups.name
                    : "";
                }
              }

              if (event.credential) {
                event.credential = JSON.parse(event.credential);
                eventObj.credential = event.credential.type;
              }

              if (event.access_right) {
                event.access_right = JSON.parse(event.access_right);
                eventObj.access_right = event.access_right.name;
              }
              if (event.access_point) {
                event.access_point = JSON.parse(event.access_point);
                eventObj.access_point = event.access_point.name;
                eventObj.access_point_data = event.access_point;
                eventObj.zone = event.access_point.zone;
              }

              let time_zone = null;
              if (event.access_point) {
                time_zone = event.access_point.time_zone;
              }

              const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
              var isFirefox = typeof InstallTrigger !== "undefined";
              var isSafari =
                navigator.vendor &&
                navigator.vendor.indexOf("Apple") > -1 &&
                navigator.userAgent &&
                navigator.userAgent.indexOf("CriOS") == -1 &&
                navigator.userAgent.indexOf("FxiOS") == -1;

              var is_OSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

              let correct_date;
              if (isFirefox || isSafari || is_OSX) {
                const local = this.$moment
                  .utc(event.date, "YYYY-MM-DD HH:mm:ss")
                  .tz(time_zone ? time_zone : time);
                const momentFormat = this.$moment(
                  local,
                  "YYYY-MM-DD HH:mm:ss"
                ).format("YYYY-MM-DD HH:mm:ss");
                correct_date = momentFormat;
              } else {
                correct_date = this.$moment(event.date + " GMT+0000")
                  .tz(time_zone ? time_zone : time)
                  .format(`YYYY-MM-DD HH:mm:ss`);
              }
              eventObj.date = correct_date; // new
              // this.$store.commit("report/saveLogs", { id: index + 1, ...event });

              event_arr.push(eventObj);
              cloneEvent.date = correct_date; // new
              this.$store.commit("report/saveLogs", {
                id: index + 1,
                ...cloneEvent,
              });

              // }
            });
            this.event_logs = event_arr;

            const sum = res.data.count % this.items_per_page_exec;
            if (!sum) {
              this.totalReportsPage = Math.floor(res.data.count / this.items_per_page_exec);
            } else {
              this.totalReportsPage =
                Math.floor(res.data.count / this.items_per_page_exec) + 1;
            }

            this.filteredReports = JSON.parse(JSON.stringify(event_arr));
            if (!this.events_popup) {
              this.events_popup = true
            }
          } else {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "There are no reports for the specified parameters",
            });
          }
        });
    }
  },
  computed: {
    reportDate() {
      return correctDate(this.configs);
    },
    editReportDate() {
      return correctEditDate(this.edit_configs);
    },
    currentPage: {
      get() {
        return 1;
      },
    },
    queriedItems() {
      return this.reports.count;
    },
    permissions() {
      return localStorage.permissions &&
        JSON.parse(localStorage.permissions)[this.$route.name]
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },
    saveLogs() {
      return this.$store.state.report.saveLogs;
    },
    reports() {
      return this.$store.state.report.reports;
    },
    isValid() {
      const name = this.configs.name;
      const start_time = this.configs.start_time;
      const end_time = this.configs.end_time;
      let period;
      if (name == "target_day") {
        if (this.configs.val.target_day) period = true;
      } else if (name == "target_month") {
        if (this.configs.val.target_month) period = true;
      } else if (name == "target_period") {
        if (
          this.configs.val.target_period.end_date &&
          this.configs.val.target_period.start_date
        )
          period = true;
      } else {
        period = true;
      }

      return name && start_time && end_time && period;
    },
    editFormValid() {
      // edit_configs
      const name = this.edit_configs.key;
      const start_time = this.edit_configs.start_time;
      const end_time = this.edit_configs.end_time;

      let period;
      if (name == "target_day") {
        if (this.edit_configs.val.target_day) period = true;
      } else if (name == "target_month") {
        if (this.edit_configs.val.target_month) period = true;
      } else if (name == "target_period") {
        if (this.edit_configs.val.target_period) {
          if (
            this.edit_configs.val.target_period.end_date &&
            this.edit_configs.val.target_period.start_date
          ) {
            period = true;
          }
        } else if (
          this.edit_configs.val.end_date &&
          this.edit_configs.val.start_date
        ) {
          period = true;
        }
      } else {
        period = true;
      }

      return name && start_time && end_time && period;
    },
  },
  created() {
    this.$root.$on("reportDelete", (data) => {
      this.deleteReportItem(data);
    });

    this.$root.$on("reportEdit", (data) => {
      this.updateReport(data);
    });

    if (!moduleReport.isRegistered) {
      this.$store.registerModule("report", moduleReport);
      moduleReport.isRegistered = true;
    }

    this.headerTitle = this.report_headers.map((item) => {
      return item.headerName;
    });

    this.headerVal = this.report_headers.map((item) => {
      return item.field;
    });

    this.headerTitleReport = this.event_headers.map((item) => {
      return item.name;
    });

    this.headerValReport = this.event_headers.map((item) => {
      return item.key;
    });

    const params = {
      page: this.page,
      page_items_count: this.itemsPerPage,
    };
    this.fetchReports(params);
  },
  components: {
    Table,
    Period,
    Event,
    AccessPoint,
    Cardholders,
    SaveTemplate,
    EventsTable,
    EventInfo,
    EditPeriod,
    EditEvent,
    EditAccessPoint,
    EditCardholders,
    EditSaveTemplate,
    vSelect,
    VideoPlayer,
    // CellRendererActions
  },
};
</script>

<style lang="scss">
@import url("./css/style.css");

.ag-root-wrapper.ag-layout-normal.ag-ltr {
  width: 100%;
}

.report_event_tbl {
  margin-top: 10px;

  .vs-table--tbody {
    max-height: 430px;
  }
}

.report_executes {
  .vs-popup {
    width: 1200px;
    height: 700px;
    position: relative;
  }

  .vs-table--search {
    margin-top: -52px;
    margin-right: 15px;
    max-width: 250px !important;
  }

  .cardGroup_searchss {
    padding: 12px 28px;
    font-size: 12px;
    width: 250px !important;
  }

  .exec_window {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-end;
  }

  .select_padding {
    margin-right: 15px;
  }
}

.report_pop {
  .vs-popup {
    width: 1400px;
    height: 800px;
    position: relative;
  }
}

.report_left_block {
  display: inline-block;
}

.report_right_block {
  display: flex;
  align-items: center;
  flex-wrap: unset;
  float: right;
  margin-bottom: 15px;
}

.rep_btns {
  position: absolute;
  bottom: 15px;
  right: 15px;
}

.rep_tbl {
  margin-top: 14px;

  .tr-values {
    .vs-table--td {
      padding: 0 15px !important;
    }
  }
}

.report_lim {
  // position: absolute;
  width: 130px;
  position: absolute;
  left: 22px;
}

.report_actions {
  display: flex;
  align-items: center;
  justify-content: end;
  width: 100%;
  right: 23px;
}

.report_card .vx-card__body {
  padding-top: 0 !important;
}

.standart_rep {
  input::placeholder {
    font-family: Montserrat, Helvetica, Arial, sans-serif;
    background-color: transparent;
    border-color: transparent;

    // font-size: 13px;
    }
}
</style>
