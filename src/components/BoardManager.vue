<template>
  <v-parallax
    class="fill-height"
    height= "1000px"
    src="../assets/preview.png"
  >
    <v-container
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >

        <template>
          <v-col
            cols="12"
            sm="12"
            md="12"
          >
            <v-data-table
              :headers="headers"
              :items="users"
              sort-by="username"
              class="elevation-12"
            >

              <template v-slot:top>
                <v-container>
                <v-toolbar flat color="white">

                  <v-toolbar-title>
                    <h4>
                      <v-icon x-large color="#1C284E">mdi-account-circle</v-icon> Users
                    </h4>
                  </v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn @click="Register" color="#1C284E" dark class="ma-2" v-on="on">
                        New user<v-icon small>mdi-plus</v-icon>
                      </v-btn>
                    </template>

                      <div v-if="!submitted">

                        <Register :user="user"></Register>

                      </div>
                      <v-snackbar
                        v-else
                        v-model="snackbar"
                        :timeout="timeout"
                        top
                      >
                        You submitted successfully!
                        <v-icon color="success">mdi-check-circle</v-icon>
                      </v-snackbar>

                  </v-dialog>

                  <v-text-field
                    hide-details
                    outlined
                    placeholder="search by username"
                    v-model="username"
                    append-icon="mdi-magnify"
                    @keyup="searchUsername"
                    dense
                  ></v-text-field>

                </v-toolbar>
                </v-container>
              </template>

              <template v-slot:item.avatar="{ item }">
                <v-avatar size="40" color="pink">
                  <span class="headline">{{ item.username.substring(0, 1) }}</span>
                </v-avatar>
              </template>

              <template v-slot:item.actions="{ item }">

                <v-menu rounded-lg offset-y>
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-if="item.is_deleted == 1" disabled small icon >
                          <v-icon color="#1C284E">mdi-circle-edit-outline</v-icon>
                        </v-btn>
                        <v-btn
                          v-else
                          small
                          icon
                          @mouseover="setActiveUser(item, index)"
                          v-bind="attrs"
                          v-on="{...tooltip,...menu}"
                        >
                          <v-icon color="#1C284E">mdi-circle-edit-outline</v-icon>
                        </v-btn>
                      </template> <span>edit roles</span>
                    </v-tooltip>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="role in roles"
                      :key="role.name"
                    >

                    <v-list-item-title>
                      {{ role.name }}
                    </v-list-item-title>

                    <v-list-item-action>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn @click="addUser_roles(role.id)" small v-on="on" icon color="success">
                            <v-icon>mdi-plus-box</v-icon>
                          </v-btn>
                        </template>
                        <span>add role</span>
                      </v-tooltip>
                    </v-list-item-action>

                    <v-list-item-action>      
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn @click="removeUser_roles(role.id)" small v-on="on" icon color="error">
                            <v-icon>mdi-minus-box</v-icon>
                          </v-btn>
                        </template>
                        <span>remove role</span>
                      </v-tooltip>
                    </v-list-item-action>

                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-tooltip v-if="item.is_deleted == 1" top>
                  <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    icon
                    @click="setActiveUser(item, index); terminateUser(false)"
                    v-on="on"
                  >
                    <v-icon color="error">mdi-alert-circle</v-icon>
                  </v-btn>
                  </template>
                  <span>reinstate</span>
                </v-tooltip>
                <v-tooltip v-else top>
                  <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    icon
                    @click="setActiveUser(item, index); terminateUser(true)"
                    v-on="on"
                  >
                    <v-icon color="warning">mdi-cancel</v-icon>
                  </v-btn>
                  </template>
                  <span>terminate</span>
                </v-tooltip>

              </template>

              <template v-slot:item.is_deleted="{ item }">
                <v-chip color="error" small outlined v-if="item.is_deleted == 1">terminated</v-chip>
                <v-chip color="success" small outlined v-else>active</v-chip>
              </template>

                <template v-slot:item.is_locked="{ item }">
                  <v-tooltip v-if="item.is_locked == 1" top>
                    <template v-slot:activator="{ on }">
                      <v-icon @click="setActiveUser(item, index); updateLock (false)" v-on="on" color="error">mdi-lock</v-icon>
                    </template>
                    <span>unlock</span>
                  </v-tooltip>
                  <v-tooltip v-else top>
                    <template v-slot:activator="{ on }">                
                      <v-icon @click="setActiveUser(item, index); updateLock (true)" v-on="on">mdi-lock-open-variant</v-icon>
                    </template>
                    <span>lock</span>
                  </v-tooltip>
                </template>

              <template v-slot:item.roles="{ item }">
                <v-chip class="ma-1" small v-for="role in item.roles" :key="role">{{role.name}}</v-chip>
              </template>

              <template v-slot:item.createdAt="{ item }">
                {{item.createdAt}}
              </template>

            </v-data-table>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-parallax>
