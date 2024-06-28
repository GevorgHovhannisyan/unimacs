<template>
  <div class="events_popup_inner">
    <div class="date_time_info">
      <div class="info_images" v-if="propsData && propsData.cardholder">
        <div class="table_image" v-if="propsData && propsData.cardholder">
          <img
            v-if="
              propsData && propsData.cardholder && propsData.cardholder.image
            "
            :src="propsData.cardholder.image"
          />
          <img v-else src="/no_avatar.svg" alt="" title="" />
        </div>

        <div class="ev_user_images" v-if="propsData && propsData.cardholder">
          <div class="card__img">
            <img
              v-if="
                propsData &&
                propsData.cardholder &&
                propsData.cardholder.car_image
              "
              :src="propsData.cardholder.car_image"
            />
            <img v-else src="/no_car.svg" alt="" title="" />
          </div>
        </div>
      </div>
      <div class="info_main" :class="{ empty_card: !propsData.cardholder }">
        <div class="table__block">
          <table>
            <tr>
              <td>Date/Time:</td>
              <td>
                {{ propsData.date ? propsData.date : "" }}
              </td>
            </tr>
            <tr>
              <td>Entry:</td>
              <td>
                {{ propsData.date ? propsData.date : "" }}
              </td>
            </tr>

            <tr>
              <td>Event:</td>
              <td>
                {{ propsData.event ? propsData.event : "" }}
              </td>
            </tr>
            <tr v-if="propsData && propsData.direction">
              <td>Direction:</td>
              <td>
                {{
                  propsData.direction ? propsData.direction.toLowerCase() : ""
                }}
              </td>
            </tr>
            <tr v-if="propsData && propsData.credential">
              <td>Credential:</td>
              <td>
                {{
                  propsData.credential
                    ? `${propsData.credential}`
                    : ""
                }}
              </td>
            </tr>
          </table>
        </div>
        <div
          class="user_info_block"
          :class="{ min__height: !propsData || !propsData.cardholder }"
        >
          <vs-tabs
            v-model="activeTab"
            v-if="propsData && propsData.cardholder"
            class="tab-action-btn-fill-conatiner"
          >
            <vs-tab label="Main info " icon-pack="feather" icon="icon-user">
              <div class="event_user_info_inners">
                <div class="user_info mt-3">
                  <table>
                    <tr>
                      <td>Name:</td>
                      <td>
                        {{ propsData ? propsData.first_name : "" }}
                      </td>
                    </tr>
                    <tr>
                      <td>Last Name:</td>
                      <td>
                        {{ propsData ? propsData.last_name : "" }}
                      </td>
                    </tr>
                    <tr>
                      <td>Family name</td>
                      <td>
                        {{ propsData ? propsData.family_name : "" }}
                      </td>
                    </tr>
                    <tr>
                      <td>Company:</td>
                      <td>
                        {{ propsData ? propsData.company_name : "" }}
                      </td>
                    </tr>
                    <tr>
                      <td>Group:</td>
                      <td>
                        {{ propsData ? propsData.cardholder_groups_name : "" }}
                      </td>
                    </tr>
                    <tr>
                      <td>Access Right:</td>
                      <td>
                        {{
                          propsData.access_right
                            ? propsData.access_right.name
                            : ""
                        }}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </vs-tab>

            <vs-tab label="Extend info " icon-pack="feather" icon="icon-user">
              <div class="">
                <div class="event_user_info_inners">
                  <div class="user_info mt-3">
                    <table>
                      <tr>
                        <td>Valid due:</td>
                        <td>
                          {{
                            propsData.valid_due
                              ? $moment(propsData.valid_due).format(
                                  "DD/MM/YYYY"
                                )
                              : ""
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>Email:</td>
                        <td>
                          {{ propsData ? propsData.email : "" }}
                        </td>
                      </tr>
                      <tr>
                        <td>Phone:</td>
                        <td>
                          {{ propsData ? propsData.phone : "" }}
                        </td>
                      </tr>
                      <tr>
                        <td>Anti-passback</td>
                        <td>
                          {{
                            propsData.antipass_backss
                              ? `${propsData.antipass_backss.type} / Timer ${propsData.antipass_backss.time} ${propsData.antipass_backss.time_type}`
                              : ""
                          }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </vs-tab>
          </vs-tabs>

          <!-- :disabled="disableDropDown" -->
          <vs-dropdown
            :class="{ custom_position: !propsData || !propsData.cardholder }"
            v-if="!disableDropDown"
            vs-trigger-click
            class="cursor-pointer ml-3 detail_drop"
            vs-custom-content
          >
            <div class="p-3 cursor-pointer">
              <span class="mr-2 leading-none"
                ><vs-icon
                  style="font-size: 25px"
                  icon-pack="material-icons"
                  icon="reorder"
              /></span>
            </div>

            <vs-dropdown-menu>
              <vs-dropdown-item
                v-for="(menu, index) in menuActions"
                :key="index"
                @click="menuAction(menu.action)"
              >
                <span class="flex items-center">
                  <span>{{ menu.name }}</span>
                </span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    propsData: {
      type: Object,
    },
  },
  watch: {
    propsData() {
      this.correctMenu(this.propsData);
    },
  },
  data() {
    return {
      activeTab: 0,
      menuActions: [],
      disableDropDown: false,
    };
  },
  methods: {
    menuAction(action) {
      this.disableDropDown = false;
      if (action == "createNewCardholder") {
        this.$parent.$parent.userLogPopup = false;
        this.$parent.$parent.openCardholderFunc();
        this.$parent.$parent.socket_cr = this.propsData.credential_saved;
      } else if (action == "editCardholder") {
        if (this.propsData.cardholder) {
          this.$parent.$parent.editCardholder(this.propsData.cardholder.id);
        } else {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "No Cardholder",
          });
        }
      }
    },
    correctMenu(data) {
      if (data.event_type == "CARDHOLDER-ALARM") {
        if (data.cardholder_id) {
          this.menuActions = [
            { name: " Edit cardholder", action: "editCardholder" },
          ];
        } else {
          this.menuActions = [
            { name: " Create new cardholder", action: "createNewCardholder" },
          ];
        }
        this.disableDropDown = false;
      } else if (data.event_type == "CARDHOLDER") {
        this.menuActions = [
          { name: " Edit cardholder", action: "editCardholder" },
        ];
        this.disableDropDown = false;
      } else {
        this.disableDropDown = true;
      }
    },
  },
  created() {
    this.correctMenu(this.propsData);
  },
};
</script>

