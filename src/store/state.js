/*=========================================================================================
  File Name: state.js
  Description: Vuex Store - state
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import navbarSearchAndPinList from '@/layouts/components/navbar/navbarSearchAndPinList'
import themeConfig, { colors } from '@/../themeConfig.js'
import countries from '../assets/json_files/countries'
import antipass_types from '../assets/json_files/antipass_types'
// /////////////////////////////////////////////
// Helper
// /////////////////////////////////////////////

// *From Auth - Data will be received from auth provider

const languages = [{
        title: 'English',
        iso: 'en',
        id: 1
    },
    // {
    //   title: 'Russian',
    //   iso: 'ru',
    //   id: 2
    // },
    // {
    //   title: 'Armenian',
    //   iso: 'am',
    //   id: 3
    // }
]



// Check if device is touch device
// This is used to remove perfect scrollbar from touch devices
// Using Dynamic components
const is_touch_device = () => {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
    const mq = function(query) {
        return window.matchMedia(query).matches
    }

    if ('ontouchstart' in window || window.DocumentTouch) {
        return true
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
    return mq(query)
}


// /////////////////////////////////////////////
// State




const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

const week_data = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7,
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
}

const formTypes = [
    { name: "User info", key: "add_user" },
    { name: "Group", key: "group" },
    { name: "Role", key: "role" },

]

const types = [
    { name: "Cardholder info", key: "user" },
    { name: "Group", key: "group" },
    { name: "Credentials", key: "credentials" },

    // { name: "Extra Features", key: "extra_features" },
    { name: "Limitations", key: "limitations" },
    { name: "Access Right", key: "access_right" },
    // { name: "Anti Pass Back", key: "antipass_backs" },
    // { name: "Time Attendance", key: "time_attendance" },
    { name: "Car Information", key: "car_infos" },
    { name: "Guest Keys", key: "guest_keys" },
]
const editTypes = [
    { name: "Cardholder info", key: "edit_user" },
    { name: "Group", key: "edit_group" },
    { name: "Credentials", key: "edit_credentials" },
    // { name: "Extra Features", key: "edit_extra_features" },
    { name: "Limitations", key: "edit_limitation" },
    { name: "Access Right", key: "edit_access_right" },
    // { name: "Anti Pass Back", key: "edit_antipass_back" },
    // { name: "Time Attendance", key: "edit_time_attendance" },
    { name: "Car Information", key: "edit_car_info" },
    { name: "Guest Keys", key: "edit_guest_keys" },
]

const tutorialLinks = {
  "Account": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI0dlKD4QfXczkeMyKOws_Sj",
  "Admin": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI1ff-j1LPc10d_Q0eSIl30a",
  "Dashboard": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI1oQC_3lUMUDE17EmDTis7-",
  "AccessPoint": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI1kn3C-CuHAfn6JCcQ5igrM",
  "Cardholder": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI3Vu9SRvR-QtASJc6AAiqgE",
  "AccessRight": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI0u1n0BUv4bpLkAmtnlBMTQ",
  "CardholderGroup": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI22e_WsLTOTuM7INxH6fspF",
  "guest-keys": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI0E69wm6gkORsJk1HcgTuOq",
  "Schedule": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI2ijS8f-f_RnYRTJ_x9L1cN",
  "auto-tasks": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI1vMUZbfLMhD7rVlIzUR9PQ",
  "Product": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI1xd3DKhwNZJ6nIdbG6dZEZ",
  "StandardReport": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI1IgqXm6YYA5ors8E3atXqW",
  "EventLog": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI3p8hPaHC5ypBiNNcAdp8cx",
  "UserLog": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI2sFLBnc1LSagl-R4cWaESN",
  "Ticket": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI3xB75fZnBWTAB8P9WtAjrg",
  "Cctv": "https://www.youtube.com/playlist?list=PLVS_hTK7_qI2oUwxJ7gxsfCqLoTfYtxW0",
}
let theme_config = 'light'
if (localStorage.getItem("theme_config")) {
    const theme_configs = JSON.parse(localStorage.getItem("theme_config"));

    if (theme_configs && theme_configs.theme) {
        theme_config = theme_configs.theme
    }
}
const state = {
    bodyOverlay: false,
    isVerticalNavMenuActive: true,
    is_touch_device: is_touch_device(),
    mainLayoutType: themeConfig.mainLayoutType || 'vertical',
    navbarSearchAndPinList,
    reduceButton: themeConfig.sidebarCollapsed,
    verticalNavMenuWidth: 'default',
    verticalNavMenuItemsMin: false,
    scrollY: 0,
    starredPages: navbarSearchAndPinList['pages'].data.filter((page) => page.is_bookmarked),
    theme: theme_config || 'light',
    themePrimaryColor: colors.primary,
    languages,
    countries,
    antipass_types,
    weekDays,
    // Can be used to get current window with
    // Note: Above breakpoint state is for internal use of sidebar & navbar component
    windowWidth: null,
    types,
    editTypes,
    week_data,
    formTypes,
    tutorialLinks,
    settings: localStorage.getItem('settings') && JSON.parse(localStorage.getItem('settings')) ? JSON.parse(localStorage.getItem('settings')) : null
}
export default state
