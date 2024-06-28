<!-- =========================================================================================
  File Name: Department.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container translations_page">
    <vs-popup class="holamundo" title="Create Package Type" :active.sync="popupActive">
      <div>
        <vs-input label="Name" class="w-full" name="name" v-model="depart.name" v-validate="'required'" />

      </div>
      <div class="mt-3">
        <vs-input label="Description" class="w-full" name="description" v-model="depart.description"
          v-validate="'required'" />

      </div>
      <div class="vx-row mt-3">
        <div class="vx-col w-2/3">
          <label for="" class="vs-input--label ">Status</label>

          <v-select v-model="depart.status" :options="statusOptions" class="select_padding" name="status"
            placeholder="Status" :reduce="(status) => status.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

        </div>
        <div class="vx-col w-1/3 mt-3">
          <vs-checkbox class="mt-5 custom__checkbox" v-model="depart.service">Service</vs-checkbox>
        </div>

        <div class="vx-col w-1/3 mt-3">
          <vs-checkbox class="mt-5 custom__checkbox" v-model="depart.default">Default</vs-checkbox>
        </div>
      </div>
      <div class="vx-row w-full" style="margin: 0">
        <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse; margin: 0;padding: 0;">
          <vs-button class=" mt-4 unimacs_button padding: 0" @click="createType" :disabled="!isFormValid">Submit
          </vs-button>
        </div>
      </div>

      <!-- <vs-button class="unimacs_button" @click="popupActive = false"
        >Cancel</vs-button
      > -->
    </vs-popup>

    <vs-popup class="holamundo" title="Update Package Type" :active.sync="edits">
      <div>
        <vs-input label="Name" class="w-full" name="name" v-model="editDepart.name" v-validate="'required'" />
      </div>
      <div class="mt-3">
        <vs-input label="Description" class="w-full" name="description" v-model="editDepart.description"
          v-validate="'required'" />
      </div>
      <div class="vx-row mt-3">
        <div class="vx-col w-full">
          <label for="" class="vs-input--label ">Status</label>

          <v-select v-model="editDepart.status" :options="statusOptions" class="select_padding" name="status"
            placeholder="Status" :reduce="(status) => status.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
          <span class="text-danger text-sm" v-show="errors.has('status')">{{
          errors.first("status")
          }}</span>
        </div>
        <div class="vx-col w-1/3 mt-3">
          <vs-checkbox class="mt-5 custom__checkbox" :disabled="editDepart.default" v-model="default_value">Default
          </vs-checkbox>
        </div>

      </div>
      <div class="vx-row w-full" style="margin: 0">
        <div class="vx-col w-full" style="padding: 0; display: flex; flex-direction: row-reverse">
          <vs-button class="mt-4 unimacs_button" @click="updateTrans" :disabled="!isFormValidEdit">Submit</vs-button>
        </div>
      </div>

      <!-- <vs-button class="unimacs_button" @click="edits = false"
        >Cancel</vs-button
      > -->
    </vs-popup>

    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center float-right">
        <div class="flex-grow"></div>
        <div style="margin-top: 7px" class="
            custom
            btn-add-new
            p-3
            mb-3
            mr-4
            rounded-lg
            cursor-pointer
            flex
            items-center
            justify-center
            text-lg
            font-medium
            text-base text-primary
            border border-solid border-primary
            
          " @click="popupActive = true" v-if="permissions.addItem">
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-primary addNeww">Add New</span>
        </div>
      </div>

      <vs-table  
