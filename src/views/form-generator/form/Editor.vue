<template>
  <div class="editor_form">
    <h3 class="mb-5">{{ label }}</h3>

    <quill-editor
      class="vx-col w-full mb-5"
      :value="value"
      :name="name"
      @change="$emit('input', $event.html)"
    ></quill-editor>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  name: "editor",
  props: ["label", "name", "value"],
  components: {
    quillEditor,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.editor_form {
  margin-top: 1.25rem !important;
}
</style>
