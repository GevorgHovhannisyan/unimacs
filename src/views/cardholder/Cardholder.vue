<template>
  <div class="cardholder_page">
    <vs-prompt title="Please confirm delete" class="export-options load_progress" @cancel="undoDelete"
      @accept="deleteManyCards" accept-text="Confirm" @close="undoDelete" :active.sync="progresspopup"
      :buttons-hidden="true">
      <div class="vx-row confirm_card__delete">
        <div class="vx-col">
          <span>
            You are about to delete the sellected cards owners information!
          </span>
          <span class="bold_text"> This action can not be reversed ! </span>
          <br />
          <span class="bold_text"> Are you sure you want to delete? </span>

          <div>
            <span>Deletion will be available in: </span>
            <span>{{ codeTimer }} sec</span>
          </div>
        </div>
      </div>

      <footer>
        <button type="button" name="button"
          class="vs-component vs-button vs-dialog-accept-button vs-button-primary vs-button-filled"
          :disabled="!codeTimer == 0" @click="deleteManyCards">
          <span class="vs-button-backgroundx vs-button--background" style="
              opacity: 1;
              left: 20px;
              top: 20px;
              width: 0px;
              height: 0px;
              transition: width 0.3s ease 0s, height 0.3s ease 0s,
                opacity 0.3s ease 0s;
            "></span>
          <!----><span class="vs-button-text vs-button--text">Confirm</span><span class="vs-button-linex" style="
              top: auto;
              bottom: -2px;
              left: 50%;
              transform: translate(-50%);
            "></span></button><button type="button" name="button"
          class="vs-component vs-button vs-dialog-cancel-button vs-button-primary vs-button-flat"
          style="background: transparent; color: rgba(0, 0, 0, 0.5)" @click="undoDelete">
          <span class="vs-button-backgroundx vs-button--background" style="
              opacity: 1;
              left: 20px;
              top: 20px;
              width: 0px;
              height: 0px;
              transition: width 0.3s ease 0s, height 0.3s ease 0s,
                opacity 0.3s ease 0s;
            "></span>
          <!----><span class="vs-button-text vs-button--text">Cancel</span><span class="vs-button-linex" style="
              top: auto;
              bottom: -2px;
              left: 50%;
              transform: translate(-50%);
            "></span>
        </button>
      </footer>
    </vs-prompt>
    <vs-prompt title="Export To Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
      accept-text="Export" @close="clearFields" :active.sync="activePrompt">
      <vs-input v-model="fileName" placeholder="Enter File Name.." class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
        <span class="mr-4">Cell Auto Width:</span>
        <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>
      </div>
    </vs-prompt>
    <vs-popup class="holamundo reg_invite_popup" title="Registration" :active.sync="invite_user_popup">
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input class="w-full mt-2" label="Username" name="first_name" disabled
            v-model="edit_cardholder_info.first_name" />
        </div>
        <div class="vx-col w-full">
          <vs-input class="w-full mt-3" label="Email" name="first_name" disabled v-model="edit_cardholder_info.email" />
        </div>
        <!-- <div class="vx-col w-full">
          <vs-checkbox class="mt-6 custom__checkbox"
            >I agree Terms and conditions</vs-checkbox
          >
        </div> -->
        <div class="vx-col w-full">
          <vs-button @click="sendInvite" color="#03ce00" style="margin-top: 30px;" class=" w-full">Register</vs-button>
        </div>
      </div>
    </vs-popup>
    <vs-popup class="holamundo" title="Choose cardholder headers" :active.sync="card_colums">
      <vs-checkbox v-for="(header, index) in card_table_headers" :key="index" class="mb-4 mt-5 custom__checkbox"
        :disabled="header.headerName === 'Actions'" v-model="header.show">{{ header.headerName }}</vs-checkbox>

      <div class="screen_false">
        <vs-button class="mt-4 unimacs_button" @click="changeCardHeaders">Submit</vs-button>
        <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="card_colums = false">Cancel</vs-button>
      </div>
    </vs-popup>
    <vs-popup class="holamundo popup_width_small cardhold_popup asd da_pop" :class="{ without_back: openEdit == true }"
      title="Create Cardholder" :active.sync="openCardholder">
      <div class="block_account add">
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
    <vs-popup class="holamundo popup_width_small cardhold_popup addOpened da_pop ed_user" title="Edit Cardholder"
      :active.sync="openEdit">
      <div class="block_account edit">
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
    <vs-popup class="holamundo s_popup" title="Select Cardholder Group" :active.sync="selectGroupPopup">
      <v-select :options="cardGroups" class="w-full mt-4 select_padding" placeholder="Cardholder Groups" name="cardGroups"
        v-model="groupMoveId" :reduce="(input_mode) => input_mode.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

      <vs-button class="ml-auto mt-2 update_info_button cg_button" color="success" @click.stop="moveTo"
        :disabled="!groupMoveId">Submit
      </vs-button>
    </vs-popup>
    <vs-popup class="holamundo s_popup" title="Select Cardholder Group" :active.sync="selectGroupPopupItem">
      <v-select :options="cardGroups" class="w-full mt-4 select_padding" placeholder="Cardholder Groups" name="cardGroups"
        v-model="newMovedItem" :reduce="(input_mode) => input_mode.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

      <vs-button class="ml-auto mt-2 update_info_button cg_button" color="success" @click.stop="moveToItem"
        :disabled="!newMovedItem">Submit
      </vs-button>
    </vs-popup>
    <div class="vx-card p-6" style="min-height: 770px">
      <div class="vx-row table_actions">
        <div class="vx-col"></div>
        <div class="vx-col flex flex-wrap items-center float-right">
          <div class="flex-grow"></div>

          <vs-dropdown vs-trigger-click @click="correctMenu()"
            class="cursor-pointer ml-1 cardholder_menu_icon burger_m unimacs_button unimacs_add_new_btn" vs-custom-content
            style="color: white">
            <div class="cursor-pointer">
              <span class="leading-none">
                <vs-icon style="font-size: 25px" icon-pack="material-icons" icon="reorder" />
              </span>
            </div>

            <vs-dropdown-menu class="card_drop_menu_inner">
              <vs-dropdown-item @click.prevent="callDynamicMethod(action.action)" v-for="(action, index) in contextMenus"
                :key="index">
                <span class="flex items-center">
                  <span>{{ action.name }}</span>
                </span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>

          <vs-button @click="card_colums = true" class="unimacs_button  ml-2" icon-pack="material-icons"
            icon="filter_list"></vs-button>
        </div>

        <vs-button class="unimacs_button unimacs_add_new_btn " @click="addCardholder">
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" /> Add New
        </vs-button>
      </div>

      <!-- <vs-dropdown vs-trigger-click class="cursor-pointer hover_class">
        <div
          class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
        >
          <span class="mr-2"
            >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
            {{
              cardholders.data.length - currentPage * itemsPerPage > 0
                ? currentPage * itemsPerPage
                : cardholders.data.length
            }}
            of {{ queriedItems }}</span
          >
          <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
        </div>
        <vs-dropdown-menu>
          <vs-dropdown-item @click="itemsPerPage = 10">
            <span>10</span>
          </vs-dropdown-item>
          <vs-dropdown-item @click="itemsPerPage = 20">
            <span>20</span>
          </vs-dropdown-item>
          <vs-dropdown-item @click="itemsPerPage = 50">
            <span>50</span>
          </vs-dropdown-item>
          <vs-dropdown-item @click="itemsPerPage = 100">
            <span>100</span>
          </vs-dropdown-item>
          <vs-dropdown-item @click="itemsPerPage = 500">
            <span>500</span>
          </vs-dropdown-item>
          <vs-dropdown-item @click="itemsPerPage = 1000">
            <span>1000</span>
          </vs-dropdown-item>
          <vs-dropdown-item @click="itemsPerPage = 5000">
            <span>5000</span>
          </vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown> -->

      <v-select v-model="itemsPerPage" :options="[10, 20, 50, 100, 500, 1000, 5000]"
        class="select_padding cardholder_limit" name="ap_type" placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'"
        :clearable="false" :searchable="false" />


      <div class="con-input-search vs-table--search">
        <input @input="cardholderSearch" v-model="cardsSearchText" type="text"
          class="input-search vs-table--search-input" /><i
          class="vs-icon notranslate icon-scale material-icons null">search</i>
      </div>
      <!-- :class="{ opacity_resize: opacity_table }" -->

      <ag-grid-vue ref="agGridTable" :gridOptions="gridOptions"
        class="ag-theme-material w-100 mb-4 ag-grid-table ap_ag_grid cardholder_tbl" :columnDefs="headers"
        :defaultColDef="defaultColDef" :rowData="cardholders.data" colResizeDefault="shift" @rowClicked="onRowClicked"
        @grid-ready="onGridReady" domLayout="autoHeight" rowSelection="multiple" :animateRows="true" :pagination="false"
        :enableRtl="$vs.rtl" @row-selected="onRowSelected" :suppressDragLeaveHidesColumns="true"
        :suppressAggFuncInHeader="true" :suppressRowClickSelection="true">
        <!-- :suppressPaginationPanel="true" -->
      </ag-grid-vue>

      <CustomPaging @pageChanged="page = $event" :total="totalPage"
        v-if="itemsPerPage < cardholders.count ? true : false" />

      <!-- <vs-pagination
        class="mt-3"
        v-if="itemsPerPage < cardholders.count ? true : false"
        :total="totalPage"
        v-model="page"
      ></vs-pagination> -->
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import vSelect from "vue-select";
import {
  moduleCardholder,
  moduleCardGroup,
  moduleRight,
  moduleSchedule,
  moduleFile,
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
  guest_keys,
  edit_guest_keys,
} from "./modules";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import { updateDataBind, createDataBind } from "@/functions/cardholderDataBind";
import CellRendererActions from "./renderer/CellRendererActions";
import CellRendererStatus from "./renderer/CellRendererStatus";
import CellRendererAntiPass from "./renderer/CellRendererAntiPass";
import MultiTable from "@/components/custom/table/CardMultiTable";
export default {
  methods: {
    onRowSelected(event) {
      const check = event.node.isSelected();
      this.$store.commit("cardholder/CHECK_ITEM", {
        event: check,
        item: event.node.data,
      });
    },

    exportToExcel() {
      const name = this.fileName;

      import("@/vendor/Export2Excel").then((excel) => {
        const list = this.cardholders.data;
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
    undoDelete() {
      clearInterval(this.downloadTimer);
      this.progresspopup = false;
      this.downloadTimer = null;
      this.showCodeBlock = false;
      this.codeTimer = 0;
    },
    clearFields() {
      this.filename = "";
      this.cellAutoWidth = true;
      this.selectedFormat = "xlsx";
    },
    startProcess() {
      clearInterval(this.downloadTimer);
      this.downloadTimer = null;
      var timeleft = 10;
      this.codeTimer = 10;
      this.downloadTimer = setInterval(() => {
        if (timeleft < 1) {
          this.codeTimer = 0;
        } else {
          timeleft -= 1;
          this.codeTimer = timeleft;
        }
      }, 1000);
    },
    confirmDelete() {
      this.undoDelete();
      this.deleteManyCards();
    },
    confirmDeleteManyRecord() {
      this.progresspopup = true;
      this.startProcess();
    },
    checkItem({ event, item }) {
      this.$store.commit("cardholder/CHECK_ITEM", { event, item });
    },
    setAllChecked(value) {
      this.$store.commit("cardholder/SET_ALL_CHECKED", { event: value });
    },
    createInformation(e) {
      this.access = false;
      e.preventDefault();

      if (this.currentForm === "credentials") {
        localStorage.setItem("cardholder_tab", "credential");
      } else {
        localStorage.removeItem("cardholder_tab");
      }

      let cardholder_info = { ...this.cardholder_info };
      const saveObject = createDataBind(cardholder_info);
      let hasRules = false;



      if (saveObject.access_right) {
        this.$store
          .dispatch("right/fetchRight", saveObject.access_right)
          .then((res) => {
            const access_rules = res.data.access_rules;
            if (access_rules && access_rules.length) {
              hasRules = true;
            }
          });
      }

      this.$vs.loading({
        type: "corners",
      });

      const params = {
        page: this.page,
        page_items_count: this.itemsPerPage,
      };


      const filterObj = this.delKeys(saveObject)

      this.$store
        .dispatch("cardholder/createUser", { data: filterObj, params })
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Cardholder created",
          });

          if (!hasRules && !saveObject.access_right_inherited) {
            this.$vs.notify({
              time: 7000,
              color: "warning",
              title:
                "You save a cardholder  which does not have access rules in access right. You have to add access rule into access right after adding Access Point.",
            });
          }

          const params = {
            page: this.page,
            page_items_count: this.itemsPerPage,
          };

          this.getCardholders(params);

          // this.editCardholder(res.data);

          this.$store.commit("cardholder/RESET_CARD_INFO");
          this.addCardholder();
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    editCardholder(data) {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("cardholder/fetchCardholder", data.id)
        .then((res) => {
          setTimeout(() => {
            if (
              localStorage.cardholder_tab &&
              localStorage.cardholder_tab === "credential"
            ) {
              this.updateForms = "edit_credentials";
            } else {
              this.updateForms = "edit_user";
            }
            this.openEdit = true;
          }, 300);

          setTimeout(() => {
            this.$vs.loading.close();
          }, 300);
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    updateInformation() {
      let cardholder = { ...this.edit_cardholder_info };
      const saveObject = updateDataBind(cardholder);
      let hasRules = false;


      if (saveObject.access_right) {
        this.$store
          .dispatch("right/fetchRight", saveObject.access_right)
          .then((res) => {
            const access_rules = res.data.access_rules;
            if (access_rules && access_rules.length) {
              hasRules = true;
            }
          });
      }
      const filterObj = this.delKeys(saveObject)

      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("cardholder/updateUser", filterObj)
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Cardholder updated",
          });

          if (!hasRules && !saveObject.access_right_inherited) {
            this.$vs.notify({
              time: 7000,
              color: "warning",
              title:
                "You save a cardholder  which does not have access rules in access right. You have to add access rule into access right after adding Access Point.",
            });
          }
          const params = {
            page: this.page,
            page_items_count: this.itemsPerPage,
          };
          this.getCardholders(params);
          if (
            this.edit_cardholder_info.status ==
            !this.edit_cardholder_info.save_status
          ) {
            this.openEdit = false;
            return false;
          }
          this.$store
            .dispatch("cardholder/fetchCardholder", res.data.id)
            .then((res) => {
              this.updateForms = "edit_credentials";
              this.updateForms = "edit_user";
              setTimeout(() => {
                this.$vs.loading.close();
              }, 300);
            })
            .catch((err) => {
              this.$vs.loading.close();
            });

          setTimeout(() => {
            this.$vs.loading.close();
          }, 200);
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    addCardholder() {
      this.$vs.loading({
        type: "corners",
      });
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
          }, 350);
        })
        .catch(() => {
          this.$vs.loading.close();
        });
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.first_name} cardholder`,
        accept: this.deleteUser,
        acceptText: "Delete",
      });
    },
    deleteManyCards() {
      this.$vs.loading({
        type: "corners",
      });

      const selecteds = this.$store.state.cardholder.checked_cardholders;
      let ids = [];
      if (selecteds && Object.keys(selecteds).length) {
        for (const key in selecteds) {
          if (selecteds[key]) {
            ids.push(key);
          }
        }
      }

      this.$store
        .dispatch("cardholder/deleteCardholderMany", ids)
        .then((res) => {
          this.progresspopup = false;

          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Cardholder(s) deleted",
          });
          this.deletedId = null;

          const sum = this.cardholders.count % this.itemsPerPage;
          if (!sum) {
            this.totalPage = Math.floor(
              this.cardholders.count / this.itemsPerPage
            );
          } else {
            this.totalPage =
              Math.floor(this.cardholders.count / this.itemsPerPage) + 1;
          }
          this.page = 1;
          const params = {
            page: this.page,
            page_items_count: this.itemsPerPage,
          };
          this.getCardholders(params);
        })

        .catch((err) => {
          this.$vs.loading.close();
        });

      this.$store.commit("cardholder/SET_ALL_CHECKED", { event: false });
    },
    deleteUser() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("cardholder/deleteCardholder", this.deletedId)
        .then((res) => {
          this.$vs.loading.close();

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Cardholder deleted",
          });
          this.deletedId = null;

          const sum = this.cardholders.count % this.itemsPerPage;
          if (!sum) {
            this.totalPage = Math.floor(
              this.cardholders.count / this.itemsPerPage
            );
          } else {
            this.totalPage =
              Math.floor(this.cardholders.count / this.itemsPerPage) + 1;
          }

          const params = {
            page: this.page,
            page_items_count: this.itemsPerPage,
          };
          this.getCardholders(params);
        })

        .catch((err) => {
          this.$vs.loading.close();
          this.activeLoading = false;
        });
    },
    changeStatus(status, ids) {
      if (status == "deleteRecord") {
        this.confirmDeleteManyRecord();
      } else if (status == "moveToGroup") {
        this.selectGroupPopup = true;
      } else {
        this.$store
          .dispatch("cardholder/updateCardStatus", { status, ids })
          .then((res) => {
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Cardholder(s) status updated",
            });
          });
      }
    },
    correctMenu() {
      this.contextMenus = [];
      if (!this.permissions || this.permissions.updateItem) {
        this.contextMenus.push(
          { name: "Activate", action: "active" },
          { name: "Deactivate", action: "inactive" },
          { name: "Move to Group", action: "moveToGroup" },
          { name: "Export", action: "export" }
        );
      }

      if (!this.permissions || this.permissions.destroyItem) {
        this.contextMenus.push({ name: "Delete", action: "deleteRecord" });
      }
    },
    callDynamicMethod(action) {
      const selecteds = this.$store.state.cardholder.checked_cardholders;
      let ids = [];
      if (selecteds && Object.keys(selecteds).length) {
        for (const key in selecteds) {
          if (selecteds[key]) {
            ids.push(key);
          }
        }
      }

      if (action == "export") {
        this.activePrompt = true;

        return false;
      }
      if (ids.length) {
        this.changeStatus(action, ids);
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "No selected cardholders",
        });
      }
    },
    moveToGroupRequest(ids, cardholder_group) {
      this.$store
        .dispatch("cardholder/moveToGroup", {
          ids,
          cardholder_group,
        })
        .then((res) => {
          this.selectGroupPopup = false;
          if (res.data.success) {
            const card_group = this.cardGroups.find(
              (c) => c.id == cardholder_group
            ).label;
            // this.$store.commit("cardholder/CHANGE_GROUP", { ids, card_group });
          }

          const params = {
            page: this.page,
            page_items_count: this.itemsPerPage,
          };

          this.getCardholders(params);
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Cardholder(s) moved to group",
          });
        });
    },
    moveTo() {
      // const selecteds = this.gridApi.getSelectedRows();
      const selecteds = this.$store.state.cardholder.checked_cardholders;
      let ids = [];
      if (selecteds && Object.keys(selecteds).length) {
        for (const key in selecteds) {
          if (selecteds[key]) {
            ids.push(key);
          }
        }
      }

      // let ids = [];
      // if (selecteds.length) {
      //   ids = selecteds.map((s) => s.id);
      // }

      this.moveToGroupRequest(ids, this.groupMoveId);
    },
    moveToGroupItem(tr) {
      this.moveIdItem = tr.id;

      this.selectGroupPopupItem = true;
    },
    moveToItem() {
      this.moveToGroupRequest([this.moveIdItem], this.newMovedItem);

      this.selectGroupPopupItem = false;
    },
    activateItem(item) {
      this.changeStatus("active", [item.id]);
    },
    inActivateItem(item) {
      this.changeStatus("inactive", [item.id]);
    },
    async changeCardHeaders() {
      this.$vs.loading({
        type: "corners",
      });
      this.autoSizeAll();
      setTimeout(() => {
        this.$vs.loading.close();

      }, 200);
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.table_headers.cardholder_header = this.card_table_headers;
      this.card_headers = JSON.parse(JSON.stringify(this.card_table_headers));
      await this.$store.dispatch("setSettings", settings)
      // this.setSettings(settings);
      this.card_colums = false;
    },
    inviteUser() {
      if (
        this.edit_cardholder_info.email &&
        this.edit_cardholder_info.first_name
      ) {
        this.invite_user_popup = true;
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Please fill first name and email",
        });
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
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Invite to cardholder sent",
            });
          }
        });
    },
    getCardholders(params) {
      this.$store
        .dispatch("cardholder/fetchCardholders", params)
        .then(() => {
          const state_checkeds =
            this.$store.state.cardholder.checked_cardholders;
          this.gridApi.forEachLeafNode((node) => {
            if (state_checkeds[node.data.id]) {
              node.setSelected(true);
            }
          });
          const sum = this.cardholders.count % this.itemsPerPage;
          if (!sum) {
            this.totalPage = Math.floor(
              this.cardholders.count / this.itemsPerPage
            );
          } else {
            this.totalPage =
              Math.floor(this.cardholders.count / this.itemsPerPage) + 1;
          }

          this.$vs.loading.close();
          this.autoSizeAll();

        })
        .catch(() => {
          this.$vs.loading.close();
        });
    },
    cardholderSearch() {
      const params = {
        page: this.page,
        page_items_count: this.itemsPerPage,
      };
      if (this.cardsSearchText) {
        params.search = this.cardsSearchText;
      }

      if (this.page !== 1) {
        this.page = 1;
      }

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getCardholders(params);
      }, 300);
    },
    onRowClicked(card) {
      this.editCardholder(card.data);
    },
    onGridReady(params) {
      // this.$vs.loading({
      //   type: "corners",
      // });
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.opacity_table = false;
      // setTimeout(() => {
      //   this.autoSizeAll();
      // }, 400);
    },
    handleWindowResize() {
      this.autoSizeAll();
    },
    autoSizeAll() {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit({
          defaultMinWidth: 150,
          columnLimits: [{ key: "actions", minWidth: 150 }],
        });
        this.opacity_table = true;

        this.$vs.loading.close();
      }, 100);
    },
    delKeys(cloneObj) {
      const obj = JSON.parse(JSON.stringify(cloneObj))

      if ('extra_features' in obj) delete obj['extra_features'];
      if ('time_attendance' in obj) delete obj['time_attendance']
      if ('time_attendance' in obj) delete obj['time_attendance']
      if ('time_attendance_inherited' in obj) delete obj['time_attendance_inherited']
      if ('antipass_backs' in obj) delete obj['antipass_backs']

      return obj
    },
  },
  watch: {
    openCardholder() {
      localStorage.setItem("disable_notifs", this.openCardholder);
      if (!this.openCardholder) {
        this.$store.commit("cardholder/RESET_CARD_INFO");
      }
    },
    openEdit() {
      localStorage.setItem("disable_notifs", this.openEdit);
    },
    card_colums(val) {
      if (!val) {
        this.card_table_headers = JSON.parse(JSON.stringify(this.card_headers));
      }
    },
    itemsPerPage() {
      const params = {
        page: 1,
        page_items_count: this.itemsPerPage,
      };

      if (this.cardsSearchText) {
        params.search = this.cardsSearchText;
      }
      this.getCardholders(params);
    },
    page() {
      const params = {
        page: this.page,
        page_items_count: this.itemsPerPage,
      };

      if (this.cardsSearchText) {
        params.search = this.cardsSearchText;
      }
      this.getCardholders(params);
    },
  },
  computed: {
    cardholders() {
      return this.$store.state.cardholder.cardholders;
    },
    selectedcardholders() {
      let cardholders = this.$store.state.cardholder.cardholders.data;
      return cardholders.length ? cardholders.filter((c) => c.selected) : [];
    },
    cardholder_info() {
      return this.$store.state.cardholder.cardholder_info;
    },
    edit_cardholder_info() {
      return this.$store.state.cardholder.edit_cardholder_info;
    },
    types() {
      return this.$store.state.types;
    },
    editTypes() {
      return this.$store.state.editTypes;
    },
    chipColor() {
      return (value) => {
        if (value == "active") return "rgb(92 184 92)";
        else if (value == "inactive") return "rgb(212 55 55)";
        else if (value == "expired") return "rgb(239 197 48)";
        else if (value == "noCredential") return "rgb(162 157 139)";
      };
    },
    headers() {
      return this.card_headers.filter((h) => h.show);
    },
    isFormValid() {
      return (
        this.cardholder_info.first_name &&
        (this.cardholder_info.access_right ||
          this.cardholder_info.access_right_inherited) &&
        this.cardholder_info.cardholder_group &&
        ((this.cardholder_info.limitations &&
          this.cardholder_info.limitations.enable_date &&
          this.cardholder_info.limitations.valid_due &&
          this.cardholder_info.limitations.valid_from) ||
          // (this.cardholder_info.limitations.pass_counter_enable &&
          //   this.cardholder_info.limitations.pass_counter_passes) ||
          // (this.cardholder_info.limitations.first_use_counter_enable &&
          //   this.cardholder_info.limitations.first_use_counter_days) ||
          // (this.cardholder_info.limitations.last_use_counter_enable &&
          //   this.cardholder_info.limitations.last_use_counter_days) ||
          this.cardholder_info.limitations.limitation_inherited)
      );
    },
    isEditFormValid() {
      return (
        this.edit_cardholder_info.first_name &&
        (this.edit_cardholder_info.access_right ||
          this.edit_cardholder_info.access_right_inherited) &&
        this.edit_cardholder_info.cardholder_group &&
        ((this.edit_cardholder_info.limitations &&
          this.edit_cardholder_info.limitations.enable_date &&
          this.edit_cardholder_info.limitations.valid_due &&
          this.edit_cardholder_info.limitations.valid_from) ||
          // (this.edit_cardholder_info.limitations.pass_counter_enable &&
          //   this.edit_cardholder_info.limitations.pass_counter_passes) ||
          // (this.edit_cardholder_info.limitations.first_use_counter_enable &&
          //   this.edit_cardholder_info.limitations.first_use_counter_days) ||
          // (this.edit_cardholder_info.limitations.last_use_counter_enable &&
          //   this.edit_cardholder_info.limitations.last_use_counter_days) ||
          this.edit_cardholder_info.limitation_inherited)
      );
    },
    right_list() {
      return this.$store.state.right.rights;
    },
    currentPage: {
      get() {
        return 1;
      },
    },
    queriedItems() {
      return this.cardholders.count;
    },
    selecteds() {
      const state_checkeds = this.$store.state.cardholder.checked_cardholders;
      let selectedcardholders = [];
      if (Object.keys(state_checkeds).length) {
        for (const key in state_checkeds) {
          if (state_checkeds[key]) {
            selectedcardholders.push(key);
          }
        }
      }
      return selectedcardholders;
    },
    timerCount() {
      return this.codeTimer;
    },
    settingsStore() {
      return this.$store.state.settings
    }

  },
  async created() {
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

    // await this.$store.dispatch("getSettings")

    this.$root.$on("cardholderRemove", (data) => {
      this.confirmDeleteRecord(data.data);
    });
    this.$root.$on("cardholderEdit", (data) => {
      this.editCardholder(data.data);
    });

    // this.$root.$on("refreshCardTable", () => {
    //     this.autoSizeAll();
    //     this.$vs.loading.close();
    // });

    window.addEventListener("resize", this.handleWindowResize);
    setTimeout(() => {
      this.autoSizeAll();
    }, 100);
    const user = localStorage.user ? JSON.parse(localStorage.user) : null;

    this.headerTitle = this.card_table_headers.map((item) => {
      return item.headerName;
    });

    this.headerVal = this.card_table_headers.map((item) => {
      return item.field;
    });

    // this.getSettings().then((res) => {
    const settings = JSON.parse(JSON.stringify(this.settingsStore)) || null;
    // this.settings = settings;
    if (!settings) {
      await this.$store.dispatch("setSettings", {
        table_headers: {
          cardholder_header: this.card_table_headers,
        },
      })

      // this.setSettings({
      //   table_headers: {
      //     cardholder_header: this.card_table_headers,
      //   },
      // });
      this.card_headers = JSON.parse(JSON.stringify(this.card_table_headers));
    } else {
      if (settings.table_headers) {
        if (settings.table_headers.cardholder_header) {
          this.card_headers = JSON.parse(
            JSON.stringify(settings.table_headers.cardholder_header)
          );
          this.card_table_headers = JSON.parse(
            JSON.stringify(this.card_headers)
          );
        } else {
          const saveSettings = { ...settings };

          saveSettings.table_headers.cardholder_header =
            this.card_table_headers;

          this.card_headers = JSON.parse(
            JSON.stringify(this.card_table_headers)
          );
          await this.$store.dispatch("setSettings", saveSettings)

          // this.setSettings(saveSettings);
        }
      } else {
        const saveSettings = { ...settings };
        saveSettings.table_headers = {
          cardholder_header: this.card_table_headers,
        };

        this.card_headers = JSON.parse(
          JSON.stringify(this.card_table_headers)
        );
        await this.$store.dispatch("setSettings", saveSettings)

        // this.setSettings(saveSettings);
      }
    }
    // });



    this.$store.commit("cardholder/RESET_CARD_INFO");

    this.sockets.subscribe(
      `credential_automat_mode/${user.company}`,
      (payload) => {
        const data = JSON.parse(payload);

        this.$root.$emit("getCredential", data);
      }
    );

    const params = {
      page: this.page,
      page_items_count: this.itemsPerPage,
    };

    this.getCardholders(params);

    this.cardGroups = [];
    this.$store
      .dispatch("cardGroup/fetchCardHolderGroups")
      .then((res) => {
        if (res.data.length) {
          res.data.forEach((group) => {
            this.cardGroups.push({ id: group.id, label: group.name });
          });
        }
      })
      .catch((err) => {
        this.$vs.loading.close();
      });

    this.$store.dispatch("right/fetchRights");
  },
  data() {
    return {
      searchQuery: "",
      gridOptions: {},
      maxPageNumbers: 7,
      gridApi: null,
      gridColumnApi: null,
      defaultColDef: {
        sortable: true,
        resizable: true,
        lockPinned: true,
      },
      columnDefs: [],
      data: [],
      groupMoveId: null,
      card_colums: false,
      itemsPerPage: 10,
      openEdit: false,
      openCardholder: false,
      cardHolderTable: [],
      access: false,
      edit_access: false,
      currentForm: "user",
      updateForms: "edit_user",
      opacity_table: false,
      card_table_headers: [
        {
          headerName: "#",
          field: "count",
          filter: true,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          maxWidth: 170,
          suppressSizeToFit: true,
          pinned: "left",
          lockPinned: true,
          lockPosition: "left",
          cellClass: "locked-col",
          width: 140,
          show: true,
        },
        {
          headerName: "Name",
          field: "name",
          filter: true,
          show: true,
          minWidth: 150,
          // width: 150,
        },
        {
          headerName: "Group",
          field: "group",
          filter: true,
          show: true,
          minWidth: 180,
          // width: 180,
        },
        {
          headerName: "Email",
          field: "email",
          filter: true,
          show: true,
          minWidth: 160,
          // width: 150,
        },
        {
          headerName: "Company",
          field: "company",
          filter: true,
          show: true,
          minWidth: 150,
          // width: 150,
          // maxWidth: 190,
        },

        {
          headerName: "Access Right",
          field: "access_right",
          filter: true,
          show: true,
          minWidth: 200,
          // maxWidth: 190,
          // width: 200,
        },
        {
          headerName: "Status",
          field: "status",
          filter: true,
          show: true,
          cellRendererFramework: "CellRendererStatus",
          minWidth: 150,
          // width: 150,
          // maxWidth: 190,
        },
        {
          headerName: "Phone",
          field: "phone",
          filter: true,
          show: true,
          minWidth: 160,
          // maxWidth: 180,
          // width: 150,
        },
        {
          headerName: "Anti-passback",
          field: "antipass_back",
          filter: true,
          cellRendererFramework: "CellRendererAntiPass",
          show: true,
          minWidth: 190,
          // width: 190,
        },
        {
          headerName: "Actions",
          field: "actions",
          show: true,
          filter: false,
          cellRendererFramework: "CellRendererActions",
          // pinned: "right",
          // lockPinned: true,
          // lockPosition: "right",
          cellClass: "locked-col",
          maxWidth: 120,
          width: 120,
          // minWidth: 120,
          // suppressSizeToFit: true,
        },
      ],
      components: {
        CellRendererActions,
        CellRendererAntiPass,
        CellRendererStatus,
      },

      card_headers: [],
      features:
        localStorage.features && JSON.parse(localStorage.features).Cardholder
          ? JSON.parse(localStorage.features).Cardholder
          : null,
      permissions:
        localStorage.permissions &&
          JSON.parse(localStorage.permissions).Cardholder
          ? JSON.parse(localStorage.permissions).Cardholder.actions
          : null,
      contextMenus: [],
      selectGroupPopup: false,
      cardGroups: [],
      moveIdItem: null,
      selectGroupPopupItem: false,
      newMovedItem: null,
      fileName: "",
      formats: ["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      headerTitle: [],
      headerVal: [],
      activePrompt: false,
      settings: null,
      invite_user_popup: false,
      itemsPerPage: 10,
      page: 1,
      totalPage: 1,
      cardsSearchText: null,
      timer: null,
      canSeeRight: false,
      progress: 0,
      progresspopup: false,
      downloadTimer: null,
      showCodeBlock: false,
      codeTimer: 10,
    };
  },
  components: {
    user,
    car_infos,
    limitations,
    group,
    time_attendance,
    extra_features,
    access_right,
    antipass_backs,
    edit_user,
    edit_car_info,
    edit_car_info,
    edit_limitation,
    edit_antipass_back,
    edit_credentials,
    edit_extra_features,
    edit_access_right,
    edit_time_attendance,
    edit_group,
    credentials,
    MultiTable,
    vSelect,
    guest_keys,
    edit_guest_keys,
    AgGridVue,
    CellRendererActions,
    CellRendererStatus,
    CellRendererAntiPass,
  },
};
</script>

<style lang="scss">
@import "./cardholder.scss";
</style>
