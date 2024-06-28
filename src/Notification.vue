<template>
  <div>
    <table class="notif_table">
      <tr>
        <td>Date/Time:</td>
        <td>
          {{ getDate(propsData) }}
        </td>
      </tr>
      <tr>
        <td>Access Point:</td>
        <td>
          {{
              propsData.access_point_name ? propsData.access_point_name :(propsData.access_point ? propsData.access_point: "No Access Point") 
          }}
        </td>
      </tr>
      <tr>
        <td>Event:</td>
        <td>{{ propsData.event }}</td>
      </tr>
    </table>

    <div class="vx-row">
      <div class="vx-col w-1/3">
        <vs-button
          class="view_alarm unimacs_button"
          @click="$root.$emit('view_all_notifs')"
        >
          View alarm events
        </vs-button>
      </div>

      <div class="vx-col w-1/3 confirm_btn">
        <vs-button
          class="view_alarm unimacs_button"
          @click="confirmNotification"
          :disabled="propsData.confirmed !== 'Unconfirmed'"
        >
          {{ propsData.confirmed === "Unconfirmed" ? "Confirm" : "Confirmed" }}
        </vs-button>
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
  created() {},
  computed: {
    getDate() {
      return (date) => {
        const time_zone =
          date.access_points && "time_zone" in date.access_points
            ? date.access_points.time_zone
            : null;

        const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var isFirefox = typeof InstallTrigger !== "undefined";
        var isSafari =
          navigator.vendor &&
          navigator.vendor.indexOf("Apple") > -1 &&
          navigator.userAgent &&
          navigator.userAgent.indexOf("CriOS") == -1 &&
          navigator.userAgent.indexOf("FxiOS") == -1;

        var is_OSX = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

        let correct_date;
        if (isFirefox || isSafari || is_OSX) {
          const local = this.$moment
            .utc(date.createDate, "YYYY-MM-DD HH:mm:ss")
            .tz(time_zone ? time_zone : time);
          const momentFormat = this.$moment(
            local,
            "YYYY-MM-DD HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm:ss");
          correct_date = momentFormat;
        } else {
          correct_date = this.$moment(date.createDate)
            .tz(time_zone ? time_zone : time)
            .format(`YYYY-MM-DD HH:mm:ss`);
        }
        return correct_date;
        // if (date.createDate) {
        //   if (time_zone) {
        //     return this.$moment(date.createDate).tz(time_zone).format(`YYYY-MM-DD HH:mm ( dddd )`)
        //   } else {
        //     return this.$moment(date.createDate).format(`YYYY-MM-DD HH:mm ( dddd )`)
        //   }
        // } else {
        //   return this.$moment().format(`YYYY-MM-DD HH:mm ( dddd )`)
        // }
      };
    },
  },
  methods: {
    confirmNotification() {
      this.$http
        .put(
          `notification/confirm`,
          { id: this.propsData.id },
          { headers: { Authorization: localStorage.token } }
        )
        .then((res) => {
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Notification confirmed",
          });
          this.$root.$emit("confirm_notif", res.data);

          this.$emit("closeConfirmPopup");
        });
    },
  },
};
</script>

<style scoped lang="scss">
.view_alarm {
  padding: 10px 20px !important;
  border: 1px solid black;
  margin-top: 20px;
}

.confirm_btn {
  margin-left: auto;
}

.confirm_btn button {
  margin-left: auto;
  display: block;
}

.notif_table {
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
}
</style>
