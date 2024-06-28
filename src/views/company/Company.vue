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
    <vs-popup class="holamundo" title="Send Invite" :active.sync="sendPopup">
      <div>
        <vs-input class="w-full mt-4" label="Email" v-model="email" type="email" v-validate="'email'" name="email" />
        <span class="text-danger text-sm" v-show="errors.has('email')">{{
          errors.first("email")
        }}</span>
      </div>
      <div class="vx-roww-full">
        <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse">
          <vs-button class="mt-4 unimacs_button" @click="sendEmail" :disabled="!this.email">Send invite</vs-button>
        </div>
      </div>
      <!-- <vs-button class="unimacs_button" @click="sendPopup = false"
        >Cancel</vs-button
      > -->
    </vs-popup>
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
      <vs-popup class="holamundo" title="Choose Access Points headers" :active.sync="rowsPopup">
        <vs-checkbox v-for="(header, index) in company_headers" :key="index" class="mb-4 mt-5 custom__checkbox"
          v-model="header.show">{{ header.name }}</vs-checkbox>

        <div class="screen_false">
          <vs-button class="mt-4 unimacs_button" @click="changeHeaders">Submit</vs-button>

          <vs-button class="mr-6 mt-4 unimacs_cancel_button" @click="rowsPopup = false">Cancel</vs-button>
        </div>
      </vs-popup>
      <vs-popup v-if="companyData" class="holamundo popCompany company_tablist" title="Detail information"
        :active.sync="popupActive">
        <vs-tabs class="company_tabs">
          <vs-tab label="Main info">
            <div class="vx-row">
              <div class="vx-col md:w-1/4 w-full comp_avatar_block">
                <div class="company_image account">
                  <img :src="accountImage" class="" />
                </div>
              </div>

              <div class="vx-col md:w-3/4 w-full list_block">
                <div class="vx-card">
                  <div class="info">
                    <div>
                      <span class="field">Company: </span>
                      <span class="value">{{ company_list.company }}</span>
                    </div>
                    <div>
                      <span class="field">Contact Person: </span>
                      <span class="value">{{
                        company_list.contact_person
                      }}</span>
                    </div>
                    <div>
                      <span class="field">Package Name: </span>
                      <span class="value">{{ company_list.package }}</span>
                    </div>
                    <div>
                      <span class="field">Email: </span>
                      <span class="value">{{ company_list.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="vx-row">
              <div class="vx-col w-full account_select mt-3">
                <label for="" class="vs-input--label mt-4">Status</label>

                <v-select v-model="companyData.status" :options="statusOptions" class="select_padding" name="status"
                  placeholder="Status" :reduce="(status) => status.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
              </div>
              <div class="vx-col w-full mt-2">
                <vs-textarea label="Message" v-model="companyData.message" class="mt-3" />
              </div>
            </div>
            <div class="detail_actions">
              <vs-button class="unimacs_button" @click="updateInfo">Submit</vs-button>
              <vs-button class="unimacs_cancel_button mr-3 ml-4" @click="popupActive = false">Cancel</vs-button>
            </div>
          </vs-tab>
          <vs-tab label="Contact info">
            <div class="vx-row list_block">
              <div class="vx-col w-full">
                <div class="vx-card">
                  <div class="info">
                    <div>
                      <span class="field">Phone Number: </span>
                      <span class="value">{{ contact_list.phone_1 }}</span>
                    </div>
                    <div>
                      <span class="field">Country: </span>
                      <span class="value">{{ contact_list.country }}</span>
                    </div>
                    <div>
                      <span class="field">Site: </span>
                      <span class="value">{{ contact_list.site }}</span>
                    </div>
                    <div>
                      <span class="field">Address: </span>
                      <span class="value">{{ contact_list.address }}</span>
                    </div>
                    <div>
                      <span class="field">Viber: </span>
                      <span class="value">{{ contact_list.viber }}</span>
                    </div>
                    <div>
                      <span class="field">WhatsApp: </span>
                      <span class="value">{{ contact_list.whatsapp }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vs-tab>

          <vs-tab label="Balance info">
            <div class="con-tab-ejemplo">Balance info</div>
          </vs-tab>

          <vs-tab label="Documents">
            <div class="con-tab-ejemplo">
              <div class="vx-row">
                <div class="vx-col w-1/4" v-for="(file, index) in files" :key="index">
                  <div class="flex items-start flex-col sm:flex-row company_img_block">
                    <a :href="file.download_file" target="_blank" download>
                      <img :src="file.image" class="mr-8 rounded h-24 w-24" />
                    </a>

                    <!-- <img :src="file.image" class="mr-8 rounded h-24 w-24" /> -->
                    <div style="margin: 0 10px">
                      <span class="doc_name">{{ file.name }}</span>
                      <br />
                      <!-- <vs-button class="mr-4 mb-4">Change Avatar</vs-button> -->
                      <vs-button style="font-size: 10px" type="border" @click="confirmDelete(file)" color="danger"
                        v-if="file.image && myToken">Remove Document</vs-button>
                    </div>
                  </div>
                </div>
              </div>
              <vs-divider />
              <div class="new_images">
                <div class="flex items-start flex-col sm:flex-row" v-if="newFile.length">
                  <div v-for="(file, index) in newFile" :key="index" class="new_images_block">
                    <a :href="file.download_file" target="_blank" download>
                      <img :src="file.image" class="mr-8 rounded h-24 w-24" />
                    </a>

                    <!-- <img :src="file.image" class="mr-8 rounded h-24 w-24" /> -->
                    <div style="margin: 0 10px">
                      <!-- <vs-button class="mr-4 mb-4">Change Avatar</vs-button> -->
                      <vs-button style="font-size: 10px" type="border" @click="removeNewFiles(file)" color="danger"
                        v-if="file.image && myToken">Remove Document</vs-button>
                    </div>
                  </div>
                </div>

                <input type="file" class="hidden" multiple :ref="`update_image`" @change="update_image"
                  accept=".doc,.docx,.xls,.xlsx,.pdf,.zip" />

                <vs-button class="mr-4 unimacs_button" @click="$refs.update_image.click()" v-if="myToken">Upload
                </vs-button>
              </div>
              <div class="vx-row w-full up_document">
                <div class="vx-col">
                  <vs-button class="mr-6 mt-4 unimacs_button" @click="updateDocument" v-if="myToken">Upload documents
                  </vs-button>
                  <vs-button class="unimacs_cancel_button" @click="popupActive = false">Cancel</vs-button>
                </div>
              </div>
            </div>
          </vs-tab>
        </vs-tabs>
      </vs-popup>
    </div>
    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center float-right">
        <div class="flex-grow mr-8"></div>
        <vs-button class="columns_button unimacs_button" @click="filterColumns" icon-pack="material-icons"
          icon="filter_list"></vs-button>
      </div>

      <div class="left_block">
        <!-- <vs-dropdown vs-trigger-click class="cursor-pointer">
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
              {{
                companies.data.length - currentPage * itemsPerPage > 0
                ? currentPage * itemsPerPage
                : companies.data.length
              }}
              of {{ companies.count }}</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <vs-dropdown-menu>
            <vs-dropdown-item @click="itemsPerPage = 5">
              <span>5</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 10">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 15">
              <span>15</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown> -->

        <v-select v-model="itemsPerPage" :options="[10, 15, 20]" class="select_padding company_lim mr-3" name="ap_type"
          placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'" :clearable="false" :searchable="false" />

        <div class="vx-row date_filter mr-5">
          <vs-checkbox class="mb-4 mt-5 ml-3 mr-3" @change="disableDate = $event.target.checked"></vs-checkbox>
          <div class="vx-col md:w-1/2 start_date">
            <flat-pickr :disabled="!disableDate" :config="configdateTimePicker" v-model="startDate"
              placeholder="Start Time" />
          </div>
          <div class="vx-col md:w-1/2 endDate">
            <flat-pickr :disabled="!disableDate" :config="configdateTimePicker" v-model="endDate"
              placeholder="End Time" />
          </div>
          <vs-button @click="filterByDate" :disabled="isFormValid" class="unimacs_button" icon-pack="material-icons"
            icon="search"></vs-button>
        </div>
        <!-- <vs-button
          @click="sendPopup = true"
          class="unimacs_button ml-3 send_inv"
          >Send invite to the {{ hasCompany }}</vs-button
        > -->
        <vs-button class="unimacs_button mr-5 company_export" @click="activePrompt = true"
          :disabled="!companies.data.length">Export</vs-button>
      </div>

      <vs-table noDataText="No data available" class="mt-5 bs_table" ref="table" :data="companies.data"
        :max-items="itemsPerPage" search>
        <div slot="header" class="flex flex-wrap-reverse items-center">
          <div class="items-center"></div>
        </div>
        <template slot="thead">
          <vs-th v-for="(header, index) in headers" :key="index" :sort-key="header.key">{{ header.name }}</vs-th>
          <vs-th>Actions</vs-th>
        </template>
        <template slot-scope="{ data }">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td v-for="(header, index) in headers" :key="index">
                <div v-if="header.key == 'status'" @click="permissions.updateItem ? edit(tr) : false">
                  <vs-chip class="ag-grid-cell-chip" :color="chipColor(tr[header.key])">
                    <span>{{ tr[header.key] }} </span>
                  </vs-chip>
                </div>
                <div v-else @click="permissions.updateItem ? edit(tr) : false">
                  <p class="product-name font-medium truncate">
                    {{ tr[header.key] ? tr[header.key] : "" }}
                  </p>
                </div>
              </vs-td>

              <vs-td class="whitespace-no-wrap">
                <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                  @click.stop="edit(tr)" v-if="permissions.updateItem" />
                <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2"
                  v-if="permissions.destroyItem" @click.stop="confirmDeleteRecord(tr)" />
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
      <CustomPaging @pageChanged="page = $event" class="mt-4 " :total="totalPage"
        v-if="itemsPerPage < companies.count ? true : false" />

      <!-- <vs-pagination
        class="mt-3"
        v-if="itemsPerPage < companies.count ? true : false"
        :total="totalPage"
        v-model="page"
      ></vs-pagination> -->
    </div>
  </div>
</template>

<script>
import moduleCompany from "@/store/company/moduleCompany.js";

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import moduleFile from "@/store/files/moduleFile.js";
import vSelect from "vue-select";
import Table from "@/components/custom/table/Table";

export default {
  components: {
    flatPickr,
    vSelect,
    Table,
  },
  watch: {
    rowsPopup(val) {
      if (!val) {
        this.company_headers = JSON.parse(JSON.stringify(this.company_header));
      }
    },
    itemsPerPage(event) {
      const params = { page: this.page, page_items_count: event };

      if (this.startDate) {
        params.start_from = this.startDate;
      }

      if (this.endDate) {
        params.start_to = this.endDate;
      }

      this.fetchCompanies(params);
    },
    page(event) {
      const params = { page: event, page_items_count: this.itemsPerPage };
      if (this.startDate) {
        params.start_from = this.startDate;
      }
      if (this.endDate) {
        params.start_to = this.endDate;
      }
      this.fetchCompanies(params);
    },
    disableDate(val) {
      if (!val) {
        const params = { page: this.page, page_items_count: this.itemsPerPage };
        this.fetchCompanies(params);
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
      itemsPerPage: 10,
      deletedId: null,
      deleteDocId: null,
      startDate: "",
      newFile: [],
      endDate: "",
      totalPage: 0,
      translations: [],
      popupActive: false,
      rowsPopup: false,
      disableDate: false,
      selectedTranses: [],
      companyData: null,
      files: [],
      page: 1,
      accountImage: "/no_avatar.svg",
      company_list: {},
      contact_list: {},
      statusOptions: [
        {
          label: "Enabled",
          id: "enabled",
        },
        {
          label: "Pending",
          id: "pending",
        },
        {
          label: "Disabled",
          id: "disable",
        },
      ],
      configdateTimePicker: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      company_header: [],
      company_headers: [
        { name: "#", key: "count", show: true },
        { name: "Registration Date", key: "createDate", show: true },
        { name: "Last Online", key: "last_online", show: true },
        { name: "Company Name", key: "company_name", show: true },
        { name: "Email", key: "email", show: true },
        { name: "Country", key: "country", show: true },
        { name: "Contact Person", key: "contact_person", show: true },
        { name: "Facilities", key: "facilities", show: false },
        { name: "Device", key: "device", show: false },
        { name: "Comment", key: "comment", show: false },
        { name: "Status", key: "status", show: true },
      ],
      fileName: null,
      formats: ["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      selectedFormat: "xlsx",
      headerTitle: [],
      headerVal: [],
      activePrompt: false,
      email: null,
      sendPopup: false,
    };
  },
  computed: {
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },

    headers() {
      return this.company_header.filter((c) => c.show);
    },
    currentPage: {
      get() {
        return 1;
      },
    },
    // queriedItems() {
    //   return this.$store.state.company.companies.count;
    // },
    chipColor() {
      return (value) => {
        if (value == "pending") return "#428bca";
        else if (value == "enabled") return "rgb(92 184 92)";
        else if (value == "disable") return "danger";
      };
    },
    companies() {
      return this.$store.state.company.companies;
    },
    isFormValid() {
      return (this.startDate || this.endDate) && !this.disableDate;
    },
    myToken() {
      return localStorage.user ? JSON.parse(localStorage.user).company : null;
    },
    settingsStore() {
      return this.$store.state.settings
    }
    // hasCompany() {
    //   const userCompany =
    //     localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))
    //       ? JSON.parse(localStorage.getItem("user")).company
    //       : null;

    //   if (userCompany) {
    //     return "partition";
    //   } else {
    //     return "company";
    //   }
    // }
  },
  methods: {
    sendEmail() {
      this.$vs.loading({
        type: "corners",
      });
      this.$http
        .post(
          `registrationInvite`,
          {
            email: this.email,
          },
          { headers: { Authorization: localStorage.token } }
        )
        .then((res) => {
          this.sendPopup = false;

          this.email = "";

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Registraion invite sent",
          });
          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
          this.sendPopup = false;
        });
    },
    exportToExcel() {
      const name = this.fileName;

      import("@/vendor/Export2Excel").then((excel) => {
        const list = this.companies.data;
        const header = this.company_headers.map((item) => {
          return item.name;
        });

        const headerVal = this.company_headers.map((item) => {
          return item.key;
        });

        //      this.headerTitle = this.access_point_headers.map((item) => {
        //   return item.name;
        // });

        const data = this.formatJson(headerVal, list);

        excel.export_json_to_excel({
          header: header,
          data,
          filename: name,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat,
        });
        this.clearFields();
        this.fileName = "";
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
      this.filename = null;
      this.cellAutoWidth = true;
      this.selectedFormat = "xlsx";
    },
    async changeHeaders() {
      const settings = JSON.parse(JSON.stringify(this.settingsStore));
      settings.table_headers.company_header = this.company_headers;
      this.company_header = JSON.parse(JSON.stringify(this.company_headers));
      // this.setSettings(settings);
      await this.$store.dispatch("setSettings", settings)

      this.rowsPopup = false;
    },

    updateInfo() {
      const obj = {
        id: this.companyData.id,
        message: this.companyData.message,
        status: this.companyData.status,
      };

      this.$store
        .dispatch("company/updateCompany", obj)
        .then((res) => {
          this.popupActive = false;
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Company info updated",
          });
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    edit(data) {
      this.popupActive = true;

      this.$store
        .dispatch("company/fetchCompany", data.id)
        .then((res) => {
          this.files = [];
          if (res.data.company_documents && res.data.company_documents.length) {
            res.data.company_documents.forEach((file) => {
              if (file.file) {
                file.file = JSON.parse(file.file);

                file.image = `/doc.png`;
                file.download_file = `${process.env.VUE_APP_BACK}/${file.file.path}`;
              }

              this.files.push(file);
            });
          }

          this.companyData = res.data;
          let account = res.data.company_account;

          let company = res.data.company_name;
          let contact_person = account.last_name
            ? account.first_name + " " + account.last_name
            : account.first_name;
          let packet = res.data.package_types
            ? res.data.package_types.name
            : "No package";
          this.company_list = {
            company,
            contact_person,
            packet,
            email: account ? account.email : "",
          };

          this.contact_list = {
            email: account.email,
            phone_1: account.phone_1,
            country: account.country,
            site: account.site,
            address: account.address,
            viber: account.viber,
            whatsapp: account.whatsapp,
          };

          if (account.avatar && JSON.parse(account.avatar)) {
            const avatar = JSON.parse(account.avatar);
            this.accountImage = `${process.env.VUE_APP_BACK}/${avatar.path}`;
          }
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    removeImage() {
      this.$store
        .dispatch("company/deleteDocument", this.deleteDocId)
        .then((res) => {
          const fileIndex = this.files.findIndex(
            (f) => f.id == this.deleteDocId
          );
          this.files.splice(fileIndex, 1);
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    updateDocument() {
      if (this.newFile.length) {
        this.$vs.loading({
          type: "corners",
        });
        this.newFile.forEach((file) => {
          let document = {
            name: file.name,
            date: new Date(),
            company: this.companyData.id,
            file: JSON.stringify(file.file),
          };
          this.$store
            .dispatch("company/createDocument", document)
            .then((res) => {
              if (res.data.file) {
                let file = JSON.parse(res.data.file);

                document.image = `/doc.png`;
                document.download_file = `${process.env.VUE_APP_BACK}/${res.data.path}`;
              }
              document.id = res.data.id;
              this.files.push(document);
              this.$vs.loading.close();
            })
            .catch((err) => {
              this.$vs.loading.close();
            });
        });

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Company document created",
        });

        this.newFile = [];
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "No uploaded documents",
        });
      }
    },
    confirmDelete(data) {
      this.deleteDocId = data.id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.name} document`,
        accept: this.removeImage,
        acceptText: "Delete",
      });
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.company_name} company`,
        accept: this.deleteCompany,
        acceptText: "Delete",
      });
    },
    update_image(event) {
      var input = event.target.files;
      if (input && input.length) {
        this.$vs.loading({
          type: "corners",
        });

        input.forEach((file) => {
          this.$store
            .dispatch("file/companyFileUpload", file)
            .then((res) => {
              let file = {
                name: res.data.name,
                company: this.companyData.id,
                date: new Date(),
                file: res.data,
                image: `/doc.png`,
                download_file: `${process.env.VUE_APP_BACK}/${res.data.path}`,
              };
              this.newFile.push(file);

              this.$vs.loading.close();
            })
            .catch((error) => { });
        });

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Image(s) uploaded",
        });
      }
    },
    deleteCompany() {
      this.$store
        .dispatch("company/deleteCompany", this.deletedId)
        .then((res) => { })
        .catch((err) => {
          this.$vs.loading.close();

          this.totalPage = Math.ceil(this.companies.count / this.itemsPerPage);

          // const sum = this.companies.count % this.itemsPerPage;
          // if (!sum) {
          //   this.totalPage = Math.floor(
          //     this.companies.count / this.itemsPerPage
          //   );
          // } else {
          //   this.totalPage =
          //     Math.floor(this.companies.count / this.itemsPerPage) + 1;
          // }

          this.activeLoading = false;
        });
    },
    filterByDate() {
      const params = {
        start_date: this.startDate,
        end_date: this.endDate,
        page: this.page,
        page_items_count: this.itemsPerPage,
      };
      this.fetchCompanies(params);
    },
    filterColumns() {
      this.rowsPopup = true;
    },
    fetchCompanies(obj) {
      this.$store
        .dispatch("company/fetchCompanies", obj)
        .then((res) => {
          const sum = res.data.count % this.itemsPerPage;
          if (!sum) {
            this.totalPage = Math.floor(res.data.count / this.itemsPerPage);
          } else {
            this.totalPage = Math.floor(res.data.count / this.itemsPerPage) + 1;
          }
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
  },
  async created() {
    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    if (!moduleCompany.isRegistered) {
      this.$store.registerModule("company", moduleCompany);
      moduleCompany.isRegistered = true;
    }

    const user = localStorage.user ? JSON.parse(localStorage.user) : null;

    if (user && user.username !== 'super') {
      this.$router.push("/error-404").catch(() => { });
    }

    this.$root.$on("openInvitePop", () => {
      this.sendPopup = true;
    });

    this.$store.dispatch("pagePermissions", this.permissions).then((res) => {
      if (res != true) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: `You haven't access to enter to ${this.$route.name}`,
        });
        setTimeout(() => {
          // this.$router.push(res).catch(() => {});
          this.$router.push("/error-404").catch(() => { });
        }, 100);

        return false;
      }
    });

    const settings = JSON.parse(JSON.stringify(this.settingsStore))

    if (!settings) {
      await this.$store.dispatch("setSettings", {
        table_headers: {
          company_header: this.company_headers,
        },
      })
      // this.setSettings({
      //   table_headers: {
      //     company_header: this.company_headers,
      //   },
      // });

      this.company_header = JSON.parse(JSON.stringify(this.company_headers));
    } else {
      if (settings.table_headers) {
        if (settings.table_headers.company_header) {
          this.company_header = JSON.parse(
            JSON.stringify(settings.table_headers.company_header)
          );
          this.company_headers = JSON.parse(
            JSON.stringify(this.company_header)
          );
        } else {
          const saveSettings = { ...settings };

          saveSettings.table_headers.company_header = this.company_headers;

          this.company_header = JSON.parse(
            JSON.stringify(this.company_headers)
          );
          await this.$store.dispatch("setSettings", saveSettings)
          // this.setSettings(saveSettings);
        }
      } else {
        const saveSettings = { ...settings };
        saveSettings.table_headers = {
          company_header: this.company_headers,
        };

        this.company_header = JSON.parse(
          JSON.stringify(this.company_headers)
        );
        await this.$store.dispatch("setSettings", saveSettings)

        // this.setSettings(saveSettings);
      }
    }
    // });



    const params = { page: this.page, page_items_count: this.itemsPerPage };
    this.fetchCompanies(params);
  },
};
</script>

<style lang="scss">
// .comp_avatar_block {
//   display: flex !important;
//   flex-direction: column !important;
//   justify-content: center !important;
// }

.company_image.account {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
  }
}

.company_page {
  .up_document {
    align-items: center;
    justify-content: flex-end;
  }

  .doc_name {
    white-space: nowrap;
    overflow: hidden;
    display: block;
    max-width: 100%;
    text-overflow: ellipsis;
  }

  .left_block {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: -40px;
  }

  .columns_button {
    margin-right: 25px;
    margin-top: 5px;
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

  .vs-table--search {
    padding-bottom: 15px !important;
    margin-top: -35px !important;
    margin-right: 5px;
    // input {
    //   border-radius: 5px !important;
    //   height: 35px;
    // }
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

  .list_block .list__item span.feather-icon {
    display: none;
  }

  .popCompany .vs-popup {
    width: 1000px !important;
  }

  .social_flex {
    flex: 0 0 100%;
    display: flex;
    margin: 10px -5px;
  }

  .border_bottom {
    border-bottom: 1px solid #f2f2f2;
  }

  .agree_check {
    margin: -5px;
  }

  .company_img_block {
    display: block !important;
    text-align: center;
    margin-bottom: 20px;
    max-width: 200px;
    border: 2px solid #9288f4;
    border-radius: 5px;
    padding: 10px 0;

    img {
      margin: 0 !important;
    }
  }

  .new_images_block {
    text-align: center;
    margin-right: 20px;
    margin-bottom: 20px;
    max-width: 200px;
    border: 2px solid #9288f4;
    border-radius: 5px;
    padding: 10px 15px;

    img {
      margin: 0 !important;
    }
  }

  .con-vs-dialog {
    z-index: 100000 !important;
  }

  // .detail_actions {
  //   display: flex;
  //   flex-direction: row-reverse;
  //   width: 100%;
  //   align-items: baseline;
  // }

  // .company_export {
  //   position: absolute;
  //   right: 200px;
  // }
}

.send_inv {
  position: relative;
  // right: -245px;
}

.date_filter {
  flex-wrap: unset;
  align-items: center;
  margin-left: 10px;
}

// con-input-search vs-table--search
// position: absolute;
//     top: 50px;
//     right: 90px;

@media (max-width: 1448px) {
  .vs-table--search-input {
    max-width: 200px;
    width: 100%;
  }

  .endDate,
  .start_date {
    width: 150px !important;
  }

  .company_page .columns_button {
    margin-right: 0;
  }
}

@media (max-width: 1288px) {
  .vs-table--search-input {
    max-width: 120px;
    width: 100%;
  }
}

@media (max-width: 1192px) {
  .vs-table--search-input {
    max-width: 200px;
    width: 100%;
  }
}

@media (max-width: 1035px) {
  .date_filter {
    width: 100%;
    flex-wrap: unset;
    padding-left: 135px;
    margin: -42px 0 24px 0;
  }

  .vs-checkbox-primary {
    margin: 0 !important;
  }

  .endDate,
  .start_date {
    width: unset !important;
  }

  .company_page .left_block {
    flex-direction: column;
    align-items: baseline;
  }
}

.detail_actions {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}

.company_tabs .vx-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px 15px;

  .info {
    .field {
      min-width: 130px;
      width: 130px;
      display: inline-block;
    }
  }
}

.company_tablist {
  .vs-popup {
    // min-height: 480px;
  }
}

.company_lim {
  width: 100px;
}
</style>
