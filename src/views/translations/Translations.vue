<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container translations_page">
    <vs-popup
      class="holamundo"
      title="Create Translation"
      :active.sync="popupActive"
    >
      <div>
        <vs-input
          label="Term"
          class="w-full"
          name="Term"
          v-model="trans.term"
          v-validate="'required'"
        />
      </div>
      <div class="p-1" v-for="language in languages" :key="language.id">
        <vs-input
          :label="language.title"
          v-model="trans.translations[language.iso]"
          class="mt-5 w-full"
          :name="`${language.title}`"
          v-validate="'required'"
        />
      </div>

      <vs-button class="mr-6 mt-4" @click="createTrans" :disabled="!isFormValid"
        >Create Translation</vs-button
      >
      <vs-button
        type="border"
        color="#b49b13"
        @click="
          popupActive = false;
          initValues();
        "
        >Cancel</vs-button
      >
    </vs-popup>

    <vs-popup
      v-if="editTrans.translations"
      class="holamundo"
      title="Update Translation"
      :active.sync="edits"
    >
      <div>
        <vs-input
          label="Term"
          class="w-full"
          name="Term"
          v-model="editTrans.term"
          v-validate="'required'"
        />
      </div>
      <div class="p-1">
        <vs-input
          label="English"
          v-model="editTrans.translations['en']"
          class="mt-5 w-full"
          :name="`English`"
          v-validate="'required'"
        />
      </div>

      <vs-button
        class="mr-6 mt-4"
        @click="updateTrans"
        :disabled="!isFormValidEdit"
        >Update Translation</vs-button
      >
      <vs-button type="border" color="#b49b13" @click="edits = false"
        >Cancel</vs-button
      >
    </vs-popup>

    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center float-right">
        <div class="flex-grow"></div>
        <div
          class="custom btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary hover_class"
          @click="popupActive = true"
          v-if="permissions.addItem"
        >
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-primary addNeww">Add New</span>
        </div>
      </div>

      <MultiTable
        :items="translations"
        :headers="translation_headers"
        :permissions="permissions"
        :confirmDeleteMany="confirmDeleteMany"
        @input="selectedTranses = $event"
        :actions="true"
        @updateItem="edit($event)"
        @deleteRecord="confirmDeleteRecord($event)"
      />
    </div>
  </div>
</template>

