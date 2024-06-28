<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container userlog_page">
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
        <vs-checkbox v-for="(header, index) in user_log_headers" :key="index" class="mb-4 mt-5 custom__checkbox"
          v-model="header.show">{{ header.headerName }}</vs-checkbox>
        <div class="screen_false">
          <vs-button class="mt-4 unimacs_button" @click="changeHeaders">Submit</vs-button>

          <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="rowsPopup = false">Cancel</vs-button>
        </div>
      </vs-popup>
      <vs-popup class="holamundo" title="Detail Information" :active.sync="userLogPopup">
        <div class="user_popup_inner">
          <div class="date_time_info">
            <table>
              <tr>
                <td>Date/Time:</td>
                <td>
                  {{ userLogPopupData.date ? " " + userLogPopupData.date : "" }}
                </td>
              </tr>
              <tr>
                <td>Event</td>
                <td>
                  {{ userLogPopupData.event ? userLogPopupData.event : "" }}
                </td>
              </tr>
              <tr>
                <td>Target</td>
                <td>
                  {{ userLogPopupData.target ? userLogPopupData.target : "" }}
                </td>
              </tr>
              <tr>
                <td class="ev_detail_td">Value:</td>
                <td class="ev_detail_td" v-if="userLogPopupData.value && userLogPopupData.value !== 'null'
                  ">
                  <div class="ev_detail_div" v-for="(value, key) in userLogPopupData.value"
                    :key="userLogPopupData.value[key]" :class="{
                      col_:
                        typeof value == 'object' && Object.keys(value).length,
                    }">
                    {{ key }}:
                    <div v-if="typeof value == 'object' && Object.keys(value).length
                      ">
                      <table class="lev_2">
                        <tr>
                          <td>
                            <div class="ev_detail_div" v-for="(val, key) in value" :key="`${key}_${getUid(5)}`">
                              {{ key }}:
                              <div v-if="typeof val == 'object' &&
                                Object.keys(val).length
                                ">
                                <table class="lev_2">
                                  <tr>
                                    <td>
                                      <div class="ev_detail_div" v-for="(lev_3, key) in val" :key="`${key}_${getUid(5)}`">
                                        <div v-if="typeof lev_3 == 'object' &&
                                          Object.keys(lev_3).length
                                          ">
                                          <table class="lev_2">
                                            <tr>
                                              <td>
                                                <div class="ev_detail_div" v-for="(lev_4, key) in val"
                                                  :key="`${key}_${getUid(5)}`">
                                                  {{ key }}: {{ lev_4 }}
                                                </div>
                                              </td>
                                            </tr>
                                          </table>
                                        </div>

                                        <div v-else>{{ key }}: {{ lev_3 }}</div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>

                              <div v-else>
                                {{ val }}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div v-else>
                      {{ value }}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div class="user_info_block">
            <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
              <vs-tab label="User" icon-pack="feather" icon="icon-user">
                <div class="new_user_info_inner">
                  <div class="log_user_image">
                    <img :src="userLogPopupData.account &&
                      userLogPopupData.account.image
                      ? userLogPopupData.account.image
                      : 'no_avatar.svg'
                      " />
                  </div>

                  <div class="user_info">
                    <table>
                      <tr>
                        <td>Name:</td>
                        <td>
                          {{
                            userLogPopupData.account
                            ? userLogPopupData.account.first_name
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Last Name:</td>
                        <td>
                          {{
                            userLogPopupData.account
                            ? userLogPopupData.account.last_name
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Account</td>
                        <td>
                          {{
                            userLogPopupData.account
                            ? userLogPopupData.account.email
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Group:</td>
                        <td>
                          {{
                            userLogPopupData.account &&
                            userLogPopupData.account.account_group
                            ? userLogPopupData.account.account_group
                            : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Access role:</td>
                        <td>
                          {{
                            userLogPopupData.role ? userLogPopupData.role : ""
                          }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </vs-tab>
            </vs-tabs>
          </div>
        </div>
      </vs-popup>
    </div>
    <div class="vx-card p-6 user_log_cardd" style="min-height: 750px">
      <div class="flex flex-wrap items-center float-right">
        <div class="flex-grow mr-8"></div>
        <vs-button class="unimacs_button mr-5" @click="activePrompt = true"
          :disabled="!logs.data.length">Export</vs-button>
        <vs-button @click="rowsPopup = true" class="unimacs_button columns_button" color="primary"
          icon-pack="material-icons" icon="filter_list"></vs-button>
      </div>

      <div class="vx-row" style="position: relative">
        <v-select v-model="itemsPerPage" :options="[10, 20, 50, 100, 500, 1000, 5000]"
          class="select_padding log_log_lim mr-3" name="ap_type" placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :clearable="false" :searchable="false" />

        <!-- <div class="vx-col md:w-1/2 flex_itemss flexyy"> -->
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
        <!-- </div> -->
      </div>
      <Table :items="logs.data" :headers="headers" @openDetail="openTr($event)" />
      <CustomPaging class="log_page" @pageChanged="page = $event" :total="totalPage"
        v-show="itemsPerPage < logs.count && logs.data.length ? true : false" />
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import moduleUser from "@/store/user/moduleUserManagement.js";
import vSelect from "vue-select";
import Table from "./LogTable";
import { uid } from "uid";

export default {
  watch: {
    rowsPopup(val) {
      if (!val) {
        this.user_log_headers = JSON.parse(
          JSON.stringify(this.user_log_header)
        );
      }
    },
    itemsPerPage() {
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
    page() {
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
    disableDate(val) {
      if (!val && (this.startDate || this.endDate)) {
        this.startDate = null;
        this.endDate = null;
        const params = {
          page: this.page,
          page_items_count: this.itemsPerPage,
        };
        this.fetchLogs(params);
      }
    },
  },
  data() {
    return {
      userLogPopupData: {},
      userLogPopup: false,
      activeTab: 1,
      startDate: null,
      endDate: null,
      itemsPerPage: 10,
      totalPage: 0,
      page: 1,
      rowsPopup: false,
      disableDate: false,
      user_log_header: [],
      user_log_headers: [
        {
          headerName: "#",
          field: "count",
          filter: true,
          show: true,
          pinned: "left",
          lockPinned: true,
          lockPosition: "left",
          cellClass: "locked-col",
          minWidth: 100,
          width: 100,
          suppressSizeToFit: true,
        },
        {
          headerName: "Date/Time",
          field: "date",
          filter: true,
          show: true,
          minWidth: 100,
          width: 100,
        },
        {
          headerName: "User account",
          field: "account_name",
          filter: true,
          show: true,
          minWidth: 130,
          width: 130,
        },
        {
          headerName: "Event",
          field: "event",
          filter: true,
          show: true,
          cellRendererFramework: "CellRendererStatus",
          minWidth: 80,
          width: 80,
        },
        {
          headerName: "Target",
          field: "target",
          filter: true,
          show: true,
          minWidth: 120,
          width: 120,
        },
        // { headerName: "Value", field: "value", filter: true, show: true },
      ],
      columns: {
        date_time: true,
        user_account: true,
        event: true,
        target: true,
        value: true,
      },
      configdateTimePicker: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      logs: {
        count: 0,
        data: [],
      },
      fileName: "",
      formats: ["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      headerTitle: [],
      headerVal: [],
      activePrompt: false,
      settings: null,
    };
  },
  computed: {
    currentPage: {
      get() {
        return 1;
      },
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
    headers() {
      return this.user_log_header.filter((c) => c.show);
    },
    getUid() {
      return (num) => {
        return +uid(5);
      };
    },
    settingsStore() {
      return this.$store.state.settings
    }
  },
  components: {
    flatPickr,
    vSelect,
    Table,
  },
  methods: {

    async changeHeaders() {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.table_headers.user_log_header = this.user_log_headers;
      this.user_log_header = JSON.parse(JSON.stringify(this.user_log_headers));
      await this.$store.dispatch("setSettings", settings)
      // this.setSettings(settings);
      this.rowsPopup = false;
      this.$root.$emit("refreshUserLogTable");
    },
    openTr(trData) {
      trData.uid = uid(10);
      if (trData && trData.value && trData.value !== "null") {
        if (typeof trData.value === "string") {
          trData.value = JSON.parse(trData.value);
        }

        this.userLogPopupData = trData;
      } else {
        if (typeof trData.value === "string") {
          trData.value = JSON.parse(trData.value);
        }

        this.userLogPopupData = trData;
      }
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
      const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
      var isFirefox = typeof InstallTrigger !== "undefined";
      var isSafari =
        navigator.vendor &&
        navigator.vendor.indexOf("Apple") > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf("CriOS") == -1 &&
        navigator.userAgent.indexOf("FxiOS") == -1;

      var is_OSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

      this.$vs.loading({
        type: "corners",
      });
      this.logs.data = [];
      this.$http
        .get(`userLog`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((res) => {
          this.$vs.loading.close();

          if (res.data.data.length) {
            this.logs.count = res.data.count;

            const sum = res.data.count % this.itemsPerPage;
            if (!sum) {
              this.totalPage = Math.floor(res.data.count / this.itemsPerPage);
            } else {
              this.totalPage =
                Math.floor(res.data.count / this.itemsPerPage) + 1;
            }
            res.data.data.forEach((log, index) => {
              log.count = index + 1;

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
                  .utc(log.date, "YYYY-MM-DD HH:mm:ss")
                  .tz(time);
                const momentFormat = this.$moment(
                  local,
                  "YYYY-MM-DD HH:mm:ss"
                ).format("YYYY-MM-DD HH:mm:ss");
                correct_date = momentFormat;
              } else {
                correct_date = this.$moment(log.date)
                  .tz(time)
                  .format(`YYYY-MM-DD HH:mm:ss`);
              }

              log.date = correct_date;

              // log.date = this.$moment(log.date + " GMT+0000")
              //   .tz(time)
              //   .format(`YYYY-MM-DD HH:mm:ss`);
              // if (log.account) {
              //   log.account = JSON.parse(log.account);
              //   if (log.account.avatar) {
              //     log.account.avatar = JSON.parse(log.account.avatar);

              //     log.account.image = `${process.env.VUE_APP_BACK}/${log.account.avatar.path}`;
              //   }
              // }

              if (isFirefox || isSafari || is_OSX) {
                const local = this.$moment
                  .utc(log.date, "YYYY-MM-DD HH:mm:ss")
                  .tz(time);
                log.date = this.$moment(local, "YYYY-MM-DD HH:mm:ss").format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              } else {
                log.date = this.$moment(log.date + " GMT+0000")
                  .tz(time)
                  .format(`YYYY-MM-DD HH:mm:ss`);
              }

              this.logs.data.push(log);
            });
          }
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
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
  },
  async created() {
    if (!moduleUser.isRegistered) {
      this.$store.registerModule("user", moduleUser);
      moduleUser.isRegistered = true;
    }
    this.headerTitle = this.user_log_headers.map((item) => {
      return item.headerName;
    });

    this.headerVal = this.user_log_headers.map((item) => {
      return item.field;
    });

    // this.getSettings().then((res) => {
    const settings = JSON.parse(JSON.stringify(this.settingsStore)) || null;
    // this.settings = settings;
    if (!settings) {
      await this.$store.dispatch("setSettings", {
        table_headers: {
          user_log_headers: this.user_log_headers,
        },
      })
      // this.setSettings({
      //   table_headers: {
      //     user_log_headers: this.user_log_headers,
      //   },
      // });
      this.user_log_header = JSON.parse(
        JSON.stringify(this.user_log_headers)
      );
    } else {
      if (settings.table_headers) {
        if (settings.table_headers.user_log_header) {
          this.user_log_header = JSON.parse(
            JSON.stringify(settings.table_headers.user_log_header)
          );
          this.user_log_headers = JSON.parse(
            JSON.stringify(this.user_log_header)
          );
        } else {
          const saveSettings = { ...settings };

          saveSettings.table_headers.user_log_header = this.user_log_headers;

          this.user_log_header = JSON.parse(
            JSON.stringify(this.user_log_headers)
          );
          await this.$store.dispatch("setSettings", saveSettings)
          // this.setSettings(saveSettings);
        }
      } else {
        const saveSettings = { ...settings };
        saveSettings.table_headers = {
          user_log_header: this.user_log_headers,
        };

        this.user_log_header = JSON.parse(
          JSON.stringify(this.user_log_headers)
        );
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
.new_user_info_inner {
  display: flex;
  widows: 100%;
  justify-content: space-between;

  img {
    width: 50%;
    height: 100%;
  }

  .user_info {
    flex: 1;
  }
}

.userlog_page {
  .column_fil {}

  .user_popup_inner {
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

  .log_user_image {
    width: 100%;
    max-width: 160px;
    margin-right: 20px;
  }
}

._export_event {
  position: absolute;
  right: 75px;
  top: 21px;
}
</style>

<style lang="scss">
.us_tbl {
  .header-table {
    position: relative;
  }
}

.ev_detail_td {
  vertical-align: text-bottom;
}

.ev_detail_div {
  display: inline-block;
  margin-right: 10px;
  // margin-top: 5px;
  display: flex;

  &.col_ {
    flex-direction: column;
  }
}

.ev_detail_div:not(:last-child):after {
  // content: ",";
}

.lev_2 {
  margin-left: 10px;
}

.log_log_lim {
  width: 130px;
}

.log_page {
  // margin-top: 90px !important;
}
</style>
