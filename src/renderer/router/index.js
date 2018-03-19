import Vue from 'vue';
import Router from 'vue-router';
import store from '../store'

import Login from '@/components/Login';
import Register from '@/components/Register';
import Wallet from '@/components/Wallet';
import Dashboard from '@/components/Dashboard';
import Settings from '@/components/Settings';
import WalletSettings from '@/components/WalletSettings';
import Trading from '@/components/Trading';
import Offers from '@/components/Offers';
import Offer from '@/components/Offer';
import TwoAuth from '@/components/TwoAuth';
import Transactions from '@/components/Transactions';
import NewOffer from '@/components/NewOffer';
import OffersSaved from '@/components/OffersSaved';
import EditOffer from '@/components/EditOffer';
import Notifications from '@/components/Notifications';
import WalletOffers from '@/components/WalletOffers';

Vue.use(Router);

const router = new Router({
    routes: [{
        path: '/',
        name: 'Wallet',
        component: Wallet
    }, {
        path: '/wallet',
        name: 'Wallet',
        component: Wallet
    }, {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    }, {
        path: '/settings',
        name: 'Settings',
        component: Settings
    }, {
        path: '/wallet/settings',
        name: 'WalletSettings',
        component: WalletSettings
    }, {
        path: '/wallet/trading',
        name: 'Trading',
        component: Trading
    }, {
        path: '/offers',
        name: 'Offers',
        component: Offers
    }, {
        path: '/offers/saved',
        name: 'OffersSaved',
        component: OffersSaved
    }, {
        path: '/offers/new',
        name: 'NewOffer',
        component: NewOffer
    }, {
        path: '/offers/edit/:id',
        name: 'EditOffer',
        component: EditOffer
    }, {
        path: '/offers/:id',
        name: 'Offer',
        component: Offer
    }, {
        path: '/wallet/transactions',
        name: 'Transactions',
        component: Transactions
    }, {
        path: '/notifications',
        name: 'Notifications',
        component: Notifications
    }, {
        path: '/wallet/offers',
        name: 'WalletOffers',
        component: WalletOffers
    }, {
        path: '*',
        name: 'NotFound',
        component: Wallet
    }]
});

router.beforeEach((to, from, next) => {
    console.log('to', to.name);
    let userId = localStorage.getItem('id');
    if (localStorage.getItem('systemLang') === null) {
        localStorage.setItem('systemLang', 'eng');
    }
    if (localStorage.getItem('id') === null) {
        localStorage.setItem('id', 1);
    }

    let findUserWallet = store.state.Wallets.wallets.filter(item => {
        return parseInt(item.ownerId) === parseInt(userId)
    });

    if (to.name !== 'Wallet') {
        if (findUserWallet.length === 0) {
            router.push('wallet');
        }
    }

    if (findUserWallet.length !== 0) {
        store.state.Wallets.currentWallet = findUserWallet.find(item => {
            return parseInt(item.id) === parseInt(localStorage.getItem('walletId'));
        });

        if (store.state.Wallets.currentWallet === undefined) {
            store.state.Wallets.currentWallet = findUserWallet[0];
            localStorage.setItem('walletId', findUserWallet[0].id)
        }
    }

    console.log(findUserWallet.find(item => {
        return parseInt(item.id) === parseInt(localStorage.getItem('walletId'));
    }));

    next();
});

export default router;