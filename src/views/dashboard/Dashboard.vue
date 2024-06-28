<template>
  <div class="dash_custom_block">
    <div class="vx-col w-full dash_setting" style="text-align: end">
      <vs-button class="unimacs_button" @click="blockSettingsPopup = true">
        <vs-icon icon-pack="material-icons" icon="settings" />
      </vs-button>
    </div>
    <vs-popup class="holamundo reg_invite_popup" title="Registration" :active.sync="invite_user_popup">
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input class="w-full mt-3" label="Username" name="first_name" disabled
            v-model="edit_cardholder_info.first_name" />
        </div>
        <div class="vx-col w-full">
          <vs-input class="w-full mt-3" label="Email" name="first_name" disabled v-model="edit_cardholder_info.email" />
        </div>
        <div class="vx-col w-full">
          <vs-checkbox class="mt-6">I agree Terms and conditions</vs-checkbox>
        </div>
        <div class="vx-col w-full">
          <vs-button @click="sendInvite" color="#03ce00" class="mt-4 w-full">Register</vs-button>
        </div>
      </div>
    </vs-popup>
    <vs-popup class="holamundo" title="Choose Access Points Headers" :active.sync="ap_table_headers_opup">
      <vs-checkbox v-for="(header, index) in access_point_headers" v-model="header.show" :key="index"
        class="mb-4 mt-5 custom__checkbox">
        {{ header.headerName }}
      </vs-checkbox>

      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" @click="changeApHeaders">Submit</vs-button>

        <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="cancelApHeaders">Cancel</vs-button>
      </div>
    </vs-popup>
    <vs-popup class="holamundo" title="Choose Activity headers" :active.sync="ev_table_headers_opup">
      <vs-checkbox v-for="(header, index) in event_headers" v-model="header.show" :key="index" class="mb-4 mt-5">
        {{ header.headerName }}
      </vs-checkbox>

      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" @click="changeAvtivityHeaders">Submit</vs-button>

        <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="cancelActivityHead">Cancel</vs-button>
      </div>
    </vs-popup>
    <vs-popup class="holamundo" title="Screen configuration" :active.sync="blockSettingsPopup">
      <div class="scr_config mt-3" v-for="(config, key) in screenConfigs" :key="key">
        <vs-checkbox class="custom__checkbox" v-model="screenSettings[key].show">
          {{ config.name }}
        </vs-checkbox>
      </div>
      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" @click="changeScreenSettings">Submit</vs-button>

        <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="blockSettingsPopup = false">Cancel</vs-button>
      </div>
    </vs-popup>
    <vs-popup class="holamundo event__details_popup" title="Event detail information" :active.sync="userLogPopup">
      <EventDetail :propsData="userLogPopupData" v-if="userLogPopup" />
    </vs-popup>
    <vs-popup class="holamundo" title="Access Point Monitor 1 settings" :active.sync="monitorSettingsPopups">
      <MonitorSettingsPopup v-if="monitorSettingsPopups" :propsSettings="monitor_1_settings" />
    </vs-popup>

    <vs-popup class="holamundo" title="Access Point Monitor 2 settings" :active.sync="monitor2SettingsPopups">
      <Monitor2SettingsPopup v-if="monitor2SettingsPopups" :propsSettings="monitor_2_settings" />
    </vs-popup>
    <vs-popup class="holamundo" title="Access Point Status" :active.sync="ac_point_popup">
      <AccessPointStatusPopup v-if="ac_point_popup" :apData="ac_status_data" />
    </vs-popup>
    <vs-popup class="holamundo popup_width_small cardhold_popup_dash cardhold_popup da_pop"
      :class="{ without_back: openEdit == true }" title="Create Cardholder" :active.sync="openCardholder">
      <div class="block_account">
        <div class="row_block">
          <div class="left_block">
            <div>
              <span tag="span" class="email__label flex items-center mb-4 cursor-pointer" v-for="(type, index) in types"
                :key="index" @click="currentForm = type.key">
                <span class="text-lg" :class="{ 'text-primary m-item': currentForm == type.key }">{{ type.name }}</span>
              </span>
            </div>
          </div>

          <div class="right_block">
            <div class="inner_block" v-show="canSeeRight">
              <component :is="currentForm" :features="features"></component>
            </div>
          </div>
        </div>
      </div>
      <div class="vx-row w-full da_button">
        <vs-button color="danger" style="margin-top: 1.5rem !important; margin-right: 10px"
          @click.stop="openCardholder = false">Cancel
        </vs-button>
        <vs-button style="margin-top: 1.5rem !important" color="success" @click.stop="createInformation"
          :disabled="!isFormValid">Submit
        </vs-button>
      </div>
    </vs-popup>
    <vs-popup class="holamundo popup_width_small cardhold_popup addOpened da_pop ed_user dash_cardholder_pop_edit"
      title="Edit Cardholder" :active.sync="openEdit">
      <div class="block_account">
        <div class="row_block">
          <div class="left_block">
            <div>
              <span tag="span" class="email__label flex items-center mb-4 cursor-pointer"
                v-for="(type, index) in editTypes" :key="index" @click="updateForms = type.key">
                <span class="text-lg" :class="{ 'text-primary m-item': updateForms == type.key }">{{ type.name }}</span>
              </span>
            </div>
          </div>

          <div class="right_block">
            <div class="inner_block">
              <component v-if="openEdit" :is="updateForms" :features="features"></component>
            </div>
          </div>
        </div>
      </div>
      <div class="vx-row w-full da_button">
        <div class="invite_btn" @click="inviteUser">
          <vs-icon icon-pack="material-icons" class="check_icon" icon="email" />Invite
        </div>
        <vs-button color="danger" style="margin-top: 1.5rem !important; margin-right: 10px"
          @click.stop="openEdit = false">Cancel
        </vs-button>
        <vs-button color="success" style="margin-top: 1.5rem !important" @click.stop="updateInformation"
          :disabled="!isEditFormValid">Submit
        </vs-button>
      </div>
    </vs-popup>
    <vs-popup class="holamundo" title="Activity settings" :active.sync="activitySettingsPopups">
      <ActivitySettingsPopup v-if="activitySettingsPopups" :propsData="logsForSettings"
        @setWhichShowActivity="setShowActivity($event)" :ac_points="access_point_status" />
    </vs-popup>
    <vs-popup class="holamundo" title="Access Point Status" :active.sync="apStatusSettingsPopups">
      <APStatus :userConfig="userConfig" @setWhichShowAccessPoints="setShowAccessPoint($event)"
        v-if="apStatusSettingsPopups" :propsData="savePoints" />
    </vs-popup>

    <MonitorConfig :configPopup="configPopup" :monitorDataConfig="monitorDataConfig" @closePopup="configPopup = false"
      :settings="monitor_1_settings" @submitUpdate="updateMonitorOptions($event, 1)" />

    <Monitor2Config :configPopup="config2Popup" :monitorDataConfig="monitor2DataConfig" @closePopup="config2Popup = false"
      :settings="monitor_2_settings" @submitUpdate="updateMonitorOptions($event, 2)" />

    <div class="vx-row ap_st">
      <div class="vx-col md:w-1/5 dashboard_inner _1" style="position: relative"
        v-if="configsScreen && configsScreen.ap_status.show">
        <CloseBlock class="remove_dashboard_item" @input="setRemoveStorage('ap_status')" />
        <vx-card title="Access Point Status">
          <AccessPointStatusChart :access_pointData="access_pointData" :statuses="access_point_status"
            :changeStatus="changedStatus" />
        </vx-card>
      </div>

      <div class="vx-col md:w-1/5 dashboard_inner _2" style="position: relative"
        v-if="configsScreen && configsScreen.cardholder_present.show">
        <CloseBlock class="remove_dashboard_item" @input="setRemoveStorage('cardholder_present')" />
        <vx-card title="Cardholders Presence">
          <CardholdersPresence :modesData="dashboard_cardholders" />
        </vx-card>
      </div>

      <div class="vx-col md:w-1/5 dashboard_inner _3" style="position: relative"
        v-if="configsScreen && configsScreen.ap_modes.show">
        <CloseBlock class="remove_dashboard_item" @input="setRemoveStorage('ap_modes')" />
        <vx-card title="Access Points Modes">
          <AccessPointModes :modesData="access_point_modes" />
        </vx-card>
      </div>

      <div class="vx-col md:w-1/5 dashboard_inner _4" style="position: relative"
        v-if="configsScreen && configsScreen.acu_status.show">
        <CloseBlock class="remove_dashboard_item" @input="setRemoveStorage('acu_status')" />
        <vx-card title="ACU Status">
          <AcuStatus :acuData="acuData" />
        </vx-card>
      </div>

      <div class="vx-col md:w-1/5 dashboard_inner _5" style="position: relative"
        v-if="configsScreen && configsScreen.events.show">
        <CloseBlock class="remove_dashboard_item" @input="setRemoveStorage('events')" />
        <vx-card title="Events Statistics">
          <EventStats :eventsData="eventsData" />
        </vx-card>
      </div>
    </div>
    <div class="vx-row mt-5 dashboard_main">
      <div class="vx-col md:w-1/2" style="position: relative" v-if="configsScreen && configsScreen.ap_monitor.show">
        <CloseBlock class="remove_dashboard_item" @input="setRemoveStorage('ap_monitor')" />
        <vx-card title="Access Point Monitor 1" class="monitor_card">
          <i class="icon_system monitor_settings" @click="monitorSettingsPopups = true"></i>

          <vs-icon class="filter_monitor" icon-pack="material-icons" icon="filter_list" @click="configPopup = true" />
          <AccessPointMonitor :monitorFileds="monitorDataConfig" :monitorData="monitor1"
            :monitor_1_settings="monitor_1_settings" :access_points="access_points_list" />
        </vx-card>
      </div>

      <div class="vx-col md:w-1/2" style="position: relative" v-if="configsScreen && configsScreen.ap_monitor_2.show">
        <CloseBlock class="remove_dashboard_item" @input="setRemoveStorage('ap_monitor_2')" />
        <vx-card title="Access Point Monitor 2" class="monitor_card">
          <i class="icon_system monitor_settings" @click="monitor2SettingsPopups = true"></i>

          <vs-icon class="filter_monitor" icon-pack="material-icons" icon="filter_list" @click="config2Popup = true" />

          <AccessPointMonitor2 :monitorFileds="monitor2DataConfig" :monitorData="monitor2"
            :monitor_2_settings="monitor_2_settings" :access_points="access_points_list" />
        </vx-card>
      </div>
    </div>

    <vx-card title="Activity" class="mt-5 act" v-if="configsScreen && configsScreen.activity.show">
      <div class="vx-row activity_actions flex">
        <div class="vx-col last_events">
          <span> Last Events </span>
          <v-select v-model="logs_limit" :options="logs_limits" @input="changeLimit($event)" class="select_padding"
            name="ap_type" placeholder="Limit" :reduce="(type) => type.label" :dir="$vs.rtl ? 'rtl' : 'ltr'"
            :clearable="false" :searchable="false" />
        </div>
        <div class="vx-col">
          <i class="icon_system activity_settings" @click="activitySettingsPopups = true"></i>
        </div>
      </div>
      <div class="vx-col">
        <CloseBlock class="remove_activity_item" @input="setRemoveStorage('activity')" />
      </div>
      <div>
        <div class="search_table">
          <vs-button class=" columns_button unimacs_button" @click="ev_table_headers_opup = true"
            icon-pack="material-icons" style="position: absolute" icon="filter_list"></vs-button>
          <ActivityTable :headers="ev_headers" :items="logs.data" />
        </div>
      </div>
    </vx-card>

    <vx-card title="Access Points Status" class="mt-5 aps" v-if="configsScreen && configsScreen.ap_status_table.show">
      <i class="icon_system ap_status_settings" @click="apStatusSettingsPopups = true"></i>
      <CloseBlock class="remove_activity_item" @input="setRemoveStorage('ap_status_table')" />
      <!-- <vs-dropdown vs-trigger-click class="cursor-pointer drop_tables">
        <div
          class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
          <span class="mr-2">{{ currentPage * itemsPerPageStatus - (itemsPerPageStatus - 1) }}
            -
            {{
              access_points.data.length - currentPage * itemsPerPageStatus > 0
              ? currentPage * itemsPerPageStatus
              : access_points.data.length
            }}
            of {{ access_points.count }}</span>
          <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
        </div>
        <vs-dropdown-menu>
          <vs-dropdown-item @click="itemsPerPageStatus = 10">
            <span>10</span>
          </vs-dropdown-item>
          <vs-dropdown-item @click="itemsPerPageStatus = 25">
            <span>25</span>
          </vs-dropdown-item>
          <vs-dropdown-item @click="itemsPerPageStatus = 50">
            <span>50</span>
          </vs-dropdown-item>

          <vs-dropdown-item @click="itemsPerPageStatus = 100">
            <span>100</span>
          </vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown> -->

      <div class="table_search" style="position: relative">
        <div class="group_actions_dash">
          <div>Group actions</div>

          <vs-button color="danger" @mouseover="down_hovered = true" @mouseleave="down_hovered = false" @click="changeMode('locked')" class="ml-3">Lock Down</vs-button>
          <div class="lock_down_hint" v-if="down_hovered">LOCK DOWN <br/>
            This action will override any current state of ALL Access Points. <br/>
            All Access Points will be LOCKED DOWN until you change the mode to UNLOCKED or NORMAL.
          </div>

          <vs-button color="success" @mouseover="unlock_hovered = true" @mouseleave="unlock_hovered = false" @click="changeMode('unlocked')" class="ml-3">Unlock</vs-button>
          <div class="unlock_hint" v-if="unlock_hovered">UNLOCK <br/>
            This action will override any current state of ALL Access Points. <br/>
            All Access Points will be UNLOCKED until you change the mode to LOCKED DOWN or NORMAL.

          </div>
          <vs-button color="#14c3ed" @mouseover="normal_hovered = true" @mouseleave="normal_hovered = false" @click="changeMode('credential')" class="ml-3">Normal</vs-button>
          <div class="normal_hint" v-if="normal_hovered">NORMAL <br/>
            This action will override any current state of ALL Access Points. <br/>
            All Access Points will be transferred into NORMAL operation that is not LOCKED DOWN or UNLOCKED.
          </div>
        </div>

        <v-select v-model="itemsPerPageStatus" :options="[10, 25, 50, 100]" class="select_padding acu_status_select"
          name="ap_type" placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'" :clearable="false" :searchable="false" />


        <vs-button class="unimacs_button columns_button" @click="ap_table_headers_opup = true" icon-pack="material-icons"
          icon="filter_list" style="position: absolute"></vs-button>
        <AccessPointTable :headers="ac_headers" :items="access_points.data" />

        <vs-pagination class="mt-3" v-if="itemsPerPageStatus < access_points.count ? true : false" :total="totalPage"
          v-model="page"></vs-pagination>
      </div>
    </vx-card>

    <vs-prompt :title="`${getModalTitle} mode`" class="export-options mode_prompt" @accept="updateMode"
      accept-text="Confirm" cancel-text="Cancel" color="success" :active.sync="modePrompt">
      <div>
        <p>CAUTION!</p>
        <p>This operation applies to ALL Access Points!</p>
        <p>Enable {{ getModalTitle }} mode?</p>
      </div>
    </vs-prompt>

  </div>
