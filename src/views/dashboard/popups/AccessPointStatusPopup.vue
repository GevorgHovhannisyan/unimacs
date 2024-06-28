<template>
  <div class="ac_status_view">
    <vs-tabs>
      <vs-tab label="Main info">
        <div class="con-tab-ejemplo">
          <div>
            <MainInfo :apData="apData" />
          </div>
          <div class="man_overrride">
            <span class="manual_over">Manual override </span>

            <div class="vx-row manual__override">
              <ManualOverride
                :apData="apData"
                v-if="apData.type !== 'turnstile_two_side'"
              />
              <TurnManualOverride :apData="apData" v-else />
            </div>
          </div>
        </div>
      </vs-tab>
      <vs-tab label="ACU Info">
        <div class="con-tab-ejemplo">
          <AcuInfo :acuData="apData.acus" />
        </div>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import AcuInfo from "./components/AcuInfo";
import MainInfo from "./components/MainInfo";
import ManualOverride from "./components/ManualOverride";
import TurnManualOverride from "./components/TurnManualOverride";

export default {
  props: {
    apData: {
      type: Object,
    },
  },
  methods: {},
  created() {},
  components: {
    AcuInfo,
    MainInfo,
    ManualOverride,
    TurnManualOverride,
  },
};
</script>

<style lang="scss" >
.man_overrride {
  display: flex;
    flex-direction: column;
}
.manual_over {
  font-weight: bold;
  text-align: center;
  font-size: 20px;
}
</style>