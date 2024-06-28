<!-- =========================================================================================
  File Name: UserView.vue
  Description: User View page
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="create_packet">
    <div :class="{ activeLoading: activeLoading }" @click="openLoading(corners)"
      class="vs-con-loading__container loading-example"></div>
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Basic settings" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <form>
                <vx-card class="mt-base" title="" no-shadow>
                  <div class="vx-row">
                    <div class="vx-col w-full">
                      <div class="flex items-start flex-col sm:flex-row">
                        <div></div>
                      </div>
                    </div>
                  </div>

                  <div class="vx-row">
                    <div class="vx-col md:w-1/3 w-full">
                      <div class="">
                        <vs-input class="w-full " label="Name" v-validate="'required'" name="name"
                          v-model="packet.name" />
                        <span class="text-danger text-sm" v-show="errors.has('name')">{{ errors.first("name") }}</span>
                      </div>
                    </div>

                    <div class="vx-col md:w-2/3 w-full">
                      <div class="">
                        <vs-input class="w-full " label="Description" v-validate="'required'" name="description"
                          v-model="packet.description" />
                        <span class="text-danger text-sm" v-show="errors.has('description')">{{
                        errors.first("description") }}</span>
                      </div>
                    </div>

                    <div class="vx-col md:w-1/3 w-full">
                      <div class="mt-3">
                        <label for="" class="vs-input--label">Package type</label>
                        <v-select v-model="packet.package_type" :options="packetTypes" disabled name="packet_type"
                          class="w-full select_padding" placeholder="Package type" :reduce="(type) => type.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                        <span class="text-danger text-sm" v-show="errors.has('packet_type')">{{
                        errors.first("packet_type") }}</span>
                      </div>
                    </div>

                    <div class="vx-col md:w-1/3 w-full">
                      <div class="mt-3">
                        <label for="" class="vs-input--label">Pay type</label>
                        <v-select v-model="packet.free" :options="payTypes" name="free" class="w-full select_padding"
                          @input="changePay" placeholder="Pay type" :reduce="(type) => type.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                        <span class="text-danger text-sm" v-show="errors.has('free')">{{ errors.first("free") }}</span>
                      </div>
                    </div>

                    <div class="vx-col md:w-1/3 w-full">
                      <div class="mt-3">
                        <label for="" class="vs-input--label">Status</label>
                        <v-select v-model="packet.status" :options="statusOptions" name="status"
                          class="w-full select_padding" placeholder="Status" :reduce="(type) => type.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                        <span class="text-danger text-sm" v-show="errors.has('status')">{{ errors.first("status")
                        }}</span>
                      </div>
                    </div>

                    <div class="vx-col md:w-1/3 w-full">
                      <div>
                        <div class="mt-3">
                          <label for="" class="vs-input--label">Basic price</label>
                          <input type="number" class="w-full number_input" name="price" min="0" @input="calcPersent"
                            v-model="packet.price" :disabled="disabled" placeholder="Basic price" />
                          <span class="text-danger text-sm" v-show="errors.has('price')">{{ errors.first("price")
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="vx-col md:w-1/3 mt-6 w-full">
                      <vs-checkbox class="mt-5 custom__checkbox" :disabled="packet.default" v-model="default_packet">
                        Default</vs-checkbox>
                    </div>

                  </div>
                  <vs-table  
noDataText="No data available" ref="table" class="bs_table mt-5" :max-items="10" :data="payTerms">
                    <div slot="header" class="flex flex-wrap-reverse items-center">
                      <div class="flex flex-wrap-reverse items-center"></div>
                    </div>

                    <template slot="thead">
                      <vs-th sort-key="id">#</vs-th>
                      <vs-th sort-key="name">Pay terms</vs-th>
                      <vs-th sort-key="discount">Discount</vs-th>
                      <vs-th sort-key="price">Price</vs-th>
                    </template>

                    <template slot-scope="{ data }">
                      <tbody>
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                          <vs-td>
                            <p class="product-name font-medium truncate">
                              {{ tr.id }}
                            </p>
                          </vs-td>

                          <vs-td>
                            <p class="product-name font-medium truncate">
                              {{ tr.name }}
                            </p>
                          </vs-td>

                          <vs-td>
                            <template slot="edit">
                              <input type="number" class="number_input" v-model="tr.discount"
                                @input="changeDiscount($event.target.value, tr)" />
                            </template>
                            <p class="product-name font-medium truncate">
                              {{ tr.discount }}
                            </p>
                          </vs-td>

                          <vs-td>
                            <p class="product-name font-medium truncate">
                              {{ calcPersent(packet.price, tr.discount) }}
                            </p>
                          </vs-td>
                        </vs-tr>
                      </tbody>
                    </template>
                  </vs-table>
                </vx-card>
              </form>
            </div>
          </vs-tab>
          <vs-tab label="Extra settings" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <div class="vx-row">
                <div class="todo__filters-container vs-col w-1/4">
                  <div class="px-6 py-4">
                    <span v-for="filter in leftFilters" @click="todoFilter = filter.filter"
                      class="text-lg ml-3 flex mt-6 cursor-pointer"
                      :class="{ 'text-primary': todoFilter == filter.filter }" :key="filter.filter">{{ filter.name
                      }}</span>
                  </div>
                </div>
                <div class="vs-col w-3/4">
                  <vs-table  
noDataText="No data available" class="bs_table cr_res" ref="table_extra" :pagination="
                    tableData[todoFilter] &&
                    tableData[todoFilter].length > itemsPerPage
                      ? true
                      : false
                  " :max-items="itemsPerPage" search :data="tableData[todoFilter]">
                    <div slot="header" class="flex flex-wrap-reverse items-center"></div>

                    <template slot="thead">
                      <vs-th sort-key="name">Resource name</vs-th>
                      <vs-th sort-key="qty" v-if="todoFilter == 'resources'">QTY</vs-th>
                      <vs-th sort-key="enable" v-else>Enable</vs-th>
                    </template>

                    <template slot-scope="{ data }">
                      <tbody>
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                          <vs-td>
                            <p class="product-name font-medium truncate">
                              {{ tr.name }}
                            </p>
                          </vs-td>

                          <vs-td :data="tr.qty">
                            <span v-if="todoFilter == 'resources'">
                              <!-- {{ tr.qty }} -->
                              <input v-if="todoFilter == 'resources'" type="number" class="number_input w-1/2"
                                v-model="tr.qty" @input="
                                  changeResource(
                                    $event.target.value,
                                    tr.original_name
                                  )
                                " />
                            </span>

                            <span v-if="todoFilter != 'resources'">
                              <!-- <vs-chip
                                class="ag-grid-cell-chip"
                                :color="chipColor(tr.status)"
                              > -->
                              <vs-checkbox class="mb-4 mt-5" v-model="tr.checked"
                                style="justify-content: flex-start !important" @input="
                                  changeFeature(
                                    $event,
                                    tr.feature,
                                    tr.original_name
                                  )
                                "></vs-checkbox>
                              <!-- <span>{{ tr.checked }}</span> -->
                              <!-- </vs-chip> -->
                            </span>

                            <!-- <template slot="edit">
                              <input
                                v-if="todoFilter == 'resources'"
                                type="number"
                                class="number_input"
                                v-model="tr.qty"
                                @input="
                                  changeResource(
                                    $event.target.value,
                                    tr.original_name
                                  )
                                "
                              />

                              <vs-checkbox
                                v-else
                                class="mb-4 mt-5"
                                v-model="tr.checked"
                                @input="
                                  changeFeature(
                                    $event,
                                    tr.feature,
                                    tr.original_name
                                  )
                                "
                              ></vs-checkbox>
                            </template> -->
                          </vs-td>
                        </vs-tr>
                      </tbody>
                    </template>
                  </vs-table>
                </div>
              </div>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full">
          <div class="mt-8 flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2 unimacs_button" @click="updatePacket">Submit</vs-button>
            <!-- <vs-button class="mt-2 ml-2 unimacs_button" @click="cancel"
              >Cancel</vs-button
            > -->
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";
import modulePacket from "@/store/packet/modulePackets.js";

export default {
  components: {
    vSelect,
  },
  data() {
    return {
      tableData: {},
      extra_settings: { resources: {}, features: {}, package_types: {} },
      leftFilters: [{ name: "Resources", filter: "resources" }],

      statusOptions: [
        { label: "Active", id: true },
        { label: "Inactive", id: false },
      ],
      payTerms: [
        {
          name: "1 Month",
          id: 1,
          discount: 0,
          price: 0,
        },
        {
          name: "6 Month",
          id: 2,
          discount: 15,
          price: 0,
        },
        {
          name: "12 Month",
          id: 3,
          discount: 25,
          price: 0,
        },
      ],
      disabled: false,
      default_packet: false,
      payTypes: [
        { label: "Paid", id: false },
        { label: "Free", id: true },
      ],
      activeLoading: false,
      packet: {
        name: null,
        description: null,
        package_type: null,
        free: false,
        status: false,
        price: null,
      },
      todoFilter: "resources",
      itemsPerPage: 15,
      activeTab: 0,
      packetTypes: [],
    };
  },
  computed: {
    // packetTypes() {
    //   return this.$store.state.packet.packetTypes;
    // },
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
    types() {
      return this.$store.state.packet.packetTypes;
    },
  },
  methods: {
    updatePacket() {
      this.$vs.loading({
        type: "corners",
      });
      this.packet.id = this.$route.params.id;
      this.packet.extra_settings = JSON.stringify(this.extra_settings);
      this.packet.pay_terms = JSON.stringify(this.payTerms);
      if(this.packet.default) {
        delete this.packet.default
      }
      this.$store
        .dispatch("packet/updatePacket", this.packet)
        .then((res) => {
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Package updated",
          });
          this.$vs.loading.close();
          this.$router.push("/package").catch((err) => { });
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    changeDiscount(event, tr) {
      this.calcPersent();
    },
    calcPersent(price, discount) {
      let calculated = 0;
      if (discount > 0) {
        calculated = this.percentage(price, discount).toFixed(2);
      } else {
        calculated = price;
      }

      return calculated;
    },
    percentage(num, per) {
      return num - (num / 100) * per;
    },
    changePay() {
      if (!this.packet.free) {
        this.disabled = false;
      } else {
        this.disabled = true;
        this.packet.price = 0;
        this.calcPersent();
      }
    },
    changeResource(event, name) {
      const find_type = this.types.find((t) => t.name == name);

      if (!event && !find_type) {
        this.extra_settings.resources[name] = 0;
      } else if (event && !find_type) {
        this.extra_settings.resources[name] = event;
      } else if (!event && find_type) {
        this.extra_settings.package_types[find_type.id] = 0;
      } else if (event && find_type) {
        this.extra_settings.package_types[find_type.id] = event;
      }
    },
    changeFeature(event, feature, name) {
      this.extra_settings.features[feature][name] = event;
    },

    cancel() {
      this.$router.push("/package").catch(() => { });
    },
  },

  created() {
    this.$vs.loading({
      type: "corners",
    });

    if (!modulePacket.isRegistered) {
      this.$store.registerModule("packet", modulePacket);
      modulePacket.isRegistered = true;
    }

    this.tableData = [];

    this.$store
      .dispatch("packet/fetchSettings")
      .then((res) => {
        let feature = res.data.features;

        this.$store
          .dispatch("packet/fetchPacket", this.$route.params.id)
          .then((response) => {
            this.packet = {
              name: response.data.name,
              description: response.data.description,
              package_type: response.data.package_type,
              free: response.data.free,
              status: response.data.status,
              price: response.data.price,
            };

            if (response.data.default) {
              this.packet.default = response.data.default
              this.default_packet = response.data.default
            } else {
              this.packet.default = false
              this.default_packet = false
            }

            if (response.data.pay_terms && response.data.pay_terms.length) {
              this.payTerms = JSON.parse(response.data.pay_terms);
            }

            if (!response.data.free) {
              this.disabled = false;
            } else {
              this.disabled = true;
            }

            let data = response.data.extra_settings
              ? JSON.parse(response.data.extra_settings)
              : {};

            if (this.todoFilter == "resources") {
              this.tableData["resources"] = [];

              res.data.resources.forEach((res) => {
                if (!data.resources[res]) {
                  this.extra_settings.resources[res] = 0;
                  let name = res.replace(/([A-Z])/g, " $1").trim();
                  this.tableData["resources"].push({
                    name,
                    original_name: res,
                    qty: 0,
                  });
                } else {
                  this.extra_settings.resources[res] = data.resources[res];
                  let name = res.replace(/([A-Z])/g, " $1").trim();

                  this.tableData["resources"].push({
                    name,
                    original_name: res,
                    qty: data.resources[res],
                  });
                }
              });
            }

            if (Object.keys(data.package_types).length) {
              for (const key in data.package_types) {
                const fint_type = this.types.find((t) => t.id == key);
                this.tableData["resources"].push({
                  name: fint_type.name,
                  original_name: fint_type.name,
                  qty: data.package_types[key],
                  type: "package",
                });
              }
            }

            for (const key in feature) {
              if (feature[key]) {
                this.tableData[key] = [];
                this.extra_settings.features[key] = {};
                feature[key].forEach((ft) => {
                  if (!data.features[key] || !data.features[key][ft]) {
                    let name = ft.replace(/([A-Z])/g, " $1").trim();
                    this.tableData[key].push({
                      name,
                      original_name: ft,
                      checked: false,
                      feature: key,
                    });
                    this.extra_settings.features[key][ft] = false;
                  } else {
                    let name = ft.replace(/([A-Z])/g, " $1").trim();
                    this.tableData[key].push({
                      name,
                      original_name: ft,
                      checked: data.features[key][ft],
                      feature: key,
                    });
                    this.extra_settings.features[key][ft] =
                      data.features[key][ft];
                  }
                });
              }

              let name = key.replace(/([A-Z])/g, " $1").trim();
              this.leftFilters.push({ name: name, filter: key });
            }

            this.$vs.loading.close();
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      })
      .catch((err) => {
        this.$vs.loading.close();
      });

    this.$store
      .dispatch("packet/fetchPacketTypes")
      .then((res) => {
        this.packetTypes = [];
        if (res.data.length) {
          res.data.forEach((type) => {
            if (type.status) {
              this.packetTypes.push({
                id: type.id,
                label: type.name,
              });
            }
          });
        } else {
          this.packetTypes = [{ id: null, label: "No packet type" }];
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
#avatar-col {
  width: 10rem;
}

.number_input {
  border-radius: 5px;
  color: inherit;
  position: relative;
  padding: 10px 6px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  width: 100%;
}


// #account-info-col-1 {
//   // flex-grow: 1;
//   width: 30rem !important;
//   @media screen and (min-width:1200px) {
//     & {
//       flex-grow: unset !important;
//     }
//   }
// }

@media screen and (min-width: 1201px) and (max-width: 1211px),
only screen and (min-width: 636px) and (max-width: 991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }
}

.td.vs-table--td.td-edit .empty {
  display: none;
}

.cr_res {
  .tr-values {
    .vs-table--td {
      padding: 5px 15px !important;
    }
  }
}
</style>
