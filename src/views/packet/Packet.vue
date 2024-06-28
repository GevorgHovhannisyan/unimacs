<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container packets_page">
    <vs-popup class="holamundo" title="Notification" :active.sync="notif_popup">
      <p class="notif_text">
        Your account should be activated.
        <br />
        Please wait, we will contact you soon.
      </p>

      <vs-button
        class="float-right mt-6 unimacs_button"
        @click="notif_popup = false"
        >OK</vs-button
      >
    </vs-popup>

    <div class="vx-row conteiner">
      <div
        class="vx-col md:w-1/3 mt-4"
        v-for="(packet, index) in packets"
        :key="index"
      >
        <div class="vx-card text-center">
          <div class="card__body">
            <div>
              <h3>{{ packet.name }}</h3>
              <p class="card-text">contact us for more info</p>

              <!-- <p class="card-text">30 DAYS FOR FREE</p> -->
              <!-- <div class="annual-plan">
                <div class="plan-price mt-2">
                  <sup class="font-medium-1 font-weight-bold text-primary"
                    >$</sup
                  ><span
                    class="pricing-basic-value font-weight-bolder text-primary"
                    >{{ packet.price }}</span
                  ><sub
                    class="
                      pricing-duration
                      text-body
                      font-medium-1 font-weight-bold
                    "
                    >/month</sub
                  >
                </div>
              </div> -->
              <div class="list-group list-group-circle text-left">
                <div
                  class="list-group-item"
                  v-for="(option, index) in packet.resources"
                  :key="index"
                >
                  {{ option.name }} - {{ option.count }}
                </div>
              </div>
            </div>

            <button
              type="button"
              class="btn mt-2 btn-block"
              :class="{
                btn__success: selected == packet.id,
                btn__upgrade: selected != packet.id,
                btn__upgraded: upgraded_package == packet.id,
                btn__disabled: upgraded_package == packet.id,
              }"
              :disabled="upgraded_package == packet.id"
              @click="selected == packet.id ? false : confirmGetPacket(packet)"
            >
              {{
                selected == packet.id
                  ? "Your current plan"
                  : upgraded_package == packet.id
                  ? "Waiting for upgrade"
                  : !selectedPack
                  ? "Set package"
                  : "Upgrade"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modulePacketType from "@/store/packet/modulePackets.js";
export default {
  data() {
    return {
      packets: [],
      selected: null,
      selectedPacket: {},
      notif_popup: false,
      upgraded_package: null,
    };
  },
  computed: {
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },
    selectedPack() {
      return localStorage.user && JSON.parse(localStorage.user).package
        ? JSON.parse(localStorage.user).package
        : null;
    },
  },
  methods: {
    confirmGetPacket(packet) {
      this.selectedPacket = packet;
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `Confirm Changes`,
        text: `Do You want to change package`,
        accept: this.getPacket,
        acceptText: "Change Package",
      });
    },
    getPacket() {
      this.$vs.loading({
        type: "corners",
      });

      let companyId = localStorage.user
        ? JSON.parse(localStorage.user).company
        : null;

      if (companyId) {
        this.$http
          .put(
            `company`,
            {
              package: this.selectedPacket.id,
              id: companyId,
            },
            { headers: { Authorization: localStorage.token } }
          )
          .then((res) => {
            this.$vs.loading.close();

            this.notif_popup = true;
            this.$http
              .get(`account/getUserData`, {
                headers: { Authorization: localStorage.token },
              })
              .then((res) => {
                this.setUpgraded(res.data);
              });
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      }
    },
    setUpgraded(data) {
      if (data && data.upgraded_package_id) {
        this.upgraded_package = data.upgraded_package_id;
      } else {
        const upgraded_package_id =
          localStorage.user && JSON.parse(localStorage.user).upgraded_package_id
            ? JSON.parse(localStorage.user).upgraded_package_id
            : null;
        this.upgraded_package = upgraded_package_id;
      }
    },
  },
  created() {
    if (!modulePacketType.isRegistered) {
      this.$store.registerModule("packet", modulePacketType);
      modulePacketType.isRegistered = true;
    }
    this.setUpgraded();
    this.$store.dispatch("pagePermissions", this.permissions).then((res) => {
      if (res != true) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: `You haven't access to enter to ${this.$route.name}`,
        });
        setTimeout(() => {
          // this.$router.push(res).catch(() => {});
          this.$router.push("/error-404").catch(() => {});
        }, 100);

        return false;
      } else {
        this.$store
          .dispatch("packet/fetchPackets")
          .then((res) => {
            let packets = [];

            const data = "selected" in res.data ? res.data.data : res.data;
            const package_types = res.data.package_types
              ? res.data.package_types
              : [];

            if (res.data.selected) {
              this.selected = res.data.selected;
            }

            this.$vs.loading.close();
            data.forEach((type) => {
              if (type.pay_terms) {
                type.pay_terms = JSON.parse(type.pay_terms);
              }
              if (type.extra_settings) {
                type.extra_settings = JSON.parse(type.extra_settings);
              }

              if (type.extra_settings && type.extra_settings.resources) {
                let resource = type.extra_settings;

                let arr = [];
                for (const key in resource.resources) {
                  arr.push({ name: key, count: resource.resources[key] });
                }

                if (
                  resource.package_types &&
                  Object.keys(resource.package_types).length
                ) {
                  for (const key in resource.package_types) {
                    const pack_type = package_types.find((p) => p.id == key);
                    arr.push({
                      name: pack_type.name,
                      count: resource.package_types[key],
                    });
                  }
                }

                type.resources = arr;
              }
              packets.push(type);
            });
            this.packets = packets;
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      }
    });
  },
};
</script>


