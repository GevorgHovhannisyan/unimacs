<template>
  <div>
    <vs-divider />

    <div class="upload_block" v-if="value && value.length">
      <div class="upload_inner" v-for="(file, index) in files" :key="index">
        <div class="inner_block">
          <div class="upload_img">
            <vx-tooltip :text="file.name ? file.name : 'No Photo'">
              <img :src="file.image" alt title />
            </vx-tooltip>
          </div>
          <div class="remove_btn" style="cursor: pointer">
            <a @click="remFile(file)">Remove</a>
          </div>
        </div>
      </div>
    </div>
    <vs-divider />
    <div class="upload_block">
      <div
        class="upload_inner"
        v-for="(file, index) in newUploads"
        :key="index"
      >
        <div class="inner_block">
          <div class="upload_img">
            <img :src="file.image" alt title />
          </div>
          <div class="remove_btn" style="cursor: pointer">
            <a @click="removeUploaded(file)">Remove</a>
          </div>
        </div>
      </div>
      <div class="vx-row">
        <input
          type="file"
          class="hidden"
          name="file"
          ref="uploadFile"
          @change="uploadFile($event.target.files)"
          multiple
        />
        <vs-button
          type="border"
          class="ml-4 upload_btn"
          @click="$refs.uploadFile.click()"
          >Upload File</vs-button
        >
      </div>
    </div>
    <vs-divider />
  </div>
</template>


<script>
import moduleFile from "@/store/files/moduleFile.js";

export default {
  name: "buttons",
  props: ["name", "label", "value"],
  data() {
    return {
      newUploads: [],
      count: 0,
      files: [],
      remfilePath: null,
      filesPath: null,
    };
  },

  methods: {
    uploadFile(files) {
      this.$vs.loading({
        type: "corners",
      });
      var input = files;

      input.forEach((file) => {
        this.$store
          .dispatch("file/uploadFile", file)
          .then((res) => {
            let name = res.data.path.split(".");
            if (
              name[name.length - 1] == "ico" ||
              name[name.length - 1] == "svg" ||
              name[name.length - 1] == "jpg" ||
              name[name.length - 1] == "png"
            ) {
              this.newUploads.push({
                name: res.data.name,
                path: res.data.path,
                image: `${process.env.VUE_APP_BACK}/${res.data.path}`,
              });
            } else {
              this.newUploads.push({
                name: res.data.name,
                path: res.data.path,
                image: "/doc.png",
              });
            }
            let clearedFiles = [];

            this.newUploads.forEach((file) => {
              clearedFiles.push({ name: file.name, path: file.path });
            });

            this.files.forEach((file) => {
              clearedFiles.push({ name: file.name, path: file.path });
            });

            this.$emit("input", clearedFiles);
            this.$vs.loading.close();
          })
          .catch((error) => {
            this.$vs.loading.close();
          });
      });
    },
    removeFile(file) {
      const find = this.files.findIndex((img) => img.path == this.remfilePath);

      this.files.splice(find, 1);

      let clearedFiles = [];

      this.newUploads.forEach((file) => {
        clearedFiles.push({ name: file.name, path: file.path });
      });

      this.files.forEach((file) => {
        clearedFiles.push({ name: file.name, path: file.path });
      });

      this.$emit("input", clearedFiles);
      this.$vs.loading.close();
    },
    removeUploaded(e) {
      this.filesPath = e.path;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${e.name}`,
        accept: this.removeUploadedFile,
        acceptText: "Delete",
      });
    },

    removeUploadedFile() {
      let files = [];
      const findInPage = this.newUploads.findIndex(
        (img) => img.path == this.filesPath
      );

      this.newUploads.splice(findInPage, 1);

      let clearedFiles = [];

      this.newUploads.forEach((file) => {
        clearedFiles.push({ name: file.name, path: file.path });
      });

      this.files.forEach((file) => {
        clearedFiles.push({ name: file.name, path: file.path });
      });

      this.$emit("input", clearedFiles);
    },
    remFile(e) {
      this.remfilePath = e.path;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${e.name}`,
        accept: this.removeFile,
        acceptText: "Delete",
      });
    },
  },
  created() {
    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    if (this.value && this.value.length) {
      this.value.forEach((file) => {
        let name = file.name.split(".");
        if (
          name[name.length - 1] == "ico" ||
          name[name.length - 1] == "svg" ||
          name[name.length - 1] == "jpg" ||
          name[name.length - 1] == "png"
        ) {
          this.files.push({
            name: file.name,
            path: file.path,
            image: `${process.env.VUE_APP_BACK}/${file.path}`,
          });
        } else {
          this.files.push({
            name: file.name,
            path: file.path,
            image: "/doc.png",
          });
        }
      });
    }
  },
};
</script>


<style scoped>
</style>
