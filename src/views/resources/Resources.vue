<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container packets_page">
    <vx-card title="" class="packet_card_custom">
      <div class="flex flex-wrap items-center float-right">
        <div class="flex-grow"></div>

        <vs-button class="ml-4 unimacs_button unimacs_add_new_btn" @click="addPacket" v-if="permissions.addItem">
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" />Add New
        </vs-button>


        <!-- <div
          class="
            custom
            btn-add-new
            p-3
            mb-4
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

          "
          style="margin-top: 7px"
          @click="addPacket"
          v-if="permissions.addItem"
        >
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-primary addNeww">Add New</span>
        </div> -->
      </div>

      <vs-table noDataText="No data available" ref="table" class="package_table bs_table"
        :pagination="packets.length > itemsPerPage ? true : false" :max-items="itemsPerPage" search :data="packets">
        <div slot="header" class="flex flex-wrap-reverse items-center">
          <!-- <vs-dropdown vs-trigger-click class="cursor-pointer ">
            <div
              class="
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
                mb-3
              "
            >
              <span class="mr-2"
                >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                {{
                  packets.length - currentPage * itemsPerPage > 0
                    ? currentPage * itemsPerPage
                    : packets.length
                }}
                of {{ queriedItems }}</span
              >
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
          <v-select v-model="itemsPerPage" :options="[10, 20, 50]" class="select_padding resource_lim mr-3" name="ap_type"
            placeholder="Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'" :clearable="false" :searchable="false" />


          <div class="flex flex-wrap-reverse items-center ml-3">
            <div class="
                flex flex-wrap-reverse
                items-center
                data-list-btn-container
              ">
              <vs-dropdown vs-trigger-click class="dd-actions cursor-pointer mr-4 ">
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

              <!-- ADD NEW -->
            </div>
          </div>
        </div>

        <template slot="thead">
          <vs-th><vs-checkbox v-if="packets.length" v-model="selectAllCheckBox" icon-pack="feather" :icon="selectAllIcon"
              class="select-all-chexkbox ml-1"></vs-checkbox></vs-th>
          <vs-th sort-key="count">#</vs-th>
          <vs-th sort-key="name">Name</vs-th>
          <vs-th sort-key="description">Description</vs-th>
          <vs-th sort-key="packet_type">Package type</vs-th>
          <vs-th sort-key="free">Pay type</vs-th>
          <vs-th sort-key="price">Price</vs-th>
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
                <div @click.stop="edit(tr)">
                  <p class="product-name font-medium truncate">
                    {{ tr.count }}
                  </p>
                </div>
              </vs-td>
              <vs-td>
                <div @click.stop="edit(tr)">
                  <p class="product-name font-medium truncate">{{ tr.name }}</p>
                </div>
              </vs-td>
              <vs-td>
                <div @click.stop="edit(tr)">
                  <p class="product-name font-medium truncate">
                    {{ tr.description }}
                  </p>
                </div>
              </vs-td>
              <vs-td>
                <div @click.stop="edit(tr)">
                  <p class="product-name font-medium truncate">
                    {{ getType(tr.package_type) }}
                  </p>
                </div>
              </vs-td>
              <vs-td>
                <div @click.stop="edit(tr)">
                  <vs-chip class="ag-grid-cell-chip" :color="chipColor(tr.free)">
                    <span>{{ getPay(tr.free) }}</span>
                  </vs-chip>
                </div>
              </vs-td>
              <vs-td>
                <div @click.stop="edit(tr)">
                  <p class="product-name font-medium truncate">
                    {{ tr.price ? tr.price : 0 }}
                  </p>
                </div>
              </vs-td>
              <vs-td>
                <div @click.stop="edit(tr)">
                  <vs-chip class="ag-grid-cell-chip" :color="chipColor(tr.status)">
                    <span>{{ tr.status ? "Active" : "Inactive" }}</span>
                  </vs-chip>
                </div>
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
    </vx-card>
  </div>
</template>

<script>
import modulePacket from "@/store/packet/modulePackets.js";
import vSelect from "vue-select";

