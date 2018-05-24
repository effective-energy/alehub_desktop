<template>
    <div class="wallet">
        <Navbar
                :title="$t('pages.summary.navbarTitle')"
                :isNavigate="true"
                :isBalance="true"
                :rightMenu="rightMenu"
        />
        <section class="main">
            <Wallets-list
                    :wallets="wallets"
                    :new-wallets="walletList"
            />

            <div class="content">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="stats-balance">
                                <div class="stats-col">
                                    <div>
                                        <button class="buttons btn-yellow" @click="openModal('send')">
                                            <img src="../assets/img/send.svg" width="18" height="15" class="icon">
                                            {{ $t('pages.summary.buttons.send') }}
                                        </button>
                                        <button class="buttons btn-default" @click="openModal('request')">
                                            <img src="../assets/img/receive.svg" width="18" height="15" class="icon">
                                            {{ $t('pages.summary.buttons.request') }}
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <!--<div style="display: flex; justify-content: flex-end;">-->
                                <!--<div style="display: flex; justify-content: flex-end; flex-direction: column;">-->

                                <!--</div>-->
                            <!--</div>-->
                            <!--<TransactionsFilter />-->
                        </div>
                        <!--<div class="col-12">-->
                            <!--<button class="buttons btn-yellow" @click="openModal('send')">-->
                                <!--<img src="../assets/img/send.svg" width="18" height="15" class="icon">-->
                                <!--{{ $t('pages.summary.buttons.send') }}-->
                            <!--</button>-->
                            <!--<button class="buttons btn-default" @click="openModal('request')">-->
                                <!--<img src="../assets/img/receive.svg" width="18" height="15" class="icon">-->
                                <!--{{ $t('pages.summary.buttons.request') }}-->
                            <!--</button>-->
                        <!--</div>-->

                        <div class="col-12" style="margin-top: 20px;" v-if="false">

                            <Search-panel
                                    :filters="filters"
                                    :activeFilter="activeFilter"
                            />

                            <!--<datepicker-->
                            <!--id="datepickerFrom"-->
                            <!--v-model="dateFrom"-->
                            <!--language="en"-->
                            <!--:placeholder="placeholderDateFrom"-->
                            <!--/>-->

                            <!--<datepicker-->
                            <!--id="datepickerTo"-->
                            <!--v-model="dateTo"-->
                            <!--language="en"-->
                            <!--:placeholder="placeholderDateTo"-->
                            <!--/>-->

                            <Activity-list
                                    v-if="getActivity.length !== 0"
                                    :activities="getActivity"
                                    :isShowDate="true"
                            />


                            <!--<charts-panel-->
                            <!--:options="optionsChart"-->
                            <!--:wallet-balance="currentBalance"-->
                            <!--:active-period="activePeriodChart"-->
                            <!--:periods="periodsChart"-->
                            <!--/>-->

                        </div>

                        <div class="col-12">

                            <Panel-heading :title="$t('pages.summary.panelHeadings.recent')"/>

                            <Activity-list
                            :activities="getActivity"
                            v-if="getActivity.length > 0"
                            />

                            <div v-else class="empty-notif">
                            <p>No transactions found</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Modal-send/>
        <Modal-request/>
        <New-wallet/>
    </div>
</template>

