<template>
  <div>
    <div class="vx-row">
      <div class="vx-col md:w-1/2 r_padd">
        <div class="inner_block">{{ online }} Online</div>
      </div>
      <div class="vx-col md:w-1/2 l_padd">
        <div class="inner_block gray_color">{{ offline }} Offline</div>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col md:w-full">
        <div class="inner_block">{{ active }} Active</div>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col md:w-full">
        <div class="inner_block block_color">{{ no_hardware }} No Hardware</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    access_pointData: {
      type: Array,
    },
    statuses: {
      type: Array,
    },
  },
  watch: {
    access_pointData(data) {
      this.bindData(data);
    },
    statuses(data) {
      this.bindStatuses(data);
    },
    changeStatus(data) {
      if (data.type == "delete") {
        if (status == "online") {
          this.online--;
        } else if (status == "offline") {
          this.offline--;
        }
      } else if (data.type == "change") {
        if (status == "online") {
          this.online++;
          this.offline--;
        } else if (status == "offline") {
          this.online--;
          this.offline++;
        }
      }
    },
  },
  data() {
    return {
      active: 0,
      no_hardware: 0,
      online: 0,
      offline: 0,
    };
  },
  methods: {
    bindData(array) {
      let active = 0;
      let no_hardware = 0;

      if (array && array.length) {
        if (array.find((e) => e.acu_status == "active")) {
          active = array.find((e) => e.acu_status == "active").acp_qty;
        }

        if (array.find((e) => e.acu_status == "no_hardware")) {
          no_hardware = array.find(
            (e) => e.acu_status == "no_hardware"
          ).acp_qty;
        }

        this.active = active;
        this.no_hardware = no_hardware;
      }
    },
    bindStatuses(array) {
      let online = 0;
      let offline = 0;

      if (array && array.length) {
        array.forEach((status) => {
          if (status.acus.cloud_status) {
            if (status.acus.cloud_status == "offline") {
              offline++;
            } else if (status.acus.cloud_status == "online") {
              online++;
            }
          }
        });
      }

      this.online = online;
      this.offline = offline;
    },
  },
  created() {
    this.bindData(this.access_pointData);
    this.bindStatuses(this.statuses);
  },
};
</script>