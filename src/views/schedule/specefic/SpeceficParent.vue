<template>
  <div>
    <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
      <vs-tab label="Main Settings">
        <div class="vx-row mt-3">
          <div class="vx-col md:w-2/3">
            <vs-input
              label="Name"
              class="w-full"
              placeholder="Name"
              name="name"
              v-validate="'required'"
              v-model="editData.name"
            />
          </div>
          <div class="vx-col md:w-1/3">
            <vs-input
              label="Type"
              class="w-full"
              v-model="editData.type"
              :disabled="true"
              name="type"
            />
          </div>
        </div>
        <div class="vx-row" style="align-items: flex-end">
          <div class="vx-col md:w-2/3">
            <vs-input
              label="Description"
              class="w-full mt-3"
              placeholder="Description"
              v-model="editData.description"
              name="description"
              v-validate="'required'"
            />
          </div>
          <div class="vx-col md:w-1/3">
            <vs-button
              class="w-full unimacs_button"
              @click.prevent="updateScheduleInfo"
              v-if="permissions.updateItem"
              >Submit</vs-button
            >
          </div>
        </div>

        <div class="vx-row">
          <div class="vx-col md:w-full mt-5">
            <vs-table  
noDataText="No data available"
              ref="parent_daily_table "
              :max-items="25"
              class="bs_table"
              :data="schedules"
            >
              <div slot="header" class="flex flex-wrap-reverse items-center">
                <div class="items-center"></div>
              </div>

              <template slot="thead">
                <vs-th class="time_table_head" sort-key="name">Day</vs-th>
                <vs-th sort-key="time_coverage">Time Coverage</vs-th>
              </template>

              <template slot-scope="{ data }">
                <tbody>
                  <vs-tr
                    :data="tr"
                    :key="indextr"
                    v-for="(tr, indextr) in data"
                  >
                    <vs-td>
                      <p class="product-name font-medium truncate">
                        {{ tr.name }}
                      </p>
                    </vs-td>

                    <vs-td>
                      <!-- {{ tr }} -->
                      <div class="timeline_block">
                        <timeLine :array="tr.time" />
                      </div>
                    </vs-td>
                  </vs-tr>
                </tbody>
              </template>
            </vs-table>
            <div class="timeline_block"></div>
          </div>
        </div>
      </vs-tab>

      <vs-tab label="Relations">
        <vs-table  
noDataText="No data available"
          ref="parent_daily_table"
          :max-items="25"
          class="bs_table mt-3"
          :data="relations"
        >
          <div slot="header" class="flex flex-wrap-reverse items-center">
            <div class="items-center"></div>
          </div>

          <template slot="thead">
            <vs-th sort-key="id">#</vs-th>
            <vs-th sort-key="name">Access Name</vs-th>
            <vs-th sort-key="group_name">Cardholder Group Name</vs-th>
            <vs-th sort-key="qty">Cardholder Quantity</vs-th>
          </template>

          <template slot-scope="{ data }">
            <tbody>
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  <p class="product-name font-medium truncate">
                    {{ tr.count }}
                  </p>
                </vs-td>

                <vs-td>
                  <p class="product-name font-medium truncate">
                    {{ tr.access_right ? tr.access_right : "" }}
                  </p>
                </vs-td>
                <vs-td>
                  <p class="product-name font-medium truncate">
                    {{
                      tr.cardholder_group_name ? tr.cardholder_group_name : ""
                    }}
                  </p>
                </vs-td>

                <vs-td>
                  <p class="product-name font-medium truncate">
                    {{ tr.cardholders_qty ? tr.cardholders_qty : "" }}
                  </p>
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
        </vs-table>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import timeLine from "../TimeLine";

export default {
  props: {
    propData: {
      type: Object,
    },
  },
  watch: {
    propData(data) {
      this.fetchSchedules(data.id);
      this.fetchScheduleRelation(data.id);
    },
  },
  components: {
    timeLine,
  },
  data() {
    return {
      activeTab: 0,
      schedules: [],
      editData: { ...this.propData },
      permissions: this.$parent.permissions,

      relations: [],
    };
  },
  computed: {
    types() {
      return this.$store.state.schedule.types;
    },
  },
  methods: {
    updateScheduleInfo() {
      const obj = {
        id: this.editData.id,
        name: this.editData.name,
        description: this.editData.description,
      };
      this.$parent.updScheduleInfo(obj);
    },
    fetchScheduleRelation(id) {
      this.$store
        .dispatch("schedule/fetchScheduleRelation", id)
        .then((res) => {
          let arr = [];
          if (res.data.length) {
            res.data.forEach((item, index) => {
              item.count = index + 1;

              arr.push(item);
            });
          }
          this.relations = arr;
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    fetchSchedules(id) {
      this.$store
        .dispatch("schedule/fetchSchedule", id)
        .then((res) => {
          this.schedules = [];
          this.editData = res.data;
          let filterData = [];

          if (res.data.timeframes && res.data.timeframes.length) {
            res.data.timeframes.forEach((timeframe) => {
              let hasname = filterData.find((i) => i.name == timeframe.name);
              if (!hasname) {
                filterData.push({
                  name: timeframe.name,
                  time: [{ start: timeframe.start, end: timeframe.end }],
                });
              } else {
                hasname.time.push({
                  start: timeframe.start,
                  end: timeframe.end,
                });
              }
            });
          }

          this.schedules = filterData;
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
  },
  created() {
    this.fetchSchedules(this.propData.id);
    this.fetchScheduleRelation(this.propData.id);
  },
};
</script>


<style lang="scss" scoped>
.schedule-vue-sample
  .e-schedule:not(.e-device)
  .e-agenda-view
  .e-content-wrap
  table
  td:first-child {
  width: 90px;
}

.schedule-vue-sample .e-schedule .e-agenda-view .e-resource-column {
  width: 100px;
}

.timeline_block {
  text-align: end;
}
</style>