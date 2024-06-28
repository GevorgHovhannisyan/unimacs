<template>
  <div class="miniature_block">
    <div class="flex car_avatar_dashboard">
      <div
        class="monnitor_img_block"
        v-if="
          monitor_settings &&
          (monitor_settings.show_photo_car === 'cardholder' ||
            monitor_settings.show_photo_car === 'car_cardholder')
        "
      >
        <img :src="avatarSrc" class="rounded card_avatar" />
      </div>
      <div
        class="monnitor_img_block"
        v-if="
          monitor_settings &&
          (monitor_settings.show_photo_car === 'car' ||
            monitor_settings.show_photo_car === 'car_cardholder')
        "
      >
        <img :src="carSrc" class="rounded card_avatar" />
      </div>
    </div>
    <ul
      class="table_custom_ul"
      v-if="
        monitor_settings &&
        monitor_settings.miniature_position &&
        (monitor_settings.miniature_position == 'fixed' ||
        !monitor_settings.enable_cctv)
      "
    >
      <li class="list_inner" v-if="fieldsShown['access_point']">
        <div>Access Point:</div>

        <div>
          {{
            monitor_data && monitor_data.access_points
              ? monitor_data.access_points.name
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="fieldsShown['full_name']">
        <div>Full Name:</div>

        <div>
          {{
            monitor_data && monitor_data.cardholder
              ? monitor_data.cardholder.last_name
                ? monitor_data.cardholder.first_name +
                  " " +
                  monitor_data.cardholder.last_name
                : monitor_data.cardholder.first_name
              : "No data"
          }}
        </div>
      </li>

      <li class="list_inner" v-if="fieldsShown['date_time']">
        <div>Date/Time:</div>
        <div>
          {{
            monitor_data && monitor_data.date
              ? parseData(monitor_data)
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="fieldsShown['event']">
        <div>Event:</div>
        <div
          :class="{
            granted: getEventGrant(monitor_data) === 'grant',
            denied: getEventGrant(monitor_data) === 'denied',
          }"
        >
          {{
            monitor_data && monitor_data.event
              ? getEventGrant(monitor_data) === "denied"
                ? "Access denied"
                : getEventGrant(monitor_data) === "grant"
                ? "Access granted"
                : monitor_data.event
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="fieldsShown['event_description']">
        <div>Event Description:</div>
        <div>
          {{
            monitor_data && monitor_data.result
              ? monitor_data.result
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="fieldsShown['direction']">
        <div>Direction:</div>
        <div>
          {{
            monitor_data && monitor_data.direction ? monitor_data.direction : ""
          }}
        </div>
      </li>
      <li class="list_inner" v-if="fieldsShown['credential']">
        <div>Credential:</div>
        <div>
          {{
            monitor_data && monitor_data.credential
              ? monitor_data.credential.type
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="fieldsShown['copmany']">
        <div>Company:</div>
        <div>
          {{
            monitor_data &&
            monitor_data.cardholder &&
            monitor_data.cardholder.company_name
              ? monitor_data.cardholder.company_name
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="fieldsShown['group']">
        <div>Group:</div>
        <div>
          {{
            monitor_data &&
            monitor_data.cardholder &&
            monitor_data.cardholder.cardholder_groups
              ? monitor_data.cardholder.cardholder_groups.name
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="!short_info && fieldsShown['access_rigth']">
        <div>Access Right:</div>
        <div>
          {{
            monitor_data &&
            monitor_data.cardholder &&
            monitor_data.cardholder.access_rights
              ? monitor_data.cardholder.access_rights.name
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="!short_info && fieldsShown['antipass_back']">
        <div>Anti-passback:</div>
        <div>
          {{
            monitor_data &&
            monitor_data.cardholder &&
            monitor_data.cardholder.antipass_backs
              ? monitor_data.cardholder.antipass_backs.type +
                "/ Timer " +
                monitor_data.cardholder.antipass_backs.time +
                " " +
                monitor_data.cardholder.antipass_backs.time_type
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="!short_info && fieldsShown['car_model']">
        <div>Car Model/Color:</div>
        <div>
          {{
            monitor_data &&
            monitor_data.cardholder &&
            monitor_data.cardholder.car_infos
              ? monitor_data.cardholder.car_infos.model +
                " / " +
                monitor_data.cardholder.car_infos.color
              : "No data"
          }}
        </div>
      </li>
      <li class="list_inner" v-if="!short_info && fieldsShown['car_lp']">
        <div>Car License Plate #:</div>
        <div>
          {{
            monitor_data &&
            monitor_data.cardholder &&
            monitor_data.cardholder.car_infos
              ? monitor_data.cardholder.car_infos.lp_number
              : "No data"
          }}
        </div>
      </li>
    </ul>

    <ul class="table_custom_ul" v-else>
      <li class="list_inner">
        {{
          monitor_data && monitor_data.date
            ? parseData(monitor_data)
            : "No data"
        }}
      </li>
      <li class="list_inner">
        {{
          monitor_data && monitor_data.access_points
            ? monitor_data.access_points.name
            : "No data"
        }}
      </li>
      <li class="list_inner">
        {{
          monitor_data && monitor_data.direction
            ? monitor_data.direction
            : "No data"
        }}
      </li>
      <li class="list_inner">
        {{
          monitor_data && monitor_data.cardholder
            ? monitor_data.cardholder.last_name
              ? monitor_data.cardholder.first_name +
                " " +
                monitor_data.cardholder.last_name
              : monitor_data.cardholder.first_name
            : "No data"
        }}
      </li>
      <li class="list_inner">
        {{
          monitor_data &&
          monitor_data.cardholder &&
          monitor_data.cardholder.car_infos
            ? monitor_data.cardholder.car_infos.model +
              " / " +
              monitor_data.cardholder.car_infos.color
            : "No data"
        }}
      </li>
      <li class="list_inner">
        {{
          monitor_data &&
          monitor_data.cardholder &&
          monitor_data.cardholder.car_infos
            ? monitor_data.cardholder.car_infos.lp_number
            : "No data"
        }}
      </li>
      <li
        class="list_inner"
        :class="{
          granted: getEventGrant(monitor_data) === 'grant',
          denied: getEventGrant(monitor_data) === 'denied',
        }"
      >
        {{
          monitor_data && monitor_data.event
            ? getEventGrant(monitor_data) === "denied"
              ? "Access denied"
              : getEventGrant(monitor_data) === "grant"
              ? "Access granted"
              : monitor_data.event
            : "No data"
        }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    monitor_data: {
      type: Object,
      default: () => {},
    },
    monitor_settings: {
      type: Object,
      default: () => {},
    },
    fieldsShown: {
      type: Object,
      default: () => {},
    },
    short_info: {
      type: Boolean,
      default: false,
    },
    avatarSrc: {
      type: String,
    },
    carSrc: {
      type: String,
    },
  },
  computed: {
    getEventGrant() {
      return (monitor_data) => {
        if (monitor_data && monitor_data.event) {
          const event = monitor_data.event;
          if (event === "Access granted") {
            return "grant";
          } else if (event.includes("Access denied")) {
            return "denied";
          }
        } else {
          return null;
        }
      };
    },
    parseData() {
      return (date) => {
        const time_zone = date.time_zone || null;

        if (time_zone) {
          return this.$moment(date.date * 1000)
            .tz(time_zone)
            .format(`YYYY-MM-DD HH:mm:ss ( dddd )`);
        } else {
          return this.$moment(date.date * 1000).format(
            `YYYY-MM-DD HH:mm:ss ( dddd )`
          );
        }
      };
    },
  },
};
</script>

<style></style>
