<template>
  <div>
    <vs-dropdown vs-trigger-click class="cursor-pointer ml-3" vs-custom-content>
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
          @click="
            !params.data.disabled ||
            action.action === 'deleteAcu' ||
            action.action === 'detachHardwareAcu' ||
            action.action === 'copyAcu' ||
            action.action === 'pasteAcu'
              ? $root.$emit(action.action, params.data)
              : false
          "
          v-for="(action, index) in contextMenus"
          :key="index"
          :class="{
            drop_dsbl:
              params.data.disabled &&
              action.action !== 'detachHardwareAcu' &&
              action.action !== 'deleteAcu' &&
              action.action !== 'copyAcu' &&
              action.action !== 'pasteAcu',
          }"
        >
          <span class="flex items-center">
            <span>{{ action.name }}</span>
          </span>
        </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
export default {
  name: "CellRendererApActions",
  data() {
    return {
      contextMenus: [
        { name: "Activate", action: "activateAcu" },
        { name: "Copy", action: "copyAcu" },
        { name: "Paste", action: "pasteAcu", disabled: true },
        { name: "Attach Hardware", action: "attachHardwareAcu" },
        { name: "Change Acu", action: "detachHardwareAcu" },
        { name: "Edit", action: "updateItemAcu" },
        { name: "Delete", action: "deleteAcu" },
      ],
    };
  }
};
</script>