</template>

<script>
import ManagementService from '../services/management.service';
import UserService from '../services/user.service';
import Register from './Register'

export default {
  name: 'user-management',

  components: {
    Register
  },

  data () {
    return {

      dialog: false,
      username: '',
      content: '',
      message: '',
      currentUser: null,
      currentIndex: -1,
      headers: [
        { value: 'avatar', sortable: false },
        {
          text: 'Username',
          align: 'start',
          sortable: true,
          value: 'username'
        },
        { text: 'E-mail', value: 'email', sortable: false },
        { text: 'Status', value: 'is_deleted', sortable: false },
        { text: 'Lock',value: 'is_locked', sortable: false },
        { text: 'Date created', value: 'createdAt', sortable: false },
        { text: 'Roles', value: 'roles', sortable: false },
        { value: 'actions', sortable: false },
      ],
      users: [],
      user: {
        id: null,
        username: '',
        email: '',
        roles: [],
        is_deleted: false,
      },
      roles: [],
      role: {
        id: null,
        name: '',
      },
      submitted: false,
    }
  },

  methods: {

    retrieveUsers () {
      ManagementService.getAllUsers()
        .then(response => {
          this.users = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    retrieveRoles () {
      ManagementService.getAllRoles()
        .then(response => {
          this.roles = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    refreshList () {
      this.retrieveUsers ()
    },

    setActiveUser (user, index) {
      this.currentUser = user
      this.currentIndex = index
    },

    searchUsername () {
      ManagementService.findByUsername(this.username)
        .then(response => {
          this.users = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    addUser_roles (role) {
      var data = {
        id: this.currentUser.id,
        roleId: role
      }

      ManagementService.addUser_Role(this.currentUser.id, data)
        .then(response => {
          console.log(response.data)
          this.message = 'The user permissions were updated successfully!'
        })
        .catch(e => {
          console.log(e)
        })
    },

    removeUser_roles (role) {
      var data = {
        id: this.currentUser.id,
        roleId: role
      }

      ManagementService.removeUser_Role(this.currentUser.id, data)
        .then(response => {
          console.log(response.data)
          this.message = 'The user permissions were updated successfully!'
        })
        .catch(e => {
          console.log(e)
        })
    },

    terminateUser (status) {
      var data = {
        id: this.currentUser.id,
        is_deleted: status
      }

      ManagementService.updateUser(this.currentUser.id, data)
        .then(response => {
          this.currentUser.is_deleted = status
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    updateLock (status) {
      var data = {
        id: this.currentUser.id,
        is_locked: status
      }

      ManagementService.updateUser(this.currentUser.id, data)
        .then(response => {
          this.currentUser.is_locked = status
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    deleteUser () {
      ManagementService.deleteUser(this.currentUser.id)
        .then(response => {
          console.log(response.data)
          this.refreshList()
        })
        .catch(e => {
          console.log(e)
        })
    },

    Register () {
      this.submitted = false
    }
  },

  mounted () {
    UserService.getManagerBoard().then(
      response => {
        this.content = response.data;
        this.retrieveUsers ();
        this.retrieveRoles ();
        this.message = '';
        this.getUser(this.$route.params.id)
      },
      error => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  }
}
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}

.headline {
  color:white
}
</style>