</template>

<script>
import {
  dashboardCardholderValidation,
  bindLogs,
  socketLog,
  accessPointsDataBind,
  detailInformation,
  getMonitorConfigs,
  bindSettings,
} from "./utils";
import moduleCctv from "@/store/cctv/moduleCctv";
import moduleReport from "@/store/report/moduleReport";

export default {
  name: "Dashboard",
  data() {
    return {
      canSeeRight: false,
      activity: null,
      monitor1: {},
      monitor2: {},
      monitors: [],
      access_pointData: null,
      acuData: null,
      access_point_modes: null,
      eventsData: null,
      itemsPerPage: 10,
      itemsPerPageStatus: 10,
      saveMode: null,
      modePrompt: null,
      down_hovered: false,
      unlock_hovered: false,
      normal_hovered: false,
      event_headers: [
        {
          headerName: "Date/Time",
          field: "date",
          tooltipField: "date",
          show: true,
          filter: true,
          minWidth: 180,
          width: 180,
        },
        {
          headerName: "Event Type",
          field: "event_type",
          tooltipField: "event_type",
          show: false,

          minWidth: 180,
          width: 180,
        },
        {
          headerName: "Full Name / Event Source",
          filter: true,
          field: "full_name",
          tooltipField: "full_name",
          show: true,
          minWidth: 240,
          width: 240,
        },
        {
          headerName: "Credential",
          field: "credential",
          tooltipField: "credential",
          show: true,
          filter: true,
          minWidth: 200,
          width: 200,
        },
        {
          headerName: "Access Right ",
          field: "access_right",
          tooltipField: "access_right",
          show: false,
          filter: true,
          minWidth: 190,
          width: 190,
        },
        {
          headerName: "Access Point",
          field: "access_point",
          tooltipField: "access_point",
          show: true,
          filter: true,
          minWidth: 190,
          width: 190,
        },
        {
          headerName: "Event",
          field: "event",
          tooltipField: "event",
          show: true,
          filter: true,
          minWidth: 200,
          width: 200,
        },
        {
          headerName: "Result",
          field: "result",
          show: false,
          filter: true,
          minWidth: 200,
          width: 200,
          tooltipField: "result",
          tooltipComponentParams: { color: "#ececec" },
        },
        {
          headerName: "Direction",
          field: "direction",
          tooltipField: "direction",
          show: true,
          filter: true,
          minWidth: 160,
          width: 160,
        },
        {
          headerName: "Status",
          field: "status",
          tooltipField: "status",
          show: false,
          filter: true,
          minWidth: 150,
          width: 150,
        },
        {
          headerName: "Event Source",
          field: "event_source",
          tooltipField: "event_source",
          show: false,
          filter: true,
          minWidth: 200,
          width: 200,
        },
        {
          headerName: "Email",
          field: "email",
          tooltipField: "email",
          show: true,
          filter: true,
          minWidth: 180,
          width: 180,
        },
        {
          headerName: "Phone",
          field: "phone",
          tooltipField: "phone",
          show: true,
          filter: true,
          minWidth: 180,
          width: 180,
        },
        {
          headerName: "Company",
          field: "company_name",
          tooltipField: "company_name",
          show: true,
          filter: true,
          minWidth: 200,
          width: 200,
        },
      ],
      activity_header: [],
      logs: {
        count: 0,
        data: [],
      },
      saveLogs: [],
      userLogPopupData: null,
      userLogPopup: false,
      monitorSettingsPopups: false,
      monitor2SettingsPopups: false,
      blockSettingsPopup: false,
      ac_point_popup: false,
      dashboard_cardholders: [],
      access_point_status: [],
      logs_limit: 100,
      logs_page: 1,
      logsTotalPage: 0,
      logs_limits: [
        { label: 100 },
        { label: 200 },
        { label: 300 },
        { label: 400 },
        { label: 500 },
      ],
      filteredItems: [],
      access_point_headers: [
        { headerName: "Name", field: "name", show: true, filter: true },
        { headerName: "Type", field: "type", show: true, filter: true },
        {
          headerName: "Mode",
          field: "mode",
          show: true,
          filter: true,
          cellRendererFramework: "CellRendererMode",
        },
        {
          headerName: "Cloud status",
          field: "cloud_status",
          show: true,
          filter: true,
          cellRendererFramework: "CellRendererStatus",
        },
        {
          headerName: "Door state",
          field: "door_state",
          show: true,
          filter: true,
        },
        {
          headerName: "Last activity",
          field: "last_activity",
          show: true,
          filter: true,
        },
        // { name: "Tamper status ", key: "tamper_status", show: false },
      ],
      ap_header: [],
      access_points: {
        data: [],
        count: 0,
      },
      notifSound,
      openCardholder: false,
      openEdit: false,
      currentForm: "user",
      updateForms: "edit_user",
      screenSettings: {
        acu_status: {
          name: "ACU Status",
          show: true,
        },
        events: {
          name: "Events Statistics",
          show: true,
        },
        cardholder_present: {
          name: "Cardholder present status",
          show: true,
        },
        ap_status: {
          name: "Access Points Status",
          show: true,
        },
        ap_modes: {
          name: "Access Points Modes",
          show: true,
        },
        // commucation: {
        //   name: "Commucation",
        //   show: true,
        // },
        ap_monitor: {
          name: "Access Point Monitor 1",
          show: true,
        },
        ap_monitor_2: {
          name: "Access Point Monitor 2",
          show: true,
        },
        activity: {
          name: "Activity table",
          show: true,
        },
        ap_status_table: {
          name: "Access Points Status table",
          show: true,
        },
        // posts: {
        //   name: "Posts",
        //   show: true,
        // },
      },
      features:
        localStorage.features && JSON.parse(localStorage.features).Cardholder
          ? JSON.parse(localStorage.features).Cardholder
          : null,
      screenConfigs: null,

      logsForSettings: [],
      totalPage: 0,
      page: 1,
      changedStatus: null,
      ap_table_headers_opup: false,
      ev_table_headers_opup: false,
      activitySettingsPopups: false,
      apStatusSettingsPopups: false,
      savePoints: null,
      saveMonitor: null,
      invite_user_popup: false,
      settings: null,
      monitor_1_settings: null,
      monitor_2_settings: null,
      socket_cr: null,
      searchQuery: "",
      gridOptions: {},
      maxPageNumbers: 7,
      gridApi: null,
      gridColumnApi: null,
      userConfig: null,
      delayTimer: null,

      configPopup: false,
      config2Popup: false,
    };
  },
  created() {
    if (!moduleCctv.isRegistered) {
      this.$store.registerModule("cctv", moduleCctv);
      moduleCctv.isRegistered = true;
    }

    const settings = JSON.parse(JSON.stringify(this.settingsStore));

    this.userConfig = settings || {};
    // const params = {
    //   page: this.page,
    //   page_items_count: this.itemsPerPageStatus,
    // };
    // this.fetchDashboardAccessPoints(params, true);
    if (!moduleCardholder.isRegistered) {
      this.$store.registerModule("cardholder", moduleCardholder);
      moduleCardholder.isRegistered = true;
    }
    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }
    if (!moduleCardGroup.isRegistered) {
      this.$store.registerModule("cardGroup", moduleCardGroup);
      moduleCardGroup.isRegistered = true;
    }
    if (!moduleRight.isRegistered) {
      this.$store.registerModule("right", moduleRight);
      moduleRight.isRegistered = true;
    }
    if (!moduleSchedule.isRegistered) {
      this.$store.registerModule("schedule", moduleSchedule);
      moduleSchedule.isRegistered = true;
    }
    if (!moduleAccessPoint.isRegistered) {
      this.$store.registerModule("accessPoint", moduleAccessPoint);
      moduleAccessPoint.isRegistered = true;
    }
    if (!moduleReport.isRegistered) {
      this.$store.registerModule("report", moduleReport);
      moduleReport.isRegistered = true;
    }
    this.$store
      .dispatch("pagePermissions", this.permissions)
      .then(async (res) => {
        if (res != true) {
          this.showNotif(
            false,
            `You haven't access to enter to ${this.$route.name}`
          );

          setTimeout(() => {
            // this.$router.push(res).catch(() => {});
            this.$router.push("/error-404").catch(() => { });
          }, 100);

          return false;
        } else {
          const params = {
            page: this.page,
            page_items_count: this.itemsPerPageStatus,
          };

          const settings = JSON.parse(JSON.stringify(this.settingsStore))

          if (!settings) {
            await this.$store.dispatch("setSettings", {
              screen_settings: this.screenSettings,
              table_headers: {
                activity_headers: this.event_headers,
                ap_headers: this.access_point_headers,
              },
              dashboard_settings: {
                ap_monitor_1: {
                  access_point: null,
                  delay: 0,
                  enable_sound: false,
                  enable_short_info: false,
                  show_photo_car: "car_cardholder",
                  miniature_position: "fixed",
                  miniature_orientation: "vertical",
                  miniature_drag_pos: { left: 23, top: 52 },
                  camera: null,
                  enable_cctv: true,
                  enable_miniature: true,
                },
                ap_monitor_2: {
                  access_point: null,
                  delay: 0,
                  enable_sound: false,
                  enable_short_info: false,
                  show_photo_car: "car_cardholder",
                  miniature_position: "fixed",
                  miniature_orientation: "vertical",
                  miniature_drag_pos: { left: 23, top: 52 },
                  camera: null,
                  enable_cctv: true,
                  enable_miniature: true,
                },
              },
            })

            this.screenConfigs = JSON.parse(
              JSON.stringify(this.screenSettings)
            );
            this.activity_header = JSON.parse(
              JSON.stringify(this.event_headers)
            );
            this.ap_header = JSON.parse(
              JSON.stringify(this.access_point_headers)
            );
            this.monitor_1_settings = {
              access_point: null,
              delay: 0,
              enable_sound: false,
              enable_short_info: false,
              show_photo_car: "car_cardholder",
              miniature_position: "fixed",
              miniature_orientation: "vertical",
              miniature_drag_pos: { left: 23, top: 52 },
              camera: null,
              enable_cctv: true,
              enable_miniature: true,

            };
            this.monitor_2_settings = {
              access_point: null,
              delay: 0,
              enable_sound: false,
              enable_short_info: false,
              show_photo_car: "car_cardholder",
              miniature_position: "fixed",
              miniature_orientation: "vertical",
              miniature_drag_pos: { left: 23, top: 52 },
              camera: null,
              enable_cctv: true,
              enable_miniature: true,
            };
          } else {
            let saveSettings = { ...settings };

            if (settings.screen_settings) {
              this.screenConfigs = JSON.parse(
                JSON.stringify(settings.screen_settings)
              );
              this.screenSettings = JSON.parse(
                JSON.stringify(settings.screen_settings)
              );
            } else {
              this.screenConfigs = JSON.parse(
                JSON.stringify(this.screenSettings)
              );
              saveSettings.screen_settings = JSON.parse(
                JSON.stringify(this.screenSettings)
              );
            }

            if (settings.table_headers) {
              const table_headers = settings.table_headers;
              if (table_headers.activity_headers) {
                this.activity_header = JSON.parse(
                  JSON.stringify(table_headers.activity_headers)
                );

                this.event_headers = JSON.parse(
                  JSON.stringify(this.activity_header)
                );
              } else {
                saveSettings.table_headers.activity_header = JSON.parse(
                  JSON.stringify(this.event_headers)
                );
                this.activity_header = JSON.parse(
                  JSON.stringify(this.event_headers)
                );
              }
              if (table_headers.ap_headers) {
                this.ap_header = JSON.parse(
                  JSON.stringify(table_headers.ap_headers)
                );
                this.access_point_headers = JSON.parse(
                  JSON.stringify(this.ap_header)
                );
              } else {
                saveSettings.table_headers.ap_headers = JSON.parse(
                  JSON.stringify(this.access_point_headers)
                );
                this.ap_header = JSON.parse(
                  JSON.stringify(this.access_point_headers)
                );
              }
            } else {
              this.ap_header = JSON.parse(
                JSON.stringify(this.access_point_headers)
              );
              this.activity_header = JSON.parse(
                JSON.stringify(this.event_headers)
              );

              saveSettings = {
                table_headers: {
                  ap_headers: JSON.parse(
                    JSON.stringify(this.access_point_headers)
                  ),
                  activity_headers: JSON.parse(
                    JSON.stringify(this.event_headers)
                  ),
                },
              };
            }

            if (!settings.dashboard_settings) {
              saveSettings.dashboard_settings = {
                ap_monitor_1: {
                  access_point: null,
                  delay: 0,
                  enable_sound: false,
                  enable_short_info: false,
                  show_photo_car: "car_cardholder",
                  miniature_position: "fixed",
                  miniature_orientation: "vertical",
                  miniature_drag_pos: { left: 23, top: 52 },
                  camera: null,
                  enable_cctv: true,
                  enable_miniature: true,
                },
                ap_monitor_2: {
                  access_point: null,
                  delay: 0,
                  enable_sound: false,
                  enable_short_info: false,
                  show_photo_car: "car_cardholder",
                  miniature_position: "fixed",
                  miniature_orientation: "vertical",
                  miniature_drag_pos: { left: 23, top: 52 },
                  camera: null,
                  enable_cctv: true,
                  enable_miniature: true,
                },
              };
              this.monitor_1_settings =
                saveSettings.dashboard_settings.ap_monitor_1 || null;
              this.monitor_2_settings =
                saveSettings.dashboard_settings.ap_monitor_2 || null;
            } else {
              this.monitor_1_settings =
                settings.dashboard_settings.ap_monitor_1 || null;
              this.monitor_2_settings =
                settings.dashboard_settings.ap_monitor_2 || null;
            }

            if (settings.monitor_configs) {
              this.$store.commit(
                "schedule/SET_MONITOR_DATA",
                settings.monitor_configs
              );
            }
            if (settings.monitor2_configs) {
              this.$store.commit(
                "schedule/SET_MONITOR_2_DATA",
                settings.monitor2_configs
              );
            }
            if (saveSettings.not_visible_ids) {
              params.not_visible_ids = saveSettings.not_visible_ids;
            }

            if (settings.activity_limit) {
              this.logs_limit = settings.activity_limit;
            }

            await this.$store.dispatch("setSettings", saveSettings)

          }

          this.fetchDashboardAccessPoints(params);

          this.$store.commit("cardholder/RESET_CARD_INFO");

          const paramsLogs = {
            page: this.logs_page,
            page_items_count: this.logs_limit,
          };
          this.fetchActivityLogs(paramsLogs);
          this.fetchDashboardCardholders();
          this.showDelayMonitor();
          this.fetchDashboardData();
          const user = localStorage.user ? JSON.parse(localStorage.user) : null;

          this.subscribeSockets();

          this.$store.dispatch("accessPoint/fetchAccessPoint").then((res) => {
            this.savePoints = res;
            this.$vs.loading.close();
          });
        }
      });

    this.$root.$on("configsChanged", () => {

      const settings = JSON.parse(JSON.stringify(this.settingsStore));

      this.monitor_1_settings = settings.dashboard_settings
        ? settings.dashboard_settings.ap_monitor_1
        : null;

      this.monitor_2_settings = settings.dashboard_settings
        ? settings.dashboard_settings.ap_monitor_2
        : null;
    });
    // });
  },
  beforeDestroy() {
    this.unsubscribeSockets();
    this.$root.$emit("closeStream");
  },
  methods: {
    openCardholderFunc() {
      this.$vs.loading({
        type: "corners",
      });
      this.openCardholder = true;

      this.currentForm = "group";

      this.$store
        .dispatch("cardGroup/fetchCardHolderGroups")
        .then((res) => {
          if (res.data.length) {
            const findParent = res.data.find((c) => c.default);
            this.$store.commit(
              "cardholder/SET_PARENT_GROUP_INHERIT",
              findParent.id
            );
          }
          this.canSeeRight = false;
          setTimeout(() => {
            this.currentForm = "user";
            this.canSeeRight = true;
            this.openCardholder = true;
            this.$vs.loading.close();
          }, 500);
        })
        .catch(() => {
          this.$vs.loading.close();
        });
    },
    onRowClicked(card) {
      this.openDetail(card.data);
    },
    onRowAPClicked(point) {
      this.openAccessPointDetail(point.data);
    },
    onGridReady(params) {
      this.$vs.loading({
        type: "corners",
      });
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      setTimeout(() => {
        this.autoSizeAll();
      }, 100);
    },
    autoSizeAll() {
      this.gridApi.sizeColumnsToFit();
      setTimeout(() => {
        this.opacity_table = true;
        this.$vs.loading.close();
      }, 0);
    },
    async changeAvtivityHeaders() {
      this.$vs.loading({
        type: "corners",
      });
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      if (settings.table_headers) {
        settings.table_headers.activity_headers = this.event_headers;
      } else {
        settings.table_headers = {
          activity_headers: this.event_headers,
        };
      }
      this.activity_header = JSON.parse(JSON.stringify(this.event_headers));
      await this.$store.dispatch("setSettings", settings)

      // this.setSettings(settings);
      this.ev_table_headers_opup = false;
      this.$root.$emit("refreshActivityTable");
    },
    cancelActivityHead() {
      this.event_headers = JSON.parse(JSON.stringify(this.activity_header));
      this.ev_table_headers_opup = false;
    },
    async changeApHeaders() {
      this.$vs.loading({
        type: "corners",
      });
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      if (settings.table_headers) {
        settings.table_headers.ap_headers = this.access_point_headers;
      } else {
        settings.table_headers = {
          ap_headers: this.access_point_headers,
        };
      }
      this.ap_header = JSON.parse(JSON.stringify(this.access_point_headers));
      await this.$store.dispatch("setSettings", settings)

      // this.setSettings(settings);
      this.ap_table_headers_opup = false;
      this.$root.$emit("refreshApTable");
    },
    cancelApHeaders() {
      this.access_point_headers = JSON.parse(JSON.stringify(this.ap_header));
      this.ap_table_headers_opup = false;
    },
    async changeScreenSettings() {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.screen_settings = this.screenSettings;
      this.screenConfigs = this.screenSettings;
      await this.$store.dispatch("setSettings", settings)

      // this.setSettings(settings);
      this.blockSettingsPopup = false;
    },
    async setRemoveStorage(event) {
      this.screenSettings[event].show = false;
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.screen_settings = this.screenSettings;

      this.screenConfigs = JSON.parse(JSON.stringify(this.screenSettings));
      await this.$store.dispatch("setSettings", settings)

      // this.setSettings(settings);
    },

    updateMonitors() {
      this.$vs.loading({
        type: "corners",
      });

      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      if (settings && settings.dashboard_settings) {
        this.monitor_1_settings =
          settings.dashboard_settings.ap_monitor_1 || null;

        this.monitor_2_settings =
          settings.dashboard_settings.ap_monitor_2 || null;
      }

      setTimeout(() => {
        this.$vs.loading.close();
      }, 200);

    },
    timeOut(time) {
      const self = this.monitors;
      class Interval {
        timer = false;
        constructor(time) {
          this.start = function () {
            if (!this.isRunning()) {
              this.timer = setInterval(() => {
                if (self.length == 1) {
                  clearInterval(this.timer);
                } else {
                  self.splice(0, 1);
                }
              }, time);
            }
          };
          this.stop = function () {
            clearInterval(this.timer);
            this.timer = false;
          };
          this.isRunning = function () {
            return this.timer !== false;
          };
        }
      }
      let inter = new Interval(time);

      if (this.monitors.length > 1) {
        inter.start();
      } else if (this.monitors.length == 1) {
        inter.stop();
      }
    },
    createInformation(e) {
      e.preventDefault();
      if (this.currentForm === "credentials") {
        localStorage.setItem("cardholder_tab", "credential");
      } else {
        localStorage.removeItem("cardholder_tab");
      }

      let cardholder_info = { ...this.cardholder_info };
      const saveObject = createCardholder(cardholder_info);
      if (!saveObject.credentials.length) {
        const hex_code = this.socket_cr.code.replace(/ /g, "");
        const code_ = BigInt("0x" + hex_code).toString();

        if (this.socket_cr && this.socket_cr.code) {
          const hex_code = this.socket_cr.code.replace(/ /g, "");
          const code_ = BigInt("0x" + hex_code).toString();

          saveObject.credentials = [
            {
              type: "rfid",
              code: code_,
              input_mode: "serial_number",
            },
          ];
        }
      }
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("cardholder/createUser", { data: saveObject })
        .then((res) => {
          this.$vs.loading.close();
          this.showNotif(true, `Cardholder created`);

          this.openCardholder = false;
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    updateInformation() {
      let cardholder = { ...this.edit_cardholder_info };
      const saveObject = editCardholder(cardholder);

      this.$store
        .dispatch("cardholder/updateUser", saveObject)
        .then((res) => {
          this.$vs.loading.close();
          this.showNotif(true, `Cardholder updated`);

          this.openEdit = false;
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    openAccessPointDetail(event) {
      this.ac_status_data = event;
      if (event.acus && event.acus.network) {
        const network = JSON.parse(event.acus.network);
        this.ac_status_data.acus.ip_address = network.ip_address;
      }

      this.ac_point_popup = true;
    },
    subscribeSockets() {
      const user = localStorage.user ? JSON.parse(localStorage.user) : null;
      this.sockets.subscribe(
        `error_channel/${user.company}/${user.id}`,
        (payload) => {
          if (this.$route.name == "Dashboard") {
            const error_data = JSON.parse(payload);
            this.showNotif(
              false,
              error_data.error_description || "",
              error_data.device_id || ""
            );
          }
        }
      );
      this.sockets.subscribe(
        `credential_automat_mode/${user.company}`,
        (payload) => {
          const data = JSON.parse(payload);

          this.$root.$emit("getCredential", data);
        }
      );
      this.sockets.subscribe(`error_channel/${user.company}`, (payload) => {
        if (this.$route.name == "Dashboard") {
          const error_data = JSON.parse(payload);
          this.showNotif(
            false,
            error_data.error_description || "",
            error_data.device_id || ""
          );
        }
      });
      this.sockets.subscribe(
        `dashboard_access_point/${user.company}`,
        (data) => { }
      );
      this.sockets.subscribe(
        `dashboard_access_point_modes/${user.company}`,
        (data) => {
          this.access_point_modes = JSON.parse(data);
        }
      );
      this.sockets.subscribe(
        `dashboard_event_statistic/${user.company}`,
        (data) => { }
      );
      this.sockets.subscribe(`dashboard_acu/${user.company}`, (data) => {
        this.access_pointData =
          JSON.parse(data) && JSON.parse(data).access_points
            ? JSON.parse(data).access_points
            : null;

        this.acuData =
          JSON.parse(data) && JSON.parse(data).acus
            ? JSON.parse(data).acus
            : null;

      });
      this.sockets.subscribe(`dashboard_activity/${user.company}`, (ev) => {
        const data = JSON.parse(ev);
        const activitySettings = localStorage.getItem('activity_settings') && JSON.parse(localStorage.getItem('activity_settings')) ? JSON.parse(localStorage.getItem('activity_settings')) : []
        if (activitySettings && activitySettings.length) {
          if (data.access_point && activitySettings.find(a => a.id == data.access_point)) {
            return false
          }
        }

        let event_list = [...this.eventsData];

        this.eventsData = bindEventData(data, event_list);

        const u_id = uid(12);

        const { eventObj, socketData } = socketLog(data, u_id);

        this.saveLogs.push({ ...socketData, id: u_id, api: false });
        this.logs.data.unshift(eventObj);
        const params = {
          page: this.page,
          page_items_count: this.itemsPerPageStatus,
        };
      });
      this.sockets.subscribe(`dashboard_monitor/${user.company}`, (data) => {
        const payload = JSON.parse(data);

        this.monitors.push(payload);
        if (this.monitors.length === 0) {
          this.monitors = [];
        }
      });

      this.sockets.subscribe(
        `dashboard_cloud_status/${user.company}`,
        (data) => {
          const point_data = JSON.parse(data);

          const status = point_data.acus.cloud_status;
          if (point_data.delete) {
            this.changedStatus = {
              type: "delete",
              status: status,
            };

            const index = this.access_points.data.findIndex(
              (p) => p.id == point_data.id
            );
            this.access_points.data[index].splice(index, 1);
          } else {
            const index = this.access_points.data.findIndex(
              (p) => p.id == point_data.id
            );
            this.access_points.data[index].cloud_status = status;

            this.changedStatus = {
              type: "change",
              status: status,
            };
          }
        }
      );
    },
    bindLogsData(array) {
      let logs = [];
      if (array.length) {
        array.forEach((event) => {
          const unique_id = uid(12);
          const eventObj = bindLogs(event, unique_id);

          this.saveLogs.push({ id: unique_id, ...eventObj, api: true });

          logs.push(eventObj);
        });
        return logs;
      }
    },
    openDetail(data) {
      let event = this.saveLogs.find((l) => l.id == data.id);
      const obj = detailInformation(event);
      this.userLogPopupData = obj;

      this.userLogPopup = true;
    },
    showDelayMonitor() {

      const settings = JSON.parse(JSON.stringify(this.settingsStore));

      const delayTime =
        settings &&
          settings.dashboard_settings &&
          "delay" in settings.dashboard_settings.ap_monitor_1
          ? +settings.dashboard_settings.ap_monitor_1.delay
          : 4;
      clearTimeout(this.delayTimer);

      this.delayTimer = setTimeout(() => {
        this.timeOut(delayTime * 1000);
      }, 200);


    },
    showDelayMonitor2() {

      const settings = JSON.parse(JSON.stringify(this.settingsStore));

      const delayTime =
        settings &&
          settings.dashboard_settings &&
          "delay" in settings.dashboard_settings.ap_monitor_2
          ? +settings.dashboard_settings.ap_monitor_2.delay
          : 4;

      // if (this.monitors.length == 1 || this.monitors.length == 2) {
      this.timeOut(delayTime * 1000);
      // }
      // });
    },
    changeLimit(event) {
      // this.getLastLogs(event);
    },
    fetchDashboardData() {
      this.$http
        .get(`Dashboard`, { headers: { Authorization: localStorage.token } })
        .then((response) => {
          this.access_point_modes = response.data.access_point_modes;
          this.access_pointData = response.data.access_point_status;
          this.access_point_status = response.data.access_points;
          this.acuData = response.data.acus_status;
          this.eventsData = response.data.events_statistic;
        });
    },
    fetchDashboardCardholders() {
      this.$http
        .get(`Dashboard/getCardholders`, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          this.dashboard_cardholders = response.data;
        });
    },
    fetchDashboardAccessPoints(params) {
      this.$vs.loading({
        type: "corners",
      });
      this.$http
        .get(`Dashboard/getAllAccessPoints`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((res) => {
          this.access_points.data = [];
          this.$vs.loading.close();
          let data = JSON.parse(JSON.stringify(res.data));

 
            
            

            const { totalPage, pointData } = accessPointsDataBind(
              data,
              this.itemsPerPageStatus
            );

            this.totalPage = totalPage;
            this.access_points = pointData;
          // }
          // this.filterApData();
        })
        .catch(() => {
          this.$vs.loading.close();
        });
    },
    filterApData() {
      if (
        localStorage.access_point_settings &&
        JSON.parse(localStorage.access_point_settings).length
      ) {
        const items = JSON.parse(localStorage.access_point_settings);
        let arr = [...this.savePoints.data];
        let new_points = [];

        if (arr.length) {
          arr.forEach((point) => {
            if (items.find((p) => p.id === point.id)) {
              new_points.push(point);
            }
          });
        }
        this.access_points.data = new_points;
        this.access_points.count = new_points.length;
      } else {
        this.access_points.data = [...this.savePoints.data];
        this.access_points.count = this.savePoints.count;
      }

      const sum = this.access_points.count % this.itemsPerPageStatus;
      if (!sum) {
        this.totalPage = Math.floor(
          this.access_points.count / this.itemsPerPageStatus
        );
      } else {
        this.totalPage =
          Math.floor(this.access_points.count / this.itemsPerPageStatus) + 1;
      }
    },
    fetchActivityLogs(params) {

      //nedd beckend filtering
      this.$vs.loading({
        type: "corners",
      });
      this.$http
        .get(`Dashboard/getDashboardActivity`, {
          headers: { Authorization: localStorage.token },
          params,
        })
        .then((res) => {
          this.logsForSettings = res.data.data;
          let data = JSON.parse(JSON.stringify(res.data));
          this.saveMonitor = JSON.parse(JSON.stringify(res.data));
          this.logs.data = this.bindLogsData(data.data);
          this.filterPoints();
          this.logs.count = this.logs.data.length;
          this.$vs.loading.close();

        
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    filterPoints() {
      if (
        localStorage.activity_settings &&
        JSON.parse(localStorage.activity_settings).length
      ) {
        const items = JSON.parse(localStorage.activity_settings);
        const excliudeIds = items.map((i)=>i.id);
        const indexes = [];
        
        if (this.logs.data.length > 0 && excliudeIds.length > 0) {
          let filterd = this.logs.data.filter((logItem,LogIndex)=> {
            return  ! excliudeIds.includes(logItem.access_point_id);
          }); 

          this.logs.data = filterd;

        }
      }
    },
    editCardholder(id) {
      this.$store
        .dispatch("cardholder/fetchCardholder", id)
        .then((res) => {
          setTimeout(() => {
            this.updateForms = "edit_user";
            this.openEdit = true;

            this.$vs.loading.close();
          }, 100);
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    inviteUser() {
      if (
        this.edit_cardholder_info.email &&
        this.edit_cardholder_info.first_name
      ) {
        this.invite_user_popup = true;
      } else {
        this.showNotif(false, "Please fill first name and email");
      }
    },
    sendInvite() {
      this.$store
        .dispatch("cardholder/inviteCardholder", {
          email: this.edit_cardholder_info.email,
        })
        .then((res) => {
          if (res.data.success) {
            this.invite_user_popup = false;
            this.showNotif(true, "Invite to cardholder sent");
          }
        });
    },
    async setShowAccessPoint(ids) {
      let settings = this.userConfig;

      console.log("settings",settings);
      const params = {
        page: 1,
        page_items_count: this.itemsPerPageStatus,
      };
      if (ids.length) {
        params.not_visible_ids = ids;
      }
      if (settings) {
        settings.not_visible_ids = ids;
      } else {
        settings = {
          not_visible_ids: ids,
        };
      }
      await this.$store.dispatch("setSettings", settings)
      // this.setSettings(settings);
      this.fetchDashboardAccessPoints(params);


    },
    setShowActivity(not_visibles) {
      const paramsLogs = {
        page: 1,
        page_items_count: this.logs_limit,
      };
      this.fetchActivityLogs(paramsLogs);
    },
    showNotif(success, text, description) {
      this.$vs.notify({
        time: 7000,
        color: !success ? "danger" : "success",
        title: text,
        description: description ? description : "",
      });
    },
    unsubscribeSockets() {
      const user = localStorage.user ? JSON.parse(localStorage.user) : null;
      this.sockets.unsubscribe(`dashboard_access_point/${user.company}`);
      this.sockets.unsubscribe(`dashboard_access_point_modes/${user.company}`);
      this.sockets.unsubscribe(`dashboard_event_statistic/${user.company}`);
      this.sockets.unsubscribe(`dashboard_acu/${user.company}`);
      this.sockets.unsubscribe(`dashboard_activity/${user.company}`);
      this.sockets.unsubscribe(`dashboard_monitor/${user.company}`);
      this.sockets.unsubscribe(`dashboard_cloud_status/${user.company}`);
      this.sockets.unsubscribe(`error_channel/${user.company}/${user.id}`);
      this.sockets.unsubscribe(`error_channel/${user.company}`);
    },
    async updateMonitorOptions(data, monitor) {
      const set = JSON.parse(JSON.stringify(this.settingsStore))
      if (monitor === 1) {
        //await this.$store.dispatch({ ...set, monitor_configs: [...data] });

        await this.$store.dispatch("setSettings", { ...set, monitor_configs: [...data] });
        this.$store.commit("schedule/SET_MONITOR_DATA", [...data]);
      } else {
       
        await this.$store.dispatch("setSettings", { ...set, monitor2_configs: [...data] });
        this.$store.commit("schedule/SET_MONITOR_2_DATA", [...data]);
      }
    },
    changeMode(mode) {
      this.saveMode = mode;
      this.modePrompt = true;
      // this.$vs.dialog({
      //   type: "confirm",
      //   color: "success",
      //   title: `Confirm change`,
      //   text: `Do You want to chnage mode to ${mode}?`,
      //   accept: this.updateMode,
      //   acceptText: "Change",
      // });
    },
    updateMode() {
      this.$vs.loading({
        type: "corners",
      });
      this.$http
        .put(`accessPoint/updateMode`, { mode: this.saveMode }, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          if (res.data && res.data.message) {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: res.data.message,
            });
          } else {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Access Points Mode updated",
            });
          }

          setTimeout(() => {
            this.$vs.loading.close();
          }, 100);
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    }
  },
  computed: {
    ac_headers() {
      return this.ap_header.filter((h) => h.show);
    },
    ev_headers() {
      return this.activity_header.filter((h) => h.show);
    },
    cardholder_info() {
      return this.$store.state.cardholder.cardholder_info;
    },
    currentPage: {
      get() {
        return 1;
      },
    },
    types() {
      return this.$store.state.types;
    },
    editTypes() {
      return this.$store.state.editTypes;
    },
    edit_cardholder_info() {
      return this.$store.state.cardholder.edit_cardholder_info;
    },
    isFormValid() {
      return dashboardCardholderValidation(this.cardholder_info);
    },
    isEditFormValid() {
      return (
        this.edit_cardholder_info.first_name &&
        (this.edit_cardholder_info.access_right ||
          this.edit_cardholder_info.access_right_inherited) &&
        this.edit_cardholder_info.cardholder_group
      );
    },
    permissions() {
      return localStorage.permissions &&
        JSON.parse(localStorage.permissions).Dashboard
        ? JSON.parse(localStorage.permissions).Dashboard.actions
        : null;
    },
    configsScreen() {
      return this.screenConfigs;
    },
    monitorDataConfig() {
      return this.$store.state.schedule.monitorDataConfig;
    },
    monitor2DataConfig() {
      return this.$store.state.schedule.monitor2DataConfig;
    },
    access_points_list() {
      return this.$store.state.accessPoint.access_points;
    },
    settingsStore() {
      return this.$store.state.settings
    },
    getModalTitle() {
      if (this.saveMode === 'credential') {
        return "NORMAL"
      } else if (this.saveMode === 'locked') {
        return "LOCK DOWN"
      } else if (this.saveMode === 'unlocked') {
        return "UNLOCK"
      }
    }
  },
  watch: {
    ev_table_headers_opup(val) {
      if (!val) {
        this.event_headers = JSON.parse(JSON.stringify(this.activity_header));
      }
    },
    ap_table_headers_opup(val) {
      if (!val) {
        this.access_point_headers = JSON.parse(JSON.stringify(this.ap_header));
      }
    },
    openCardholder(val) {
      if (!val) {
        this.$store.commit("cardholder/RESET_CARD_INFO");
      }
    },
    itemsPerPageStatus(event) {
      
      this.page = 1;
      const params = { page: this.page, page_items_count: event };
      this.fetchDashboardAccessPoints(params);
    },
    page(event) {
      const params = { page: event, page_items_count: this.itemsPerPageStatus };
      this.fetchDashboardAccessPoints(params);
    },
    logs_page(event) {
      const paramsLogs = {
        page: event,
        page_items_count: this.logs_limit,
      };
      setTimeout(() => {
        this.fetchActivityLogs(paramsLogs);
      }, 1000);
    },
    async logs_limit(event) {
      const paramsLogs = {
        page: this.logs_page,
        page_items_count: event,
      };
      this.fetchActivityLogs(paramsLogs);
      const set = JSON.parse(JSON.stringify(this.settingsStore))
      const settings = bindSettings(set, this.logs_limit);
      await this.$store.dispatch("setSettings", settings)

      // this.setSettings(settings);
    },
    blockSettingsPopup(val) {
      if (val) {
        this.screenSettings = JSON.parse(JSON.stringify(this.screenConfigs));
      }
    },
    monitors: {
      handler() {

       
        const sound = new Audio(this.notifSound);

        const settings = JSON.parse(JSON.stringify(this.settingsStore));

        const { access_point1, access_point2, canPlay1, canPlay2 } =
          getMonitorConfigs(settings);
        if (this.monitors.length) {
          if (access_point1) {
            if (this.monitors[0].access_point == access_point1) {
              this.monitor1 = this.monitors[0];
              this.showDelayMonitor();
              if (canPlay1) {
                sound.play();
              }
            } else {
              this.showDelayMonitor();
            }
          } else {
            this.monitor1 = this.monitors[0];
            this.showDelayMonitor();
            if (canPlay1) {
              sound.play();
            }
          }

          if (access_point2) {
            if (this.monitors[0].access_point == access_point2) {
              this.monitor2 = this.monitors[0];
              this.showDelayMonitor2();
              if (canPlay2) {
                sound.play();
              }
            } else {
              this.showDelayMonitor2();
            }
          } else {
            this.monitor2 = this.monitors[0];
            this.showDelayMonitor2();
            if (canPlay2) {
              sound.play();
            }
          }
        }
      },
      deep: true,
    },
  },
  components: {
    AccessPointModes,
    AccessPointStatus,
    AcuStatus,
    EventStats,
    AccessPointMonitor,
    AccessPointMonitor2,
    ActivityTable,
    Table,
    EventDetail,
    MonitorSettingsPopup,
    Monitor2SettingsPopup,
    vSelect,
    AccessPointStatusPopup,
    user,
    car_infos,
    limitations,
    antipass_backs,
    time_attendance,
    group,
    extra_features,
    access_right,
    credentials,
    edit_antipass_back,
    edit_user,
    edit_car_info,
    edit_limitation,
    edit_extra_features,
    edit_access_right,
    edit_time_attendance,
    edit_group,
    edit_credentials,
    CloseBlock,
    CardholdersPresence,
    ActivitySettingsPopup,
    APStatus,
    AccessPointTable,
    AccessPointStatusChart,
    MonitorConfig,
    Monitor2Config,
  },
};

import MonitorConfig from "./popups/monitor/MonitorConfig";
import Monitor2Config from "./popups/monitor/Monitor2Config";
import { uid } from "uid";
import { bindEventData } from "@/functions/dasgboardEventData";
import {
  moduleCardholder,
  moduleCardGroup,
  moduleRight,
  moduleSchedule,
  moduleFile,
  AccessPointModes,
  AccessPointStatus,
  CardholdersPresence,
  AcuStatus,
  EventStats,
  AccessPointMonitor,
  AccessPointMonitor2,
  // Posts,
  EventDetail,
  MonitorSettingsPopup,
  Monitor2SettingsPopup,
  AccessPointStatusPopup,
  user,
  car_infos,
  limitations,
  antipass_backs,
  time_attendance,
  group,
  extra_features,
  access_right,
  credentials,
  edit_antipass_back,
  edit_user,
  edit_car_info,
  edit_limitation,
  edit_extra_features,
  edit_access_right,
  edit_time_attendance,
  edit_group,
  edit_credentials,
  vSelect,
  Table,
  CloseBlock,
  moduleAccessPoint,
  ActivitySettingsPopup,
  APStatus,
} from "./index";
import { createCardholder, editCardholder } from "./functions/dataBind";
const notifSound = require("@/assets/sound/notif.mp3");
import ActivityTable from "./tables/Activity";
import AccessPointTable from "./tables/AccessPointTable";
import AccessPointStatusChart from "./chart/AccessPointStatus";
</script>

<style lang="scss">
@import "./style.scss";
</style>