noDataText="No data available" class="bs_table" ref="table" :pagination="types.length > itemsPerPage ? true : false"
        :max-items="itemsPerPage" search :data="types">
        <div slot="header" class="flex flex-wrap-reverse items-center">
          <div class="flex flex-wrap-reverse items-center"></div>

          <vs-dropdown vs-trigger-click class="cursor-pointer  mb-3">
            <div class="
                p-4
                border border-solid
                d-theme-border-grey-light
                rounded-full
                d-theme-dark-bg
                cursor-pointer
                flex
                items-center
                justify-between
                font-medium
              ">
              <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                {{
                types.length - currentPage * itemsPerPage > 0
                ? currentPage * itemsPerPage
                : types.length
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
          </vs-dropdown>
          <vs-dropdown vs-trigger-click class="cursor-pointer ml-4 mb-3">
            <div class="
                p-3
                shadow-drop
                rounded-lg
                d-theme-dark-light-bg
                cursor-pointer
                flex
                items-end
                justify-center
                text-lg
                font-medium
                w-32
              ">
              <span class="mr-2 leading-none">Actions</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>

            <vs-dropdown-menu>
              <vs-dropdown-item @click="confirmDeleteMany">
                <span class="flex items-center">
                  <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Delete</span>
                </span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <template slot="thead">
          <vs-th>
            <vs-checkbox v-model="selectAllCheckBox" icon-pack="feather" :icon="selectAllIcon" style="margin: auto">
            </vs-checkbox>
          </vs-th>
          <vs-th sort-key="count">#</vs-th>
          <vs-th sort-key="name">Name</vs-th>
          <vs-th sort-key="description">Description</vs-th>
          <vs-th sort-key="service">Service</vs-th>

          <vs-th sort-key="status">Status</vs-th>
          <vs-th>Action</vs-th>
        </template>

        <template slot-scope="{ data }">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <vs-checkbox @change="checkPacket($event.target.checked, tr)" :value="tr.selected"></vs-checkbox>
              </vs-td>
              <vs-td>
                <div @click="edit(tr)">
                  <p class="product-name font-medium truncate">
                    {{ tr.count }}
                  </p>
                </div>
              </vs-td>

              <vs-td>
                <div @click="edit(tr)">
                  <p class="product-name font-medium truncate">{{ tr.name }}</p>
                </div>
              </vs-td>

              <vs-td>
                <div @click="edit(tr)">
                  <p class="product-name font-medium truncate">
                    {{ tr.description }}
                  </p>
                </div>
              </vs-td>

              <vs-td>
                <vs-chip class="ag-grid-cell-chip" :color="chipColor(tr.service)">
                  <div @click="edit(tr)">
                    <span class="colorss">{{
                    tr.service ? "Active" : "Inactive"
                    }}</span>
                  </div>
                </vs-chip>
              </vs-td>

              <vs-td>
                <vs-chip class="ag-grid-cell-chip" :color="chipColor(tr.status)">
                  <div @click="edit(tr)">
                    <span class="colorss">{{
                    tr.status ? "Active" : "Inactive"
                    }}</span>
                  </div>
                </vs-chip>
              </vs-td>

              <vs-td class="whitespace-no-wrap">
                <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                  @click.stop="edit(tr)" v-if="permissions.updateItem" />
                <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2"
                  @click.stop="confirmDeleteRecord(tr)" v-if="permissions.destroyItem" />
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </div>
  </div>
</template>

<script>
import modulePacketType from "@/store/packet-type/modulePacketType.js";
import vSelect from "vue-select";

export default {
  components: { vSelect },
  data() {
    return {
      itemsPerPage: 10,
      edits: false,
      depart: {
        name: "",
        status: false,
        description: null,
        service: false,
      },
      editDepart: {
        id: null,
        name: "",
        status: false,
        description: "",
      },
      lng: "en",
      popupActive: false,
      deletedId: null,
      deletedArray: [],
      // selectedTypes: [],
      statusOptions: [
        { label: "Active", id: true },
        { label: "Inactive", id: false },
      ],
      default_value: false
    };
  },
  computed: {
    permissions() {
      return localStorage.permissions &&
        JSON.parse(localStorage.permissions)[this.$route.name]
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },
    types() {
      return this.$store.state.type.packetTypes;
    },
    currentPage: {
      get() {
        return 1;
      },
      set(val) {
        this.gridApi.paginationGoToPage(val - 1);
      },
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.types.length;
    },
    chipColor() {
      return (value) => {
        if (value == true) return "success";
        else if (value == false) return "danger";
      };
    },
    isFormValid() {
      return this.depart.name && this.depart.description;
    },
    isFormValidEdit() {
      return this.editDepart.name && this.editDepart.description;
    },
    selectedTypes() {
      return this.types.filter((p) => p.selected);
    },
    selectAllIcon() {
      return this.selectedTypes.length === this.types.length
        ? "icon-check"
        : "icon-minus";
    },
    selectAllCheckBox: {
      get() {
        return this.selectedTypes.length;
      },
      set(value) {
        this.$store.commit("type/SET_ALL", { event: value });
      },
    },
  },
  methods: {
    checkPacket(event, item) {
      this.$store.commit("type/CHECK_ITEM", { event, item });
    },
    updateTrans() {
      this.$vs.loading({
        type: "corners",
      });
      this.editDepart.default = this.default_value
      this.$store
        .dispatch("type/updateType", this.editDepart)
        .then((res) => {
          this.$vs.loading.close();
          this.edits = false;

          this.$store
            .dispatch("type/fetchTypes")
            .then((res) => {
              this.$vs.loading.close();
            })
            .catch((err) => {
              this.$vs.loading.close();
            });
        })
        .catch((error) => {
          this.$vs.loading.close();

          this.edits = false;
        });
    },
    createType() {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("type/createType", this.depart)
        .then((res) => {
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Type created",
          });
          this.popupActive = false;
          this.initValues();

          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },
    edit(data) {

      this.editDepart = {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        service: data.service,
        default: data.default
      };
      if (data.default) {
        this.default_value = data.default
      } else {
        this.default_value = false

      }
      this.edits = true;
    },
    deleteTrans(id) {
      if (typeof id == "number") {
        const userIndex = this.translations.findIndex((u) => u.id == id);
        this.translations.splice(userIndex, 1);
      } else if (typeof id == "object") {
        id.forEach((ids) => {
          let userIndex = this.translations.findIndex((u) => u.id == ids);
          this.translations.splice(userIndex, 1);
        });
      }

      this.$vs.notify({
time: 7000,
        color: "success",
        title: "Type Deleted",
      });
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.name} packet type`,
        accept: this.deleteDepartment,
        acceptText: "Delete",
      });
    },
    confirmDeleteMany() {
      this.deletedArray = [];
      let namesArr = [];

      if (this.selectedTypes.length) {
        this.selectedTypes.forEach((department) => {
          this.deletedArray.push(department.id);
          namesArr.push(department.name);
        });
      } else if (!this.selectedTypes.length) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: "No seleced types",
        });

        return false;
      }

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${namesArr} types`,
        accept: this.deleteTransMany,
        acceptText: "Delete",
      });
    },
    deleteTransMany() {
      this.$vs.loading({
        type: "corners",
      });

      this.deletedArray.forEach((id) => {
        this.$store
          .dispatch("type/deleteDepartment", id)
          .then((res) => {
            this.$vs.loading.close();
            this.activeLoading = false;
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Type deleted",
            });
          })
          .catch((err) => {
            this.$vs.loading.close();

            this.activeLoading = false;
          });
      });

      this.deletedArray = [];
    },
    deleteDepartment() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("type/deleteDepartment", this.deletedId)
        .then((res) => {
          this.$vs.loading.close();
          this.activeLoading = false;

          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Type deleted",
          });

          this.deletedId = null;
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },
    initValues() {
      this.depart = {
        name: "",
        status: false,
      };
      this.errors.items = [];
    },
  },
  created() {
    this.$store.dispatch("pagePermissions", this.permissions).then((res) => {
      if (res != true) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: `You haven't access to enter to ${this.$route.name}`,
        });
        setTimeout(() => {
          // this.$router.push(res).catch(() => {});
          this.$router.push('/error-404').catch(() => { });

        }, 100);

        return false;
      }
    });
    this.$vs.loading({
      type: "corners",
    });

    if (!modulePacketType.isRegistered) {
      this.$store.registerModule("type", modulePacketType);
      modulePacketType.isRegistered = true;
    }

    this.$store
      .dispatch("type/fetchTypes")
      .then((res) => {
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });
  },
  watch: {
    popupActive(val) {
      if (val) {
        this.depart = {
          name: "",
          status: false,
          description: null,
          service: false,
        }
      }
    }
  }
};
</script>

