<template>
    <div class="transactions">
        <Navbar
                :title="'Transactions'"
                :isNavigate="true"
                :isBalance="true"
                :rightMenu="rightMenu"
        />

        <section class="main">
            <div class="content nomenu">
                <div class="container">
                    <div class="row">

                        <div class="col-12" v-if="isLoader">
                            <Spinner/>
                        </div>

                        <div class="col-12" v-else-if="!isLoader">

                            <Search-panel
                                    :filters="filters"
                                    :activeFilter="activeFilter"
                            />

                            <Activity-list
                                    v-if="getActivity.length !== 0"
                                    :activities="getActivity"
                                    :isShowDate="true"
                            />

                        </div>

                        <div class="col-12" v-if="getActivity.length === 0">
                            <div class="no-found">
                                No transactions found
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Modal-send/>

    </div>
</template>

<script>
    import {mapMutations} from "vuex";
    import {mapGetters} from 'vuex';

    import Navbar from './layouts/Navbar';
    import SearchPanel from './layouts/SearchPanel';
    import Spinner from './layouts/Spinner';
    import numeral from 'numeral';
    import ModalSend from "./modals/Send";
    import ActivityList from "./layouts/ActivityList";

    export default {
        name: 'transactions',
        components: {
            Navbar,
            SearchPanel,
            Spinner,
            ModalSend,
            ActivityList
        },
        data() {
            return {
                rightMenu: {
                    horizontal: false,
                    list: [{
                        type: 'link',
                        name: 'Summary',
                        link: '/wallet'
                    }, {
                        type: 'link',
                        name: 'Wallet Offers',
                        link: '/wallet/offers'
                    }, {
                        type: 'modal',
                        name: 'Send',
                        target: 'send'
                    }, {
                        type: 'link',
                        name: 'Transactions',
                        link: '/wallet/transactions'
                    }, {
                        type: 'link',
                        name: 'Wallet settings',
                        link: '/wallet/settings'
                    }]
                },
                isLoader: false,
                searchText: ''
            }
        },
        computed: {
            ...mapGetters([
                "transactionsFilter"
            ]),
            getFirstWallet: function () {
                return this.$store.state.Wallets.wallets.filter(item => {
                    return parseInt(item.ownerId) === parseInt(this.getUserId);
                })[0].id;
            },
            getUserId: function () {
                return localStorage.getItem('id');
            },
            selectedWallet() {
                return this.$store.state.Wallets.selectedWallet;
            },
            filters() {
                return this.$store.state.Transactions.filters
            },
            activeFilter() {
                return this.$store.state.Transactions.activeFilter
            },
            currentWallet() {
                return this.$store.state.Wallets.currentWallet;
            },
            getFilteredActivity() {
                let list = this.currentWallet.transactions.slice().reverse();
                let activity = [];
                for (let i = 0; list.length < 5 ? i < list.length : i < 5; i++) {
                    let findActivity = this.transactionsFilter.find(item => {
                        return list[i].id === item.id;
                    });
                    if (findActivity !== undefined) {
                        activity.push(findActivity)
                    }
                }
                return activity;
            },
            getActivity() {
                if (this.searchText) {
                    return this.getFilteredActivity.filter(item => {
                        return item.to ? item.to.toLowerCase().includes(this.searchText.toLowerCase()) : item.from.toLowerCase().includes(this.searchText.toLowerCase())
                    })
                }
                return this.getFilteredActivity
            }
        },
        methods: {
            ...mapMutations({
                changeActiveFilter: "CHANGE_ACTIVE_FILTER",
                searchTransaction: "CHANGE_FILTER_TEXT",
                changeNewWallet: 'CHANGE_NEW_WALLET'
            }),
            parsePrice(price) {
                return numeral(price).format('0,0');
            },
            imitationLoadPage() {
                this.isLoader = true;
                setTimeout(() => {
                    this.isLoader = false;
                }, 1000);
            },
            // initialCurrentWallet: function () {
            //   if (!this.newCurrentWallet) {
            //     if (this.getFirstWallet) {
            //       console.log(this.getFirstWallet);
            //       console.log('initial');
            //       this.changeNewWallet(this.getFirstWallet);
            //       localStorage.setItem('walletId', this.getFirstWallet)
            //     } else {
            //       //вызвать модалочку с предложением создать кошелек и перестать юзать 4 пробела
            //     }
            //   }
            // }
        },
        mounted() {
            this.$on('changeFilterType', function (index) {
                this.changeActiveFilter(index);
            });
            this.$on('searchTransaction', function (searchText) {
                this.searchTransaction(searchText);
                this.searchText = searchText;
            });
        },
        created() {
            this.imitationLoadPage();
            // this.initialCurrentWallet();
        }
    }
</script>

<style lang="scss" scoped>
    .activity-list {
        &:nth-child(even) {
            background: inherit;
        }

        &:nth-child(odd) {
            background: #ececec;
        }
    }

    .no-found {
        text-align: center;
        color: #34343e;
        font-size: 14px;
        font-family: MuseoSansCyrl500;
        line-height: calc(100vh - 250px);
    }
</style>
