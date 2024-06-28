<template>
  <div>
    <vs-tabs>
      <vs-tab label="Main">
        <div>
          <Main :propsData="propsData" />
        </div>
      </vs-tab>

      <!-- <vs-tab label="AntipassBack" class="features_tabs">
        <div>
          <AntiPassBack :propsData="propsData" />
        </div>
      </vs-tab> -->

      <!-- <vs-tab label="Group" class="features_tabs">
        <Group :propsData="propsData" />
      </vs-tab> -->
    </vs-tabs>
  </div>
</template>

<script>
import Main from "../tabs/access-point/AddMain";
import AntiPassBack from "../tabs/access-point/AddAntiPassBack";
import Group from "../tabs/access-point/AddGroup";

export default {
  props: {
    propsData: {
      type: Object,
    },
  },
  watch: {
    propsData(propsData) {},
  },
  data() {
    return {
      point: {},
    };
  },
  methods: {},
  created() {},

  components: {
    Main,
    AntiPassBack,
    Group,
  },
};
</script>
