<template>
  <div class="guest_key_page">
    <vs-popup class="holamundo " title="Permanent key" :active.sync="permanent_key_popup" v-if="permanent_key_popup">
      <PermanentKey :points="points" @setKey="permanentData = $event" />
      <div class="vx-row mt-3">
        <div class="vx-col w-1/2">
          <vs-button class="w-full unimacs_cancel_button" @click="permanent_key_popup = false">Cancel</vs-button>
        </div>
        <div class="vx-col w-1/2">
          <vs-button @click="setPermamentKey" class="w-full unimacs_button">Apply</vs-button>
        </div>
      </div>
    </vs-popup>

    <vs-popup class="holamundo " title="Temporary key" :active.sync="temporary_key_popup" v-if="temporary_key_popup">
      <TemporaryKey :durations="durations" :points="points" @setKey="temporaryData = $event" />
      <div class="vx-row mt-3">
        <div class="vx-col w-1/2">
          <vs-button class="w-full unimacs_cancel_button" @click="temporary_key_popup = false">Cancel</vs-button>
        </div>
        <div class="vx-col w-1/2">
          <vs-button @click="setTemporaryKey" class="w-full unimacs_button">Apply</vs-button>
        </div>
      </div>
    </vs-popup>

    <vs-popup class="holamundo " title="Edit Temporary key" :active.sync="edit_temporary_key_popup"
      v-if="edit_temporary_key_popup">
      <EditTemporaryKey :durations="durations" :points="points" @setKey="editTemporaryData = $event" />
      <div class="vx-row mt-3">
        <div class="vx-col w-1/2">
          <vs-button class="w-full unimacs_cancel_button" @click="edit_temporary_key_popup = false">Cancel</vs-button>
        </div>
        <div class="vx-col w-1/2">
          <vs-button @click="setEditTemporaryKey" class="w-full unimacs_button">Apply</vs-button>
        </div>
      </div>
    </vs-popup>

    <vs-popup class="holamundo " title="Edit Permanent key" :active.sync="edit_permanent_key_popup"
      v-if="edit_permanent_key_popup">
      <EditPermanentKey :durations="durations" :points="points" @setKey="editPermanentData = $event" />
      <div class="vx-row mt-3">
        <div class="vx-col w-1/2">
          <vs-button class="w-full unimacs_cancel_button" @click="edit_permanent_key_popup = false">Cancel</vs-button>
        </div>
        <div class="vx-col w-1/2">
          <vs-button @click="setEditPermamentKey" class="w-full unimacs_button">Apply</vs-button>
        </div>
      </div>
    </vs-popup>

    <div class="vx-card p-6">
      <div class="vx-row guest_actions_block">
        <div class="vx-col w-1/6">
          <v-select v-model="itemsCount" :options="[10, 20, 50, 100, 200]" class="select_padding" name="guest"
            placeholder="Guest Limit" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        </div>
        <div class="vx-col">
          <vs-dropdown vs-trigger-click class="cursor-pointer ml-3" vs-custom-content>
            <div class="p-3 cursor-pointer">
              <span class="leading-none">
                <vs-button class="unimacs_button unimacs_add_new_btn">
                  <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" />Add
                  New
                </vs-button>
              </span>
            </div>

            <vs-dropdown-menu class="guest_dropdown">
              <vs-dropdown-item @click.prevent="temporary_key_popup = true">
                <span class="flex items-center">
                  <span>Temporary key</span>
                </span>
              </vs-dropdown-item>

              <!-- <vs-dropdown-item @click.prevent="permanent_key_popup = true">
                <span class="flex items-center">
                  <span>Permanent key</span>
                </span>
              </vs-dropdown-item> -->
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </div>

      <div class="vx-row">
        <div class="vx-col w-full">
          <Table class="guest_multi_table" :items="guest_keys" :headers="guest_table_headers" :search="true"
            :statusMode="'acu'" :pagination="true" :actions="false" :contextMenu="true"
            :contextMenuActions="contextMenuActions" @share="shareKey($event)" @delete="deleteKey($event)"
            @edit="editKey($event)" @updateItem="editKey($event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Table from "../../components/custom/table/GuestTable";
