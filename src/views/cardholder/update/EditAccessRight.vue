<template>
  <div>
    <!-- title="Access Right" -->
    <vx-card class="mt-base card_theme" no-shadow>
      <div class="vx-row">
        <div class="md:w-full w-full">
          <div class="vx-row">
            <div class="vx-col md:w-full">
              <vs-checkbox
                class="mb-4 custom__checkbox"
                v-model="access_right.access_right_inherited"
                v-if="features.CardholderGroupAccessRight"
                @change="changeToInherit"
                :disabled="!group"
                >Inherit From Group Rules
              </vs-checkbox>
              <label for="" class="vs-input--label">Access Right</label>

              <v-select
                v-model="access_right.access_right"
                :options="rights"
                class="w-full select_padding"
                @input="changeRightDescription"
                :disabled="access_right.access_right_inherited"
                placeholder="Access Right"
                :reduce="(type) => type.id"
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
              <Table :items="access_rules" :headers="rule_table_headers" />
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
import Table from "../../../components/custom/table/Table";

export default {
  components: {
    flatPickr,
    vSelect,
    Table,
  },
  watch: {
    access_right: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_EDIT_ACCESS_RIGHT_INFO", newValue);
      },
      deep: true,
    },
  },
  props: {
    editData: {
      type: Object,
    },
  },
  data() {
    return {
      columns: {
        entry: true,
        schedule: true,
      },
      access_right: {},
      access_rules: [],
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
      return this.$store.state.cardholder.edit_cardholder_info.cardholder_group;
    },
    features() {
      return localStorage.getItem("features") &&
        JSON.parse(localStorage.features).Cardholder
        ? JSON.parse(localStorage.features).Cardholder
        : null;
    },
    right_list() {
      return this.$store.state.right.rights;
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
            this.access_right.access_right_inherited = true;
            this.changeRightDescription();
          });
      } else {
        const findDefault = this.right_list.find((right) => right.default);
        const id = findDefault
          ? findDefault.id
          : this.right_list.length
          ? this.right_list[0].id
          : null;
        this.access_right = {
          access_right: id,
        };
      }
    },
    changeRightDescription() {
      if (this.access_right.access_right) {
        this.$store
          .dispatch("right/fetchRight", this.access_right.access_right)
          .then((res) => {
            this.selectedRight = res.data;
            this.access_rules = [];

            this.access_rights = [];
            if (res.data.access_rules.length) {
              this.access_right.hasRules = true;
            } else {
              this.access_right.hasRules = false;
            }

            this.$store.commit(
              "cardholder/SET_EDIT_ACCESS_RIGHT_INFO",
              this.access_right
            );

            const rules = res.data.access_rules;
            if (rules.length) {
              rules.forEach((rule) => {
                this.access_rules.push({
                  entry: rule.access_points ? rule.access_points.name : "",
                  schedule: rule.schedules ? rule.schedules.name : "",
                });
              });
            }
          });
      } else {
        this.access_rules = [];
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
    this.access_right.access_right_inherited =
      this.$store.state.cardholder.edit_cardholder_info.access_right_inherited;
    this.access_right.access_right =
      this.$store.state.cardholder.edit_cardholder_info.access_right;

    this.selectedRight = {
      ...this.$store.state.cardholder.edit_cardholder_info.access_rights,
    };

    if (this.access_right.access_right_inherited) {
      this.changeToInherit();
    }

    this.changeRightDescription();
    this.$store.dispatch("right/fetchRights").then((res) => {
      if (res.data.length) {
        res.data.forEach((right) => {
          this.rights.push({ id: right.id, label: right.name });
        });
      }
    });
  },
};
</script>

<style lang="scss" >
.right_tbl .con-tablex.vs-table--content {
  height: 280px;
}
</style>