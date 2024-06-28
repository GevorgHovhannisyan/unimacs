<template>
  <div>
    <form>
      <div class="vx-row mt-3">
        <div class="vx-col md:w-full">
          <v-select
            v-model="network.connection_type"
            :options="connection_types"
            class="select_padding mt-5"
            name="connection_type"
            placeholder="Ethernet network"
            :reduce="(model) => model.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            disabled
          />
        </div>
      </div>
      <div class="vx-row mt-3" v-if="network.connection_type == 'wi-fi'">
        <div class="vx-col md:w-full mt-5">
          <vs-input
            class="w-full"
            label="Connect to SSID"
            name="ssid"
            v-model="network.ssid"
            disabled
          />
        </div>
        <div class="vx-col md:w-full mt-5">
          <span>Wi-Fi signal level</span>

          <div class="signal_level">
            <div class="signal_width">55dB</div>
          </div>
        </div>
      </div>
      <div class="vx-row mt-3">
        <div class="vx-col md:w-full mt-5">
          <div class="vx-row">
            <div class="vx-col md:w-1/2">
              <vs-radio disabled v-model="net_fix_dhcp" vs-name="dhcp" vs-value="fixed"
                >Fixed
              </vs-radio>
            </div>
            <div class="vx-col md:w-1/2">
              <vs-radio v-model="net_fix_dhcp" disabled="disabled" vs-name="dhcp" vs-value="dhcp"
                >DHCP</vs-radio
              >
            </div>
          </div>
        </div>
        <div class="vx-col md:w-1/2 mt-5">
          <vs-input
            class="w-full"
            label="IP Address"
            name="ip_address"
            :disabled="net_fix_dhcp == 'dhcp'"
            v-model="network.ip_address"
            v-validate="'required|validateIP'"
            disabled
          />

          <span class="text-danger text-sm" v-show="errors.has('ip_address')">{{
            errors.first("ip_address")
          }}</span>
        </div>
        <div class="vx-col md:w-1/2 mt-5">
          <vs-input
            class="w-full"
            label="Get way"
            name="gateway"
            :disabled="net_fix_dhcp == 'dhcp'"
            v-model="network.gateway"
            v-validate="'required|validateIP'"
            disabled
          />
          <span class="text-danger text-sm" v-show="errors.has('gateway')">{{
            errors.first("gateway")
          }}</span>
        </div>
        <div class="vx-col md:w-1/2 mt-5">
          <vs-input
            class="w-full"
            label="Subnet mask"
            name="subnet_mask"
            :disabled="net_fix_dhcp == 'dhcp'"
            v-model="network.subnet_mask"
            v-validate="'required|validateIP'"
            disabled
          />

          <span
            class="text-danger text-sm"
            v-show="errors.has('subnet_mask')"
            >{{ errors.first("subnet_mask") }}</span
          >
        </div>
        <div class="vx-col md:w-1/2 mt-5">
          <vs-input
            class="w-full"
            label="DNS Server"
            name="dns_server"
            :disabled="net_fix_dhcp == 'dhcp'"
            v-validate="'required|validateIP'"
            v-model="network.dns_server"
            disabled
          />
          <span class="text-danger text-sm" v-show="errors.has('dns_server')">{{
            errors.first("dns_server")
          }}</span>
        </div>
      </div>
    </form>
  </div>
</template>


<script>
import vSelect from "vue-select";
import { ValidateIPaddress } from "@/functions/IP_validator.js";
export default {
  watch: {
    network: {
      handler: function (data) {
        if (Object.keys(data).length) {
          this.$store.commit("accessPoint/UPDATE_NETWORK", data);
        }
      },
      deep: true,
    },
    net_fix_dhcp(val) {
      if (val == "fixed") {
        this.network.fixed = true;
        this.network.dhcp = false;
      } else if (val == "dhcp") {
        this.network.fixed = false;
        this.network.dhcp = true;
      }
      this.$store.commit("accessPoint/UPDATE_NETWORK", this.network);
    },
  },
  computed: {
    connection_types() {
      return this.$store.state.accessPoint.connection_types;
    },
  },
  methods: {},
  data() {
    return {
      net_fix_dhcp: "fixed",
      network: {},
    };
  },
  created() {
    this.network = { ...this.$store.state.accessPoint.edit_acu_data.network };
    if (this.network.dhcp) {
      this.net_fix_dhcp = "dhcp";
    }
    this.$validator.extend("validateIP", {
      getMessage: (field) => field + " not valid",
      validate: (value) => {
        return ValidateIPaddress(value);
      },
    });
  },
  components: {
    vSelect,
  },
};
</script>