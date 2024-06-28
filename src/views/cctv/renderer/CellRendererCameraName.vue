<template>
  <div class="flex items-center" @click="(e) => e.stopPropagation()">
    <div class="flex items-center">
      <vs-radio
        :vs-value="params.data.id"
        @input="setMain"
        v-model="main_camera"
        class="mr-4 cam_radio"
        vs-name="cam_main"
      ></vs-radio>
    </div>
    <div>
      {{ params.data.name }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      main_camera: false,
      delayTimer: null,
    };
  },
  methods: {
    setMain() {
      clearTimeout(this.delayTimer);

      this.delayTimer = setTimeout(() => {
        this.$root.$emit("setMainCamera", this.params.data);
      }, 300);
    },
  },
  computed: {},
  created() {
    if (this.params.data.main) {
      this.main_camera = this.params.data.id;
    }
  },
};
</script>

<style lang="scss" scoped>
.view_icon {
  font-size: 40px;
  cursor: pointer;
}
</style>
