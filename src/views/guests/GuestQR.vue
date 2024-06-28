<template>
  <div>
    <div class="guest_qr_code">
      <div class="title">{{ guest.first_name }} {{ guest.last_name }}</div>

      <div class="date">
        <span> {{ guest.start_date }} </span>

        <span> {{ guest.end_date }} </span>
      </div>

      <div class="qr_part">
        <div class="code">Code {{ guest.code }}</div>
        <div class="qr_code">
          <vue-qr :text="guest.code" :size="200"></vue-qr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";

export default {
  components: {
    VueQr
  },
  data() {
    return {
      token: null,
      guest: {
        code: "",
        start_date: null,
        end_date: null
      }
    };
  },
  methods: {
    getGuestQR(token) {
      this.$http.get(`guest/credential/${token}`).then(res => {
        const data = res.data;

        if (data) {
          this.guest = { ...data };

          const new_timestamp_start = this.$moment
            .utc(data.start_date)
            .toDate();
          const new_timestamp_end = this.$moment.utc(data.end_date).toDate();

          const correctStartTime = this.$moment(new_timestamp_start).format(
            "HH:mm:ss"
          );
          const correctEndTime = this.$moment(new_timestamp_end).format(
            "HH:mm:ss"
          );

          const correctStartDate = this.$moment(new_timestamp_start).format(
            "YYYY-MM-DD"
          );
          const correctEndDate = this.$moment(new_timestamp_end).format(
            "YYYY-MM-DD"
          );

          this.guest.start_date = correctStartDate + " " + correctStartTime;
          this.guest.end_date = correctEndDate + " " + correctEndTime;
        }
      });
    }
  },
  created() {
    const token = this.$route.params.token;

    this.getGuestQR(token);
  }
};
</script>

<style lang="scss">
.guest_qr_code {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  border: 2px solid;
  padding-bottom: 20px;
  margin-top: 50px;
  .title {
    background: #00000073;
    color: white;
    font-weight: 400;
    font-size: 20px;
  }
  .date {
    display: flex;
    flex-direction: column;
    span {
      font-size: 20px;
      font-weight: 600px;
      font-weight: 500;
      margin-top: 5px;
    }
  }

  .qr_part {
    .code {
      padding-top: 15px;
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 15px;
    }
    .qr_code {
      display: inline-block;
      border: 2px solid #898989;
    }
  }
}
</style>
