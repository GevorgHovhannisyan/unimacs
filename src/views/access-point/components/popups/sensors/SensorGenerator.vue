<template>
  <div>
    <form-generator :schema="arrayOfForm" v-model="formData"></form-generator>
  </div>
</template>


<script>
import FormGenerator from "../../../../form-generator/FormGenerator";

export default {
  props: {
    popupActive: {
      type: Boolean,
    },
    sensorData: {
      type: Object,
    },
    sensorType: {
      type: Object,
    },
  },
  data() {
    return {
      popup: false,
      formData: {},
      arrayOfForm: [],
    };
  },
  computed: {
    readers() {
      return this.$store.state.accessPoint.readers;
    },
    active_reader() {
      return this.$store.state.accessPoint.active_reader;
    },
    active_point() {
      return this.$store.state.accessPoint.active_point;
    },
    access_points() {
      return this.$store.state.accessPoint.acu_data.access_points;
    },
    resources() {
      return this.$store.state.accessPoint.resources;
    },
  },
  watch: {
    popupActive(val) {
      this.popup = val;
      this.$emit("popup", val);
    },
    popup(val) {
      this.$emit("popup", val);
    },
    active_reader(reader) {
      const reader_data =
        this.access_points[this.active_point].readers[this.active_reader];

      const form_fields =
        this.resources[reader_data.data.title][reader_data.data.device];

      if (reader_data.reader_info) {
        if ("interface_type" in reader_data.reader_info) {
          this.genFormByType(reader_data.reader_info.interface_type);

          this.formData = { ...reader_data.reader_info };
        } else {
          this.genFormByType(form_fields);

          this.formData = { ...reader_data.reader_info };
        }
      } else {
        this.genFormByType(form_fields);
      }
    },
    "formData.interface_type"(interface_type) {
      this.genFormByType(interface_type);
    },
    formData: {
      handler: function (formData) {
        const reader_data =
          this.access_points[this.active_point].readers[this.active_reader];

        const form_fields =
          this.resources[reader_data.data.title][reader_data.data.device];

        this.$store.commit("accessPoint/SET_READER_DATA", {
          data: formData,
        });

      },
      deep: true,
    },
  },
  methods: {
    initGenerator(form_fields) {
      this.arrayOfForm = [];
      let arrayofForm = [];

      if (Object.keys(form_fields).length) {
        Object.keys(form_fields).forEach((key) => {
          let obj = {};
          obj["type"] = form_fields[key].type;
          obj["name"] = key;
          obj["label"] = key;
          if (form_fields[key].list) {
            obj["list"] = form_fields[key].list;
          }
          arrayofForm.push(obj);
        });
        this.arrayOfForm = [...arrayofForm];
      }
    },
    genFormByType(type) {
      const reader_data =
        this.access_points[this.active_point].readers[this.active_reader];

      const form_fields =
        this.resources[reader_data.data.title][reader_data.data.device];

      if (type === 0) {
        const genFields = {
          interface_type: form_fields.interface_type,
          ...form_fields.osdp,
        };

        this.initGenerator(genFields);
      } else if (type !== 0) {
        const genFields = {
          interface_type: form_fields.interface_type,
          ...form_fields.wiegand,
        };
        this.initGenerator(genFields);
      }
    },
    readerGenerator(form_fields) {
      this.arrayOfForm = [];
      if (Object.keys(form_fields).length) {
        Object.keys(form_fields).forEach((key) => {
          let obj = {};
          obj["type"] = form_fields[key].type;
          obj["name"] = key;
          obj["label"] = key;
          if (form_fields[key].list) {
            obj["list"] = form_fields[key].list;
          }
          this.arrayOfForm.push(obj);
        });
      }
    },
  },
  created() {
    const reader_data =
      this.access_points[this.active_point].readers[this.active_reader];

    const form_fields =
      this.resources[reader_data.data.title][reader_data.data.device];


    this.initGenerator(form_fields);
  },
  components: {
    FormGenerator,
  },
};
</script>