<template >
<div>
  <v-container
    id="ChangePwd"
    class="col-12"
    v-if="!successful"
  >

    <v-card  color="#1C284E" elevation="0" class="card card-container">
      <v-img
        src="../assets/title.bar.logo.png"
        height="130"
        contain
        >
      </v-img>

      <v-form fluid ref="form" v-model="valid" lazy-validation name="form">
        <v-container>
          <v-text-field
            dark
            color="#FAA403"
            prepend-inner-icon="mdi-lock"
            v-model="currentPassword"
            type="password"
            label="Current Password"
            outlined
            required
            :rules="currentPasswordRules"
          ></v-text-field>

          <v-text-field
            dark
            color="#FAA403"
            prepend-inner-icon="mdi-lock"
            v-model="match"
            type="password"
            label="New Password"
            outlined
            required
            :rules="confirmPasswordRules"
          ></v-text-field>

          <v-text-field
            dark
            color="#FAA403"
            prepend-inner-icon="mdi-lock"
            v-model="user.password"
            type="password"
            label="Confirm Password"
            outlined
            required
            :rules="newPasswordRules"
          ></v-text-field>

          <v-btn :disabled="!valid" @mousemove="validate()" @click="snackbar = true; updatePassword()" class="btn btn-primary btn-block" color="#FAA403">
            <span class="text font-weight-bold">Submit</span>
          </v-btn>
        </v-container>
      </v-form>

        <div
          v-if="message"
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
        >{{message}}</div>
    </v-card>
    </v-container>
    <v-snackbar
    v-if="successful"
    v-model="snackbar"
    top
    >
    Password was updated successfully
    <v-icon color="success">mdi-check-circle</v-icon>
    </v-snackbar>
</div>
</template>

<script>
import ManagementService from '../services/management.service';
import User from '../models/user';

export default {
  name: 'Change Password',

  data() {
    return {
      user: new User('', '', ''),
      currentPassword: '',
      match: '',
      message: '',
      valid: true,
      snackbar: false,
      successful: false,

      currentPasswordRules: [
        v => !!v || 'current password is required',
      ],
      newPasswordRules: [
        v => !!v || 'confirm your new password',
        v => (!!v && v) === this.match || 'Passwords do not match',
      ],
      confirmPasswordRules: [
        v => !!v || 'new password required',
      ],
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  
  methods: {
    updatePassword () {
    var data = {
        id: this.currentUser.id,
        username: this.currentUser.username,
        email: this.currentUser.email,
        password: this.user.password
      }
    ManagementService.changePassword(this.currentUser.id, this.currentPassword, data)
    .then(data => {
            this.message = data.message;
            this.successful = true;
            this.reset();
        },
        error => {
            this.message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
            this.successful = false;
        })
    .catch(e => {
        console.log(e)
    })
  },

    validate () {
      this.$refs.form.validate()
    },

    reset () {
      this.$refs.form.reset()
    },
  },
};
</script>

<style scoped>

#ChangePwd {
  background-color: #1C284E;
  height: 675px
}

.text {
  color: #1C284E;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #1C284E;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
}

</style>