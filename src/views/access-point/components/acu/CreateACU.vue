<template>
  <div>
    <vs-tabs>
      <vs-tab label="Main">
        <Main />
      </vs-tab>

      <vs-tab label="Time">
        <Time />
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import moduleAccessPoint from "@/store/access-point/moduleAccessPoint";
import Main from "../tabs/acu/AddMain";
import Time from "../tabs/acu/AddTime";

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
  },
};
</script>