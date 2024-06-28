<template>
  <div>
    <vs-dropdown
      ref="vs_drop"
      class="cursor-pointer ml-3"
      vs-trigger-click
    >
      <div class="p-3 cursor-pointer">
        <span class="mr-2 leading-none"
          ><vs-icon
            style="font-size: 25px"
            icon-pack="material-icons"
            icon="reorder"
        /></span>
      </div>

      <vs-dropdown-menu>
        <vs-dropdown-item
          @click="$root.$emit('editCCTVCamera', params.data)"
        >
          <span class="flex items-center">
            <span>Edit</span>
          </span>
        </vs-dropdown-item>

        <vs-dropdown-item
          @click="$root.$emit('hideCCTVCamera', params.data)"
        >
          <span class="flex items-center">
            <span>Hide</span>
          </span>
        </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contextMenus: [
        { name: "Hidden", action: "hideCCTVCamera" },
        { name: "Edit", action: "editCCTVCamera" },
      ],
    };
  },
};
</script>
