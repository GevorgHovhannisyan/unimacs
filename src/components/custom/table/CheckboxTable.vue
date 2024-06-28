  <template>
  <div>
    <vs-table  
noDataText="No data available" ref="table" :data="items" class="bs_table">
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
        <vs-th>Actions</vs-th>
      </template>
      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td v-for="(header, index) in headers" :key="index">
              <p class="product-name font-medium truncate">
                {{ tr[header.key] ? tr[header.key] : "" }}
              </p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <vs-checkbox
                class="mb-4 mt-5"
                :disabled="selectHardware[tr.id] == tr.id"
                v-model="selectHardware[tr.id]"
                @change="checkChanges(tr)"
              ></vs-checkbox>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
      default: [],
    },
    headers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectHardware: {},
    };
  },
  components: {},
  methods: {
    checkChanges(data) {
      Object.keys(this.selectHardware).map((item, index) => {
        this.selectHardware[parseInt(item)] = false;
      });
      this.selectHardware[data.id] = true;
      this.$emit("input", data.id);
    },
  },
  computed: {},
  created() {},
};
</script>