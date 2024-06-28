<template>
  <div>
    <div class="vx-row">
      <div class="vx-col md:w-1/3">
        <img :src="imageSrc" class="mr-8 rounded h-24 w-24 card_avatar" />
      </div>
      <div class="vx-col md:w-2/3">
        <h3>Media heading</h3>

        <span
          >Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
          scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in
          vulputate at, tempus viverra turpis.
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageSrc: "Transparency500.png",
    };
  },
};
</script>