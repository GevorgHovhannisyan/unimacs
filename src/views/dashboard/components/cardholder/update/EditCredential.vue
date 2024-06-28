<template>
  <div>
    <!-- title="Credentials" -->
    <vx-card class="mt-base card_theme edit_cr_credential" no-shadow>
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

              <div class="vx-col w-full mt-4">
                <label for="" class="vs-input--label">Input mode</label>

                <v-select :options="input_modes" class="w-full select_padding" placeholder="Input mode"
                  v-validate="'required'" name="input_mode" v-model="credental.input_mode"
                  :reduce="(input_mode) => input_mode.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
              </div>
              <div class="flex" style="justify-content: space-between">
                <div class="vx-col md:w-1/4" v-if="credental.input_mode == 'wiegand_26' &&
                  credental.type !== 'pinpass'
                  ">
                  <vs-input class="w-full mt-4" label="Facility" name="facility" v-model="credental.facility"
                    @input="checkNumber($event, 'facility')" />
                </div>

                <div class="vx-col md:w-2/3" v-if="credental.input_mode == 'wiegand_26' &&
                  credental.type !== 'pinpass'
                  ">
                  <vs-input class="w-full mt-4" label="Card number" name="card_number" v-model="credental.card_number"
                    @input="checkNumber($event, 'card_number')" />
                </div>
              </div>

              <div class="vx-col md:w-full" v-if="credental.input_mode == 'serial_number' &&
                credental.type !== 'pinpass'
                ">
                <vs-input class="w-full mt-4" label="Serial number" name="serial_number" v-model="credental.serial_number"
                  @input="checkNumber($event, 'serial_number')" />
              </div>

              <div class="vx-col w-full" v-if="credental.type == 'pinpass'">
                <vs-input class="w-full mt-4 pinpass" label="Input pinpass (4-8 digits)" type="number" name="pinpass"
                  v-validate="'min:4|max:8'" v-model="credental.pin_pass" />
                <span class="text-danger text-sm" v-show="errors.has('pinpass')">{{ errors.first("pinpass") }}</span>
              </div>

              <div class="vx-col w-full" v-if="credental.type == 'vikey'"></div>

              <!-- <div class="vx-col w-full" v-if="credental.type == 'phone_bt'">
                <span> https://www.zhihu.com/org/ke-pa-ren-lian-shi-bie </span>
              </div> -->

              <div class="vx-col md:w-full mt-10">
                <vs-button @click="addManualCredential" color="success" class="w-full">Add credential</vs-button>
              </div>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
      <div class="vx-col md:w-full mt-5">
        <div class="code_part" v-if="link_code">
          <span class="code_text">
            {{ link_code.code }}
          </span>
          <span>
            <vs-icon class="copy_icon" @click="link_code.type == 'vikey' ? copyCode(link_code) : false"
              icon-pack="material-icons" icon="content_copy" />
          </span>
        </div>
        <div class="vx-col md:w-full mt-2 mb-4 copied_parent" v-if="showCopied">
          <span class="copied_part">
            <vs-icon class="check__icon" icon-pack="material-icons" icon="done" />
            Copied</span>
        </div>

        <Table class="edit_credentiall" :items="credentals" :headers="credental_headers" :actions="false"
          :contextMenu="true" :contextMenuActions="contextMenuActions" @delete="deleteRecord($event)"
          @share="share($event)" @stolen="stolen($event)" @lost="lost($event)" @getCode="getCode($event)" />

        <div class="vx-col md:w-full mt-2 mb-4 copied_parent" v-if="showShared">
          <span class="copied_part">
            <vs-icon class="check__icon" icon-pack="material-icons" icon="done" />
            Copied</span>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Table from "@/components/custom/table/CredentialTable";
