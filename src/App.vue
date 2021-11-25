<template >
  <v-app>
    <v-app-bar
      app
      color="#1C284E"
      elevation="0"
    >

      <v-img
        class="ml-5"
        src="./assets/A.team.png"
        max-width="55"
        >
      </v-img>

      <v-divider inset vertical color="#DF9219" class="ml-3"></v-divider>
      
      <v-btn @click="$router.push('home')" color="#DF9219" text>
        <span class="white--text text-capitalize">ZIMRA Receipting Application</span>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn @click="$router.push('management')" rounded outlined color="#DF9219" link v-if="showAdminBoard" class="ma-2">
        <span class="white--text text-capitalize">Manage users</span>
      </v-btn>

      <template v-if="!currentUser">
        <v-btn @click="$router.push('login')" color="#DF9219" id="btn" class="mr-4" rounded>
          <v-icon>mdi-fingerprint</v-icon> Login
        </v-btn>
        <v-btn @click="$router.push('register')" color="#DF9219" id="btn" class="mr-4" rounded>
          <v-icon small>mdi-plus</v-icon> Register
        </v-btn>
      </template>

      <template v-if="currentUser">
        <v-avatar class="ma-2" color="#DF9219">
          <span class="avatar-text headline">{{ currentUser.username.substring(0, 1) }}</span>
        </v-avatar>
        <span class="white--text">{{ currentUser.username }}</span>

        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="mr-3" color="#DF9219" v-on="on" v-bind="attrs">mdi-chevron-down</v-icon>
          </template>

          <v-list dense>
            <v-list-item @click="ChangePassword()">
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <span  v-on="on" class="grey--text subtitle-2 font-weight-normal">Change Password</span>
                </template>

                <div v-if="!submitted">
                  <ChangePassword></ChangePassword>
                </div>
              </v-dialog>
            </v-list-item>

            <v-list-item href @click.prevent="logOut">
              <span  v-on="on" class="grey--text subtitle-2 font-weight-normal">Logout</span>
            </v-list-item>
          </v-list>
        </v-menu>

      </template>

    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>

  </v-app>
</template>

<script>
import ChangePassword from './components/ChangePassword';

export default {
  name: 'App',

  components: {
    ChangePassword
  },

  data () {
  return {
      dialog: false,
      submitted: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR');
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    ChangePassword () {
      this.submitted = false
    }
  }
};
</script>

<style>
.text{
  color: white
};

.avatar-text{
  color: #1C284E
}

</style>