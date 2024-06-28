<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container company_page">
    <vs-prompt title="Export To Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
      accept-text="Export" @close="clearFields" :active.sync="activePrompt">
      <vs-input v-model="fileName" placeholder="Enter File Name.." class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
        <span class="mr-4">Cell Auto Width:</span>
        <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>
      </div>
    </vs-prompt>

    <div class="centerx">
      <vs-popup class="holamundo" title="Choose rows" :active.sync="rowsPopup">
        <vs-checkbox v-for="(header, index) in event_headers" :key="index" class="mb-4 mt-5 custom__checkbox"
          v-model="header.show">{{ header.headerName }}</vs-checkbox>

        <div class="screen_false">
          <vs-button class="mt-4 unimacs_button" @click="changeHeaders">Submit</vs-button>

          <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="rowsPopup = false">Cancel</vs-button>
        </div>
      </vs-popup>
      <vs-popup class="holamundo events_log_inform" title="Detail Information" :active.sync="userLogPopup">
        <div class="info_images">
          <div class="table_image">
            <img v-if="userLogPopupData && userLogPopupData.cardholder && userLogPopupData.cardholder.image"
              :src="userLogPopupData.cardholder.image" />
            <img v-else src="/no_avatar.svg" alt="" title="" />
          </div>

          <div class="ev_user_images">
            <div class="card__img">
              <img v-if="userLogPopupData &&
                userLogPopupData.cardholder &&
                userLogPopupData.cardholder.car_image
                " :src="userLogPopupData.cardholder.car_image" />
              <img v-else src="/no_car.svg" alt="" title="" />
            </div>
          </div>
        </div>

        <div class="event_popup_inner log" v-if="userLogPopupData">
          <div class="date_time_info">
            <table>
              <tr>
                <td>Date/Time:</td>
                <td>
                  {{ userLogPopupData.date ? userLogPopupData.date : "" }}
                </td>
              </tr>
              <tr>
                <td>Entry:</td>
                <td>
                  {{ userLogPopupData.date ? userLogPopupData.date : "" }}
                </td>
              </tr>

              <tr>
                <td>Event:</td>
                <td>
                  {{ userLogPopupData.event ? userLogPopupData.event : "" }}
                </td>
              </tr>
              <tr>
                <td v-if="userLogPopupData && userLogPopupData.cardholder">
                  Direction:
                </td>
                <td>
                  {{
                    userLogPopupData && userLogPopupData.direction
                    ? userLogPopupData.direction
                    : ""
                  }}
                </td>
              </tr>
              <tr>
                <td v-if="userLogPopupData && userLogPopupData.credential">
                  Credential:
                </td>
                <td>
                  {{
                    userLogPopupData.credential
                    ? getCredential(userLogPopupData.credential)
                    : ""
                  }}
                </td>
              </tr>
            </table>
          </div>
          <div class="user_info_block" v-if="userLogPopupData && userLogPopupData.cardholder">
            <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
              <vs-tab label="Main info " icon-pack="feather" icon="icon-user">
                <div class="event_user_info_inner">
                  <div class="user_info">
                    <table>
                      <tr>
                        <td>Name:</td>
                        <td>
                          {{
                            userLogPopupData && userLogPopupData.cardholder
                            ? userLogPopupData.cardholder.first_name
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Last Name:</td>
                        <td>
                          {{
                            userLogPopupData && userLogPopupData.cardholder
                            ? userLogPopupData.cardholder.last_name
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Family name</td>
                        <td>
                          {{
                            userLogPopupData && userLogPopupData.cardholder
                            ? userLogPopupData.cardholder.family_name
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Company:</td>
                        <td>
                          {{
                            userLogPopupData && userLogPopupData.cardholder
                            ? userLogPopupData.cardholder.company_name
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Group:</td>
                        <td>
                          {{
                            userLogPopupData &&
                            userLogPopupData.cardholder &&
                            userLogPopupData.cardholder.cardholder_groups
                            ? userLogPopupData.cardholder.cardholder_groups
                              .name
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Access Right:</td>
                        <td>
                          {{
                            userLogPopupData && userLogPopupData.access_right
                            ? userLogPopupData.access_right.name
                            : ""
                          }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </vs-tab>

              <vs-tab label="Extend info" icon-pack="feather" icon="icon-user">
                <div class="">
                  <div class="event_user_info_inner">
                    <div class="user_info mt-3">
                      <table>
                        <tr>
                          <td>Valid due:</td>
                          <td>
                            {{
                              userLogPopupData.cardholder
                              ? userLogPopupData.cardholder.first_name
                              : ""
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>E-mai:</td>
                          <td>
                            {{
                              userLogPopupData.cardholder
                              ? userLogPopupData.cardholder.last_name
                              : ""
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Phone:</td>
                          <td>
                            {{
                              userLogPopupData && userLogPopupData.cardholder
                              ? userLogPopupData.cardholder.phone
                              : ""
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Anti-passback</td>
                          <td>
                            {{
                              // userLogPopupData.cardholder
                              // ? userLogPopupData.cardholder.company_name
                              // :
                              ""
                            }}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </vs-tab>
            </vs-tabs>
          </div>
        </div>
      </vs-popup>
    </div>
    <div class="vx-card p-6 event_log_card" style="min-height: 750px">
      <div class="flex flex-wrap items-center float-right">
        <div class="flex-grow mr-8"></div>
        <vs-button class="unimacs_button mr-5" @click="activePrompt = true"
          :disabled="!logs.data.length">Export</vs-button>
        <vs-button @click="rowsPopup = true" class="unimacs_button columns_button" color="primary"
          icon-pack="material-icons" icon="filter_list"></vs-button>
      </div>

      <div class="vx-row" style="position: relative">
        <v-select v-model="itemsPerPage" :options="[10, 20, 50, 100, 500, 1000, 5000]"
          class="select_padding ev_log_lim mr-3" name="ap_type" placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :clearable="false" :searchable="false" />
          <vs-checkbox  @change="disableDate = $event.target.checked"></vs-checkbox>
          <div class="vx-row date_filter mr-3">
            <div class="vx-col md:w-1/2 start_date" :class="{ disable_date_time: !disableDate }">
              <flat-pickr :disabled="!disableDate" :config="configdateTimePicker" v-model="startDate"
                placeholder="Start Time" />
            </div>
            <div class="vx-col md:w-1/2 endDate" :class="{ disable_date_time: !disableDate }">
              <flat-pickr :disabled="!disableDate" :config="configdateTimePicker" v-model="endDate"
                placeholder="End Time" />
            </div>
          </div>

          <vs-button @click="filterByDate" :disabled="!isFormValid" class="unimacs_button" icon-pack="material-icons"
            icon="search"></vs-button>
      </div>

      <Table :items="logs.data" :headers="headers" @openDetail="openDetail($event)" />
      <CustomPaging class="ev_log_paging" @pageChanged="page = $event" ref="customPaging" :total="totalPage"
        v-if="itemsPerPage < logs.count ? true : false" />
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import moduleUser from "@/store/user/moduleUserManagement.js";
import vSelect from "vue-select";
import Table from "./Table.vue";
import {
  flatToObject,
} from "../dashboard/utils";
export default {
  watch: {
    rowsPopup(val) {
      if (!val) {
        this.event_headers = JSON.parse(JSON.stringify(this.event_header));
      }
    },
    itemsPerPage() {
      this.page = 1;
      const params = { page: 1, page_items_count: this.itemsPerPage };

      this.$refs.customPaging.resetPage(1);
      // if(this.startDate) params.start_from = this.startDate
      // if(this.endDate) params.start_to = this.endDate

      this.fetchLogs(params);
    },
    page(event) {
      const params = { page: this.page, page_items_count: this.itemsPerPage };

      if (this.startDate) params.start_from = this.startDate;
      if (this.endDate) params.start_to = this.endDate;
      this.$vs.loading();

      this.fetchLogs(params);
      setTimeout(() => {
        this.$vs.loading.close();
      }, 400);
    },
    disableDate(val) {
      if (!val) {

        if (this.endDate || this.startDate) {

          this.page = 1;
          this.$refs.customPaging.resetPage(1);
          const params = { page: 1, page_items_count: this.itemsPerPage };

          this.fetchLogs(params);
        }

        this.startDate = null;
        this.endDate = null;
      }
    },
    startDate() {
      if (
        new Date(this.startDate) > new Date(this.endDate) &&
        this.endDate &&
        this.startDate
      ) {
        this.startDate = this.$moment(new Date())
          .subtract(1, "months")
          .endOf("month")
          .format("yyyy-MM-DD");
        this.endDate = this.$moment(new Date()).format("yyyy-MM-DD");
      }
    },
    endDate() {
      if (
        new Date(this.startDate) > new Date(this.endDate) &&
        this.endDate &&
        this.startDate
      ) {
        this.startDate = this.$moment(new Date())
          .subtract(1, "months")
          .endOf("month")
          .format("yyyy-MM-DD");
        this.endDate = this.$moment(new Date()).format("yyyy-MM-DD");
      }
    },
  },
  data() {
    return {
      userLogPopupData: null,
      userLogPopup: false,
      activeTab: 0,
      startDate: null,
      endDate: null,
      itemsPerPage: 10,
      totalPage: 0,
      page: 1,
      rowsPopup: false,
      disableDate: false,
      configdateTimePicker: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      logs: {
        count: 0,
        data: [],
      },
      saveLogs: [],
      event_header: [],
      event_headers: [
        {
          headerName: "Date/Time",
          field: "date",
          filter: true,
          show: true,
          minWidth: 200,
          // width: 200,
        },
        {
          headerName: "Event Type",
          field: "event_type",
          filter: true,
          show: true,
          minWidth: 160,
          // width: 160,
        },
        {
          headerName: "Full Name / Event Source",
          field: "full_name",
          filter: true,
          show: true,
          minWidth: 260,
          // width: 260,
        },
        {
          headerName: "Credential",
          field: "credential",
          filter: true,
          show: true,
          minWidth: 150,
          // width: 150,
        },
        {
          headerName: "Access Right",
          field: "access_right",
          filter: true,
          show: true,
          minWidth: 160,
          // width: 160,
        },
        {
          headerName: "Access Point",
          field: "access_point",
          filter: true,
          show: true,
          minWidth: 180,
          // width: 180,
        },
        {
          headerName: "Event",
          field: "event",
          filter: true,
          show: true,
          minWidth: 150,
          // width: 150,
        },
        {
          headerName: "Result",
          field: "result",
          filter: true,
          show: true,
          minWidth: 150,
          // width: 150,
        },
        {
          headerName: "Direction",
          field: "direction",
          filter: true,
          show: true,
          minWidth: 160,
          // width: 160,
        },

        {
          headerName: "Status",
          field: "status",
          filter: true,
          show: false,
          minWidth: 130,
          // width: 130,
        },
        {
          headerName: "Event Source",
          field: "event_source",
          filter: true,
          show: false,
          minWidth: 180,
          // width: 180,
        },
        {
          headerName: "Email",
          field: "email",
          filter: true,
          show: false,
          minWidth: 150,
          // width: 150,
        },
        {
          headerName: "Phone",
          field: "phone",
          filter: true,
          show: false,
          minWidth: 130,
          // width: 130,
        },
        {
          headerName: "Company",
          field: "company_name",
          filter: true,
          show: false,
          minWidth: 160,
          // width: 160,
        },
      ],
      fileName: "",
      formats: ["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      headerTitle: [],
      headerVal: [],
      settings: null,
      activePrompt: false,
    };
  },
  computed: {
    headers() {
      return this.event_header.filter((l) => l.show);
    },
    currentPage: {
      get() {
        return 1;
      },
    },
    queriedItems() {
      return this.logs.count;
      // return this.$refs.logs_table
      //   ? this.$refs.logs_table.queriedResults.length
      //   : this.logs.length;
    },
    chipColor() {
      return (value) => {
        if (value == "change") return "rgb(218 181 46)";
        else if (value == "delete") return "danger";
        else if (value == "create") return "rgb(100 187 111)";
        else if (value == "login") return "rgb(52 123 195)";
        else if (value == "logout") return "rgb(52 123 195)";
      };
    },
    isFormValid() {
      return (this.startDate || this.endDate) && this.disableDate;
    },
    getDirection() {
      return (tr) => {
        if (tr.length) {
          const lower = tr.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        } else {
          return "";
        }
      };
    },
    getCredential() {
      return (credential) => {
        let code_;
        if (credential.type) {
          const hex_code = credential.code.replace(/ /g, "");
          const code = BigInt("0x" + hex_code).toString();

          code_ = `${credential.type} ` + `( ${code} )`;
        } else if (credential.code) {
          const hex_code = credential.code.replace(/ /g, "");
          const code = BigInt("0x" + hex_code).toString();
          code_ = `rfid ( ${code} )`;
        }

        return code_;
      };
    },
    settingsStore() {
      return this.$store.state.settings
    }
  },
  components: {
    flatPickr,
    // Table,
    vSelect,
    Table,
    Table,
  },
  methods: {

    async setSettings(event) {
      await this.$store.dispatch("setSettings", event)
      // .then((res) => {
      //   this.settings = res.data.settings
      //     ? JSON.parse(res.data.settings)
      //     : null;
      // });
    },
    exportToExcel() {
      const name = this.fileName;

      import("@/vendor/Export2Excel").then((excel) => {
        const list = this.logs.data;
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
    clearFields() {
      this.filename = "";
      this.cellAutoWidth = true;
      this.selectedFormat = "xlsx";
    },
    async changeHeaders() {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.table_headers.event_log_header = this.event_headers;
      this.event_header = JSON.parse(JSON.stringify(this.event_headers));
      await this.$store.dispatch("setSettings", settings)

      this.rowsPopup = false;

      this.$root.$emit("refreshEventTable");
    },
    openDetail(trData) {
      let event = this.saveLogs.find((l) => l.id == trData.id);
      if (event.cardholder) {
        event.cardholder =
          typeof event.cardholder == "string"
            ? JSON.parse(event.cardholder)
            : event.cardholder;

        if (event.cardholder.avatar) {
          const avatar = event.cardholder.avatar;
          if (typeof avatar === "string") {
            const path = JSON.parse(avatar).path;
            event.cardholder.image = `${process.env.VUE_APP_BACK}/${path}`;
          } else {
            event.cardholder.image = `${process.env.VUE_APP_BACK}/${event.cardholder.avatar.path}`;
          }
        }

        if (event.cardholder.car_infos) {
          const car_avatar = event.cardholder.car_infos.avatar;
          if (car_avatar) {
            if (typeof car_avatar === "string") {
              const path = JSON.parse(car_avatar).path;
              event.cardholder.car_image = `${process.env.VUE_APP_BACK}/${path}`;
            } else {
              event.cardholder.car_image = `${process.env.VUE_APP_BACK}/${event.cardholder.car_avatar.path}`;
            }
          } else {
            event.cardholder.car_image = null;
          }
        }
      }
      if (event.credential) {
        event.credential =
          typeof event.credential == "string"
            ? JSON.parse(event.credential)
            : event.credential;
      }

      if (event.access_point) {
        event.access_point =
          typeof event.access_point == "string"
            ? JSON.parse(event.access_point)
            : event.access_point;
      }

      if (event.access_right) {
        event.access_right =
          typeof event.access_right == "string"
            ? JSON.parse(event.access_right)
            : event.access_right;
      }

      this.userLogPopupData = event;

      this.userLogPopup = true;
    },

    filterByDate() {
      const params = {
        page: this.page,
        page_items_count: this.itemsPerPage,
      };

      if (this.startDate) {
        params.start_from = this.startDate;
      }

      if (this.endDate) {
        params.start_to = this.endDate;
      }

      this.fetchLogs(params);
    },
    fetchLogs(params) {
      this.logs.data = [];
      this.$http
        .get(`eventLog`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((res) => {

           
          this.logs.count = res.data.count;

          const sum = res.data.count % this.itemsPerPage;
          if (!sum) {
            this.totalPage = Math.floor(res.data.count / this.itemsPerPage);
          } else {
            this.totalPage = Math.floor(res.data.count / this.itemsPerPage) + 1;
          }

          // this.totalPage = Math.floor(res.data.count / this.itemsPerPage) + 1;
          this.saveLogs = [];
          const data = res.data.data;

          if (data && data.length) {
            data.forEach((event, index) => {
              const cloneEvent = JSON.parse(JSON.stringify(event));
              // this.saveLogs.push({ id: index, ...event });
              let eventObj = {};
              eventObj.id = index;

              // eventObj.date = event.date;
              eventObj.event_type = event.event_type;
              eventObj.event = event.event;
              eventObj.result = event.result;
              eventObj.event_source = event.event_source;
              eventObj.direction = this.getDirection(event.direction);
              
              let cardholder = flatToObject(event, 'cardholder','cardholder');
              let credential = flatToObject(event, 'credential','credential');
              let access_right = flatToObject(event, 'access_right','access_right');
              let access_point = flatToObject(event, 'access_point','access_rights');

              if (cardholder) 
              {
                event.cardholder = typeof cardholder == 'string' ?  JSON.parse(cardholder):cardholder ;

                eventObj.full_name =
                  event.cardholder.first_name +
                  " " +
                  event.cardholder.last_name;

                if (event.cardholder.email) {
                  eventObj.email = event.cardholder.email;
                }
                if (event.cardholder.status) {
                  eventObj.status = event.cardholder.status;
                }

                if (event.cardholder.company_name) {
                  eventObj.company_name = event.cardholder.company_name;
                }

                if (event.cardholder.phone) {
                  eventObj.phone = event.cardholder.phone;
                }
              }

              if (credential) {
                event.credential = typeof credential == 'string' ?  JSON.parse(credential):credential ;
                if (event.credential.type) {
                    const hex_code = event.credential.code.replace(/ /g, "");
                    const code = BigInt("0x" + hex_code).toString();

                    eventObj.credential =
                      `${event.credential.type} ` + `( ${code} )`;
                  } else if (event.credential.code) {
                    const hex_code = event.credential.code.replace(/ /g, "");
                    const code = BigInt("0x" + hex_code).toString();
                    eventObj.credential = `rfid ( ${code} )`;
                  } else {
                    eventObj.credential = "";
                  }
              } else {
                eventObj.credential = "";
              }
              if (access_right) {

                event.access_right = typeof access_right == 'string' ?  JSON.parse(access_right):access_right ;
                eventObj.access_right = event.access_right.name;
              }
              if (access_point) {
                
                event.access_point = typeof access_point == 'string' ?  JSON.parse(access_point):access_point ;
                eventObj.access_point = event.access_point.name;
              }

              let time_zone = null;
              if (event.access_point && event.access_point.time_zone) {
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
              eventObj.date = correct_date;
              this.logs.data.push(eventObj);
              cloneEvent.date = correct_date; // new
              this.saveLogs.push({ id: index, ...cloneEvent });
            });
          }

          this.$root.$emit("refreshEventTable");
        });
    },
  },

  async created() {


    if (!moduleUser.isRegistered) {
      this.$store.registerModule("user", moduleUser);
      moduleUser.isRegistered = true;
    }


    this.headerTitle = this.event_headers.map((item) => {
      return item.headerName;
    });

    this.headerVal = this.event_headers.map((item) => {
      return item.field;
    });

    // this.getSettings().then((res) => {

    const settings = JSON.parse(JSON.stringify(this.settingsStore));
    // this.settings = settings;
    if (!settings) {
      await this.$store.dispatch("setSettings", {
        table_headers: {
          event_log_header: this.event_headers,
        },
      })


      // this.setSettings({
      //   table_headers: {
      //     event_log_header: this.event_headers,
      //   },
      // });
      this.event_header = JSON.parse(JSON.stringify(this.event_headers));
    } else {
      if (settings.table_headers) {
        if (settings.table_headers.event_log_header) {
          this.event_header = JSON.parse(
            JSON.stringify(settings.table_headers.event_log_header)
          );
          this.event_headers = JSON.parse(JSON.stringify(this.event_header));
        } else {
          const saveSettings = { ...settings };

          saveSettings.table_headers.event_log_header = this.event_headers;

          this.event_header = JSON.parse(JSON.stringify(this.event_headers));
          await this.$store.dispatch("setSettings", saveSettings)

          // this.setSettings(saveSettings);
        }
      } else {
        const saveSettings = { ...settings };
        saveSettings.table_headers = {
          event_log_header: this.event_headers,
        };

        this.event_header = JSON.parse(JSON.stringify(this.event_headers));
        await this.$store.dispatch("setSettings", saveSettings)

        // this.setSettings(saveSettings);
      }
    }
    // });

    const params = {
      page: this.page,
      page_items_count: this.itemsPerPage,
    };
    this.fetchLogs(params);
  },
};
</script>

<style lang="scss" scoped>
.event_popup_inner {
  table {
    width: 100%;

    tr {
      width: 100%;
      display: flex;
      justify-content: space-between;
      text-align: left;

      td {
        flex: 0 0 50%;
        text-align: left;
        padding-bottom: 5px;
      }
    }
  }
}

.table_tr {
  position: relative;

  .click_tr {
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
  }
}

.ev_user_image {
  width: 100%;
  max-width: 160px;
  margin-right: 20px;
}

.event_user_info_inner {
  display: flex;
  widows: 100%;
  justify-content: space-between;

  img {
    width: 100%;
    height: 100%;
  }

  .user_info {
    flex: 1;
  }
}

.flex_itemss {
  display: flex;
  align-items: center;
}

.flexyy {
  padding-left: 5px !important;
}
</style>

<style lang="scss">
.event_logs_tbll {
  margin-top: 10px;

  .con-input-search.vs-table--search {
    margin-right: 60px;
    margin-top: -80px !important;
  }
}

.export_event {
  position: absolute;
  right: 210px;
  top: 0px;
}

.log_exort {
  left: 720px;
  top: -6px;
}

.ev_log_lim {
  width: 130px;
  // top: 6px;
}

.ev_log_paging {
  // margin-top: 85px !important;
}
</style>
