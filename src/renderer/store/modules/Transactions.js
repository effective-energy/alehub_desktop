import moment from 'moment';

const state = {
    // transactions: [{
    // 	type: 'sent',
    // 	to: '1JmqBkdgYB1p1jJnjqX3wy7NdpsLZbmvEX',
    // 	date: 1517296210000,
    // 	total: '-2583',
    // 	isActive: false
    // }, {
    // 	type: 'received',
    // 	to: 'X3wy7NdpsLZbmvEX1JmqBkdgYB1p1jJnjq',
    // 	date: 1517209810000,
    // 	total: '1234006',
    // 	isActive: true
    // }, {
    // 	type: 'bought',
    // 	to: '3dY46FJKERfdjse2fhwKfj2nRuweVnfskD',
    // 	date: 1517209810000,
    // 	total: '23',
    // 	isActive: true
    // }, {
    // 	type: 'sold',
    // 	to: 'mDke2Kr20Jfur23sgtuIGbjIFeigjUi3',
    // 	date: 1517209810000,
    // 	total: '-5912583',
    // 	isActive: false
    // }, {
    // 	type: 'sold',
    // 	to: '8uu1YhPq8x98ToiZNQ31yRrT9dSFiXoHhHA',
    // 	date: 1517209810000,
    // 	total: '-59',
    // 	isActive: false
    // }, {
    // 	type: 'sent',
    // 	to: 'zvRxbTftekQscARZpjS7ZN2R2dMsGHmnHja',
    // 	date: 1517209810000,
    // 	total: '-191283',
    // 	isActive: false
    // }, {
    // 	type: 'bought',
    // 	to: 'jWVngbRNeBNOYwBTTPrPKXED5bLGrbaBg88',
    // 	date: 1517209810000,
    // 	total: '583',
    // 	isActive: true
    // }, {
    // 	type: 'send',
    // 	to: 'PcrpU1mLEl9MRoaCe4slLg9NWPdEAR01fR7',
    // 	date: 1517209810000,
    // 	total: '-1337',
    // 	isActive: false
    // }, {
    // 	type: 'send',
    // 	to: 'fbebfrDrG9j1jWuvkFh2PmVO8qAlaGXhW55',
    // 	date: 1517209810000,
    // 	total: '-2583',
    // 	isActive: false
    // }, {
    // 	type: 'sold',
    // 	to: 'N5TKOP6F8SjM8bLeLuf70D27h79unhc2R90',
    // 	date: 1517209810000,
    // 	total: '-322228',
    // 	isActive: false
    // }, {
    // 	type: 'received',
    // 	to: 'DDvmbVl7FwUUBAwbiv0zagjBzxa5qnDNfZC',
    // 	date: 1517209810000,
    // 	total: '100000000',
    // 	isActive: true
    // }],
    transactions: [
        {
            id: 1,
            walletId: 1,
            type: 'sent',
            to: 'rJwPtKQyXwLm9PB67J2BVPFCAmpmzC',
            date: 1517617218000,
            total: -2583,
            result: 9945356,
            isActive: false
        }, {
            id: 2,
            walletId: 2,
            type: 'received',
            from: 'jF2XDoOs3mTTTWc2Ivxje7FrxpMpIh',
            date: 1517616218000,
            total: 50000,
            result: 500000,
            isActive: false
        }, {
            id: 3,
            walletId: 3,
            type: 'sent',
            to: 'C5irZXQWS6W4uSHpyxbW3Q5BkcQXMs',
            date: 1517615218000,
            total: -140,
            result: 600600,
            isActive: false
        }, {
            id: 4,
            walletId: 4,
            type: 'sent',
            to: 'gHVLuTRxyKYRZzXal2mK7R2ZB03CKm',
            date: 1517644218000,
            total: -1337,
            result: 99000000,
            isActive: false
        }, {
            id: 5,
            walletId: 5,
            type: 'received',
            from: 'AK3kw42y0RFVpHLTmWEmIlkZ25z9OC',
            date: 1517613218000,
            total: 1004,
            result: 12500,
            isActive: false
        }, {
            id: 6,
            walletId: 6,
            type: 'received',
            from: '5VnFZ25AsUoEW0GhBmh6ndmW7qhi0p',
            date: 1517612218000,
            total: 3458,
            result: 900000,
            isActive: false
        }, {
            id: 7,
            walletId: 1,
            type: 'received',
            from: 'rJwPtKQyXwLm9PB67J2BVPFCAmpmzC',
            date: 1517659218000,
            total: 435,
            result: 9945791,
            isActive: false
        }, {
            id: 8,
            walletId: 1,
            type: 'sent',
            to: 'rJwPtKQyXwLm9PB67J2BVPFCAmpmzC',
            date: 1517669218000,
            total: -12333,
            result: 9933458,
            isActive: false
        }, {
            id: 9,
            walletId: 1,
            type: 'sent',
            to: 'rJwPtKQyXwLm9PB67J2BVPFCAmpmzC',
            date: 1517679218000,
            total: -13458,
            result: 9920000,
            isActive: false
        }, {
            id: 10,
            walletId: 1,
            type: 'received',
            from: 'rJwPtKQyXwLm9PB67J2BVPFCAmpmzC',
            date: 1517689218000,
            total: 3458,
            result: 9923458,
            isActive: false
        }, {
            id: 11,
            walletId: 1,
            type: 'sent',
            to: 'rJwPtKQyXwLm9PB67J2BVPFCAmpmzC',
            date: 1517900218000,
            total: -13458,
            result: 9910000,
            isActive: false
        }, {
            id: 12,
            walletId: 1,
            type: 'received',
            from: 'rJwPtKQyXwLm9PB67J2BVPFCAmpmzC',
            date: 1517912218000,
            total: 3458,
            result: 9913458,
            isActive: false
        }, {
            id: 13,
            walletId: 1,
            type: 'sent',
            to: 'rJwPtKQyXwLm9PB67J2BVPFCAmpmzC',
            date: 1517992218000,
            total: -13458,
            result: 9900000,
            isActive: false
        }
    ],
    tmpTransactions: [],
    // filters: ['All', 'Income', 'Expend'],
    filters: ['All'],
    activeFilter: 0,
    searchText: '',
    hideFilter: false
};

const mutations = {
    CHANGE_ACTIVE_FILTER(state, index) {
        state.activeFilter = index;
    },
    CHANGE_FILTER_TEXT(state, searchText) {
        state.searchText = searchText;
    },
    SET_NOTIFICATION_FOR_SEND(state, data) {
        state.transactions.push({
            id: state.transactions.length + 1,
            walletId: data.walletId,
            type: 'sent',
            to: data.address,
            date: new Date(),
            total: '-' + data.sendedBalance,
            result: data.result,
            isActive: false
        });
    },
    REMOVE_TRANSACTIONS(state, transactionsId) {
        for (let i = 0; i < transactionsId.length; i++) {
            let rmTransactionsInd = state.transactions.findIndex(item => {
                return parseInt(item.id) === parseInt(transactionsId[i].id);
            });
            state.transactions.splice(rmTransactionsInd, 1);
        }
    },
    SET_HIDE_FILTER(state, prop) {
        state.hideFilter = prop;
    }
};

const getters = {
    transactionsFilter: state => {
        if (state.activeFilter === 0) {
            return state.transactions;
        }
        if (state.activeFilter === 1) return state.transactions.filter(item => {
            return item.type == 'received' || item.type == 'bought'
        });
        if (state.activeFilter === 2) return state.transactions.filter(item => {
            return item.type == 'sold' || item.type == 'sent'
        });
    }
};

export default {
    state,
    mutations,
    getters
}