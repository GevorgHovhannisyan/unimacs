<template>
  <div @click.stop="() =>  false">
    <vs-dropdown class="cursor-pointer ml-3" vs-custom-content>
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
          @click.stop="$root.$emit(action.action, params.data)"
          v-for="(action, index) in contextMenus"
          :key="index"
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
        // { name: "Execute Now", action: "executeTask" },
        { name: "Enable", action: "enableTask" },
        { name: "Disable", action: "disableTask" },
        { name: "Delete", action: "deleteRecordTask" },
      ],
    };
  },
};
</script>
