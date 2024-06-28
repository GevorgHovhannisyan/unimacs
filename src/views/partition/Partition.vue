<template>
  <div class="partition_page">
    <vx-card>
      <div>
        <vs-tabs>
          <vs-tab label="Main">
            <Main />
          </vs-tab>
          <vs-tab label="Sections">
           <Sections />
          </vs-tab>
        </vs-tabs>
      </div>

      <div class="actions w-full">
        <vs-button class="unimacs_button" >
          Submit
        </vs-button>
      </div>
    </vx-card>
  </div>
</template>

<script>
import Main from "./components/Main";
import Sections from "./components/Sections";

export default {
  components: {
    Main,
    Sections
  },
};
</script>

<style lang="scss">
.partition_page {
    .actions {
        display: flex;
        justify-content: flex-end;
    }
}
</style>