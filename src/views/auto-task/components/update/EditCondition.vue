<template>
  <div class="vx-row">
    <vs-popup class="holamundo condition_popup" title="Task" :active.sync="conditionPopup">
      <div class="vx-row">
        <div class="vx-col w-full">
          <label for="" class="vs-input--label mt-4">Condition Type</label>

          <v-select :options="condition_types" v-model="condition.condition_type" :reduce="(type) => type.id"
            placeholder="Condition Type" class="select_padding w-full" :selectable="(option) => !option.disabled" />
        </div>

        <div class="vx-col w-1/2 mt-4" v-if="condition.condition_type === 'time'">
          <label for="" class="vs-input--label mt-4">Period start</label>

          <flat-pickr class="w-full" :config="configdateTimePicker" placeholder="Period start"
            v-model="condition.TmBeginCondition" />
        </div>

        <div class="vx-col w-1/2 mt-4" v-if="condition.condition_type === 'time'">
          <label for="" class="vs-input--label mt-4">Period end</label>

          <flat-pickr class="w-full" :config="configdateTimePicker" placeholder="Period end"
            v-model="condition.TmEndCondition" />
        </div>

        <div class="vx-col w-1/2 mt-4" v-if="condition.condition_type === 'time'">
          <label for="" class="vs-input--label mt-4">Repeat</label>

          <v-select v-model="condition.repeat" :options="repeat_options" placeholder="Repeat" @input="changeRepeat"
            class="select_padding w-full" :reduce="(repeat) => repeat.id" />
          <div class="week_days">
            <vs-checkbox class="condition_week_item mr-3" v-model="condition.DaysOfWeek[day.key]"
              v-for="(day, index) in weekDays" :disabled="disableWeekDays" :key="index">{{ day.name }}</vs-checkbox>
          </div>
        </div>

        <div class="vx-col w-full" v-if="condition.condition_type === 'event'">
          <EventTable class="mt-4" :headers="event_headers" :items="event_list" @checkEvent="checkEvent($event)" />
        </div>

        <div class="vx-col w-full mt-4" v-if="condition.condition_type === 'direction'">
          <v-select v-model="condition.EventsDirection" :options="direction_types" :reduce="(type) => type.id"
            placeholder="Event Direction" class="select_padding w-full" />
        </div>

        <div class="vx-col w-full condition_actions">
          <vs-button class="mt-4 unimacs_cancel_button">Cancel</vs-button>
          <vs-button class="mt-4 unimacs_button" @click="addCondition">Submit</vs-button>
        </div>
      </div>
    </vs-popup>
    <div class="vx-col w-full">
      <vs-button class="mt-4 unimacs_button" @click="openCondPopup">Add condition</vs-button>
    </div>

    <div class="vx-col w-full mt-4">
      <span>
        Rule! To activate the reaction, all specified conditions must be met.
        <br />
        Rule! There must be 1 Event and 1 Time in the glass of conditions
      </span>
    </div>
    <div class="vx-col w-full mt-4">
      <Table :items="conditions" @deleteCondition="deleteCondition($event)" />
    </div>
    <!-- <div class="vx-col w-full mt-4 condition_btns">
      <vs-button class="mt-4 unimacs_button">Main</vs-button>
      <vs-button class="mt-4 unimacs_button">Reaction</vs-button>
    </div> -->
  </div>
</template>

