/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                      pageTitle => Display title besides breadcrumb
                    }
  ---------------------- ------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'
// import auth from '@/auth/authService'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [

    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/ticket',
          redirect: '/ticket/inbox',
          name: 'Ticket',
        },

        {
          path: '/ticket/:filter',
          name: "Ticket",
          component: () => import('./views/email/Email.vue'),
          custom: true,
          meta: {
            pageTitle: 'Tickets',
            requiresAuth: true,
            tutorial: true
          }
        },
        {
          path: '/dashboard',
          name: 'Dashboard',
          custom: true,
          component: () => import('./views/dashboard/Dashboard.vue'),
          meta: {
            pageTitle: 'Dashboard',
            requiresAuth: true,
            tutorial: true
          }
        },
        {
          path: '/companies',
          name: 'Company',
          custom: true,
          component: () => import('./views/company/Company.vue'),
          meta: {
            pageTitle: 'Company',
            requiresAuth: true
          }
        },
        {
          path: '/package/create-package',
          name: 'Package',
          component: () => import('./views/resources/CreatePacket.vue'),
          meta: {
            pageTitle: 'Create Package',
          }
        },


        {
          path: '/package/edit-package/:id',
          name: 'Package',
          component: () => import('./views/resources/UpdatePacket.vue'),
          meta: {
            pageTitle: 'Update Package',
          }
        },
        {
          path: '/access-right',
          name: 'AccessRight',
          component: () => import('./views/access-right/AccessRight.vue'),
          meta: {
            pageTitle: 'Access Rights',
            requiresAuth: true,
            tutorial: true
          },
        },

        {
          path: '/department',
          name: 'Department',
          component: () => import('./views/department/Department.vue'),
          meta: {
            pageTitle: 'Department',
            requiresAuth: true
          },
        },
        {
          path: '/account',
          name: 'Account',
          component: () => import('./views/account/Account.vue'),
          meta: {
            pageTitle: 'Account',
            requiresAuth: true,
            tutorial: true
          },
        },

        {
          path: '/account/:name',
          name: 'Account',
          component: () => import('./views/account/Account.vue'),
          meta: {
            pageTitle: 'Account',
            requiresAuth: true
          },
        },

        {
          path: '/package-type',
          name: 'PackageType',
          component: () => import('./views/packet-type/PacketType.vue'),
          meta: {
            pageTitle: 'Package Type',
            requiresAuth: true
          },
        },
        {
          path: '/package/:filter?',
          name: 'Package',
          component: () => import('./views/resources/Resources.vue'),
          meta: {
            pageTitle: 'Package',
            requiresAuth: true
          }
        },
        {
          path: '/packages',
          name: 'Product',
          component: () => import('./views/packet/Packet.vue'),
          meta: {
            pageTitle: 'Subscription Packages',
            requiresAuth: true,
            tutorial: true
          },
        },

        {
          path: '/user-logs',
          name: 'UserLog',
          component: () => import('./views/user-logs/UserLogs.vue'),
          meta: {
            pageTitle: 'User Logs',
            requiresAuth: true,
            tutorial: true
          },
        },
        {
          path: '/event-logs',
          name: 'EventLog',
          component: () => import('./views/event-logs/EventLogs.vue'),
          meta: {
            pageTitle: 'Events Logs',
            tutorial: true

          },
        },
        {
          path: '/standart-report',
          name: 'StandardReport',
          component: () => import('./views/reports/StandartReport.vue'),
          meta: {
            pageTitle: 'Reports',
            tutorial: true

          },
        },
        // {
        //   path: '/access-point-group',
        //   name: 'AccessPointGroup',
        //   component: () => import('./views/group-zones/GroupZones.vue'),
        //   meta: {
        //     pageTitle: 'Groups & Zones',
        //     requiresAuth: true
        //   },
        // },
        {
          path: '/access-point',
          name: 'AccessPoint',
          component: () => import('./views/access-point/AccessPoint.vue'),
          meta: {
            pageTitle: 'ACU / Access Point',
            tutorial: true
          },
        },
        {
          path: '/',
          redirect: '/account'
        },
        {
          path: '/translations',
          name: 'Translation',
          custom: true,
          component: () => import('./views/translations/Translations.vue'),
          meta: {
            pageTitle: 'Translations',
            requiresAuth: true
          }
        },
        {
          path: '/permissions',
          name: 'permission',
          component: () => import('./views/roles/Permissions.vue'),
          meta: {
            rule: 'admin',
            pageTitle: 'Permissions',
            requiresAuth: true
          }
        },
        {
          path: '/permissions/:permId',
          name: 'Edit Permissions',
          component: () => import('./views/roles/PermissionsEdit.vue'),
          meta: {
            rule: 'admin',
            pageTitle: 'Edit Permissions',
            requiresAuth: true
          }
        },
        {
          path: '/create-user',
          name: 'create user',
          component: () => import('./views/user/CreateUser.vue'),
          meta: {
            rule: 'admin',
            pageTitle: 'Create User',
            requiresAuth: true
          }
        },


        // {
        //   path: '/client-company',
        //   name: 'ClientCompany',
        //   component: () => import('./views/service-company/ClientCompany.vue'),
        //   meta: {
        //     rule: 'admin',
        //     pageTitle: 'Client Company',
        //     requiresAuth: true
        //   }
        // },
        {
          path: '/service-company',
          name: 'ServiceCompany',
          component: () => import('./views/service-company/ServiceCompany.vue'),
          meta: {
            rule: 'admin',
            pageTitle: 'Service Company',
            requiresAuth: true
          }
        },
        {
          path: '/cctv',
          name: 'Cctv',
          component: () => import('./views/cctv/CCTV.vue'),
          meta: {
            rule: 'admin',
            pageTitle: 'CCTV',
            requiresAuth: true,
            tutorial: true
          }
        },
        {
          path: '/set',
          name: 'Cctv',
          component: () => import('./views/cctv/CCTV.vue'),
          meta: {
            rule: 'admin',
            pageTitle: 'SET',
            requiresAuth: true,
            parent: "Cctv"
          }
        },
        {
          path: '/create-module/:name/:submenu',
          name: 'create module',
          component: () => import('./views/module/CreateModule.vue'),
          meta: {
            rule: 'admin',
            pageTitle: 'Create Module',
            requiresAuth: true
          }
        },
        {
          path: '/create-module/:name',
          name: 'create module',
          component: () => import('./views/module/CreateModule.vue'),
          meta: {
            pageTitle: 'Create Module',
            requiresAuth: true
          }
        },
        {
          path: '/cardholder-group',
          custom: true,
          name: 'CardholderGroup',
          component: () => import('./views/cardholder-group/CardholderGroup.vue'),
          meta: {
            pageTitle: 'Cardholder Group',
            requiresAuth: true,
            tutorial: true
          }
        },

        {
          path: '/admins',
          custom: true,
          name: 'Admin',
          component: () => import('./views/user/User.vue'),
          meta: {
            pageTitle: 'Local accounts',
            requiresAuth: true,
            tutorial: true
          }
        },

        {
          path: '/schedules',
          name: 'Schedule',
          component: () => import('./views/schedule/Schedule.vue'),
          meta: {
            pageTitle: 'Schedule',
            requiresAuth: true,
            tutorial: true
          }
        },
        {
          path: '/cardholder',
          name: 'Cardholder',
          component: () => import('./views/cardholder/Cardholder.vue'),
          meta: {
            pageTitle: 'Cardholders',
            requiresAuth: true,
            tutorial: true
          }
        },
        {
          path: '/edit-user/:userId',
          name: 'edit-user',
          component: () => import('./views/user/UserView.vue'),
          meta: {
            pageTitle: 'Edit User',
            requiresAuth: true
          }
        },


        {
          path: '/module/:name',
          name: 'module-name',
          component: () => import('./views/module/SeeModule.vue'),
          meta: {
            pageTitle: 'Module',
            requiresAuth: true
          }
        },
        {
          path: '/module/:name/:submenu',
          name: 'module-name',
          component: () => import('./views/module/SeeModule.vue'),
          meta: {
            pageTitle: 'Module',
            requiresAuth: true
          }
        },
        {
          path: '/edit-module/:name/:id',
          name: 'edit-module',
          component: () => import('./views/module/EditModule.vue'),
          meta: {
            pageTitle: 'Edit Module',
            requiresAuth: true
          }
        },
        {
          path: '/edit-module/:name/:submenu/:id',
          name: 'edit-module',
          component: () => import('./views/module/EditModule.vue'),
          meta: {
            pageTitle: 'Edit Module',
            requiresAuth: true
          }
        },
        {
          path: '/guests',
          name: 'guests',
          component: () => import('./views/guests/GuestKey.vue'),
          meta: {
            pageTitle: 'Guest',
            requiresAuth: true
          }
        },
        {
          path: '/guest-keys',
          name: 'guest-keys',
          component: () => import('./views/guest-keys/GuestKey.vue'),
          meta: {
            pageTitle: 'Guest',
            requiresAuth: true,
            tutorial: true
          }
        },
        {
          path: '/auto-tasks',
          name: 'auto-tasks',
          component: () => import('./views/auto-task/AutoTask.vue'),
          meta: {
            pageTitle: 'Automation',
            requiresAuth: true,
            tutorial: true
          }
        },
        {
          path: '/partitions',
          name: 'partitions',
          component: () => import('./views/partition/Partition.vue'),
          meta: {
            pageTitle: 'Partitions',
            requiresAuth: true
          }
        },
      ]
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        {
          path: '/login',
          name: 'page-login',
          component: () => import('@/views/pages/login/Login.vue'),
          meta: {
            rule: 'editor'
          }
        },

        {
          path: '/forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/pages/ForgotPassword.vue'),
          meta: {
            rule: 'editor'
          }
        },

        {
          path: '/recoveryPassword/:token',
          name: 'recoveryPassword',
          component: () => import('@/views/pages/RecoveryPassword.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/register',
          name: 'register',
          component: () => import('./views/pages/register/RegUnimacs.vue'),
          meta: {
            // breadcrumb: [
            //   { title: 'Home', url: '/' },
            //   { title: 'Register', active: true }
            // ],
            pageTitle: 'Register',
          },
        },
        {
          path: '/registration/:token',
          name: 'Register',
          component: () => import('./views/pages/register/Register.vue'),
          meta: {
            // breadcrumb: [
            //   { title: 'Home', url: '/' },
            //   { title: 'Register', active: true }
            // ],
            pageTitle: 'Register',
          },
        },
        {
          path: '/newpassword/:token',
          name: 'Register-company',
          component: () => import('./views/pages/register/CompanyRegister.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/newUserPassword/:token',
          name: 'New-User-Password',
          component: () => import('./views/pages/register/UserPassword.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/registrationOfPartition/:token',
          name: 'New-Partition-Password',
          component: () => import('./views/pages/register/Partition.vue'),
          meta: {
            rule: 'editor'
          }
        },

        {
          path: '/cardholder/invite/:token',
          name: 'register-cardholder',
          component: () => import('./views/pages/register/CardholderRegister.vue'),
          meta: {
            rule: 'editor'
          }
        },

        {
          path: '/credential/:code',
          name: 'credential',
          component: () => import('@/views/pages/Credential.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/guest/credential/:token',
          name: 'guest-credential',
          component: () => import('@/views/guests/GuestQR.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/authentificate',
          name: 'authentificate',
          component: () => import('@/views/pages/Auth.vue'),
          meta: {
            rule: 'editor'
          }
        },
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: 'error-404'
    }
  ]
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
