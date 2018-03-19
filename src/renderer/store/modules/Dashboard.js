const state = {
  selectedPortfolio: [],
  portfolioList: [{
    id: 1,
    name: 'Apple',
    amount: 10,
    actions: [{
      name: 'Buy',
      isActive: false
    }, {
      name: 'Sell',
      isActive: false
    }, {
      name: 'Ask',
      isActive: true
    }, {
      name: 'Bet',
      isActive: false
    }]
  }, {
    id: 2,
    name: 'Serokell',
    amount: 1,
    actions: [{
      name: 'Buy',
      isActive: false
    }, {
      name: 'Sell',
      isActive: false
    }, {
      name: 'Ask',
      isActive: false
    }, {
      name: 'Bet',
      isActive: false
    }]
  }],
  stocks: [{
    name: 'Gromakell',
    amount: 99.99,
    total: 'Some info, but i don’t know what to place here right now =(',
    isDisabled: true,
    actions: [{
      name: 'Buy'
    }, {
      name: 'Ask'
    }, {
      name: 'Bet'
    }]
  }, {
    name: 'PVA-tell',
    amount: 11,
    total: 'Kley',
    isDisabled: true,
    actions: [{
      name: 'Buy'
    }, {
      name: 'Ask'
    }, {
      name: 'Bet'
    }]
  }, {
    name: 'ALE',
    amount: 'unknown',
    total: 'this is hover state!',
    isDisabled: false,
    actions: [{
      name: 'Buy'
    }, {
      name: 'Bet'
    }]
  }],
  orders: [{
    name: 'Bets'
  }, {
    name: 'Asks'
  }],
  orderType: 1,
  positions: [{
    name: 'Apple',
    total: 47,
    alc: 4700
  }, {
    name: 'Dell',
    total: 23901,
    alc: 740931
  }, {
    name: 'HBO',
    total: 12,
    alc: 24
  }]
}

const mutations = {
  SELECT_PORTFOLIO (state, portfolio) {
    state.selectedPortfolio = portfolio;
  },
  SELECT_ORDER_TYPE (state, index) {
    state.orderType = index;
  },
  REVERSE_PORTFOLIO (state) {
    state.portfolioList.reverse();
  },
  REVERSE_STOCKS (state) {
    state.stocks.reverse();
  }
}

const actions = {
  test ({ commit }) {

  }
}

export default {
  state,
  mutations,
  actions
}
