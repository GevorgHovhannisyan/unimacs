<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="login_page">
    <div class="page_inner">
      <div class="login_container">
        <div class="logo_block">
          <img src="/all_doors_logo.png" srcset="/all_doors_logo.png 1x, /all_doors_logo@2x.png" alt=""
            title="" width="234" height="286" />
        </div>
        <div class="form_fields">
          <label class="field_block">
            <span class="field_name">Login</span>
            <input type="text" v-validate="'required'" name="username" @keyup.enter="loginJWT" v-model="username" placeholder="Username or email" aria-required="true"
              aria-invalid="false" />
            <span class="field_error">{{ errors.first("username") }}</span>
          </label>
          <label class="field_block">
            <span class="field_name">Password</span>
            <input type="password" @keyup.enter="loginJWT" v-validate="'required'" v-model="password" name="password" placeholder="Password" aria-required="true" aria-invalid="false" />
            <span class="field_error">{{ errors.first("password") }}</span>
          </label>
          <button class="submit_btn"  @click="loginJWT">Sign in</button>
          <router-link class="pass_forgot_link" to="/forgot-password">Forgot Password</router-link>
          <!-- <a href="/forgot-password" class="pass_forgot_link">Forgot Password</a> -->
          <div class="new_account_info">Don’t have an account? <router-link to="/register">Create yours now
                </router-link></div>
        </div>
        <div class="icons_img">
          <img src="/bottom_image.svg" alt="" title="" width="617" height="69" />
        </div>
        <div class="copyrights">Copyright © 2024 Lumiring Inc. All rights Reserved</div>
      </div>
    </div>
  </div>
</template>


<script>
import LoginJwt from "./LoginJWT.vue";

export default {
  components: {
    LoginJwt,
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    loginJWT() {
      // this.$vs.loading();

      const payload = {
        userDetails: {
          username: this.username,
          password: this.password,
        },
      };

      this.$store
        .dispatch("auth/loginJWT", payload)
        .then((res) => {
          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
  },
};
</script>

<style lang="scss">
#app {
  height: 100%;
}

.layout--full-page {
  height: 100%;
}

.page_new_login {
  width: 100%;
  height: 100%;
  background: #0A0B12;

  .page_container {
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
  }

  .dots_login,
  .blue_dot {
    position: absolute;
  }

  .dots_login {
    &.first {
      top: 20%;
      left: 0;
    }

    &.second {
      top: 8%;
      left: 35%;
    }

    &.third {
      top: 20%;
      right: 20%;
    }

    &.four {
      top: 29%;
      left: 22%;
    }

    &.five {
      top: 50%;
      left: 8%;
    }

    &.sixed {
      top: 45%;
      right: 10%;
    }

    &.sevent {
      top: 55%;
      right: 15%;
    }
  }




  .content_block {
    width: 100%;
    max-width: 637px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .inner_content {
    width: 100%;
    max-width: 472px;
    background-position: inherit;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .inner_block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 288px;
    margin-left: 23px;
    width: 100%;
    margin-top: 77px;
  }

  .logo_block {
    max-width: 78px;
    max-height: 78px;
  }

  .logo_block>img {
    display: block;
    height: auto;
    width: 100%;
  }

  .title_block {
    color: #FFFFFF;
    font-size: 22px;
    line-height: 23px;
    margin-top: 10px;
    letter-spacing: 8px;
    text-transform: capitalize;
    text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.65);
    font-family: 'Raleway';
  }

  .sub_title {
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 2px;
    text-transform: capitalize;
    color: #57D0FA;
    margin-top: 7px;
    font-family: 'Raleway';
  }

  .block_input {
    margin-bottom: 14px;
  }

  .form_block {
    margin-top: 37px;

    input {
      padding: 0 4px;
    }
  }

  .block_input input {
    border: none;
    border-bottom: 1px solid white;
    background: none;
    color: white;
    height: 25px;
    width: 100%;
  }

  .form_login {
    width: 100%;
  }

  .placeholder {
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    color: #57D0FA;
    margin-bottom: 4px;
  }

  .btn_sign {
    background: #57D0FA;
    border-radius: 10px;
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    color: #0B0E1A;
    margin-top: 26px;
    border: none;
    padding: 0 15px;
    margin-bottom: 23px;
    cursor: pointer;
    -transition: opacity .5s;
    -ms-transition: opacity .5s;
    -moz-transition: opacity .5s;
    -webkit-transition: opacity .5s;
    transition: opacity .5s;

    &:hover {
      opacity: 0.5;
      -transition: opacity .5s;
      -ms-transition: opacity .5s;
      -moz-transition: opacity .5s;
      -webkit-transition: opacity .5s;
      transition: opacity .5s;
    }
  }

  .forgot_btn {
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    text-decoration-line: underline;
    color: #57D0FA;
    text-align: center;
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;

    -transition: color .5s;
    -ms-transition: color .5s;
    -moz-transition: color .5s;
    -webkit-transition: color .5s;
    transition: color .5s;

    &:hover {
      color: white;
      -transition: color .5s;
      -ms-transition: color .5s;
      -moz-transition: color .5s;
      -webkit-transition: color .5s;
      transition: color .5s;
    }
  }

  .new_account_btn {
    font-size: 12px;
    line-height: 14px;
    color: #F6FDFF;

    >a {
      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
      text-decoration-line: underline;
      color: #57D0FA;
      text-align: center;
      -transition: color .5s;
      -ms-transition: color .5s;
      -moz-transition: color .5s;
      -webkit-transition: color .5s;
      transition: color .5s;

      &:hover {
        color: white;
        -transition: color .5s;
        -ms-transition: color .5s;
        -moz-transition: color .5s;
        -webkit-transition: color .5s;
        transition: color .5s;
      }
    }
  }

  .img_bottom {
    margin-top: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    img {
      width: auto;
      display: block;
      height: auto;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: radial-gradient(55.34% 4716.29% at 52.2% 50.72%, rgba(10, 11, 18, 0) 0%, rgba(10, 11, 18, 0) 0.01%, #0A0B12 100%);
      width: 100%;
      height: 100%;
    }
  }

  .copyright {
    margin-left: 23px;
    font-size: 11px;
    line-height: 13px;
    letter-spacing: 1px;
    text-transform: capitalize;
    color: #FFFFFF;
    margin-top: 50px;
    max-width: 400px;
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }



  @media (max-width: 400px) {
    .inner_block {
      margin-top: 30px;
    }
  }

}


.login-tabs-container {
  min-height: 505px;

  .con-tab {
    padding-bottom: 14px;
  }

  .con-slot-tabs {
    margin-top: 1rem;
  }
}

@import url('../../../assets/css/login.css');
</style>