export default {
  components: {
    vSelect,
    Table,
  },
  created() {
    // this.initValues();
    this.$store.dispatch("cardholder/fetchCredentialTypes").then((res) => {
      this.sensor_types = res;
    });
    this.initTable();

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

        const findCr = this.credentals.find((c) => c.code === data.code);
        if (!findCr) {
          this.waitingData.code = data.code;
          this.waitingData.new_cr = true;

          setTimeout(() => {
            this.credentals.push(this.waitingData);
            let arr = JSON.parse(JSON.stringify(this.credentals));

            if (arr.length) {
              arr.forEach((cr, index) => {
                cr.count = index + 1;
              });
            }
            this.credentals = [];
            this.credentals = arr;

            this.$store.commit(
              "cardholder/SET_EDIT_CREDENTIAL_INFO",
              JSON.parse(JSON.stringify(this.credentals))
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

    this.$root.$on("refreshCredentials", () => {
      this.initTable();
    });
  },
  methods: {
    initTable() {
      let arr = [...this.edit_data];
      if (arr.length) {
        arr.forEach((cr, index) => {
          if (cr.code) {
            cr.fake_code = cr.code;
          }
          if (cr.facility) {
            cr.fake_code = `${cr.code} (${cr.facility})`;
          }
          cr.count = index + 1;
        });
      }
      this.credentals = arr;
    },
    getCode(event) {
      if (event.type == "vikey") {
        this.link_code = {
          type: event.type,
          code: `${window.location.origin}/credential/${event.code}`,
        };
      }
    },
    copyCode() {
      const area = document.querySelector(".code_text");
      const text = area.innerText;

      this.copyStringToClipboard(text);
      this.showCopied = true;
      setTimeout(() => {
        this.showCopied = false;
      }, 2000);
    },
    copyStringToClipboard(str) {
      var el = document.createElement("textarea");
      el.value = str;
      el.setAttribute("readonly", "");
      el.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
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
          findSameCode = this.credentals.find((c) => c.code === code_ && c.facility === data.facility);
        } else {
          findSameCode = this.credentals.find((c) => c.code === code_);
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
            }

            obj.new_cr = true;

            if (data.input_mode) {
              obj.input_mode = data.input_mode;
            }

            this.credentals.push(obj);
            let arr = [...this.credentals];
            if (arr.length) {
              arr.forEach((cr, index) => {
                cr.count = index + 1;
              });
            }
            this.credentals = arr;
            this.$store.commit("cardholder/SET_EDIT_CREDENTIAL_INFO", [
              ...this.credentals,
            ]);
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
        obj.new_cr = true;

        if (data.type) {
          obj.type = data.type;
          obj.type_show = data.type === 'vikey' ? 'web_pass' : data.type
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
          findSameCode = this.credentals.find((c) => c.code === obj.code && c.facility === data.facility);
        } else {
          findSameCode = this.credentals.find((c) => c.code === obj.code);
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
        this.credentals.push(obj);
        let arr = [...this.credentals];
        if (arr.length) {
          arr.forEach((cr, index) => {
            cr.count = index + 1;
          });
        }
        this.credentals = arr;
        this.$store.commit("cardholder/SET_EDIT_CREDENTIAL_INFO", [
          ...this.credentals,
        ]);

        // this.credental = {};
      }
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
    checkNumber(value, field) {
      const val = value.replace(/\D/g, "");

      return (this.credental[field] = val);
    },
    deleteCredential() {
      if (this.deletedItem.new_cr) {
        const credentalIndex = this.credentals.findIndex(
          (u) => u.id == this.deletedItem.id
        );
        this.credentals.splice(credentalIndex, 1);
        let arr = [...this.credentals];
        if (arr.length) {
          arr.forEach((cr, index) => {
            cr.count = index + 1;
          });
        }
        this.credentals = arr;
        this.$store.commit("cardholder/SET_EDIT_CREDENTIAL_INFO", [
          ...this.credentals,
        ]);
      } else {
        this.$store
          .dispatch("cardholder/deleteCredential", this.deletedItem.id)
          .then((res) => {
            const credentalIndex = this.credentals.findIndex(
              (u) => u.id == this.deletedItem.id
            );
            this.credentals.splice(credentalIndex, 1);
            let arr = [...this.credentals];
            if (arr.length) {
              arr.forEach((cr, index) => {
                cr.count = index + 1;
              });
            }
            this.credentals = arr;
            this.$store.commit("cardholder/SET_EDIT_CREDENTIAL_INFO", [
              ...this.credentals,
            ]);

            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Credential deleted",
            });
          });
      }
    },
    share(acu) {
      const code = acu.code;
      const text = code;

      this.copyStringToClipboard(text);
      this.showShared = true;
      setTimeout(() => {
        this.showShared = false;
      }, 2000);
    },
    // activate(event) {
    //   this.changeStatus(event, "active");
    // },
    stolen(event) {
      this.changeStatus(event, "stolen");
    },
    lost(event) {
      this.changeStatus(event, "lost");
    },
    initValues() {
      this.credental = {};

      this.$validator.reset();
    },
    changeStatus(event, status) {
      if (!event.new_cr) {
        const obj = {
          id: event.id,
          status: status,
        };

        this.$store.dispatch("cardholder/updateStatus", obj).then((res) => {
          const productIndex = this.credentals.findIndex(
            (p) => p.id == event.id
          );
          this.credentals[productIndex].status = res.data.status;

          this.$store.commit("cardholder/SET_EDIT_CREDENTIAL_INFO", [
            ...this.credentals,
          ]);
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Credential status updated",
          });
        });
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Credential not saved yet",
        });
      }
    },
  },
  data() {
    return {
      link_code: null,
      credental: {},
      edit_credental: {},
      credentals: [],
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
          key: "count",
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
      id: 1,
      contextMenuActions: [
        { name: "Delete", action: "delete" },
        { name: "Share", action: "share" },
        // { name: "Active", action: "activate" },
        // { name: "Inactive", action: "inactive" },
        { name: "Stolen", action: "stolen" },
        { name: "Lost", action: "lost" },
      ],
      showCopied: false,
      input_type: "manual",
      devices: [],
      codeTimer: 10,
      showWaitingCode: false,
      waitingData: {},
      downloadTimer: null,
      showCodeBlock: false,
      exists: false,
      showShared: false,
    };
  },
  computed: {
    edit_data() {
      return this.$store.state.cardholder.edit_cardholder_info.credentials;
    },
    sensor_types_automatic(){

 

const without_web_pass = this.sensor_types.filter((i)=> i.id != "vikey");

 
 
return without_web_pass;


}
  },
  watch: {
    edit_data(data) {
      this.initTable();
    },
    // "credental.input_mode"(input_mode) {
    //   if (input_mode === "wiegand_26") {
    //     this.credental.serial_number = null;
    //   } else if (input_mode === "serial_number") {
    //     this.credental.facility = null;
    //     this.credental.card_number = null;
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.checkbox_block {
  flex: 0 0 100%;
}

.card_block {
  img {
    width: 160px !important;
    height: auto !important;
  }

  button {
    margin: 5px 0 !important;
  }
}

.car_event_block {
  margin-top: 10px;
  align-items: center;
}

.copy_icon {
  cursor: pointer;
  font-size: 25px;
  margin-left: 20px;
}

.code_part {
  text-align: center;
  padding: 15px 15px;
  border: 1px solid #0000001f;
  color: #0500ffa1;
  margin-bottom: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
.edit_credentiall {
  tbody td {
    padding: 0 15px !important;
  }

  .vs-con-tbody.vs-table--tbody {
    max-height: 300px;
  }
}

.copied_parent {
  display: flex;
  justify-content: center;
}

.copied_part {
  display: flex;
  align-items: center;
  color: #0080009c;
}

.check__icon {
  font-size: 22px;
  margin-right: 5px;
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

.edit_cr_credential {
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
