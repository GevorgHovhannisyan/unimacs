<template>
  <div>
    <vs-table noDataText="No data available" ref="multi_table" class="bs_table"
      :pagination="access_points.length > itemsPerPage ? true : false" search :max-items="itemsPerPage"
      :data="access_points">
      <template slot="thead">
        <vs-th>
          <vs-checkbox v-model="selectAllCheckBox" icon-pack="feather" :icon="selectAllIcon" style="margin: auto">
          </vs-checkbox>
        </vs-th>

        <vs-th sort-key="name">Name</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <vs-checkbox @change="checkItem($event.target.checked, tr)" :value="tr.selected"></vs-checkbox>
            </vs-td>
            <vs-td>
              <div>
                <p class="product-name font-medium truncate">
                  {{ tr.name }}
                </p>
              </div>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <div class="actions_monitor mt-4">
      <vs-button class="unimacs_cancel_button " @click="$parent.$parent.apStatusSettingsPopups = false">
        Cancel
      </vs-button>
      <vs-button class="unimacs_button ml-5" @click="saveActivity">
        Submit
      </vs-button>


    </div>
  </div>
</template>

<script>
export default {
  props: {
    propsData: {
      type: Object,
    },
    userConfig: {
      type: Object || null,
    }
  },
  data() {
    return {
      access_points: [],
      itemsPerPage: 8,
    };
  },
  methods: {
    saveActivity() {
      const arr = this.access_points.filter(a => !a.selected)
      let filter = []
      if (arr.length) {
        filter = arr.map((i => i.id));
        // localStorage.setItem("access_point_settings", JSON.stringify(filter));
      } else {
        // localStorage.removeItem("access_point_settings");
      }
      this.$emit('setWhichShowAccessPoints', filter)
      this.$parent.$parent.apStatusSettingsPopups = false;
    },
    buildData(array) {
      let access_points = [];

      if (array.length) {
        array.forEach((event) => {
          if (!access_points.length) {
            access_points.push({
              id: event.id,
              name: event.name,
              selected: true,
            });
          } else {
            if (!access_points.find((a) => a.id == event.id)) {
              access_points.push({
                id: event.id,
                name: event.name,
                selected: true,
              });
            }
          }
        });
      }
      this.access_points = access_points;
    },

    checkItem(event, item) {
      let find = this.access_points.find((a) => a.id == item.id);
      if (find) {
        find.selected = event;
      }
    },
    setNotVisibleIds() {
     

      const not_visible_ids =this.userConfig &&  this.userConfig.not_visible_ids ? this.userConfig.not_visible_ids:[];
      if (not_visible_ids && not_visible_ids.length) {
        const items = JSON.parse(JSON.stringify(not_visible_ids));

        this.access_points.map(function (x) {
          x.selected = true;
        });

        items.forEach((id) => {
          let find_point = this.access_points.find((p) => p.id == id);
          if(find_point){
            find_point.selected = false;
          }
          
        });
      }
    }
  },
  computed: {
    selecteds() {
      return this.access_points.length
        ? this.access_points.filter((i) => i.selected)
        : [];
    },
    selectAllCheckBox: {
      get() {
        return this.selecteds.length;
      },
      set(value) {
        this.access_points.map(function (x) {
          x.selected = value;
        });
      },
    },
    selectAllIcon() {
      return this.selecteds.length === this.access_points.length
        ? "icon-check"
        : "icon-minus";
    },
  },
  created() {


    this.access_points = [];
    
 


    this.buildData(this.propsData.data);
    this.setNotVisibleIds()


  },
};
</script>

<style lang="scss" scoped>
.actions_monitor {
  display: flex;
  justify-content: flex-end;
}
</style>