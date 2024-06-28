<template>
  <vs-tabs
    v-model="activeTabInner"
    class="tab-action-btn-fill-conatiner features_tabs mt-3"
  >
    <vs-tab label="Anti-passback">
      <div class="tab-text mt-5">
        <div class="vx-row w-full w-1/4" style="align-items: center">
          <div class="vx-col w-full">
            <label for="" class="vs-input--label">Anti-passback Type</label>
            <v-select
              v-model="extra_settings.antipass_backs.type"
              :options="antipass_types"
              style="width: 544px"
              @input="changeDescription"
              class="select_padding mb-3"
              name="Anti-passback Type"
              placeholder="Anti-passback Type"
              :reduce="(type) => type.id"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>
          <div class="vx-col w-full mt-3 mb-3" v-if="passDescription">
            {{ passDescription }}
          </div>
          <div class="vx-col">
            <vs-checkbox
              v-model="extra_settings.antipass_backs.enable_timer"
              class="w-full checkbox_block"
              style="margin-top: 20px"
              >Enable timer
            </vs-checkbox>
          </div>

          <!-- <div class="vx-row select_min_block"> -->
          <div class="vx-col">
            <vs-input
              class="count_passers"
              label="Minutes"
              v-model="extra_settings.antipass_backs.time"
              type="text"
              v-validate="'required'"
              @input="checkNumber($event, 'antipass_backs')"
              name="minutes_count"
              :disabled="!extra_settings.antipass_backs.enable_timer"
            />
          </div>
          <div class="vx-col">
            <label for="" class="vs-input--label">Time Type</label>

            <v-select
              v-model="extra_settings.apb_reset_timer.unit"
              style="width: 170px"
              :options="minuteTypes"
              class="select_padding"
              name="Time Type"
              :disabled="!extra_settings.antipass_backs.enable_timer"
              placeholder="Time Type"
              :reduce="(unit) => unit.id"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
          </div>
        </div>
        <div class="description_block">
          <div class="description_title font_bold">Timer description</div>
          <div class="description_info">
            Anti-passback rules will cleared until specified time
          </div>
        </div>
      </div>
    </vs-tab>
    <vs-tab label="People limits min">
      <div class="tab-text">
        <div class="vx-row w-full mt-3" style="align-items: center">
          <div class="vx-col w-1/7">
            <vs-checkbox
              v-model="extra_settings.people_limits_min.enable"
              class="w-full checkbox_block"
              style="margin-top: 15px"
              >Enable
            </vs-checkbox>
          </div>

          <div class="vx-col">
            <vs-input
              class="count_passers"
              label="Minutes"
              v-model="extra_settings.people_limits_min.time"
              type="text"
              v-validate="'required'"
              name="minutes_count_min"
              @input="checkNumber($event, 'people_limits_min')"
              :disabled="!extra_settings.people_limits_min.enable"
            />
          </div>
        </div>

        <div class="description_block">
          <div class="description_title font_bold">
            Cardholders limits indoors
          </div>
          <div class="description_info">
            The number of Cardholders in the zone, upon reaching which the EXIT
            Cardholders will be blocked
          </div>
        </div>
        <div class="warning_block">
          <div class="warning_button">Warning</div>
          <div class="warning_text">
            May cause problems if the following two conditions are met
            simultaneously:<br /><br />
            1. In case you have more than one access point leading to the
            zone<br /><br />
            2. Access Point lost connection and switch to offline
          </div>
        </div>
      </div>
    </vs-tab>
    <vs-tab label="People limits max">
      <div class="tab-text">
        <div class="vx-row w-full mt-5">
          <div class="vx-col w-1/7">
            <vs-checkbox
              v-model="extra_settings.people_limits_max.enable"
              class="w-full checkbox_block"
              style="margin-top: 25px"
              >Enable
            </vs-checkbox>
          </div>

          <div class="vx-col">
            <vs-input
              class="count_passers"
              label="Minutes"
              v-model="extra_settings.people_limits_max.time"
              type="text"
              @input="checkNumber($event, 'people_limits_max')"
              v-validate="'required'"
              name="minutes_count_max"
              :disabled="!extra_settings.people_limits_max.enable"
            />
          </div>
        </div>

        <div class="description_block">
          <div class="description_title font_bold">
            Cardholders limits indoors
          </div>
          <div class="description_info">
            The number of Cardholders in the zone, upon reaching which the ENTER
            Cardholders will be blocked
          </div>
        </div>
        <div class="warning_block">
          <div class="warning_button">Warning</div>
          <div class="warning_text">
            May cause problems if the following two conditions are met
            simultaneously:<br /><br />
            1. In case you have more than one access point leading to the
            zone<br /><br />
            2. Access Point lost connection and switch to offline
          </div>
        </div>
      </div>
    </vs-tab>
  </vs-tabs>
</template>


<script>
import vSelect from "vue-select";

export default {
  data() {
    return {
      activeTabInner: 0,
      extra_settings: {
        antipass_backs: {
          type: 'disable',
          enable_timer: false,
          time: 0,
          time_type: "minutes",
        },
        apb_reset_timer: {
          enable: false,
          time: null,
          unit: "seconds",
        },
        people_limits_min: {
          enable: false,
          time: null,
        },
        people_limits_max: {
          enable: false,
          time: null,
        },
      },

      minuteTypes: [
        {
          label: "Minutes",
          id: "minutes",
        },
        {
          label: "Seconds",
          id: "seconds",
        },
      ],
      passDescription: null,
    };
  },
  watch: {
    extra_settings: {
      handler: function (data, oldVal) {
        this.$store.commit("accessPointGroup/SET_ZONE_INFO", data);
      },
      deep: true,
    },
  },
  created() {
    const index = this.zones.findIndex((z) => z.id == this.activeZone);
    let zone = JSON.parse(JSON.stringify(this.zones[index]));
    this.extra_settings = zone;

    if (this.extra_settings.antipass_backs) {
      let findType = this.antipass_types.find(
        (s) => s.id == this.extra_settings.antipass_backs.type
      );
      if (findType) {
        this.passDescription = findType.description;
      }
    }
  },
  computed: {
    activeZone() {
      return this.$store.state.accessPointGroup.active_zone;
    },
    zones() {
      return this.$store.state.accessPointGroup.zones;
    },
    antipass_types() {
      return this.$store.state.antipass_types;
    },
  },
  methods: {
    checkNumber(value, field) {
      return (this.extra_settings[field].time = +value.replace(/[^+0-9]/g, ""));
    },
    changeDescription() {
      let findType = this.antipass_types.find(
        (s) => s.id == this.extra_settings.antipass_backs.type
      );
      if (findType) {
        this.passDescription = findType.description;
      }
    },
  },
  components: {
    vSelect,
  },
};
</script>


<style lang="scss" scoped>
.description_block {
  margin-top: 10px;
}
.font_bold {
  font-weight: bold;
}
.select_min_block {
  align-items: flex-end;
}
</style>