import TemporaryKey from "./components/TemporaryKey";
import EditTemporaryKey from "./components/EditTemporaryKey";
import PermanentKey from "./components/PermanentKey";
import EditPermanentKey from "./components/EditPermanentKey";
import moduleCardholder from "@/store/cardholder/moduleCardholder.js";
import moduleAccessPoint from "@/store/access-point/moduleAccessPoint";

export default {
  data() {
    return {
      itemsCount: 10,
      points: [],
      guest_table_headers: [
        { key: "count", name: "#" },
        // { key: "discharged", name: "Discharged" },
        { key: "first_name", name: "Key name" },
        { key: "period", name: "Period" },
        { key: "key_type", name: "Key type" },
        // { key: "room", name: "Room" },
      ],
      temporary_key_popup: false,
      permanent_key_popup: false,
      edit_permanent_key_popup: false,
      edit_temporary_key_popup: false,
      permanentData: null,
      temporaryData: null,
      editTemporaryData: null,
      editPermanentData: null,

      contextMenuActions: [
        { name: "Share", action: "share" },
        { name: "Edit", action: "edit" },
        { name: "Delete", action: "delete" },
      ],
      durations: [],
    };
  },

  methods: {
    setTemporaryKey() {
      const payload = {
        first_name: this.temporaryData.first_name,
        // status: this.temporaryData.status,
        access_points: this.temporaryData.access_points,
        key_type: "temporary",
        period: this.temporaryData.period,
        duration: this.temporaryData.duration,

      };

      if (payload.period === "days") {
        const concatStart = this.temporaryData.start_date + ' ' + this.temporaryData.start_time
        const concatEnd = this.temporaryData.end_date + ' ' + this.temporaryData.end_time

        payload.start_timestamp = new Date(concatStart).getTime();
        payload.end_timestamp = new Date(concatEnd).getTime();
      } else {
        const concatStart = this.temporaryData.start_date + ' ' + this.temporaryData.start_time
        payload.start_timestamp = new Date(concatStart).getTime();
      }
      this.$store.dispatch("cardholder/createGuestKey", payload).then((res) => {
        this.temporary_key_popup = false;

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Guest cardholder created",
        });
      });
    },
    setPermamentKey() {
      const payload = {
        first_name: this.permanentData.first_name,
        access_points: this.permanentData.access_points,
        selected_access_point: this.permanentData.selected_access_point,
        set_key: this.permanentData.set_key,
        start_time: this.permanentData.start_time,
        end_time: this.permanentData.end_time,
        key_type: "permanent",
      };

      let days_of_week = [];

      let dayOfWeek = this.permanentData.days_of_week;

      for (const i in dayOfWeek) {
        if (dayOfWeek[i]) {
          days_of_week.push(+i);
        }
      }

      payload.days_of_week = days_of_week;

      this.$store.dispatch("cardholder/createGuestKey", payload).then((res) => {
        this.editKey(res.data);
        this.permanent_key_popup = false;

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Guest cardholder created",
        });
      });
    },
    setEditTemporaryKey() {
      const payload = {
        id: this.editTemporaryData.id,
        first_name: this.editTemporaryData.first_name,
        access_points: this.editTemporaryData.access_points,
        key_type: "temporary",
        period: this.editTemporaryData.period,
        duration: this.editTemporaryData.duration,
        // start_time: this.editTemporaryData.start_time,
      };
      if (payload.period === "days") {
        const concatStart = this.editTemporaryData.start_date + ' ' + this.editTemporaryData.start_time
        const concatEnd = this.editTemporaryData.end_date + ' ' + this.editTemporaryData.end_time

        payload.start_timestamp = new Date(concatStart).getTime();
        payload.end_timestamp = new Date(concatEnd).getTime();
      } else {
        const concatStart = this.editTemporaryData.start_date + ' ' + this.editTemporaryData.start_time
        payload.start_timestamp = new Date(concatStart).getTime();
      }

      this.$store.dispatch("cardholder/updateGuestKey", payload).then((res) => {
        this.edit_temporary_key_popup = false;

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Guest cardholder updated",
        });
      });
    },
    setEditPermamentKey() {
      const payload = {
        id: this.editPermanentData.id,
        first_name: this.editPermanentData.first_name,
        access_points: this.editPermanentData.access_points,
        selected_access_point: this.editPermanentData.selected_access_point,
        set_key: this.editPermanentData.set_key ? true : false,
        start_time: this.editPermanentData.start_time,
        end_time: this.editPermanentData.end_time,
        key_type: "permanent",
      };

      let days_of_week = [];

      let dayOfWeek = this.editPermanentData.days_of_week;

      for (const i in dayOfWeek) {
        if (dayOfWeek[i]) {
          days_of_week.push(+i);
        }
      }

      payload.days_of_week = days_of_week;
      this.$store.dispatch("cardholder/updateGuestKey", payload).then((res) => {
        this.edit_temporary_key_popup = false;

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Guest cardholder updated",
        });
      });
    },
    shareKey(guest) {
      if (guest.credentials.length) {
        const url = `${process.env.VUE_APP_FRONT_URL}/guest/credential/${guest.credentials[0].token}`;
        this.copyStringToClipboard(url);

        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Credential copied",
        });
      }
    },
    deleteKey(guest) {
      this.deletedGuest = guest;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${guest.first_name} guest `,
        accept: this.deleteGuestCardholder,
        acceptText: "Delete",
      });
    },
    deleteGuestCardholder() {
      this.$store
        .dispatch("cardholder/deleteGuestCardholder", this.deletedGuest.id)
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Guest cardholder deleted",
          });
        });
    },
    editKey(data) {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("accessPoint/fetchAccessPointCardholder")
        .then((res) => {
          const points = [...res.data];
          this.points = points.map((p) => {
            p.label = p.access_points.name;
            p.id = p.access_point;
            return p;
          });
        });

      this.$store
        .dispatch("cardholder/fetchCardholder", data.id)
        .then((res) => {
          if (res.data.key_type && res.data.key_type === "temporary") {
            this.editTemporaryData = res.data;
            this.edit_temporary_key_popup = true;
          } else if (res.data.key_type && res.data.key_type === "permanent") {
            this.editPermanentData = res.data;
            this.edit_permanent_key_popup = true;
          }
          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
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
  },
  computed: {
    guest_keys() {
      return this.$store.state.cardholder.guests;
    },
  },
  created() {
    if (!moduleCardholder.isRegistered) {
      this.$store.registerModule("cardholder", moduleCardholder);
      moduleCardholder.isRegistered = true;
    }

    if (!moduleAccessPoint.isRegistered) {
      this.$store.registerModule("accessPoint", moduleAccessPoint);
      moduleAccessPoint.isRegistered = true;
    }

    this.$store
      .dispatch("accessPoint/fetchAccessPointCardholder")
      .then((res) => {
        const points = [...res.data];
        this.points = points.map((p) => {
          p.label = p.access_points.name;
          p.id = p.access_point;
          return p;
        });
      });

    this.$http
      .get("cardholder/guestsTimeKeys", {
        headers: { Authorization: localStorage.token },
      })
      .then((response) => {
        const data = response.data;

        this.durations = data.time_keys ? data.time_keys.split(",") : [];
      });

    this.$store.dispatch("cardholder/fetchGuestKeys").then((res) => { });
  },
  components: {
    vSelect,
    Table,
    TemporaryKey,
    PermanentKey,
    EditTemporaryKey,
    EditPermanentKey,
  },
};
</script>

<style lang="scss">
@import "./guestKey.scss";
</style>
