<template>
  <v-container
    id="register"
    class="col-12"
    fluid height="10"
  >

    <v-card color="#ffffff00" elevation="0" class="card card-container">
      <v-img
        src="../assets/title.bar.logo.png"
        height="130"
        contain
        >
      </v-img>

      <v-form ref="form" v-model="valid" lazy-validation name="form">
        <v-container>
          <v-text-field
            dark
            color="#FAA403"
            prepend-inner-icon="mdi-account"
            v-model="user.username"
            label="Username"
            outlined
            required
            :rules="nameRules"
          ></v-text-field>

          <v-text-field
            dark
            color="#FAA403"
            prepend-inner-icon="mdi-email"
            v-model="user.email"
            type="email"
            label="email"
            outlined
            required
            :rules="emailRules"
          ></v-text-field>

          <v-text-field
            dark
            color="#FAA403"
            prepend-inner-icon="mdi-lock"
            v-model="user.password"
            type="password"
            label="Password"
            outlined
            required
            :rules="passwordRules"
          ></v-text-field>

          <v-btn :disabled="!valid" @mouseover="validate()" @click="handleRegister()" class="btn btn-primary btn-block" color="#FAA403">
            <span class="text font-weight-bold">Sign-up</span>
          </v-btn>
        </v-container>
        <div
          v-if="message"
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
        >{{message}}</div>
      </v-form>
    </v-card>

  </v-container>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Register',

  data() {
    return {
      user: new User('', '', ''),
      submitted: false,
      successful: false,
      message: '',
      valid: true,
      nameRules: [
        v => !!v || 'username is required',
        v => (v && v.length <= 10) || 'username must be less than 10 characters',
        v => (v && v.length >= 3) || 'username must be at least 3 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'password is required',
        v => (v && v.length <= 10) || 'password must be less than 10 characters',
        v => (v && v.length >= 3) || 'password must be at least 3 characters',
      ],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  // mounted() {
  //   if (this.loggedIn) {
  //     this.$router.push('/profile');
  //   }
  // },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            data => {
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
            }
          );
        }
      });
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

#register {
  background-color: #1C284E;
  height: 675px
}

.A-team{
  padding-bottom: 100px
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