<style lang="scss">
.translations_page {
  .td-check {
    width: 6px !important;
  }

  .hover_class {
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.5;
    }
  }

  // .vs-con-tbody {
  //   background: none;
  //   border: none;
  // }
  // .tr-table-state-null {
  //   box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  // }
  // .vs-table--tbody-table {
  //   border-collapse: separate;
  //   padding: 0 1rem;
  //   border-spacing: 0 1.3rem;
  // }
  // .tr-values td {
  //   padding: 20px !important;
  // }
  // .vs-table--header {
  //   justify-content: unset !important;
  // }
  .vs-table--search {
    padding: 0 !important;
    margin-bottom: 8px;
    // input {
    //   border-radius: 5px !important;
    //   height: 35px;
    // }
  }
}

#data-list-list-view {
  .vs-con-table {

    /*
        Below media-queries is fix for responsiveness of action buttons
        Note: If you change action buttons or layout of this page, Please remove below style
      */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }
  }
}

.ag-root-wrapper.ag-layout-normal.ag-ltr {
  border-top: 1px solid #e2e2e2;
}

.ag-grid-cell-chip.vs-chip-success {
  background: #28c76f;
}

.ag-grid-cell-chip.vs-chip-danger {
  background: #ea5455;
}

#data-list-list-view .ag-header-container .ag-header-row:last-child {
  display: none;
}

.ag-header.ag-pivot-off {
  height: 60px !important;
  min-height: 61px !important;
}

.data-list-container .custom {
  margin-bottom: 0px !important;
  margin-left: 15px;
  height: 36px;
}
</style>
