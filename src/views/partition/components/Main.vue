<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <span> Идентификатор объекта: W67468335684FC825 </span>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-1/2">
        <div class="mt-2">
          <vs-input label="Name" class="w-full" name="name" />
        </div>

        <div class="mt-2">
          <vs-input label="Responsible person" class="w-full" name="name" />
        </div>

        <div class="mt-2">
          <vs-input label="Email" rules="email" class="w-full" name="name" />
        </div>

        <div class="mt-2">
          <vs-input label="Phone 1" class="w-full" name="name" />
        </div>

        <div class="mt-2">
          <vs-input label="Phone 2" class="w-full" name="name" />
        </div>

        <div class="mt-2">
          <label for="" class="vs-input--label mt-4">Country</label>

          <v-select
            :options="[]"
            class="select_padding w-full"
            name="status"
            placeholder="Outputs"
            :reduce="(source) => source.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>

        <div class="mt-2">
          <label for="" class="vs-input--label mt-4">City</label>

          <v-select
            :options="[]"
            class="select_padding w-full"
            name="status"
            placeholder="Outputs"
            :reduce="(source) => source.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
      </div>
      <div class="vx-col w-1/2">
        <div class="mt-2">
          <label for="" class="vs-input--label mt-4">Time zone</label>

          <v-select
            :options="[]"
            class="select_padding w-full"
            name="status"
            placeholder="Outputs"
            :reduce="(source) => source.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>

        <div class="vx-row">
          <div class="vx-col w-1/2">
            <div class="mt-2">
              <label for="" class="vs-input--label mt-4">Date format</label>

              <v-select
                :options="[]"
                class="select_padding w-full"
                name="status"
                placeholder="Outputs"
                :reduce="(source) => source.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
            </div>
          </div>
          <div class="vx-col w-1/2">
            <div class="mt-2">
              <label for="" class="vs-input--label mt-4">Time format</label>

              <v-select
                :options="[]"
                class="select_padding w-full"
                name="status"
                placeholder="Outputs"
                :reduce="(source) => source.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
export default {
  components: {
    vSelect,
  },
};
</script>

<style>
</style>