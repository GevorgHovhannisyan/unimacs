/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default [{
        url: "/dashboard",
        name: "Dashboard",
        slug: "Dashboard",
        icon: "icon_dash"
    },
    {
        url: "/access-point",
        name: "Access Points",
        slug: "AccessPoint",
        icon: "icon_access_point"
    },
    // {
    //     url: "/access-point-group",
    //     name: "Groups & Zones",
    //     slug: "AccessPointGroup",
    //     icon: "icon_group_zones"
    // },

    {
        url: "/cardholder",
        name: "Cardholders",
        slug: "Cardholder",
        icon: "icon_cardholders"
    },
    {
        url: "/access-right",
        name: "Access Rights",
        slug: "AccessRight",
        icon: "icon_access_right"
    },
    {
        url: "/cardholder-group",
        name: "Groups",
        slug: "CardholderGroup",
        icon: "icon_groups"
    },
    {
        url: "/guest-keys",
        name: "Guest Keys",
        slug: "GuestKeys",
        icon: "icon_guest_keys"
    },
    {
        url: "/schedules",
        name: "Schedules",
        slug: "Schedule",
        icon: "icon_schedule"
    },
    {
        url: "/auto-tasks",
        name: "Automation",
        slug: "AutoTask",
        icon: "icon_auto_tasks"
    },
    {
        url: "/guests",
        name: "Guests",
        slug: "Guests",
        icon: "icon_guest_keys"
    },
    {
        url: "/companies",
        name: "Company",
        slug: "Company",
        icon: "icon_company"
    },
    {
        url: "/package",
        name: "Package",
        slug: "Package",
        icon: "icon_packages"
    },
    {
        url: "/packages",
        name: "Packages",
        slug: "Product",
        icon: "icon_packages"
    },

    {
        url: "/package-type",
        name: "Package Type",
        slug: "PackageType",
        icon: "icon_packages"
    },

    {
        url: "/department",
        name: "Department",
        slug: "Department",
        icon: "icon_company"
    },
    {
        url: "/standart-report",
        name: "Reports Manager",
        slug: "StandardReport",
        icon: "icon_reports"
    },
    {
        url: "/event-logs",
        name: "Events",
        slug: "EventLog",
        icon: "icon_events"
    },
    {
        url: "/user-logs",
        name: "User Logs",
        slug: "UserLog",
        icon: "icon_reports"
    },
    {
        url: "/ticket/inbox",
        name: "Tickets",
        slug: "Ticket",
        icon: "icon_ticket"
    },
    {
        url: "/service-company",
        name: "Service Company",
        slug: "ServiceCompany",
        icon: "icon_client_company"
    },
    // {
    //     url: "/client-company",
    //     name: "Client Company",
    //     slug: "ClientCompany",
    //     icon: "icon_client_company"
    // },
    {
      url: "/cctv",
      name: "CCTV",
      slug: "Cctv",
      icon: "icon_cctv"
  },
];