<style lang="scss" scoped>
.events_popup_inner {
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

  .event_user_info_inners {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;

    .user_info {
      padding: 0 10px;
      flex: 0 0 66.666666%;
      max-width: 66.666666%;
    }
  }

  .card__img {
    flex: 1;
    width: 100%;
    height: auto;
    display: flex;
    img {
      display: block;
      object-fit: contain;
      width: 100%;
    }
  }

  .flex_itemss {
    display: flex;
    align-items: center;
  }
  .user_info_block {
    position: relative;
    display: flex;
    align-items: flex-start;
    // min-height: 280px;
    .detail_drop {
      position: absolute;
      top: -3px;
      right: 0px;
    }
    .con-ul-tabs > div {
      flex: 1;
    }
  }
  .date_time_info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    img {
      max-width: 100%;
      max-height: 180px;
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
      display: block;
    }
  }
  .card__img {
    img {
      max-width: 100%;
      max-height: 180px;
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
      display: block;
    }
  }
  .ev_user_images {
    padding: 0 !important;
  }
  .event_user_info_inners {
    .user_info {
      flex: 0 0 100%;
      max-width: 100%;
      padding: 0 !important;
    }
  }
}
.info_images {
  max-width: 33%;
  flex: 0 0 33%;
  .table_image {
    margin-bottom: 10px;
  }
}
.info_main {
  max-width: 400px;
  flex: 0 0 76%;
  padding-left: 30px;
  &.empty_card {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
}
.min__height {
  min-height: unset !important;
}
.custom_position {
  top: -40px !important;
}
</style>

<style lang="scss">
.event__details_popup {
  .vs-popup {
    width: 625px;
    max-width: 100%;
    // min-height: 490px;
  }
}
.user_info_block {
  .vs-tabs--content {
    padding: 0 15px 5px 10px !important;
  }
}
</style>
