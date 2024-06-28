<template>
  <div>
    <vx-card class="mt-base card_theme add_cr_credential" no-shadow>
      <div class="vx-row">
        <vs-tabs>
          <vs-tab label="Automatic input">
            <div>
              <div class="vx-col w-full">
                <label for="" class="vs-input--label">Type</label>
                <v-select :options="sensor_types_automatic" class="w-full select_padding" placeholder="Type"
                  :reduce="(credental_type) => credental_type.id" v-model="edit_credental.type"
                  :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <div class="device_part mt-2">
                  <label for="" class="vs-input--label">Device</label>

                  <v-select :options="devices" class="w-full select_padding" placeholder="Input mode"
                    v-validate="'required'" name="input_mode" v-model="edit_credental.access_point"
                    :reduce="(input_mode) => input_mode.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                </div>

                <div class="vx-col md:w-full mt-4">
                  <vs-button @click="addAutomaticCredential" color="success" class="w-full">Add credential</vs-button>
                </div>

                <div class="vx-col md:w-full mt-4 wainting_code" v-if="showWaitingCode">
                  Wainting for code {{ codeTimer }}
                </div>
                <div class="vx-col md:w-full mt-4 wainting_code" v-if="showCodeBlock">
                  Code {{ exists ? "already exists" : "added" }}
                </div>
              </div>
            </div>
          </vs-tab>

          <vs-tab label="Manual input">
            <div>
              <div class="vx-col w-full">
                <label for="" class="vs-input--label">Type</label>
                <v-select :options="sensor_types" class="w-full select_padding" placeholder="Type"
                  :reduce="(credental_type) => credental_type.id" v-model="credental.type"
                  :dir="$vs.rtl ? 'rtl' : 'ltr'" />
              </div>

              <div class="vx-col w-full mt-2">
                <label for="" class="vs-input--label">Input mode</label>

                <v-select :disabled="credental.type === 'vikey'" :options="input_modes" class="w-full select_padding"
                  placeholder="Input mode" v-validate="'required'" name="input_mode" v-model="credental.input_mode"
                  :reduce="(input_mode) => input_mode.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
              </div>
              <div class="flex" style="justify-content: space-between">
                <div class="vx-col md:w-1/4" v-if="credental.input_mode == 'wiegand_26' &&
                  credental.type !== 'pinpass' && credental.type !== 'vikey'
                  ">
                  <vs-input class="w-full mt-4" label="Facility" name="facility" v-model="credental.facility"
                    @input="checkNumber($event, 'facility')" />
                </div>
                <div class="vx-col md:w-2/3" v-if="credental.input_mode == 'wiegand_26' &&
                  credental.type !== 'pinpass' && credental.type !== 'vikey'
                  ">
                  <vs-input class="w-full mt-4" label="Card number" name="card_number" v-model="credental.card_number"
                    @input="checkNumber($event, 'card_number')" />
                </div>
              </div>

              <div class="vx-col md:w-full" v-if="credental.input_mode == 'serial_number' &&
                credental.type !== 'pinpass' && credental.type !== 'vikey'
                ">
                <vs-input class="w-full mt-4" label="Serial number" name="serial_number" v-model="credental.serial_number"
                  @input="checkNumber($event, 'serial_number')" />
              </div>

              <div class="vx-col w-full" v-if="credental.type == 'pinpass'">
                <vs-input class="w-full mt-4 pinpass" label="Input pinpass (4-8 digits)" type="text" name="pinpass"
                  v-validate="'validatePinnPass|min:4|max:8'" min="4" max="8" @input="checkPinn(credental.pin_pass)"
                  v-model="credental.pin_pass" />
                <!-- v-validate="'min:4|max:8'" -->
                <span class="text-danger text-sm" v-show="errors.has('pinpass')">{{ errors.first("pinpass") }}</span>
              </div>

              <div class="vx-col w-full" v-if="credental.type == 'vikey'"></div>

              <!-- <div class="vx-col w-full" v-if="credental.type == 'phone_bt'">
                <span> https://www.zhihu.com/org/ke-pa-ren-lian-shi-bie </span>
              </div> -->

              <div class="vx-col md:w-full mt-4">
                <!-- :disabled="" -->
                <vs-button @click="addManualCredential" color="success" class="w-full">Add credential</vs-button>
              </div>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>

      <div class="vx-col md:w-full mt-5">
        <Table class="add_credentiall" :items="credentials" :headers="credental_headers" :actions="false"
          :contextMenu="true" :contextMenuActions="contextMenuActions" @delete="deleteRecord($event)"
          @getCode="getCode($event)" />
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Table from "@/components/custom/table/CredentialTable";
import { ValidatePinnPass } from "@/functions/IP_validator.js";

