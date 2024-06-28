<template>
  <div class="upd_acu_tab_block">
    <vs-tabs>
      <vs-tab label="Main">
        <Main />
      </vs-tab>

      <vs-tab label="Network" >
        <Network />
      </vs-tab>
      <!-- <vs-tab label="Interfaces">
        <Interfaces />
      </vs-tab> -->
      <vs-tab label="Time">
        <Time />
      </vs-tab>
      <vs-tab label="Maintenance">
        <Maintain />
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import moduleAccessPoint from "@/store/access-point/moduleAccessPoint";
import Main from "../tabs/acu/update/UpdateMain";
import Time from "../tabs/acu/update/UpdateTime";
import Network from "../tabs/acu/update/UpdateNetwork";
import Interfaces from "../tabs/acu/update/UpdateInterfaces";
import Maintain from "../tabs/acu/update/UpdateMaintain";

export default {
  created() {
    if (!moduleAccessPoint.isRegistered) {
      this.$store.registerModule("accessPoint", moduleAccessPoint);
      moduleAccessPoint.isRegistered = true;
    }
  },
  components: {
    Main,
    Time,
    Network,
    Interfaces,
    Maintain,
  },
};
</script>


<style lang="scss" >
.upd_acu_tab_block {
  height: 100%;
  .con-tab.vs-tabs--content {
    overflow-x: unset !important;
  }
  .con-vs-tabs.vs-tabs {
    height: 100%;
    overflow: unset;
  }
  .con-slot-tabs {
    height: 100%;
  }
}
.updatee {
  .vs-popup--content {
    height: 100%;
  }

  .vs-popup {
    // height: 100%;
  }
}
</style>
