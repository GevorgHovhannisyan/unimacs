    <template>
  <div class="table_component">
    <vs-table  
noDataText="No data available" ref="table" class="bs_table" :data="items">
      <div slot="header" class="flex flex-wrap-reverse items-center">
        <div class="items-center"></div>
      </div>
      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="product-name font-medium truncate">{{tr.id}}</p>
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">{{tr.condition_type}}</p>
            </vs-td>

            <vs-td v-if="tr.condition_type === 'time'">
              <p class="product-name font-medium truncate">{{tr.TmBeginCondition}} - {{tr.TmEndCondition}}</p>
            </vs-td>

             <vs-td
              v-else-if="tr.condition_type === 'event'"
              style="max-width: 200px"
            >
              <p class="product-name font-medium truncate">
                {{ getEvents(tr) }}
              </p>
            </vs-td>

               <vs-td
              v-else-if="tr.condition_type === 'direction'"
              style="max-width: 200px"
            >
              <p class="product-name font-medium truncate">
                {{ getDirection(tr) }}
              </p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <vs-dropdown
                vs-trigger-click
                @click="correctMenu(tr)"
                class="cursor-pointer ml-3 z_ind"
                vs-custom-content
              >
                <div class="p-3 cursor-pointer">
                  <span class="mr-2 leading-none"
                    ><vs-icon
                      style="font-size: 25px"
                      icon-pack="material-icons"
                      icon="reorder"
                  /></span>
                </div>

                <vs-dropdown-menu>

                   <vs-dropdown-item
                    @click.prevent="$emit('deleteCondition', tr)"
                  >
                    <span class="flex items-center">
                      <span>Delete</span>
                    </span>
                  </vs-dropdown-item>

                </vs-dropdown-menu>
              </vs-dropdown>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import { VueContext } from "vue-context";
export default {
  props: {
    items: {
      type: Array,
    },
    actions: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    contextMenu: {
      type: Boolean,
      default: false,
    },
    contextMenuActions: {
      type: Array,
    },
  },
  data() {
    return {
      itemsPerPage: 10,
      contextMenus: [],
    };
  },
  components: {
    VueContext,
  },
  methods: {
    deleteItem(tr) {
      this.$emit("deleteRecord", tr);
    },
    correctMenu(tr) {
      // this.contextMenus = [...this.contextMenuActions];
    },
  },
    computed: {
    getEvents() {
      return (tr) => {
        const events = [];
        const event_list = this.$store.state.autoTask.events;
        for (const key in event_list) {
          const name = event_list[key].split("_").join(" ");
          events.push({ id: key, name });
        }

        let events_text = "";
        if (tr.EventsCondition && tr.EventsCondition.length) {
          tr.EventsCondition.forEach((element) => {
            const findtext = events.find((item) => item.id == element);
            events_text += findtext.name + ", ";
          });
        }
        return events_text;
      };
    },
    getDirection() {
      return (tr) => {
        if (tr.EventsDirection) {
          return "Entry";
        } else {
          return "Exit";
        }
      };
    },
  },
};
</script>

<style lang="scss">
.con-vs-dropdown--menu.vs-dropdown-menu {
  z-index: 999999999999999 !important;
}
</style>