<template>
  <div class="popup_inner" v-if="userLogPopupData">
    <div class="date_time_info">
      <table>
        <tr>
          <td>Date/Time:</td>
          <td>
            {{ userLogPopupData.date ? userLogPopupData.date : "" }}
          </td>
        </tr>
        <tr>
          <td>Entry:</td>
          <td>
            {{ userLogPopupData.date ? userLogPopupData.date : "" }}
          </td>
        </tr>

        <tr>
          <td>Event:</td>
          <td>
            {{ userLogPopupData.event ? userLogPopupData.event : "" }}
          </td>
        </tr>
        <tr>
          <td v-if="userLogPopupData && userLogPopupData.cardholder">
            Direction:
          </td>
          <td>
            {{ userLogPopupData ? userLogPopupData.direction : "" }}
          </td>
        </tr>
        <tr>
          <td v-if="userLogPopupData && userLogPopupData.cardholder">
            Credential:
          </td>
          <td>
            {{
              userLogPopupData.credential
                ? getCredential(userLogPopupData.credential)
                : ""
            }}
          </td>
        </tr>
      </table>
    </div>
    <div
      class="user_info_block"
      v-if="userLogPopupData && userLogPopupData.cardholder"
    >
      <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
        <vs-tab label="Main info " icon-pack="feather" icon="icon-user">
          <div class="user_info_inner">
            <div class="car_avatar_block">
              <div class="user_image">
                <img
                  :src="getImage(userLogPopupData.cardholder)"
                  v-if="
                    userLogPopupData &&
                    userLogPopupData.cardholder.avatar &&
                    userLogPopupData.cardholder.image
                  "
                />

                <img v-else src="/no_avatar.svg" />
              </div>

              <div class="user_image car_image">
                <img
                  :src="getCarImage(userLogPopupData.cardholder)"
                  v-if="
                    userLogPopupData &&
                    userLogPopupData.cardholder.avatar &&
                    userLogPopupData.cardholder.image
                  "
                />
                <img v-else src="/no_avatar.svg" />
              </div>
            </div>

            <div class="user_info">
              <table>
                <tr>
                  <td>Name:</td>
                  <td>
                    {{
                      userLogPopupData.cardholder
                        ? userLogPopupData.cardholder.first_name
                        : ""
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Last Name:</td>
                  <td>
                    {{
                      userLogPopupData.cardholder
                        ? userLogPopupData.cardholder.last_name
                        : ""
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Family name</td>
                  <td>
                    {{
                      userLogPopupData && userLogPopupData.cardholder
                        ? userLogPopupData.cardholder.family_name
                        : ""
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Company:</td>
                  <td>
                    {{
                      userLogPopupData.cardholder
                        ? userLogPopupData.cardholder.company_name
                        : ""
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Group:</td>
                  <td>
                    {{ userLogPopupData && userLogPopupData.cardholder &&
                    userLogPopupData.cardholder.cardholder_groups ? userLogPopupData.cardholder.cardholder_groups.name: ''

                    }}
                  </td>
                </tr>
                <tr>
                  <td>Access Right:</td>
                  <td>
                    {{
                      userLogPopupData.access_right
                        ? userLogPopupData.access_right.name
                        : ""
                    }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </vs-tab>

        <!-- <vs-tab label="Extend info " icon-pack="feather" icon="icon-user">
                <div class="">
                  <div class="user_info_inner">
                    <div
                      class="user_image"
                      v-if="
                        userLogPopupData &&
                        userLogPopupData.cardholder.avatar &&
                        userLogPopupData.cardholder.image
                      "
                    >
                      <img :src="userLogPopupData.cardholder.image" />
                    </div>

                    <div class="user_info">
                      <table>
                        <tr>
                          <td>Valid due:</td>
                          <td>
                            {{
                              userLogPopupData.cardholder
                                ? userLogPopupData.cardholder.first_name
                                : ""
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>E-mai:</td>
                          <td>
                            {{
                              userLogPopupData.cardholder
                                ? userLogPopupData.cardholder.last_name
                                : ""
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Phone:</td>
                          <td>
                            {{
                              userLogPopupData.family_name
                                ? userLogPopupData.family_name
                                : ""
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Anti-passback</td>
                          <td>
                            {{
                              userLogPopupData.cardholder
                                ? userLogPopupData.cardholder.company_name
                                : ""
                            }}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </vs-tab> -->
      </vs-tabs>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userLogPopupData: {
      type: Object,
    },
  },
  data() {
    return {
      activeTab: 0,
    };
  },
  computed: {
    getImage() {
      return (cardholder) => {
        let image = "/no_avatar.svg";
        if (cardholder && cardholder.avatar) {
          const avatar = JSON.parse(cardholder.avatar);
          image = `${process.env.VUE_APP_BACK}/${avatar.path}`;
        }

        return image;
      };
    },
    getCarImage() {
      return (cardholder) => {
        let image = "/no_avatar.svg";
        if (cardholder && cardholder.car_infos && cardholder.car_infos.avatar) {
          const avatar = JSON.parse(cardholder.car_infos.avatar);
          image = `${process.env.VUE_APP_BACK}/${avatar.path}`;
        }
        return image;
      };
    },
    getCredential() {
      return (credential) => {
        let code_;
        if (credential.type) {
          const hex_code = credential.code.replace(/ /g, "");
          const code = BigInt("0x" + hex_code).toString();

          code_ = `${credential.type} ` + `( ${code} )`;
        } else if (credential.code) {
          const hex_code = credential.code.replace(/ /g, "");
          const code = BigInt("0x" + hex_code).toString();
          code_ = `rfid ( ${code} )`;
        }

        return code_;
      };
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.user_image {
  width: 50%;
  margin-top: 10px;
  img {
    width: 100% !important;
  }
}

.car_image {
  margin-left: 5px;
}

.car_avatar_block {
  display: flex;
  width: 50%;
  align-items: center;
}
</style>
