<!-- =========================================================================================
  File Name: Department.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container department_page">
    <vs-popup
      class="holamundo"
      title="Create Department"
      :active.sync="popupActive"
    >
      <div>
        <vs-input
          label="Department"
          class="w-full"
          name="department"
          v-model="depart.name"
          v-validate="'required'"
        />
        <span class="text-danger text-sm" v-show="errors.has('department')">{{
          errors.first("department")
        }}</span>
      </div>
      <div class="mt-3">
        <label for="" class="vs-input--label">Status</label>
        <v-select
          v-model="depart.status"
          :options="statusOptions"
          class="select_padding"
          name="status"
          placeholder="Status"
          :reduce="(status) => status.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
        <span class="text-danger text-sm" v-show="errors.has('status')">{{
          errors.first("status")
        }}</span>
      </div>
      <div class="vx-row w-full" style="margin: 0">
        <div
          class="vx-col w-full"
          style="padding: 0; display: flex; flex-direction: row-reverse"
        >
          <vs-button
            class="mt-4 unimacs_button"
            @click="createDepart"
            :disabled="!isFormValid"
            >Submit</vs-button
          >
        </div>
      </div>

      <!-- <vs-button class="unimacs_button" @click="popupActive = false"
        >Cancel</vs-button
      > -->
    </vs-popup>

    <vs-popup class="holamundo" title="Update Department" :active.sync="edits">
      <div>
        <vs-input
          label="Name"
          class="w-full"
          name="name"
          v-model="editDepart.name"
          v-validate="'required'"
        />
      </div>
      <div class="mt-3">
        <label for="" class="vs-input--label">Status</label>

        <v-select
          v-model="editDepart.status"
          :options="statusOptions"
          class="select_padding"
          name="status"
          placeholder="Status"
          :reduce="(status) => status.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
      <div class="vx-row w-full" style="margin: 0">
        <div
          class="vx-col w-full"
          style="padding: 0; display: flex; flex-direction: row-reverse"
        >
          <vs-button
            class="mt-4 unimacs_button"
            @click="updateTrans"
            :disabled="!isFormValidEdit"
            >Submit</vs-button
          >
        </div>
      </div>

      <!-- <vs-button class="unimacs_button" @click="edits = false"
        >Cancel</vs-button
      > -->
    </vs-popup>

    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center float-right">
        <div class="flex-grow"></div>
        <!-- <vs-button
          class="create_new"
          @click="popupActive = true"
          v-if="permissions.addItem"
        >
          <vs-icon icon-pack="material-icons" color="white" icon="add_circle" />
        </vs-button> -->

        <div
          class="unimacs_add_button mr-1 create_new"
          @click="popupActive = true"
          style="height: 38px"
          v-if="permissions.addItem"
        >
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />

          <span class="ml-2 text-base text-primary addNeww">Add New</span>
        </div>
      </div>
      <MultiTable
        :items="departments"
        :headers="department_headers"
        :permissions="permissions"
        :confirmDeleteMany="confirmDeleteMany"
        @updateItem="edit($event)"
        @input="checkItem($event)"
        @setAll="setAllChecked($event)"
        :actions="true"
        @deleteRecord="confirmDeleteRecord($event)"
      />
      <!-- @input="selectedDepartments = $event" -->
    </div>
  </div>
</template>

<script>
import moduleDepartment from "../../store/department/moduleDepartment.js";
import vSelect from "vue-select";
import MultiTable from "../../components/custom/table/MultipleTable";

