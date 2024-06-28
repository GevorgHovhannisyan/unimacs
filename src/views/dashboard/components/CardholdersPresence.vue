<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="inner_block">{{ presense }} Present</div>
      </div>
      <div class="vx-col w-full">
        <div class="inner_block red_color">
          {{ absent_no_reason }} Absent / No Reason
        </div>
      </div>
    </div>
    <div class="vx-col w-full">
      <div class="inner_block yellow_color">
        {{ absent_by_reason }} Absent / By Reason
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    propsData: {
      type: Array,
    },
  },
  watch: {
    propsData(data) {
      this.bindData(data);
    },
  },
  data() {
    return {
      presense: 0,
      absent_no_reason: 0,
      absent_by_reason: 0,
    };
  },
  methods: {
    bindData(array) {
      let presense = 0;
      let absent_no_reason = 0;
      let absent_by_reason = 0;

      if (array && array.length) {
        if (array.find((e) => e.cardholder_presense == "presense")) {
          presense = array.find(
            (e) => e.cardholder_presense == "presense"
          ).cardholder_qty;
        }

        if (array.find((e) => e.cardholder_presense == "absent_no_reason")) {
          absent_no_reason = array.find(
            (e) => e.cardholder_presense == "absent_no_reason"
          ).cardholder_qty;
        }

        if (array.find((e) => e.cardholder_presense == "absent_by_reason")) {
          absent_by_reason = array.find(
            (e) => e.cardholder_presense == "absent_by_reason"
          ).cardholder_qty;
        }

        this.presense = presense;
        this.absent_no_reason = absent_no_reason;
        this.absent_by_reason = absent_by_reason;
      }
    },
  },
  created() {
    this.bindData(this.propsData);
  },
};
</script>