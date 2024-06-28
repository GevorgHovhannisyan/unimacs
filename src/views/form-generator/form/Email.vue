<template>
  <div>
    <vs-input
      class="w-full mt-4"
      :label="label"
      :name="name"
      :value="email_value"
      v-validate="isRequired?'required|email':'email'"
      type="email"
      @input="write($event)"
      :data-vv-as="name"
    />
    <!-- $emit('input',$event); -->
    <span
      class="text-danger text-sm"
      v-if="errors.first(name) || !value"
    >{{label}} must be a valid email</span>
  </div>
</template>
<script>
export default {
  name: "email",
  props: ["label", "name", "value", "required"],
  data() {
    return {
      isRequired: false,
      email_value: this.value,
    };
  },
  methods: {
    write(event) {
      this.$emit("input", event);
      this.email_value = event;

      if (!event) {
        this.errors.add({
          field: this.name,
          msg: `${this.label} must be a valid email`,
        });
      }
    },
  },
  created() {
    if (this.required) {
      this.isRequired = true;

      if (!this.email_value) {
        this.errors.add({
          field: this.name,
          msg: `${this.label} must be a valid email`,
        });
      }
    }
  },
};
</script>
<style lang="scss">
.modulesPage {
  .input-select-con,
  .number_input,
  .vs-input--input {
    max-width: 460px;
  }

  .number_input {
    display: flex;
    flex-direction: column;
  }

  .switchButton_module {
    display: flex;

    label {
      padding-right: 15px;
    }
  }
  .upload_block {
    display: flex;
    flex-wrap: wrap;
  }

  .file-upload {
    position: relative;
    overflow: hidden;
    margin: 10px;
  }

  .file-upload {
    position: relative;
    overflow: hidden;
    margin: 10px;
    width: 100%;
    max-width: 150px;
    text-align: center;
    color: #fff;
    font-size: 1.2em;
    background: transparent;
    border: 2px solid #888;
    padding: 0.85em 1em;
    display: inline;
    -ms-transition: all 0.2s ease;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;

    &:hover {
      background: #999;
      -webkit-box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.75);
      -moz-box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.75);
      box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.75);
    }
  }

  .file-upload input.file-input {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    filter: alpha(opacity=0);
    height: 100%;
  }

  .inner_block {
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
    -webkit-transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 25px;
    width: 100%;
    height: 100%;
  }

  .upload_inner {
    flex: 0 0 20%;
    max-width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 15px;
  }

  .upload_img {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
    padding-bottom: 55.5%;
    position: relative;
    width: 100%;

    img {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .remove_btn {
    margin-bottom: 25px;
    margin-top: 25px;

    a {
      background: #7367f0;
      color: white;
      padding: 10px 25px;
      border-radius: 5px;
      -webkit-transition: all 0.3s ease;
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.5;
      }
    }
  }

  .upload_btn {
    padding: 0 !important;
    border: none !important;

    &:hover {
      background: none !important;
      opacity: 0.5;
    }
  }
}
</style>