<script>
import vSelect from "vue-select";
import Table from "./EditConditionTable.vue";
import EventTable from "./EditEventTable.vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/plugins/monthSelect/style.css";
export default {
  data() {
    return {
      conditionPopup: false,
      condition_types: [
        { label: "Time", id: "time" },
        { label: "Event", id: "event" },
        { label: "Direction of passage", id: "direction" },
      ],
      direction_types: [
        { label: "Entry", id: 1 },
        { label: "Exit", id: 0 },
      ],
      condition: {
        condition_type: "time",
        TmBeginCondition: null,
        TmEndCondition: null,
        repeat: null,
        DaysOfWeek: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
        },
        EventsCondition: [],
      },

      configdateTimePicker: {
        enableTime: true,
        time_24hr: true,
        enableSeconds: true,
        noCalendar: true,
        minTime: "00:00:00",
        maxTime: "23:59:59",
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
      event_headers: [
        { key: "count", name: "#" },
        { key: "name", name: "Name" },
      ],
      condition_time_start: null,
      condition_time_end: null,
      repeat_options: [
        { label: "Don't repeat", id: null },
        { label: "Every day", id: "every_day" },
        { label: "Graph", id: "graph" },
      ],
      disableWeekDays: true,
    };
  },
  methods: {
    openCondPopup() {
      this.condition_types.map(type => {
        return type.disabled = false
      })

      this.conditions.forEach((condition) => {
        const types = this.condition_types.find(
          (c) => c.id === condition.condition_type
        );
        types.disabled = true;
      });

      const notDisabled = this.condition_types.filter((t) => !t.disabled);

      if (notDisabled.length) {
        this.condition.condition_type = notDisabled[0].id;
        this.conditionPopup = true;
      } else {
        this.$vs.notify({
          time: 7000,
          title: "You must add a maximum of 3 conditions",
          color: "danger",
        });
      }


    },
    addCondition() {
      let obj = {};
      if (this.condition.condition_type === "time") {
        obj = {
          TmBeginCondition: this.condition.TmBeginCondition,
          TmEndCondition: this.condition.TmEndCondition,
          repeat: this.condition.repeat ? true : false,
          condition_type: this.condition.condition_type,
        };

        const days_of_week = [];
        for (const key in this.condition.DaysOfWeek) {
          if (this.condition.DaysOfWeek[key]) {
            days_of_week.push(+key);
          }
        }
        obj.DaysOfWeek = days_of_week;
      } else if (this.condition.condition_type === "event") {
        obj = {
          condition_type: this.condition.condition_type,
          EventsCondition: this.condition.EventsCondition,
        };
      } else if (this.condition.condition_type === "direction") {
        obj = {
          condition_type: this.condition.condition_type,
          EventsDirection: this.condition.EventsDirection,
        };
      }

      this.conditionPopup = false;

      this.$store.commit("autoTask/SET_EDIT_CONDITION", { ...obj });
    },
    deleteCondition(event) {
      this.$store.commit("autoTask/DELETE_EDIT_CONDITION", event);
    },
    checkEvent(event) {
      const eventsConditions = [];

      if (event && Object.keys(event).length) {
        for (const key in event) {
          if (event[key]) {
            eventsConditions.push(+key);
          }
        }
      }
      this.condition.EventsCondition = eventsConditions;
    },
    changeRepeat() {
      if (this.condition.repeat === "every_day") {
        for (const key in this.condition.DaysOfWeek) {
          this.condition.DaysOfWeek[key] = true;
        }
        this.disableWeekDays = true;
      } else if (this.condition.repeat === "graph") {
        for (const key in this.condition.DaysOfWeek) {
          this.condition.DaysOfWeek[key] = false;
        }
        this.disableWeekDays = false;
      } else if (!this.condition.repeat) {
        for (const key in this.condition.DaysOfWeek) {
          this.condition.DaysOfWeek[key] = false;
        }
        this.disableWeekDays = true;
      }
    },
  },
  computed: {
    conditions() {
      return this.$store.state.autoTask.edit_conditions;
    },
    event_list() {
      const events = [];
      const event_list = this.$store.state.autoTask.events;
      for (const key in event_list) {
        const name = event_list[key].split("_").join(" ");
        events.push({ id: key, name });
      }
      return events;
    },
  },
  watch: {
    condition: {
      handler: function (condition_data, oldData) {
        const data = JSON.parse(JSON.stringify(condition_data));
        this.$store.commit("autoTask/SET_CONDITION_DATA", data);
      },
      deep: true,
    },
  },
  components: {
    Table,
    flatPickr,
    vSelect,
    EventTable,
  },
};
</script>

<style lang="scss">
.condition_btns,
.condition_actions {
  display: flex;
  justify-content: space-between;
}

.condition_popup {
  z-index: 99999;

  .week_days {
    display: flex;

    .condition_week_item {
      flex-direction: column-reverse;
    }
  }
}
</style>