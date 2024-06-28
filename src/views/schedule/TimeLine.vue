<template>
  <div class="timeline_line">
    <div
      class="timeline_item_small"
      v-for="item in items"
      :key="item.id"
      :style="stylingItem(item)"
    >
      <vx-tooltip :text="item ? item.start + '-' + item.end : ''">
        {{ item.start ? item.start.split(":", 2).join(":") : "" }}
      </vx-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    array: {
      type: Array,
      required: true,
    },
  },
  watch: {
    array() {
      this.items = this.array;
    },
  },
  data() {
    return {
      items: this.array,
    };
  },
  methods: {
    stylingItem(item) {
      if((item.start == '00:00:00' &&  item.end == '00:00:00') || item.start == '00:00' &&  item.end == '00:00') {
        return {width:0, left: 0} ;
      }
      const end = item.end.split(":")
      let width = 0

      if(end[0] == 23) {
        if(end[1] <= 52 && end[1] >= 50) width = 2
        else if(end[1] <= 58 && end[1] >= 52) width = 3
        else if(end[1] >= 58) width = 4
      }
      
      return {
        width:
          ((100 / 24) * (parseInt(item.end) - parseInt(item.start)) == 0
            ? 1 + "%"
            : (100 / 24) * (parseInt(item.end) - parseInt(item.start)) + width ) + "%",
        left: (parseInt(item.start) / 24) * 100 + "%",
      };
    },
  },
};
</script>


<style lang="scss" scoped>
.timeline_line {
  position: relative;
  width: 100%;
  height: 15px;
  outline: 1px solid #66c666;
  overflow: hidden;
}
.timeline_item_small {
  background: #66c666;
  border-right: 1px solid white;
  height: 100%;
  font-size: 9px;
  text-align: center;
  color: white;
  position: absolute;
  opacity: 0.8;
}
</style>
