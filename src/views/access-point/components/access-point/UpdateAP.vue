<template>
  <div class="ap_tabb">
    <vs-tabs>
      <vs-tab label="Main">
        <div>
          <Main :mainData="propsData" />
        </div>
      </vs-tab>

      <!-- <vs-tab label="AntipassBack" class="features_tabs">
        <div>
          <AntiPassBack :mainData="propsData" />
        </div>
      </vs-tab> -->

      <!-- <vs-tab label="Group" class="features_tabs">
        <Group :mainData="propsData" />
      </vs-tab> -->
    </vs-tabs>
  </div>
</template>



<script>
import Main from "../tabs/access-point/update/UpdateMain";
import AntiPassBack from "../tabs/access-point/update/UpdateAntiPassBack";
import Group from "../tabs/access-point/update/UpdateGroup";

export default {
  props: {
    propsData: {
      type: Object,
    },
  },
  data() {
    return {
      point: {},
    };
  },
  watch: {},
  methods: {},
  created() {},
  components: {
    Main,
    AntiPassBack,
    Group,
  },
};
</script>

<style lang="scss" scoped>
.ap_tabb {
  height: 100%;
}

.ap_tabb .con-vs-tabs.vs-tabs.vs-tabs-primary.vs-tabs-position-top {
  height: 100%;
}
</style>
