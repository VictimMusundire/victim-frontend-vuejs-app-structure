<template>
  <v-container
    id="login"
    class="col-12"
    fluid
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
            prepend-inner-icon="mdi-lock"
            v-model="user.password"
            type="password"
            label="Password"
            outlined
            required
            :rules="passwordRules"
          ></v-text-field>

          <v-btn :disabled="!valid" @mousemove="validate()" @click.prevent="handleLogin()" class="btn btn-primary btn-block" color="#FAA403">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span class="text font-weight-bold">Login</span>
          </v-btn>
        </v-container>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Login',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: '',
      valid: true,
      nameRules: [
        v => !!v || 'username is required',
      ],
      passwordRules: [
        v => !!v || 'password is required',
      ],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/home');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/home');
            },
            error => {
              this.loading = false;
              this.message =
                (error.response && error.response.data.message) ||
                error.message ||
                error.toString();
            }
          );
        }
      });
    },

    validate () {
      this.$refs.form.validate()
    },
  }
};
</script>

<style scoped>

#login {
  background-color: #1C284E;
  height: 700px
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