import moduleCardholder from "@/store/cardholder/moduleCardholder.js";
import moduleCardGroup from "@/store/cardholder-group/moduleCardGroup.js";
import moduleRight from "@/store/access-right/moduleAccess.js";
import moduleAccessPoint from "@/store/access-point/moduleAccessPoint.js";
import moduleSchedule from "@/store/schedule/moduleSchedule.js";
import moduleFile from "@/store/files/moduleFile.js";
import AccessPointModes from "./chart/AccessPointModes";
import AccessPointStatus from "./components/AccessPointStatus";
import CardholdersPresence from "./chart/CardholdersPresence";
import AcuStatus from "./chart/AcuStatus";
import EventStats from "./chart/EventStats";
import AccessPointMonitor from "./components/AccessPointMonitor";
import AccessPointMonitor2 from "./components/AccessPointMonitor2";
import Posts from "./components/Posts";
import EventDetail from "./components/EventDetail";
import MonitorSettingsPopup from "./popups/MonitorSettingsPopup";
import Monitor2SettingsPopup from "./popups/Monitor2SettingsPopup";
import AccessPointStatusPopup from "./popups/AccessPointStatusPopup";
import ActivitySettingsPopup from "./popups/ActivitySettingsPopup";
import APStatus from "./popups/APStatus";

import user from "./components/cardholder/create/CardHolders";
import car_infos from "./components/cardholder/create/CarInfo";
import limitations from "./components/cardholder/create/Limitations";
import antipass_backs from "./components/cardholder/create/AntiPassBack";
import time_attendance from "./components/cardholder/create/TimeAttendence";
import group from "./components/cardholder/create/Group";
import extra_features from "./components/cardholder/create/ExtraFeatures";
import access_right from "./components/cardholder/create/AccessRight";
import credentials from "./components/cardholder/create/Credential";
import edit_antipass_back from "./components/cardholder/update/EditAntiPassBack";
import edit_user from "./components/cardholder/update/EditCardHolder";
import edit_car_info from "./components/cardholder/update/EditCarInfo";
import edit_limitation from "./components/cardholder/update/EditLimitation";
import edit_extra_features from "./components/cardholder/update/EditExtraFeatures";
import edit_access_right from "./components/cardholder/update/EditAccessRight";
import edit_time_attendance from "./components/cardholder/update/EditTimeAttendence";
import edit_group from "./components/cardholder/update/EditGroup";
import edit_credentials from "./components/cardholder/update/EditCredential";
import vSelect from "vue-select";
import Table from "@/components/custom/table/DashboardEvent";
import CloseBlock from "./components/CloseBlock";

export {
    moduleCardholder,
    moduleCardGroup,
    moduleRight,
    moduleSchedule,
    moduleFile,
    AccessPointModes,
    AccessPointStatus,
    CardholdersPresence,
    AcuStatus,
    EventStats,
    AccessPointMonitor,
    AccessPointMonitor2,
    Posts,
    EventDetail,
    MonitorSettingsPopup,
    Monitor2SettingsPopup,
    AccessPointStatusPopup,
    user,
    car_infos,
    limitations,
    antipass_backs,
    time_attendance,
    group,
    extra_features,
    access_right,
    credentials,
    edit_antipass_back,
    edit_user,
    edit_car_info,
    edit_limitation,
    edit_extra_features,
    edit_access_right,
    edit_time_attendance,
    edit_group,
    edit_credentials,
    vSelect,
    Table,
    CloseBlock,
    moduleAccessPoint,
    ActivitySettingsPopup,
    APStatus
}
