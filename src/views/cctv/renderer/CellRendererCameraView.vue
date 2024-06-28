<template>
  <div>
    <p class="product-name font-medium truncate text-center">
      <vs-icon icon-pack="material-icons" icon="video_call" @click="showCamera" class="view_icon" />
    </p>
  </div>
</template>

<script>
export default {
  methods: {
    showCamera(){
      this.$root.$emit('showCctvCamera', this.params.data)
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
