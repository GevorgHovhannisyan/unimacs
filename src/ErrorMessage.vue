<template>
  <div>
    <h3>
      {{ message.error_description ? message.error_description : message }}
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
    },
  },
};
</script>

<style>
</style>