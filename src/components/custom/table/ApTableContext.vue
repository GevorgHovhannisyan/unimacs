    <template>
  <div class="table_component">
    <vs-table
      noDataText="No data available"
      ref="table"
      class="bs_table"
      :data="items"
      :max-items="itemsPerPage"
      :search="search"
      >
      <!-- :pagination="pagination && items.length > itemsPerPage ? true : false" -->
      <div slot="header" class="flex flex-wrap-reverse items-center">
        <div class="items-center"></div>
      </div>
      <template slot="thead">
        <vs-th
          v-for="(header, index) in headers"
          :key="index"
          :sort-key="header.key"
          >{{ header.name }}</vs-th
        >
        <vs-th v-if="actions || contextMenu">Actions</vs-th>
      </template>
      <template slot-scope="{ data }">
        <tbody>
          <vs-tr
            :data="tr"
            :key="indextr"
            v-for="(tr, indextr) in data"
            :class="{ disabled_row: statusMode === 'acu' && tr.disabled }"
          >
            <vs-td v-for="(header, index) in headers" :key="index">
              <div
                v-if="
                  (header.key == 'status' && !statusMode) ||
                  ((header.key == 'status' || header.key == 'acu_status') &&
                    statusMode == 'acu')
                "
                @click="updateItem(tr)"
              >
                <p
                  class="product-name font-medium truncate"
                  :style="{ color: getStatusColor(tr[header.key]) }"
                >
                  {{ getDeviceName(tr[header.key]) }}
                </p>

                <!-- <vs-chip
                  class="ag-grid-cell-chip"
                  :color="chipColor(tr[header.key])"
                >
                  <span>{{ tr[header.key] }} </span>
                </vs-chip> -->
              </div>
              <div v-else @click="updateItem(tr)">
                <p class="product-name font-medium truncate">
                  {{ tr[header.key] ? tr[header.key] : "" }}
                </p>
              </div>
            </vs-td>

            <vs-td class="whitespace-no-wrap" v-if="actions">
              <feather-icon
                icon="EditIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="updateItem(tr)"
                v-if="!permissions || permissions.updateItem"
              />
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                v-if="!permissions || permissions.destroyItem"
                @click.stop="deleteItem(tr)"
              />
            </vs-td>

            <vs-td class="whitespace-no-wrap" v-if="!actions && contextMenu">
              <vs-dropdown
                vs-trigger-click
                @click="correctMenu(tr)"
                class="cursor-pointer ml-3"
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
                    @click.prevent="
                      !tr.disabled || action.action === 'delete'
                        ? $emit(action.action, tr)
                        : false
                    "
                    v-for="(action, index) in contextMenus"
                    :key="index"
                    :class="{
                      drop_dsbl:
                        statusMode === 'acu' &&
                        tr.disabled &&
                        action.action !== 'delete',
                    }"
                  >
                    <span class="flex items-center">
                      <span>{{ action.name }}</span>
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
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    actions: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    statusMode: {
      type: String,
      default: "standart",
    },
    contextMenu: {
      type: Boolean,
      default: false,
    },
    contextMenuActions: {
      type: Array,
    },
    permissions: {
      type: Object,
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
    updateItem(tr) {
      this.$emit("updateItem", tr);
    },
    deleteItem(tr) {
      this.$emit("deleteRecord", tr);
    },
    correctMenu() {
      this.contextMenus = [...this.contextMenuActions];
    },
  },
  computed: {
    chipColor() {
      return (value) => {
        if (value == "active") return "rgb(92 184 92)";
        else if (value == "pending") return "rgb(239 197 48)";
        else if (value == "no_hardware") return "rgb(162 157 139)";
      };
    },
    getDeviceName() {
      return (value) => {
        if (value == "offline") return "Offline";
        // else if (value == "pending") return "Waiting for config";
        else if (value == "online") return "Online";
      };
    },
    getStatusColor() {
      return (value) => {
        if (value == "offline") return "grey";
        // else if (value == "pending") return "rgb(255 178 0)";
        else if (value == "online") return "rgb(0 251 0)";
      };
    },
  },
  created() {
    // this.contextMenus = [...this.contextMenuActions];
  },
};
</script>
