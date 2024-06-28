<template>
  <div v-if="!isHidden">
    <vs-checkbox
      class="mb-4 mt-5"
      :disabled="disabled"
      @change="$emit('input',$event.target.checked)"
      :value="value"
    >{{label}}</vs-checkbox>
  </div>
</template>
<script>
export default {
  name: "checkbox",
  props: ["label", "name", "value", "readOnly", "hidden"],
  data() {
    return {
      val: this.value,
      disabled: false,
      isHidden: false,
    };
  },
  created() {
    if (!this.value) {
      this.$emit("input", false);
    } else {
      this.$emit("input", true);
    }

    if (this.readOnly) {
      this.disabled = true;
    }

    if (this.hidden) {
      this.isHidden = true;
    }
  },
};
</script>
