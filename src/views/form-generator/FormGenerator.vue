<template>
  <div class="parent_form">
    <component
      class="input_form_field"
      v-for="(field, index) in schema"
      :key="index"
      :is="field.type"
      :value="formData[field.name]"
      @input="updateForm(field.name, $event)"
      v-bind="field"
    ></component>
  </div>
</template>

<script>
import numberInput from "./form/NumberInput";
import multiSelectInput from "./form/MultiSelectInput";
import selectInput from "./form/Select";
import textInput from "./form/TextInput";
import checkBox from "./form/Checkbox";

import uploadFile from "./form/FilesUpload";
import imageUpload from "./form/Button";

import switchButton from "./form/Switch";

import editor from "./form/Editor";
import emailInput from "./form/Email";
import dateInput from "./form/DateInput";

export default {
  name: "FormGenerator",
  components: {
    numberInput,
    selectInput,
    textInput,
    checkBox,
    uploadFile,
    imageUpload,
    editor,
    emailInput,
    switchButton,
    dateInput,
    multiSelectInput,
  },
  props: ["schema", "value"],
  data() {
    return {
      formData: this.value || {},
      lng: localStorage.lng,
    };
  },
  methods: {
    updateForm(fieldName, value) {
      this.$set(this.formData, fieldName, value);

      this.$emit("input", this.formData);
    },
  },
};
</script>

<style lang="scss" scoped>
.parent_form {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 -10px;
  .input_form_field {
    flex: 0 0 50%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    margin-top: auto;
    input {
      margin: 0 !important;
    }
  }
}
</style>