<script>
import moduleTrans from "@/store/translate/moduleTrans.js";
import MultiTable from "../../components/custom/table/MultipleTable";
import { pagePermissions } from "@/functions/pagePermissions";
export default {
  components: {},
  data() {
    return {
      itemsPerPage: 10,
      languages: this.$store.state.languages,
      edits: false,
      trans: {
        term: "",
        translations: {},
      },
      // permissions: this.$store.state.permissions,
      editTrans: {
        term: "",
        translations: {
          en: "",
        },
      },
      saveTrans: {},
      lng: "en",
      translations: [],
      popupActive: false,
      searchQuery: "",
      deletedId: null,

      sidebarData: {},

      deletedArray: [],
      selectedTranses: [],
      translation_headers: [
        { name: "#", key: "id" },
        { name: "Term", key: "term" },
        { name: "Translations", key: "translation" },
      ],
    };
  },
  components: {
    MultiTable,
  },
  computed: {
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
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
        : this.translations.length;
    },
    isFormValid() {
      return this.trans.term;
    },
    isFormValidEdit() {
      return this.editTrans.term;
    },
  },
  methods: {
    setSelecteds(array) {
      this.selectedTranses = array;
    },

    checkProperties(obj) {
      for (var key in obj) {
        if (obj[key] !== null && obj[key] != "") return false;
      }
      return true;
    },
    updateTrans() {
      if (this.checkProperties(this.editTrans.translations)) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: "Please fill translation",
        });
      } else {
        this.$vs.loading({
          type: "corners",
        });
        const send = {
          term: this.editTrans.term,
          translations: JSON.stringify(this.editTrans.translations),
        };
        this.$http
          .put(
            `translations`,
            {
              ...send,
            },
            { headers: { Authorization: localStorage.token } }
          )
          .then((res) => {
            const productIndex = this.translations.findIndex(
              (p) => p.id == res.data.id
            );

            let trans = {
              id: res.data.id,
              term: res.data.term,
              translations: JSON.parse(res.data.translations),
              translation: JSON.parse(res.data.translations)[this.lng],
            };

            Object.assign(this.translations[productIndex], trans);
            this.$vs.loading.close();
            this.edits = false;
          })
          .catch((error) => {
            this.$vs.loading.close();

            this.edits = false;
          });
      }
    },
    createTrans() {
      if (this.checkProperties(this.trans.translations)) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: "Please fill translation",
        });
      } else {
        this.$vs.loading({
          type: "corners",
        });

        let trans = {
          term: this.trans.term,
          translations: JSON.stringify(this.trans.translations),
        };
        this.$http
          .post(
            `translations`,
            {
              ...trans,
            },
            { headers: { Authorization: localStorage.token } }
          )
          .then((res) => {
            this.translations.push({
              id: res.data.id,
              term: res.data.term,
              translations: JSON.parse(res.data.translations),

              translation: JSON.parse(res.data.translations)[this.lng],
            });

            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Translation successfully created",
            });

            setTimeout(() => {
              this.$vs.loading.close();
              this.activeLoading = false;
              this.popupActive = false;
            }, 100);
            this.initValues();
          })
          .catch((err) => {
            this.$vs.loading.close();

            this.activeLoading = false;
            this.popupActive = false;
          });
      }
    },
    edit(data) {
      this.edits = true;
      const editedItem = this.translations.find((u) => u.id == data.id);
      this.editTrans.term = editedItem.term;
      this.editTrans.translations.en = editedItem.translations.en;

      this.saveTrans = editedItem;
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
    cleanValues() {},
    changeLanguage(lng) {
      this.$vs.loading({
        type: "corners",
      });
      this.lng = lng;
      this.translations = [];

      this.$http
        .get(`translations`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          res.data.forEach((term) => {
            this.translations.push({
              id: term.id,
              term: term.term,
              translations: term.translations
                ? JSON.parse(term.translations)
                : " ",
              trans: term.translations
                ? JSON.parse(term.translations)[this.lng]
                : " ",
            });
          });

          setTimeout(() => {
            this.$vs.loading.close();
            this.activeLoading = false;
          }, 100);
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.term} translations`,
        accept: this.deleteTranslations,
        acceptText: "Delete",
      });
    },
    confirmDeleteMany() {
      this.deletedArray = [];
      let namesArr = [];

      if (this.selectedTranses.length) {
        this.selectedTranses.forEach((slider) => {
          this.deletedArray.push(slider.id);
          namesArr.push(slider.term);
        });
      } else if (!this.selectedTranses.length) {
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
        text: `Do You want to delete ${namesArr} translations`,
        accept: this.deleteTransMany,
        acceptText: "Delete",
      });
    },
    deleteTransMany() {
      this.$vs.loading({
        type: "corners",
      });

      this.deletedArray.forEach((trans) => {
        this.$store
          .dispatch("trans/deleteTrans", trans)
          .then((res) => {
            this.$vs.loading.close();
            this.activeLoading = false;

            const index = this.translations.findIndex((u) => u.id == trans);
            this.translations.splice(index, 1);
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      });

      this.$vs.notify({
time: 7000,
        color: "success",
        title: "Translation deleted",
      });

      this.deletedArray = [];
    },
    deleteTranslations() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("trans/deleteTrans", this.deletedId)
        .then((res) => {
          this.$vs.loading.close();
          this.activeLoading = false;

          // this.deleteTrans(this.deletedId);
          const index = this.translations.findIndex(
            (u) => u.id == this.deletedId
          );
          this.translations.splice(index, 1);

          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Translation deleted",
          });
          this.initValues();

          this.deletedId = null;
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },

    updateSearchQuery(val) {
      this.gridApi.setQuickFilter(val);
    },
    initValues() {
      this.trans = {
        term: "",
        translations: {
          en: "",
        },
      };
    },
  },
  created() {
    const allowEnter = pagePermissions(this.permissions);

    if (allowEnter != true) {
      this.$vs.notify({
time: 7000,
        color: "danger",
        title: `You haven't access to enter to ${this.$route.name}`,
      });
      setTimeout(() => {
        this.$router.push(allowEnter).catch(() => {});
      }, 100);
      return false;
    }

    this.$vs.loading({
      type: "corners",
    });

    if (!moduleTrans.isRegistered) {
      this.$store.registerModule("trans", moduleTrans);
      moduleTrans.isRegistered = true;
    }

    this.$http
      .get(`translations`, {
        headers: { Authorization: localStorage.token },
      })
      .then((res) => {
        res.data.forEach((term) => {
          this.translations.push({
            id: term.id,
            term: term.term,
            translation: term.translations
              ? JSON.parse(term.translations)[this.lng]
              : "",
            translations: term.translations
              ? JSON.parse(term.translations)
              : null,
          });
        });

        this.$vs.loading.close();
        this.activeLoading = false;
      })
      .catch((err) => {
        this.$vs.loading.close();

        this.activeLoading = false;
      });
  },
};
</script>

<style lang="scss">
.translations_page {
  .td-check {
    width: 6px !important;
  }
  // .hover_class {
  //   -webkit-transition: all 0.3s ease;
  //   transition: all 0.3s ease;

  //   &:hover {
  //     opacity: 0.5;
  //   }
  // }
  .vs-con-tbody {
    background: none;
    border: none;
  }
  .tr-table-state-null {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  }
  .vs-table--tbody-table {
    border-collapse: separate;
    padding: 0 1rem;
    border-spacing: 0 1.3rem;
  }
  .tr-values td {
    padding: 20px !important;
  }
  .vs-table--header {
    justify-content: unset !important;
  }
  .vs-table--search {
    padding: 0 !important;
    margin-bottom: 8px;
    input {
      border-radius: 5px !important;
      height: 35px;
    }
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
