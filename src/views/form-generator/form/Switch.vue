<template>
  <div class="mt-5 switchButton_module" v-if="!isHidden">
    <label>{{ label }}</label>
    <vs-switch
      class="mb-5"
      color="success"
      :name="name"
      :value="val"
      :disabled="disabled"
      @input="
        $emit('input', $event);
        check($event);
      "
    >
      <span slot="on">Active</span>
      <span slot="off">Inactive</span>
    </vs-switch>
  </div>
</template>

<script>
export default {
  name: "switchButton",
  props: ["value", "label", "readOnly", "hidden", "name"],
  data() {
    return {
      val: this.value,
      lab: this.label,
      isHidden: false,
      disabled: false,
    };
  },
  methods: {
    check(event) {
      this.val = event;
    },
  },
  created() {
    if (!this.value) {
      this.$emit("input", false);
    }
    if (!this.label) {
      this.label = this.name;
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

<style>
</style>
