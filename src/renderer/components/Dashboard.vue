<template>
  <div class="dashboard">

    <Navbar
      :title="'Trader’s Dashboard'"
      :isNavigate="true"
      :isBalance="false"
      :rightMenu="rightMenu"
    />

    <section class="main">
      <div class="content nomenu">
        <div class="container">
          <div class="row">
            <div class="col-8">

              <Panel-heading
                :title="'My Portfolio'"
                :isTop="true"
              />

              <table class="table table-striped table-selected">
                <thead>
                  <tr>
                    <th class="isArrow"># <i class="arrow_down" @click="revPortfolio"></i></th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(portfolio, index) in portfolios" @click="selPortfolio(portfolio)" :class="{ 'selPortfolio': selectedPortfolio.id == portfolio.id }">
                    <th>{{ index+1 }}</th>
                    <td>{{ portfolio.name }}</td>
                    <td>{{ portfolio.amount }}</td>
                    <td>= {{ parsePrice(portfolio.amount * 1000 ) }} ALC</td>
                    <td>
                      <a v-for="badge in portfolio.actions" href="#" class="badge" :class="{ 'active': badge.isActive }">{{ badge.name }}</a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <Panel-heading :title="'Other stocks'" />

              <table class="table table-striped table-selected">
                <thead>
                  <tr>
                    <th class="isArrow"># <i class="arrow_down" @click="revStocks"></i></th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(stock, index) in stocks" :class="{ 'disabled': stock.isDisabled }">
                    <th>{{ index+3 }}</th>
                    <td>{{ stock.name }}</td>
                    <td v-if="stock.amount != 'unknown'">{{ stock.amount }} ALC / stock</td>
                    <td v-else>unknown</td>
                    <td>{{ stock.total }}</td>
                    <td>
                      <a href="#" class="badge" v-for="badge in stock.actions">{{ badge.name }}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="col-4">

              <Panel-heading
                :title="'Trends'"
                :isTop="true"
              />

              <div class="panel">
                <div class="panel-heading">
                  <h3 class="small" v-if="selectedPortfolio.length == 0">No select portfolio</h3>
                  <h3 class="small" v-else>{{ selectedPortfolio.name }}</h3>
                </div>

                <div class="annotation">
                  <h3>Place for graphs</h3>
                  <p>We click stock line on the left and this field shows all the connecting info</p>
                </div>
              </div>

              <Panel-heading
                :title="'Orders'"
              />

              <div class="list-panel-heading flexleft">
                <h3 v-for="(order, index) in orders" :class="{ 'active': orderType == index }" @click="selOrderType(index)">{{ order.name }}</h3>
              </div>

              <table class="table table-striped">
                <tbody>
                  <tr v-for="(position, index) in positions">
                    <th>{{ position.name }}</th>
                    <td>{{ parsePrice(position.total) }}</td>
                    <td>{{ parsePrice(position.alc) }} ALC</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from './layouts/Navbar';
import numeral from 'numeral';
import PanelHeading from './layouts/PanelHeading';

import { mapMutations } from 'vuex';

export default {
  name: 'dashboard',
  components: {
    Navbar,
    PanelHeading
  },
  data() {
    return {
      rightMenu: {
        horizontal: true,
        list: [{
          type: 'link',
          name: 'Buy',
          link: '#'
        }, {
          type: 'link',
          name: 'Sell',
          link: '#'
        }, {
          type: 'link',
          name: 'Ask',
          link: '#'
        }, {
          type: 'link',
          name: 'Bet',
          link: '#'
        }]
      }
    }
  },
  computed: {
    positions() {
      return this.$store.state.Dashboard.positions
    },
    orderType() {
      return this.$store.state.Dashboard.orderType
    },
    stocks() {
      return this.$store.state.Dashboard.stocks
    },
    portfolios() {
      return this.$store.state.Dashboard.portfolioList
    },
    selectedPortfolio() {
      return this.$store.state.Dashboard.selectedPortfolio
    },
    orders() {
      return this.$store.state.Dashboard.orders
    }
  },
  methods: {
    ...mapMutations({
      selectPortfolio: 'SELECT_PORTFOLIO',
      selectOrderType: 'SELECT_ORDER_TYPE',
      reversePortfolio: 'REVERSE_PORTFOLIO',
      reverseStocks: 'REVERSE_STOCKS'
    }),
    selPortfolio(portfolio) {
      this.selectPortfolio(portfolio);
    },
    selOrderType(index) {
      this.selectOrderType(index)
    },
    parsePrice(count) {
      return numeral(count).format('0,0');
    },
    revPortfolio() {
      this.reversePortfolio()
    },
    revStocks() {
      this.reverseStocks()
    },
    initComponent() {
      this.selectPortfolio('');
    }
  },
  created() {
    this.initComponent();
  }
}
</script>

<style lang="scss" scoped>
  .selPortfolio {
    background: #dedfdf !important;
  }
</style>
