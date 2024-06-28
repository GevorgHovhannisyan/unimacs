<template>
  <div>
    <!-- title="Access Right" -->
    <vx-card class="mt-base card_theme"  no-shadow>
      <div class="vx-row">
        <div class="vx-col md:w-full w-full">
          <div class="vx-row">
            <div class="vx-col md:w-full">
              <vs-checkbox
                class="mb-4 "
                v-if="features.CardholderGroupAccessRight"
                :disabled="!group"
                v-model="access_right.access_right_inherited"
                @change="changeToInherit"
                >Inherit From Group Rules</vs-checkbox
              >

              <label for="" class="vs-input--label mt-3">Access Right</label>

              <v-select
                v-model="access_right.access_right"
                :options="rights"
                class="select_padding"
                @input="changeRightDescription"
                :disabled="access_right.access_right_inherited"
                placeholder="Access Right"
                :reduce="(access_right) => access_right.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />

              <vs-input
                v-if="selectedRight && access_right.access_right"
                class="w-full mt-4 new_inp"
                label="Description"
                v-model="selectedRight.description"
                :disabled="true"
                name="description"
              />
            </div>
          </div>
          <vs-divider />
          <div class="vx-row timer_block right_tbl">
            <div class="vx-col md:w-full">
              <Table :items="access_rights" :headers="rule_table_headers" />
            </div>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import vSelect from "vue-select";
import Table from "@/components/custom/table/Table";

export default {
  components: {
    flatPickr,
    vSelect,
    Table,
  },
  watch: {
    access_right: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_ACCESS_RIGHT_INFO", newValue);
      },
      deep: true,
    },
  },
  data() {
    return {
      access_right: {
        access_right_inherited: false,
        access_right: null,
      },
      access_rights: [],
      rights: [],
      selectedRight: null,
      rule_table_headers: [
        { name: "Entry", key: "entry" },
        { name: "Schedule", key: "schedule" },
      ],
    };
  },
  computed: {
    group() {
      return this.$store.state.cardholder.cardholder_info.cardholder_group;
    },
    features() {
      return localStorage.getItem("features") &&
        JSON.parse(localStorage.features).Cardholder
        ? JSON.parse(localStorage.features).Cardholder
        : null;
    },
  },
  methods: {
    checkNumber(value, field) {
      return (this.access_right[field] = +value.replace(/[^+0-9]/g, ""));
    },
    changeToInherit() {
      if (this.access_right.access_right_inherited) {
        this.$store
          .dispatch("cardGroup/fetchCardGroup", this.group)
          .then((res) => {
            this.access_right = {
              access_right: res.data.access_rights.id,
            };

            // { ...res.data.access_rights };
            this.access_right.access_right_inherited = true;
            this.changeRightDescription();
          });
      } else {
        this.access_right = {};
      }
    },
    changeRightDescription() {
      if (this.access_right.access_right) {
        this.$store
          .dispatch("right/fetchRight", this.access_right.access_right)
          .then((res) => {
            this.selectedRight = res.data;
            this.access_rights = [];
            const rules = res.data.access_rules;
            if (rules.length) {
              rules.forEach((rule) => {
                this.access_rights.push({
                  entry: rule.access_points ? rule.access_points.name : "",
                  schedule: rule.schedules ? rule.schedules.name : "",
                });
              });
            }
          });
      } else {
        this.access_rights = [];
      }
    },
  },
  created() {
    this.rights = [
      {
        id: null,
        label: "No Access Rights",
      },
    ];

    this.$store.dispatch("right/fetchRights").then((res) => {
      if (res.data.length) {
        res.data.forEach((right) => {
          this.rights.push({ id: right.id, label: right.name });
        });
      }
    });

    this.access_right.access_right_inherited =
      this.$store.state.cardholder.cardholder_info.access_right_inherited;
    this.access_right.access_right =
      this.$store.state.cardholder.cardholder_info.access_right;

    if (this.access_right.access_right_inherited) {
      this.changeToInherit();
    }

    this.changeRightDescription();
  },
};
</script>

<style lang="scss" >
.right_tbl .con-tablex.vs-table--content {
  height: 280px;
}

.new_inp .vs-input--input {
  padding-top: 11px !important;
  padding-bottom: 11px !important;
}
</style>