export default {
  props: {
    rowsPopup: {
      type: Boolean,
    },
  },
  components: {
    vSelect,
    Table,
  },
  created() {
    this.credentials = [
      ...this.$store.state.cardholder.cardholder_info.credentials,
    ];

    this.$store.dispatch("cardholder/fetchCredentialTypes").then((res) => {
      this.sensor_types = res;
    });

    this.$http
      .get("/accessPoint", {
        headers: { Authorization: localStorage.token },
        params: { status: "active" },
      })
      .then((res) => {
        if (res.data.length) {
          this.devices = res.data.map((item) => {
            return {
              label: item.name,
              id: item.id,
            };
          });
        }
      });
    this.$root.$on("getCredential", (data) => {
      if (
        this.waitingData &&
        data.access_point === this.waitingData.access_point &&
        this.codeTimer
      ) {
        this.showWaitingCode = false;
        clearInterval(this.downloadTimer);
        this.codeTimer = 0;
        this.showCodeBlock = true;

        const findCr = this.credentials.find(
          (c) => c.code === data.code || c.fake_code === data.code
        );
        if (!findCr) {
          this.waitingData.code = data.code;
          this.waitingData.fake_code = data.code;

          setTimeout(() => {
            this.credentials.push(this.waitingData);
            let arr = JSON.parse(JSON.stringify(this.credentials));
            if (arr.length) {
              arr.forEach((cr, index) => {
                cr.id = index + 1;
              });
            }
            this.credentials = [];
            this.credentials = arr;

            this.$store.commit(
              "cardholder/SET_CREDENTIAL_INFO",
              JSON.parse(JSON.stringify(this.credentials))
            );

            this.showCodeBlock = false;

            this.waitCodeTimer();
          }, 2000);
        } else {
          if (this.showCodeBlock) {
            this.exists = true;
          }
          setTimeout(() => {
            this.showCodeBlock = false;
          }, 2000);
        }
      }
    });

    this.$validator.extend("validatePinnPass", {
      getMessage: (field) => field + " not valid",
      validate: (value) => {
        return ValidatePinnPass(value);
      },
    });
  },
  methods: {
    addManualCredential() {
      const data = this.credental;

      if (!data.type) {
        this.$vs.notify({
          color: "danger",
          title: "No selected type",
        });
        return false;
      }

      if (!data.input_mode && data.type !== 'vikey') {
        this.$vs.notify({
          color: "danger",
          title: "No selected mode",
        });
        return false;
      }


      if (data.type === "rfid") {
        let hash;
        let code_ = "";
        if (data.input_mode === "serial_number") {
          code_ = data.serial_number;
        } else if (
          data.input_mode === "wiegand_26" &&
          data.facility &&
          data.card_number
        ) {
          code_ = data.card_number;
        } else if (data.input_mode === "pin_pass") {
          code_ = data.pin_pass;
        }

        let findSameCode = false
        if (data.input_mode === "wiegand_26") {
          findSameCode = this.credentials.find((c) => c.code === code_ && c.facility === data.facility);
        } else {

          findSameCode = this.credentials.find((c) => c.code === code_);
        }

        const obj = {};

        if (!findSameCode) {
          if (data.input_mode === "serial_number") {
            if (data.serial_number) {
              obj.code = data.serial_number;
              obj.fake_code = obj.code;
              const serial_number = +data.serial_number;

              hash = serial_number.toString(16);
            }
          } else if (
            data.input_mode === "wiegand_26" &&
            data.facility &&
            data.card_number
          ) {
            obj.code = data.card_number;
            obj.fake_code = obj.code;

            if (data.facility) {
              obj.facility = data.facility;

              obj.fake_code = `${data.facility}. ${obj.fake_code}`;
            }

            const facility = +data.facility;
            const card_number = +data.card_number;

            hash = facility.toString(16) + card_number.toString(16);
          } else if (data.input_mode === "pin_pass") {
            obj.code = data.pin_pass;
            obj.fake_code = obj.code;
          } else {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Please fill all fields ",
            });
            return false;
          }
          if (hash.length <= 14) {
            if (data.type) {
              obj.type = data.type;
              obj.type_show = obj.type
            }

            if (data.input_mode) {
              obj.input_mode = data.input_mode;
            }

            this.credentials.push(obj);

            this.credentials.forEach((cr, index) => {
              cr.id = index + 1;
            });
            this.$store.commit("cardholder/SET_CREDENTIAL_INFO", [
              ...this.credentials,
            ]);
            // this.credental = {};
          } else {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Code is too long",
            });
          }
        } else {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "Duplicate code",
          });
          return false;
        }
      } else {
        const data = this.credental;
        if (
          (data.type === "pinpass" &&
            (this.errors.has("pinpass") || !data.pin_pass) || (
              data.type !== "pinpass" && data.input_mode !== 'serial_number' && (!data.facility || !data.card_number)
            )) && data.type !== 'vikey'
        ) {
          this.$vs.notify({
            color: "danger",
            title: "Invalid parameters",
          });
          return false;
        }



        const obj = {};
        if (data.type) {
          obj.type = data.type;
          obj.type_show = data.type === 'vikey' ? 'web_pass' : data.type
          // obj.type = data.type === 'vikey' ? 'web_pass' : data.type;
        }

        if (data.type === 'pinpass') {
          obj.code = data.pin_pass
          obj.fake_code = obj.code;
        } else {
          if (data.input_mode !== 'serial_number') {
            obj.code = data.card_number
          } else {
            obj.code = data.serial_number
          }
          obj.fake_code = obj.code;
        }

        if (data.input_mode !== 'serial_number' && data.facility && data.type !== 'pinpass') {
          obj.facility = data.facility;
          obj.fake_code = `${data.facility}. ${obj.fake_code}`;
        }

        if (data.input_mode) {
          obj.input_mode = data.input_mode;
        }


        let findSameCode = false

        if (data.input_mode === "wiegand_26") {
          findSameCode = this.credentials.find((c) => c.code === obj.code && c.facility === data.facility);
        } else {
          findSameCode = this.credentials.find((c) => c.code === obj.code);
        }

        if (findSameCode) {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "Duplicate code",
          });
          return false;
        }



        if (data.type === 'vikey') {
          obj.facility = null;
          obj.fake_code = null;
          obj.code = null;
        }

        this.credentials.push(obj);

        this.credentials.forEach((cr, index) => {
          cr.id = index + 1;
        });
        this.$store.commit("cardholder/SET_CREDENTIAL_INFO", [
          ...this.credentials,
        ]);
        // this.credental = {};
      }
    },
    addAutomaticCredential() {
      const data = this.edit_credental;
      if (!data.type || !data.access_point) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Please fill required fields",
        });
        return false;
      } else {
        const obj = {
          type: data.type,
          code: null,
          fake_code: null,
          mode: this.input_type,
          access_point: data.access_point,
        };

        this.waitingData = obj;

        this.waitCodeTimer();
      }
    },
    waitCodeTimer() {
      clearInterval(this.downloadTimer);
      this.showWaitingCode = true;
      this.downloadTimer = null;
      this.exists = false;
      var timeleft = 10;
      this.codeTimer = 10;
      this.downloadTimer = setInterval(() => {
        if (timeleft <= 1) {
          clearInterval(this.downloadTimer);
          this.showWaitingCode = false;
          this.codeTimer = 0;
        } else {
          timeleft -= 1;
          this.codeTimer = timeleft;
        }
      }, 1000);
    },

    deleteRecord(event) {
      this.deletedItem = event;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete credential`,
        accept: this.deleteCredential,
        acceptText: "Delete",
      });
    },
    deleteCredential() {
      let arr = [...this.credentials];
      const credentalIndex = arr.findIndex((u) => u.id == this.deletedItem.id);
      arr.splice(credentalIndex, 1);

      if (arr.length) {
        arr.forEach((cr, index) => {
          cr.id = index + 1;
        });
      }
      this.credentials = arr;

      this.$store.commit(
        "cardholder/SET_CREDENTIAL_INFO",
        JSON.parse(JSON.stringify(this.credentials))
      );
    },
    modeChanged() {
      if (this.credental.input_mode === "wiegand_26") {
        this.credental.serial_number = null;
      } else if (this.credental.input_mode === "serial_number") {
        this.credental.facility = null;
        this.credental.card_number = null;
      }
    },
    checkPinn(pin_pass) {
      this.credental.pin_pass = pin_pass.replace(/\D/g, "");

      if (
        this.credental.pin_pass.length > 4 &&
        this.credental.pin_pass.length < 9
      ) {
        this.$validator.reset();
      }
    },
    checkNumber(value, field) {
      const val = value.replace(/\D/g, "");
      return (this.credental[field] = val);
      // return (this.credental[field] = value.replace(/[^+0-9]/g, ""));
    },
  },
  data() {
    return {
      credental: {},
      edit_credental: {},
      credentials: [],
      avatarSrc: "/no_car.svg",
      selecteds: [],

      sensor_types: [],
      input_modes: [
        { label: "Wiegand 26", id: "wiegand_26" },
        { label: "Serial number", id: "serial_number" },
      ],
      credental_headers: [
        {
          name: "#",
          key: "id",
        },
        {
          name: "Type",
          key: "type_show",
        },
        {
          name: "Code",
          key: "fake_code",
        },
        {
          name: "Status",
          key: "status",
        },
      ],
      deletedItem: null,
      id: 1,
      contextMenuActions: [{ name: "Delete", action: "delete" }],
      input_type: "manual",
      devices: [],
      codeTimer: 10,
      showWaitingCode: false,
      waitingData: {},
      downloadTimer: null,
      showCodeBlock: false,
      exists: false,
    };
  },
  computed: {
      sensor_types_automatic(){



    const without_web_pass = this.sensor_types.filter((i)=> i.id != "vikey");

     

    return without_web_pass;


    }
  }
  // watch: {
  //   "credental.input_mode"(input_mode) {
  //     if (input_mode === "wiegand_26") {
  //       this.credental.serial_number = null;
  //     } else if (input_mode === "serial_number") {
  //       this.credental.facility = null;
  //       this.credental.card_number = null;
  //     }
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.checkbox_block {
  flex: 0 0 100%;
}

.car_event_block {
  margin-top: 10px;
  align-items: center;
}
</style>

<style lang="scss">
.add_credentiall {
  tbody td {
    padding: 0 15px !important;
  }

  .vs-con-tbody.vs-table--tbody {
    max-height: 300px;
  }
}

.credential__type {
  display: flex;
  border: 1px solid #cccccc;
  border-radius: 4px;

  .type {
    text-align: center;
    width: 50%;
    padding: 6px;
    font-weight: 500;
    cursor: pointer;

    &.selected {
      background: #cccccc;
    }
  }

  .automatic_cr {
    border-right: 1px solid #cccccc;
  }
}

.add_cr_credential {
  .con-vs-tabs {
    overflow: visible;

    .con-slot-tabs {
      overflow: visible;
    }
  }

  .wainting_code {
    text-align: center;
    padding: 10px 0;
    border: 1px solid #cccccc;
    border-radius: 4px;
  }
}
</style>
