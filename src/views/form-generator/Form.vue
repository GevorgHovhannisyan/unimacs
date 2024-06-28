<template>
  <div>
    <h1>Form Generator</h1>

    <form-generator :schema="array" v-model="formData"></form-generator>

    <p>
      Hello {{ formData.title }} {{ formData.firstName }}
      {{ formData.lastName }}, I hear you are {{ formData.age }} years old.
      {{ formData.checkbox }}
    </p>

    <vs-button @click="saveModule">Save</vs-button>
  </div>
</template>

<script>
import FormGenerator from "./FormGenerator";
// import schema from "./page-configs/slider.json";
import schema from "./page-configs/conf.json";

export default {
  name: "GeneratorDemo",
  components: { FormGenerator },
  data() {
    return {
      formData: {},
      schema: schema,
      array: [],
      lng: "en",
    };
  },
  created() {
    Object.keys(this.schema.fields).forEach((key) => {
      let obj = {};

      obj["type"] = this.schema.fields[key].formType;
      obj["name"] = key;
      obj["label"] = this.schema.fields[key].label;

      if (this.schema.fields[key].selections) {
        obj["selections"] = this.schema.fields[key].selections;
      }

      this.array.push(obj);
    });
  },
  methods: {
    saveModule() {},
  },
};
</script>