<style lang="scss" scoped>
.packets_page .vs-dialog-accept-button {
  background: rgb(228, 206, 85) !important;
  color: black;
  border: 2px solid black;
  padding: 8px 30px !important;
}

.card__body {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
}
.notif_text {
  text-align: center;
  padding-top: 25px;
  font-weight: 600;
}

.conteiner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 15px;
  justify-content: center;

  .vx-card.text-center {
    height: 100%;
  }
}
.list-group.list-group-circle .list-group-item {
  position: relative;
}
.list-group.list-group-circle .list-group-item::after {
  background-image: url("../../assets/images/cycle.svg");
  background-repeat: no-repeat;
  color: #6e6b7b;
  position: absolute;
  height: 10px;
  width: 10px;
  top: 1.15rem;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 10px;
  left: 0;
  content: "";
}

// cycle.svg
.btn__success {
  border: 1px solid #28c76f !important;
  background-color: transparent;
  box-shadow: none;
  border-radius: 0.358rem;
  text-align: center;
  color: #28c76f;
  display: block;
  width: 100%;
  padding: 0.786rem 1.5rem;
}

.btn__upgrade {
  cursor: pointer;
  border: 1px solid #7367f0 !important;
  background-color: transparent;
  box-shadow: none;
  border-radius: 0.358rem;
  text-align: center;
  color: #7367f0;
  display: block;
  width: 100%;
  padding: 0.786rem 1.5rem;
}

.card__body {
  padding: 1.5rem;
  -webkit-box-flex: 1;
  flex: 1 1 auto;
  min-height: 1px;
}

.annual-plan {
  margin-bottom: 1.7rem;

  .pricing-card .annual-plan .plan-price sup {
    left: 0;
  }

  .pricing-card .annual-plan .plan-price sup {
    top: -1.5rem;
  }

  .plan-price span {
    font-size: 3.5rem;
    line-height: 0.8;
  }

  .font-weight-bolder {
    font-weight: 600 !important;
  }

  .pricing-card .annual-plan .plan-price sup {
    right: 0;
  }

  .plan-price sub {
    bottom: 0;
  }
}

.list-group.list-group-circle {
  border: none;
}

.pricing-card .list-group-circle {
  font-weight: 500;
  color: #5e5873;
}

.list-group {
  margin-bottom: 0;
  border-radius: 0.358rem;
}

.list-group.list-group-circle .list-group-item {
  padding-left: 1.5rem;
  border: none;
  position: relative;
}

.list-group-item {
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border: 1px solid rgba(34, 41, 47, 0.125);
  display: block;
  line-height: 1.5;
  cursor: default !important;
}

.btn__disabled {
  border-color: #b3b0b0 !important;
  color: #838383;
  cursor: unset;
  background: #6b6b6b1f;
}
</style>
