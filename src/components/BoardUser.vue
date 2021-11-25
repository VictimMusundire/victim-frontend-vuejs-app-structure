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
              :items="reciepts"
              items-per-page = 9
              :search="search"
              sort-by="client"
              class="elevation-12"
            >
              <template  v-slot:top>
                <v-container>
                <v-toolbar flat tile>

                  <v-toolbar-title>
                    <h4 class="font-weight-medium">
                      Tax Receipts
                    </h4>
                  </v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-text-field
                    hide-details
                    outlined
                    v-model="search"
                    placeholder="search..."
                    append-icon="mdi-magnify"
                    @keyup="searchClient"
                    dense
                  ></v-text-field>
                </v-toolbar>
                </v-container>
              </template>

              <template  v-slot:item.amount="{ item }">
                {{item.currency}} {{ Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
              </template>

              <template v-slot:item.confirmed="{ item }">
                <v-chip v-if="item.confirmed" small color="success" dark>confirmed</v-chip>
                <v-chip v-else small color="warning" dark>pending</v-chip>
              </template>

              <template v-slot:item.actions="{ item }">

                <v-tooltip v-if="item.confirmed" top>
                  <template v-slot:activator="{ on }">
                    <v-btn

                      @click="setActiveReciept(item, index); updateConfirmed(false)"
                      color="warning"
                      class="mr-4"
                      icon v-on="on"
                    >
                      <v-icon color="error">mdi-bookmark-minus</v-icon>
                    </v-btn>
                  </template>
                  <span>unconfirm</span>
                </v-tooltip>

                <v-tooltip v-else top>
                  <template v-slot:activator="{ on }">
                    <v-btn

                      @click="setActiveReciept(item, index); updateConfirmed(true)"
                      color="warning"
                      class="mr-4"
                      icon v-on ="on"
                    >
                      <v-icon color="success">mdi-bookmark-check</v-icon>
                    </v-btn>
                  </template>
                  <span>confirm</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                  <v-btn
                    v-if="item.confirmed"
                    small
                    icon
                    v-on="on"
                    @mouseover="setActiveReciept(item, index)"
                    @click="print()"
                  >
                    <v-icon color="#1C284E">mdi-printer</v-icon>
                  </v-btn>

                  <v-btn
                    v-else
                    small
                    icon
                    v-on="on"
                    disabled
                  >
                    <v-icon color="#1C284E">mdi-printer</v-icon>
                  </v-btn>

                  </template>
                  <span>Print</span>
                </v-tooltip>

                <div id="printMe" class="black--text d-none">
                  <img
                    style="padding-left:47px; padding-bottom:0px"
                    src="../assets/receipt-logo2.png"
                    height="70"
                  />
                  <h6>ZIMBABWE REVENUE AUTHORITY</h6>
                  <div style="font-size:10px">
                    <p>Taxes Receipt :{{currentReciept.receipt_no}}<br><br>
                      Client No. : .....{{currentReciept.bp_no}}<br>
                      Client Name : .{{currentReciept.client}}<br>
                      Amt Paid : ......{{currentReciept.currency}} {{ Number(currentReciept.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}) }}<br>
                      Tax Code : ......{{currentReciept.tax_code}}<br>
                      Date : ..............{{currentReciept.receipt_date}}<br>
                      Time : .............{{currentReciept.receipt_time}}<br><br>
                      Printed by : {{currentUser.username}}<br><br>
                      .........................................................................
                    </p>
                  </div>

                  <img
                    src="../assets/logo.png"
                    width="190"
                  />
                </div>
              </template>

            </v-data-table>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-parallax>
</template>

<script>
import RecieptsDataService from '../services/RecieptsDataService';
import UserService from '../services/user.service'

export default {
  name: 'user',
  data () {
    return {

      message: '',
      output: null,
      currentReciept: null,
      currentIndex: -1,
      client: '',
      search: '',
      headers: [
        {
          text: 'Transaction Date',
          align: 'start',
          sortable: false,
          value: 'trn_date'
        },
        { text: 'BP Number', value: 'bp_no', sortable: false },
        { text: 'Client', value: 'client', sortable: true },
        { text: 'Amount', value: 'amount', align: 'end', sortable: false },
        { text: 'Reference Number', value: 'reference_no', sortable: false },
        { text: 'Status', value: 'confirmed', sortable: false },
        { text: '', value: 'actions', sortable: false },
      ],
      reciepts: [],
      reciept: {
        id: null,
        client: '',
        reference_no: '',
        bp_no: '',
        currency: '',
        amount:'',
        narrative: '',
        trn_date: '',
        receipt_no: '',
        receipt_time: '',
        tax_code: '',
        confirmed: false,
      },
    }
  },

  methods: {

    retrieveReciepts () {
      RecieptsDataService.getAll()
        .then(response => {
          this.reciepts = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    refreshList () {
      this.retrieveReciepts()
    },

    print () {
      // Pass the element id here
      this.$htmlToPaper('printMe');
    },

    setActiveReciept (reciept, index) {
      this.currentReciept = reciept
      this.currentIndex = index
    },

    searchClient () {
      RecieptsDataService.findByClient(this.client)
        .then(response => {
          this.reciepts = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },
    getReciept (id) {
      RecieptsDataService.get(id)
        .then(response => {
          this.currentReciept = response.data
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },

    updateConfirmed (status) {
      var data = {
        id: this.currentReciept.id,
        client: this.currentReciept.client,
        bp_no: this.currentReciept.bp_no,
        confirmed: status
      }

      RecieptsDataService.update(this.currentReciept.id, data)
        .then(response => {
          this.currentReciept.confirmed = status
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    },
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },

  mounted () {
    UserService.getUserBoard().then(
      response => {
        console.log(response.data);
        this.retrieveReciepts();
        this.message = '';
        this.getReciept(this.$route.params.id)
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

</style>
