<template>
  <div v-if="!isHidden">
    <label>{{label}}</label>
    <input
      type="number"
      :name="name"
      class="number_input"
      :value="val"
      @input="write($event.target.value);"
      :placeholder="label"
      v-validate="isRequired?'required':undefined"
      :disabled="disabled"
      :data-vv-as="name"
    />
    <span class="text-danger text-sm" v-if="errors.first(name) || isRequired && !value">{{errorMsg}}</span>
  </div>
</template>
<script>
export default {
  name: "NumberInput",
  props: [
    "placeholder",
    "label",
    "name",
    "value",
    "readOnly",
    "hidden",
    "required",
  ],
  data() {
    return {
      disabled: false,
      isHidden: false,
      isRequired: false,
      val: this.value,
    };
  },
  computed: {
    errorMsg() {
      return `${this.label} is required`;
    },
  },
  methods: {
    write(event) {
      this.$emit("input", event);
      this.val = event;

      if (!event) {
        this.errors.add({
          field: this.name,
          msg: `${this.label} must be a valid email`,
        });
      }
    },
  },

  created() {
    if (this.readOnly) {
      this.disabled = true;
    }

    if (this.hidden) {
      this.isHidden = true;
    }

    if (this.required) {
      this.isRequired = true;

      if (!this.val) {
        this.errors.add({
          field: this.name,
          msg: this.errorMsg,
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.number_input {
  border-radius: 5px;
  color: inherit;
  position: relative;
  padding: 0.6rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  width: 100%;
}
</style>