export default {
  components: { vSelect, MultiTable },
  data() {
    return {
      itemsPerPage: 5,
      edits: false,
      depart: {
        name: "",
        status: false,
      },
      editDepart: {
        id: null,
        name: "",
        status: false,
      },
      popupActive: false,
      gridOptions: {},
      deletedId: null,
      sidebarData: {},
      deletedArray: [],
      // selectedDepartments: [],
      statusOptions: [
        { label: "Active", id: true },
        { label: "Inactive", id: false },
      ],
      department_headers: [
        { name: "#", key: "count" },
        { name: "Name", key: "name" },
        { name: "Status", key: "status" },
      ],
    };
  },
  watch: {
    popupActive(val) {
      this.initValues();
    },
  },
  computed: {
    selectedDepartments() {
      let department = this.$store.state.department.departments;
      return department.length ? department.filter((c) => c.selected) : [];
    },
    permissions() {
      return localStorage.permissions &&
        JSON.parse(localStorage.permissions)[this.$route.name]
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },
    departments() {
      return this.$store.state.department.departments;
    },
    currentPage: {
      get() {
        if (this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1;
        else return 1;
      },
      set(val) {
        this.gridApi.paginationGoToPage(val - 1);
      },
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.departments.length;
    },
    chipColor() {
      return (value) => {
        if (value == true) return "success";
        else if (value == false) return "danger";
      };
    },
    isFormValid() {
      return this.depart.name;
    },
    isFormValidEdit() {
      return this.editDepart.name;
    },
  },
  methods: {
    checkItem({ event, item }) {
      this.$store.commit("department/CHECK_ITEM", { event, item });
    },
    setAllChecked(value) {
      this.$store.commit("department/SET_ALL_CHECKED", { event: value });
    },
    updateTrans() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("department/updateDepartment", this.editDepart)
        .then((res) => {
          this.$vs.loading.close();

          this.edits = false;
        })
        .catch((error) => {
          this.$vs.loading.close();

          this.edits = false;
        });
    },
    createDepart() {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("department/createDepartment", this.depart)
        .then((res) => {
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Department created",
          });
          this.popupActive = false;
          this.initValues();
          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();
          this.popupActive = false;
        });
    },
    edit(data) {
      this.editDepart = {
        id: data.id,
        name: data.name,
        status: data.status,
      };
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
        title: "Translations Deleted",
      });
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.name} department`,
        accept: this.deleteDepartment,
        acceptText: "Delete",
      });
    },
    confirmDeleteMany() {
      this.deletedArray = [];
      let namesArr = [];

      if (this.selectedDepartments.length) {
        this.selectedDepartments.forEach((department) => {
          this.deletedArray.push(department.id);
          namesArr.push(department.name);
        });
      } else if (!this.selectedDepartments.length) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: "No seleced translations",
        });

        return false;
      }

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${namesArr} departments`,
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
          .dispatch("department/deleteDepartment", id)
          .then((res) => {
            this.$vs.loading.close();
            this.activeLoading = false;
          })
          .catch((err) => {
            this.$vs.loading.close();

            this.activeLoading = false;
          });
      });

      this.deletedArray = [];

      this.$vs.notify({
time: 7000,
        color: "success",
        title: "Deparment(s) deleted",
      });

      this.deletedArray = [];
    },
    deleteDepartment() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("department/deleteDepartment", this.deletedId)
        .then((res) => {
          this.$vs.loading.close();
          this.activeLoading = false;

          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Department deleted",
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

      this.$validator.reset();
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
          this.$router.push('/error-404').catch(() => {});

        }, 100);

        return false;
      }
    });
    this.$vs.loading({
      type: "corners",
    });

    if (!moduleDepartment.isRegistered) {
      this.$store.registerModule("department", moduleDepartment);
      moduleDepartment.isRegistered = true;
    }

    this.$store
      .dispatch("department/fetchDepartments")
      .then((res) => {
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });
  },
};
</script>

<style lang="scss">
.department_page {
  .con-input-search.vs-table--search {
    margin-right: 20px;
  }
  .actions_part {
    margin-left: 15px;
    .hover_class {
      top: unset;
    }
  }
  .create_new {
    position: relative;
    top: 10px;
  }
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
}

.data-list-container .custom {
  margin-bottom: 0px !important;
  margin-left: 15px;
  height: 36px;
}
</style>
