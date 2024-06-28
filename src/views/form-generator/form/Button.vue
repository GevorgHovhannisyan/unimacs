<template>
  <div>
    <!--    <img :src="`${env}/${value}`" class="mr-8 rounded h-24 w-24" />-->
    <vs-divider />
    <div class="upload_block mt-5 mb-5">
      <div class="upload_inner">
        <div class="inner_block" v-if="imageSrc">
          <div class="upload_img">
            <vx-tooltip :text="imageTooltip ? imageTooltip : 'No Photo'">
              <img :src="imageSrc" alt title />
            </vx-tooltip>
          </div>
          <div class="remove_btn" style="cursor: pointer">
            <a @click="removeFile">Remove</a>
          </div>
        </div>
        <input
          type="file"
          class="hidden"
          name="file"
          ref="update_avatar_input"
          @change="uploadImage($event.target.files[0])"
          multiple
        />
        <vs-button
          type="border"
          class="mr-4"
          @click="$refs.update_avatar_input.click()"
          >{{ label }}</vs-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import moduleFile from "@/store/files/moduleFile.js";

export default {
  name: "buttons",
  props: ["multi", "name", "label", "value", "image"],
  data() {
    return {
      env: process.env.VUE_APP_BACK,
      imageSrc: null,
      imageTooltip: "No Photo",
      file: null,
    };
  },
  created() {
    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    if (this.value && this.value.path) {
      this.imageSrc = `${process.env.VUE_APP_BACK}/${this.value.path}`;
      this.imageTooltip = this.value.name;
    }
  },
  methods: {
    uploadImage(event) {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("file/uploadFile", event)
        .then((res) => {
          this.imageSrc = `${process.env.VUE_APP_BACK}/${res.data.path}`;
          this.imageTooltip = res.data.name;
          this.$emit("input", { path: res.data.path, name: res.data.name });

          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    removeFile() {
      this.imageSrc = null;
      this.imageTooltip = "No Photo";
      this.file = null;

      this.$emit("input", null);
    },
  },
};
</script>

