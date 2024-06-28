<template>
  <div class="invite_user">
    <form>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input
            class="w-full mt-4"
            label="Username"
            v-model="user_data.username"
            v-validate="'required'"
            name="username"
          />
          <span class="text-danger text-sm" v-show="errors.has('username')">{{
            errors.first("username")
          }}</span>

          <vs-input
            class="w-full mt-4"
            label="First name"
            v-model="user_data.first_name"
            v-validate="'required'"
            name="first_name"
          />
          <span class="text-danger text-sm" v-show="errors.has('first_name')">{{
            errors.first("first_name")
          }}</span>

          <vs-input
            class="w-full mt-4 mb-4"
            label="Email"
            v-model="user_data.email"
            type="email"
            v-validate="'required|email'"
            name="email"
          />
          <span class="text-danger text-sm" v-show="errors.has('email')">{{
            errors.first("email")
          }}</span>

          
<label for="" class="vs-input--label ">Role</label>
          <v-select
            v-model="user_data.role"
            :options="roleOptions"
            class="select_padding "
            name="role"
            v-validate="'required'"
            placeholder="Role"
            :reduce="(role) => role.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />

          <span class="text-danger text-sm" v-show="errors.has('role')">{{
            errors.first("role")
          }}</span>

            <!-- :label="!user_data.comment?'Comment':' '" -->
          <vs-textarea
            placeholder="Comment"
            v-model="user_data.comment"
            class="w-full mt-5 comm_block"
          >
          </vs-textarea>
        </div>

        <div class="vx-row w-full">
          <div
            class="vx-col w-full"
            style="display: flex; flex-direction: row-reverse"
          >
            <vs-button
              class="ml-3 mt-2 update_info_button unimacs_button"
              @click.stop="createUser"
              >Submit
            </vs-button>
            <vs-button
              class="ml-3 mt-2 update_info_button unimacs_cancel_button"
              @click.stop="cancel"
              >Cancel
            </vs-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import vSelect from "vue-select";
export default {
  props: {
    clearFields: {
      type: Boolean,
    },
  },
  watch: {
    clearFields(val) {
      this.user_data = {};
      this.errors.clear();
    },
  },
  data() {
    return {
      roleOptions: [],
      user_data: {},
    };
  },
  methods: {
    cancel() {
      this.user_data = {};
      this.errors.clear();
      this.$emit("close");
    },
    createUser() {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.$vs.loading({
            type: "corners",
          });

          this.$http
            .post(`account/invite`, this.user_data, {
              headers: { Authorization: localStorage.token },
            })
            .then((res) => {
              this.$vs.loading.close();
              this.$store.commit("user/SET_USER", res.data);
              this.$vs.notify({
time: 7000,
                color: "success",
                title: "Invitation mail sent",
              });
              this.errors.clear();
              this.user_data = {};

              this.$emit("close");
            })
            .catch((error) => {
              this.$vs.loading.close();
            });
        } else {
        }
      });
    },
  },
  created() {
    const roles = localStorage.permissions
      ? JSON.parse(localStorage.permissions).Admin
        ? JSON.parse(localStorage.permissions).Admin.actions.getAllItems
        : null
      : null;
    if (roles) {
      this.$http
        .get(`roles`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          res.data.forEach((role) => {
            this.roleOptions.push({
              label: role.slug,
              id: role.id,
            });
          });
        });
    }
  },
  components: {
    vSelect,
  },
};
</script>

<style lang="scss">
.invite_user {
  .comm_block .vs-textarea::placeholder {
      font-size:12px
  }
}
</style>