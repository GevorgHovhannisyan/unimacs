<template>
  <div class="vx-row">
    <div class="vx-col w-full">
      <div class="free_slots_block">
        <div
          class="slot_item"
          v-for="(slot, index) in slotCounts.count"
          :key="index"
          :class="{
            filled: slot <= slotCounts.saved,
            bordered: slot === slotCounts.saved + 1,
            empty: slot > slotCounts.saved + 1,
          }"
        ></div>
      </div>

      <div class="vx-col w-full mt-1">
        <vs-input
          class="w-full"
          v-model="guestData.first_name"
          label="Key name"
          name="lp_number"
        />
      </div>
      <div class="vx-col w-full">
        <label for="" class="vs-input--label">Access Points</label>

        <v-select
          v-if="showAccessPoints"
          multiple
          v-model="guestData.access_points"
          @input="onChangeAccessPoints"
          :options="points"
          class="select_padding w-full"
          name="model"
          placeholder="Access Points"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :reduce="(access_point) => access_point.id"
        />
      </div>

      <div class="vx-col w-full week_d">
        <vs-checkbox
          class="week_item"
          v-for="(day, index) in weekDays"
          :key="index"
          v-model="guestData.days_of_week[day.key]"
          >{{ day.name }}</vs-checkbox
        >
      </div>
      <div class="vx-row mt-3">
        <label for="" class="vs-input--label w-full ml-4"
          >Start of action</label
        >

        <div class="vx-col w-1/2">
          <flat-pickr
            class="w-full"
            placeholder="Start of action"
            :config="configdateTimePicker"
            v-model="guestData.start_time"
          />
        </div>
        <div class="vx-col w-1/2">
          <flat-pickr
            class="w-full"
            :config="configdateTimePicker"
            v-model="guestData.end_time"
          />
        </div>
      </div>

      <div class="vx-col w-full mt-3">
        <label for="" class="vs-input--label">Select access point</label>

        <v-select
          v-model="guestData.selected_access_point"
          :options="selected_points"
          class="select_padding w-full"
          name="model"
          placeholder="Access Point"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
          :reduce="(access_point) => access_point.id"
        />
      </div>
    </div>

    <div class="vx-col w-1/2 ml-1 mt-3">
      <vs-checkbox v-model="guestData.status">Status</vs-checkbox>
    </div>

    <div class="vx-col w-full mt-3">
      <vs-button
        class="view_alarm unimacs_button w-full"
        @click="
          guestData.set_key = true;
          $parent.$parent.setEditPermamentKey();
        "
      >
        Set key
      </vs-button>
    </div>

    <div class="vx-col w-full mt-3" v-if="showKey && guest_key">
      <div class="wait_guest_code">{{ guest_key }} Key designated</div>
    </div>

    <div class="vx-col w-full mt-3" v-if="exists">
      <div class="wait_guest_code">Key already exists</div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/plugins/monthSelect/style.css";

export default {
  props: {
    points: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    guestData: {
      handler: function (data, oldVal) {
        this.$emit("setKey", data);
      },
      deep: true,
    },
  },
  data() {
    return {
      configdateDatePicker: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      configdateTimePicker: {
        enableTime: true,
        time_24hr: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "00:00:00",
        maxTime: "23:59:59",
      },
      slotCounts: {
        count: 12,
        saved: 0,
      },
      guestData: {
        status: false,
        days_of_week: {},
        access_points: [],
        duration: 0,
        start_date: "2022-02-05 14:14:14",
        start_time: "15:00:00",
        selected_access_point: null,
        set_key: false,
      },
      weekDays: [
        { name: "Mon", key: 1 },
        { name: "Tue", key: 2 },
        { name: "Wed", key: 3 },
        { name: "Thu", key: 4 },
        { name: "Fri", key: 5 },
        { name: "Sat", key: 6 },
        { name: "Sun", key: 7 },
      ],
      showAccessPoints: true,
      selected_points: [],
      codeTimer: null,
      showKey: false,
      guest_key: null,
      exists: null
    };
  },
  computed: {
    access_points() {
      return this.$store.state.access_points;
    },
    editGuestData() {
      return this.$store.state.cardholder.edit_cardholder_info;
    },
  },
  created() {
    const user = localStorage.user ? JSON.parse(localStorage.user) : null;
    if (user && user.company) {
      this.sockets.subscribe(
        `guest_set_key/${user.company}/${user.id}`,
        (payload) => {
          const data = JSON.parse(payload);

          if(data.dublicate) {
            this.exists = true;
          }

          this.showKey = true;
          this.guest_key = data.code;


        }
      );
    }

    this.$store.dispatch("cardholder/getGuestLimit").then((response) => {
      this.slotCounts.count = response.data.guest_count;
      this.slotCounts.saved = response.data.created_guests_count;
    });

    this.guestData = JSON.parse(JSON.stringify(this.editGuestData));
    this.guestData.access_points = [];

    if (
      this.guestData.access_rights &&
      this.guestData.access_rights.access_rules &&
      this.guestData.access_rights.access_rules.length
    ) {
      this.guestData.access_rights.access_rules.forEach((rule) => {
        this.guestData.access_points.push(rule.access_point);
      });
    }

    if (
      this.guestData.days_of_week &&
      JSON.parse(this.guestData.days_of_week)
    ) {
      const parseDays = JSON.parse(this.guestData.days_of_week);
      const weekDays = {};
      this.guestData.days_of_week = {};

      if (parseDays.length) {
        parseDays.forEach((day) => {
          weekDays[day] = true;
        });
      }

      this.guestData.days_of_week = weekDays;
    }

    this.setPoints();

    if (this.guestData.credentials.length) {
      this.showKey = true;
      this.guest_key = this.guestData.credentials[0].code;
    }

  },
  destroyed() {
    const user = localStorage.user ? JSON.parse(localStorage.user) : null;

    this.sockets.unsubscribe(`guest_set_key/${user.company}/${user.id}`);

    // this.sockets.subscribe(`guest_set_key
  },
  methods: {
    setPoints() {
      let selected_points = [];
      if (this.guestData.access_points) {
        for (let i = 0; i < this.guestData.access_points.length; i++) {
          const findPoint = this.points.find(
            (point) => point.id == this.guestData.access_points[i]
          );
          selected_points.push(findPoint);
        }
      }

      this.selected_points = selected_points;
    },
    onChangeAccessPoints() {
      this.showAccessPoints = false;
      setTimeout(() => {
        this.showAccessPoints = true;
      }, 0);
      if (!this.guestData.access_points.length) {
        this.guestData.selected_access_point = null;
      } else if (
        this.guestData.selected_access_point &&
        !this.guestData.access_points.includes(
          this.guestData.selected_access_point
        )
      ) {
        this.guestData.selected_access_point =
          this.guestData.access_points[0].id;
      }

      this.setPoints();
    },
  },
  components: {
    vSelect,
    flatPickr,
  },
};
</script>

<style lang="scss" >
.week_d {
  display: flex;
  justify-content: space-between;

  .week_item {
    display: flex;
    flex-direction: column-reverse;

    .checkbox_x {
      margin-left: auto;
      margin-right: auto;
    }
  }
}

.wait_guest_code {
  text-align: center;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 8px;
}
</style>