export default {
  components: {
    vSelect
  },
  data() {
    return {
      itemsPerPage: 10,
      popupActive: false,
      deletedId: null,
      payTypes: [
        { text: "Paid", value: false },
        { text: "Free", value: true },
      ],
      deletedArray: [],
      packets: [],
      types: [],
    };
  },
  computed: {
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },
    chipColor() {
      return (value) => {
        if (value === true) return "success";
        else if (value === false) return "danger";
      };
    },
    currentPage: {
      get() {
        return 1;
      },
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.packets.length;
    },
    selectedPackets() {
      return this.packets.filter((p) => p.selected);
    },
    selectAllIcon() {
      return this.selectedPackets.length === this.packets.length
        ? "icon-check"
        : "icon-minus";
    },
    selectAllCheckBox: {
      get() {
        return this.selectedPackets.length;
      },
      set(value) {
        this.packets.map(function (x) {
          x.selected = value;
        });
      },
    },
    getType() {
      return (type) => {
        return this.types.length
          ? this.types.find((t) => t.id == type)
            ? this.types.find((t) => t.id == type).name
            : null
          : null;
      };
    },
    getPay() {
      return (pay) => {
        return this.payTypes.find((p) => p.value == pay).text;
      };
    },
  },
  methods: {
    checkPacket(event, item) {
      let find = this.packets.find((a) => a.id == item.id);
      if (find) {
        find.selected = event;
      }
    },
    edit(data) {
      this.$router.push(`/package/edit-package/${data.id}`).catch(() => { });
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.name} packet`,
        accept: this.deletePacket,
        acceptText: "Delete",
      });
    },
    confirmDeleteMany() {
      this.deletedArray = [];
      let namesArr = [];

      if (this.selectedPackets.length) {
        this.selectedPackets.forEach((packet) => {
          this.deletedArray.push(packet.id);
          namesArr.push(packet.name);
        });
      } else if (!this.selectedPackets.length) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "No seleced packets",
        });
        return false;
      }

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${namesArr} packets`,
        accept: this.deletePacketMany,
        acceptText: "Delete",
      });
    },
    deletePacketMany() {
      this.$vs.loading({
        type: "corners",
      });

      this.deletedArray.forEach((packet) => {
        this.$store
          .dispatch("packet/deletePacket", packet)
          .then((res) => {
            this.$vs.loading.close();
            this.activeLoading = false;

            const index = this.packets.findIndex((u) => u.id == packet);
            this.packets.splice(index, 1);

            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Package deleted",
            });
          })
          .catch((err) => {
            this.$vs.loading.close();

            this.activeLoading = false;
          });
      });

      this.packets.map(function (x) {
        x.selected = false;
      });
      this.deletedArray = [];
    },
    deletePacket() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("packet/deletePacket", this.deletedId)
        .then((res) => {
          this.$vs.loading.close();
          this.activeLoading = false;
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Package deleted",
          });

          const index = this.packets.findIndex((u) => u.id == this.deletedId);
          this.packets.splice(index, 1);

          let arr = [];
          if (this.packets.length) {
            this.packets.forEach((item, index) => {
              item.count = index + 1;
              arr.push(item);
            });
          }

          this.packets = arr;

          this.deletedId = null;
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },
    addPacket() {
      this.$router.push("/package/create-package").catch(() => { });
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

    if (!modulePacket.isRegistered) {
      this.$store.registerModule("packet", modulePacket);
      modulePacket.isRegistered = true;
    }

    this.$store
      .dispatch("packet/fetchPacketTypes")
      .then((res) => {
        this.types = [];
        res.data.forEach((type) => {
          this.types.push({
            id: type.id,
            name: type.name,
          });
        });
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });

    this.$store
      .dispatch("packet/fetchPackets")
      .then((res) => {
        this.packets = [];
        const data = res.data.data ? res.data.data : res.data;
        if (data.length) {
          data.forEach((type, index) => {
            type.count = index + 1;
            type.selected = false;
            if (type.pay_terms) {
              type.pay_terms = JSON.parse(type.pay_terms);
            }
            if (type.extra_settings) {
              type.extra_settings = JSON.parse(type.extra_settings);
            }

            if (type.extra_settings && type.extra_settings.resources) {
              let resource = type.extra_settings.resources;
              let arr = [];
              for (const key in resource) {
                arr.push({ name: key, count: resource[key] });
              }

              type.resources = arr;
            }
            this.packets.push(type);
          });
        }
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });
  },
};
</script>

<style lang="scss">
.packets_page {
  .package_table .vs-table-text {
    display: block !important;
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
      // .vs-table--search {
      //   margin-left: 0;
      //   max-width: unset;
      //   width: 100%;

      //   .vs-table--search-input {
      //     width: 100%;
      //   }
      // }
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

.resource_lim {
  width: 100px;
}

.packet_card_custom {
  .vs-table--content {
    margin-top: 14px;
  }
}
</style>
