<template></template>

<script>
export default {
  created() {
    console.log(this.$route.query);

    const token = this.$route.query.token
    if (token) {
      this.$http
        .get(`${process.env.VUE_APP_BACK}/account/getUserData`, {
          headers: { Authorization: token },
        })
        .then((result) => {
          const settings_data = result.data.settings;
          const settings =
            settings_data && JSON.parse(settings_data)
              ? JSON.parse(settings_data)
              : null;
          if (settings && settings.theme_config) {

            this.$store.commit("UPDATE_THEME", settings.theme_config.theme);
          }
          localStorage.setItem("user", JSON.stringify(result.data));
          if (result.data.features) {
            localStorage.setItem(
              "features",
              JSON.stringify(result.data.features)
            );
          }
          this.$http
            .get(
              `${process.env.VUE_APP_BACK}/roles/${result.data.role}`,
              {
                headers: { Authorization: token },
              }
            )
            .then((result) => {
              localStorage.setItem("permissions", result.data.permissions);
              this.$router.push('/')

            }).catch(() => this.$router.push('/login'));

        }).catch(() => this.$router.push('/login'));;
    } else {
      this.$router.push('/login')
    }



  }
}
</script>