<script>
    import Navbar from "./layouts/Navbar";
    import WalletsList from "./layouts/WalletsList";
    import ActivityList from "./layouts/ActivityList";
    import ModalSend from "./modals/Send";
    import ModalRequest from "./modals/Request";
    import PanelHeading from "./layouts/PanelHeading";
    import NewWallet from './modals/NewWallet';
    import ChartsPanel from './layouts/ChartsPanel';
    import SearchPanel from './layouts/SearchPanel';
    import Datepicker from 'vuejs-datepicker';
    import TransactionsFilter from './layouts/TransactionsFilter';
    import FormattingPrice from './layouts/FormattingPrice';
    import path from 'path';
    import storage from 'electron-json-storage';

    import {mapMutations} from "vuex";
    import {mapGetters} from "vuex";
    import { defaultCoreCipherList } from 'constants';
    import { setTimeout, setInterval } from 'timers';
    import { throws } from 'assert';

    export default {
        name: "wallet",
        components: {
            Navbar,
            WalletsList,
            ActivityList,
            ModalSend,
            ModalRequest,
            PanelHeading,
            NewWallet,
            ChartsPanel,
            SearchPanel,
            Datepicker,
            TransactionsFilter,
            FormattingPrice
        },
        watch: {
            // dateFrom: function (val) {
            //     console.log(val, 'dateFrom');
            // },
            // dateTo: function (val) {
            //     console.log(val, 'dateTo');
            // }
            selectedWallet: function (val) {
                if (this.setIntervalIdTransactions) {
                    clearInterval(this.setIntervalIdTransactions)
                }
                let _this = this;
                this.getTransactionsForWallet();
                this.setIntervalIdTransactions = setInterval(function () {
                    _this.getTransactionsForWallet();
                }, 15000);
            }
        },
        data() {
            return {
                isSuccessNotif: true,
                dateFrom: null,
                dateTo: null,
                placeholderDateFrom: 'Date from',
                placeholderDateTo: 'Date to',
                rightMenu: {
                    horizontal: false,
                    list: [{
                        type: "link",
                        name: this.$t('pages.summary.rightMenu.summary'),
                        link: "/wallet"
                    }, {
                        type: 'link',
                        name: this.$t('pages.summary.rightMenu.walletOffers'),
                        link: '/wallet/offers'
                    }, {
                        type: "modal",
                        name: this.$t('pages.summary.rightMenu.send'),
                        target: "send"
                    }, {
                        type: "link",
                        name: this.$t('pages.summary.rightMenu.transactions'),
                        link: "/wallet/transactions"
                    }, {
                        type: "link",
                        name: this.$t('pages.summary.rightMenu.walletSettings'),
                        link: "/wallet/settings"
                    }]
                },
                searchText: '',
                walletList: [],
                transactionsList: [],
                setIntervalIdTransactions: 0
            }
        },
        computed: {
            ...mapGetters([
                "transactionsFilter"
            ]),
            chartData() {
                return this.$store.state.Charts;
            },
            wallets() {
                return this.$store.state.Wallets.walletsList;
            },
            // walletList() {
            //     return this.$store.state.Wallets.wallets;
            // },
            currentWallet() {
                return this.$store.state.Wallets.currentWallet;
            },


            currentBalance: function () {
                return this.$store.state.Wallets.currentWallet.balance;
            },
            optionsChart: function () {
                return this.$store.state.Charts.options;
            },
            activePeriodChart: function () {
                return this.$store.state.Charts.activePeriod;
            },
            periodsChart: function () {
                return this.$store.state.Charts.periods;
            },


            getUserWallets() {
                return this.walletList.filter(item => {
                    return parseInt(item.ownerId) === parseInt(this.getUserId);
                });
            },
            getUserId() {
                return localStorage.getItem('id');
            },
            getFirstWallet() {
                if (this.getUserWallets.length !== 0)
                    return this.getUserWallets[0].id;
                return false;
            },
            // getActivity() {
            //     let list = this.currentWallet.transactions.slice().reverse();
            //     let activity = [];
            //     for (let i = 0; list.length < 5 ? i < list.length : i < 5; i++) {
            //         activity.push(this.getTransactions.find(item => {
            //             return list[i].id === item.id;
            //         }));
            //     }
            //     return activity;
            // },

            filters() {
                return this.$store.state.Transactions.filters;
            },
            activeFilter() {
                return this.$store.state.Transactions.activeFilter
            },
            getTransactions() {
                return this.$store.state.Transactions.transactions;
            },

            currentTransactions: function () {
                return this.$store.state.Transactions.transactions.filter(item => {
                    return item.walletId === parseInt(localStorage.getItem('walletId'));
                });
            },

            currentTmpTransactions: function () {
                let dateFrom = this.dateFrom,//.getTime(),
                    dateTo = this.dateTo//.getTime();

                // console.log(this.dateFrom.getTime(), 'check')

                return this.currentTransactions.filter(item => {
                    return item.date > dateFrom && item.date < dateTo;
                });
            },

            getFilteredActivity: function () {

                // let list = this.currentTmpTransactions.slice().reverse();
                // let activity = [];
                // for (let i = 0; i < list.length; i++) {
                //     let findActivity = this.transactionsFilter.find(item => {
                //         return list[i].id === item.id;
                //     });
                //     if (findActivity !== undefined) {
                //         activity.push(findActivity)
                //     }
                // }
                return this.transactionsList;//activity;
                // let list = this.currentWallet.transactions.slice().reverse();
                // let activity = [];
                // for (let i = 0; i < list.length; i++) {
                //     let findActivity = this.transactionsFilter.find(item => {
                //         return list[i].id === item.id;
                //     });
                //     if (findActivity !== undefined) {
                //         activity.push(findActivity)
                //     }
                // }
                // return activity;
            },
            getActivity() {
                if (this.searchText) {
                    return this.getFilteredActivity.filter(item => {
                        return item.to ? item.to.toLowerCase().includes(this.searchText.toLowerCase()) : item.from.toLowerCase().includes(this.searchText.toLowerCase())
                    })
                }
                return this.getFilteredActivity;
            },
            selectedWallet() {
                return this.$store.state.Wallets.selectedWallet;
            }
        },
        methods: {
            ...mapMutations({
                changeWallet: "CHANGE_SELECTED_WALLET",
                sendMoneyToAdress: "SEND_MONEY_TO_ADDRESS",
                changeNewWallet: 'CHANGE_NEW_WALLET',
                setNotificationForSend: 'SET_NOTIFICATION_FOR_SEND',
                setNotificationForSendToProfile: 'SET_NOTIFICATION_FOR_SEND_TO_PROFILE',
                setDefaultChart: 'SET_DEFAULT_CHARTS',
                setActivePeriod: 'SET_ACTIVE_PERIOD',

                changeActiveFilter: "CHANGE_ACTIVE_FILTER",
                searchTransaction: "CHANGE_FILTER_TEXT"
            }),
            openModal(name) {
                this.$modal.show(name);
            },
            initialCurrentWallet() {
                if (this.walletList.length === 0) {
                    this.$modal.show('newwallet');
                }
            },




            initiateDatepickers: function () {
                this.dateFrom = new Date(this.currentTransactions.reduce(
                    (acc, loc) =>
                        acc.date < loc.date
                            ? acc
                            : loc
                ).date);
                this.dateTo = new Date();
            },


            currentBalanceBeginPeriod: function () {
                return this.currentTmpTransactions.reduce(
                    (acc, loc) =>
                        acc.date <= loc.date
                            ? acc
                            : loc
                ).result;
            },
            currentBalanceEndPeriod: function () {
                return this.currentTmpTransactions.reduce(
                    (acc, loc) =>
                        acc.date >= loc.date
                            ? acc
                            : loc
                ).result;
            },
            currentSentBalance: function () {
                let sentBalance = this.currentTmpTransactions.filter(item => {
                    return item.type === 'sent';
                }).reduce(
                    (sum, current) => {
                        return {total: parseInt(sum.total) + parseInt(current.total)};
                    }
                );
                return sentBalance.total;
            },
            currentReceiveBalance: function () {
                let receiveBalance = this.currentTmpTransactions.filter(item => {
                    return item.type === 'received';
                }).reduce(
                    (sum, current) => {
                        return {total: parseInt(sum.total) + parseInt(current.total)};
                    }
                );
                return receiveBalance.total;
            },
            createNewWallet (name, publicKey) {
                this.setNewWalletToStorage(name, publicKey);
                this.changeNewWallet(publicKey);
            },
            setNewWalletToStorage (name, address) {
                let wallets = [],
                    _this = this
                storage.getAll(function(error, data) {
                    if (error)
                        return console.error(error);
                    if (!data.wallets) {
                        storage.set('wallets', [
                            {
                                name: name,
                                balance: 'sdf',
                                address: address
                            }
                        ], function(error) {
                            if (error)
                                return console.error(error);
                            _this.getBalanceForWallet()
                        })
                    }
                    else {
                        wallets = data.wallets;
                        wallets.push(
                            {
                                name: name,
                                balance: 'sdf',
                                address: address
                            }
                        )
                        console.log(wallets)
                        storage.set('wallets', wallets, function(error) {
                            if (error)
                                return console.error(error);
                            _this.getBalanceForWallet()
                        })
                    }
                })
            },
            getBalanceForWallet() {
                let wallets = [],
                    _this = this;
                storage.getAll(function(error, data) {
                    if (error) throw error;
                    wallets = data.wallets;
                    let address = wallets[wallets.length-1].address.replace(/\//g,"\%2F")
                    _this.$http.get(`http://localhost:9757/http://127.0.0.1:12348/node/state/account/${address}/$@`, {
                    headers : {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    }
                    }).then(response => {
                        wallets[wallets.length-1].balance = response.body
                        storage.set('wallets', wallets, function(error) {
                            if (error)
                                return console.error(error);
                            _this.getWalletList()
                            _this.$modal.hide('newwallet');
                            storage.set('selectedWallet', wallets[wallets.length-1].address, function() {
                                if(error) throw error
                            })
                        })
                    }, response => {
                        console.error('Все сломалось(')
                    })
                });
                

                // setTimeout(() => {
                //     storage.getAll(function(error, data) {
                //         if (error) throw error;
                //         console.log(data.wallets);
                //     });
                // }, 1000);
            },
            importWallet(data) {
                this.$http.put(`http://localhost:9757/http://127.0.0.1:12348/importWallet`,JSON.stringify(data.secret), {
                headers : {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
                }).then(response => {
                    let dif = this.walletList.find(item => {
                        return item.address === response.body.wiPublicKey;
                    });
                    if (dif !== undefined) return this.$modal.hide('newwallet');
                    this.setNewWalletToStorage(data.name, response.body.wiPublicKey)
                }, response => {
                    console.log('Все сломалось(')
                })
            },
            getWalletList() {
                let _this = this;
                storage.getAll(function(error, data) {
                    if (error) throw error;
                    if (!data.wallets) return _this.initialCurrentWallet();
                    _this.walletList = data.wallets;
                    _this.initialCurrentWallet();
                })
            },
            updateAllBalances() {
                let _this = this
                storage.getAll(function(error, data) {
                    if (error) throw error
                    let wallets = data.wallets
                    for (let i = 0; i < wallets.length; i++) {
                        let urlAddress = wallets[i].address.replace(/\//g,"\%2F");
                        _this.$http.get(`http://localhost:9757/http://127.0.0.1:12348/node/state/account/${urlAddress}/$@`, {
                        headers : {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Accept': 'application/json'
                        }
                        }).then(response => {
                            wallets[i].balance = response.body
                            if (i == wallets.length-1) {
                                storage.set('wallets', wallets, function(error) {
                                    if (error) throw error
                                    _this.getWalletList()
                                    
                                })
                            }
                        }, response => {
                            console.log('Все сломалось(')
                        })
                    }
                })
            },
            getTransactionsForWallet() {
                this.$http.get(`http://localhost:9757/http://127.0.0.1:12348/wallets/${this.selectedWallet.replace(/\//g,"\%2F")}/transactions/list`, {
                headers : {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
                }).then(response => {
                    let formatedData = []
                    for (let i = 0; i < response.body.length; i++) {
                        formatedData.push({
                            date: response.body[i].tTimestamp,
                            type: response.body[i].tSender == this.selectedWallet ? 'sent' : 'received',
                            from: response.body[i].tSender,
                            to: response.body[i].tReceiver,
                            total: response.body[i].tAmount
                        })
                    }
                    if (formatedData.length !== 0)
                        this.transactionsList = formatedData;
                }, response => {
                    console.log('Все сломалось(')
                })
            }
        },
        created() {
            setTimeout(() => {
                this.getWalletList();
                this.updateAllBalances();
                setInterval(this.updateAllBalances,15000);
            }, 200);
            // setTimeout(() => {
            //     storage.remove('wallets', function(error) {
            //         if (error) throw error;
            //     });
            //     storage.remove('selectedWallet', function(error) {
            //         if (error) throw error;
            //     });
            // }, 100);
        },
        mounted() {
            // this.initiateDatepickers();

            this.$on('sendMoney', function (data) {
                this.sendMoneyToAdress(data);
                this.setNotificationForSend(data);
                let lastNotif = this.getTransactions[this.getTransactions.length - 1];
                this.setNotificationForSendToProfile(lastNotif);
            });

            this.$on('successCopyAddress', function (wallet) {
                this.$modal.hide('request');
                this.$toasted.show(`Address ${wallet} was copied to the clipboard`, {
                    duration: 5000,
                    type: 'success',
                });
            });

            //this.setDefaultChart('year');

            this.$on('setPeriod', function (period) {
                this.setActivePeriod(period);
                if (period !== "alltime") this.setDefaultChart(period);
            });


            this.$on('changeFilterType', function (index) {
                this.changeActiveFilter(index);
            });

            this.$on('searchTransaction', function (searchText) {
                this.searchTransaction(searchText);
                this.searchText = searchText;
            });

            this.$on('changeDateFrom', val => {
                (this.dateFrom) ? this.dateFrom = val : this.dateFrom = null;
            });

            this.$on('changeDateTo', val => {
                (this.dateTo) ? this.dateTo = val : this.dateTo = null;
            });

            this.$on('createNewWallet', function (name, wallet) {
                this.createNewWallet(name, wallet)
            })

            this.$on('importWallet', function (data) {
                this.importWallet(data)
            })

            this.$on('updateAllBalances', function() {
                this.updateAllBalances()
            })

            //this.currentBalanceBeginPeriod();
        }
    };
</script>

<style lang="stylus" scoped>

    .result-opt-span.sent
        color #b10303

    .stats-col1
        display flex

    .stats-col
        display flex
        flex-direction column

    .stats-balance
        font-size 14px
        font-family MuseoSansCyrl500
        color #34343e
        display flex
        justify-content space-between

        .result-opt-span
            align-self flex-end

        .title-opt-span
            align-self flex-start

    .result-opt-span, .count, .title-opt-span
        margin 0 10px 0 10px
        padding 5px

    .empty-notif
        background-color #f0f0f0
        padding 5px
        p
            opacity 0.7
            font-family MuseoSansCyrl500
            font-size 16px
            font-weight 500
            line-height 1.25
            text-align center
            color #34343e
</style>

<style lang="stylus">

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button
        -webkit-appearance none
        -moz-appearance none
        appearance none
        margin 0


</style>