<template>
    <div class="portfolio">
        <Navbar
                :title="$t('pages.walletOffers.navbarTitle')"
                :isNavigate="true"
                :isBalance="true"
                :rightMenu="rightMenu"
        />
        <section class="main">
            <Wallets-list
                    :new-wallets="walletList"
            />

            <div class="content">
                <div class="container">
                    <div class="row">
                        <div class="col-12">

                            <Panel-heading
                                    :title="$t('pages.walletOffers.portfolios.title')"
                                    :check-box="true"
                                    :check-box-name="$t('pages.walletOffers.hideComplete')"
                                    :check-box-value="'portfolio'"
                                    :check-box-state="stateHiddenCompletedPortfolio"
                            />

                            <div class="offer-list" v-for="portfolio in listUserWalletPortfolio">
                                <SingleOffer :item="portfolio"/>
                            </div>

                            <Empty-list
                                    v-if="listUserWalletPortfolio.length === 0"
                                    :textMessage="emptyPortfolio.text"
                                    :textButton="emptyPortfolio.button"
                                    :yellowBtn="emptyPortfolio.buttonStyle"
                                    :isBtn="true"
                                    :type="'portfolio'"
                            />

                            <Panel-heading
                                    :title="$t('pages.walletOffers.offers.title')"
                                    :is-top="true"
                                    :check-box="true"
                                    :check-box-name="$t('pages.walletOffers.hideComplete')"
                                    :check-box-value="'offers'"
                                    :check-box-state="stateHiddenCompletedOffers"
                            />

                            <div class="offer-list" v-for="offer in listUserWalletOffers">
                                <SingleOffer :item="offer"/>
                            </div>

                            <Empty-list
                                    v-if="listUserWalletOffers.length === 0"
                                    :textMessage="emptyOffer.text"
                                    :textButton="emptyOffer.button"
                                    :yellowBtn="emptyOffer.buttonStyle"
                                    :isBtn="true"
                                    :type="'offer'"
                            />

                        </div>
                    </div>
                </div>
            </div>
        </section>

        <New-wallet/>
        <Modal-send/>
    </div>
</template>

<script>
    import Navbar from "./layouts/Navbar";
    import WalletsList from "./layouts/WalletsList";
    import PanelHeading from "./layouts/PanelHeading";
    import SingleOffer from './layouts/SingleOffer';
    import EmptyList from './layouts/EmptySummaryList';
    import NewWallet from './modals/NewWallet';
    import ModalSend from "./modals/Send";

    import {mapMutations} from "vuex";

    export default {
        name: 'Portfolio',
        components: {
            Navbar,
            WalletsList,
            PanelHeading,
            SingleOffer,
            EmptyList,
            NewWallet,
            ModalSend
        },
        data() {
            return {
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
                }
            }
        },
        computed: {
            getUserId: function () {
                return localStorage.getItem('id');
            },
            walletList: function () {
                return this.$store.state.Wallets.wallets;
            },
            currentWallet: function () {
                return this.$store.state.Wallets.currentWallet;
            },
            getFirstWallet: function () {
                return this.$store.state.Wallets.wallets.filter(item => {
                    return parseInt(item.ownerId) === parseInt(this.getUserId);
                })[0].id;
            },
            stateHiddenCompletedOffers: function () {
                return this.currentWallet.hideCompleteOffers;
            },
            emptyPortfolio: function () {
                if (this.currentWallet.hideCompletePortfolio) {
                    return {
                        text: this.$t('pages.walletOffers.portfolios.noTasks.title'),
                        button: this.$t('pages.walletOffers.portfolios.noTasks.btntext'),
                        buttonStyle: true
                    }
                } else {
                    return {
                        text: this.$t('pages.walletOffers.portfolios.empty.title'),
                        button: this.$t('pages.walletOffers.portfolios.empty.btntext'),
                        buttonStyle: true
                    }
                }
            },
            emptyOffer() {
                if (this.currentWallet.hideCompleteOffers) {
                    return {
                        text: this.$t('pages.walletOffers.offers.noTasks.title'),
                        button: this.$t('pages.walletOffers.offers.noTasks.btntext'),
                        buttonStyle: false
                    }
                } else {
                    return {
                        text: this.$t('pages.walletOffers.offers.empty.title'),
                        button: this.$t('pages.walletOffers.offers.empty.btntext'),
                        buttonStyle: false
                    }
                }
            },
            stateHiddenCompletedPortfolio() {
                return this.currentWallet.hideCompletePortfolio;
            },
            listUserOffers: function () {
                return this.$store.state.Offers.offersList.filter(item => {
                    return parseInt(item.ownerId) === parseInt(this.getUserId);
                });
            },
            listContractorOffers: function () {
                return this.$store.state.Offers.offersList.filter(item => {
                    return parseInt(item.contractorId) === parseInt(this.getUserId);
                });
            },
            listUserWalletPortfolio: function () {
                let resultWalletPortfolio = [],
                    hideCompletePortfolio = this.currentWallet.hideCompletePortfolio,
                    listContractorOffers = this.listContractorOffers,
                    listCurrentWalletPortfolio = this.currentWallet.portfolio;


                for (let i = 0; i < listContractorOffers.length; i++) {
                    for (let j = 0; j < listCurrentWalletPortfolio.length; j++) {
                        if (!hideCompletePortfolio) {
                            if (parseInt(listContractorOffers[i].id) === parseInt(listCurrentWalletPortfolio[j].id)) {
                                resultWalletPortfolio.push(listContractorOffers.find(item => {
                                    return item.id === listCurrentWalletPortfolio[j].id;
                                }));
                            }
                        } else {
                            if (parseInt(listContractorOffers[i].id) === parseInt(listCurrentWalletPortfolio[j].id) && !listContractorOffers[i].completed) {
                                resultWalletPortfolio.push(listContractorOffers.find(item => {
                                    return item.id === listCurrentWalletPortfolio[j].id;
                                }));
                            }
                        }
                    }
                }

                return resultWalletPortfolio;
            },
            listUserWalletOffers: function () {
                let resultWalletOffers = [],
                    hideCompleteOffers = this.currentWallet.hideCompleteOffers,
                    listUserOffers = this.listUserOffers,
                    listCurrentWalletOffers = this.currentWallet.offers;


                for (let i = 0; i < listUserOffers.length; i++) {
                    for (let j = 0; j < listCurrentWalletOffers.length; j++) {
                        if (!hideCompleteOffers) {
                            if (parseInt(listUserOffers[i].id) === parseInt(listCurrentWalletOffers[j].id)) {
                                resultWalletOffers.push(listUserOffers.find(item => {
                                    return item.id === listCurrentWalletOffers[j].id;
                                }));
                            }
                        } else {
                            if (parseInt(listUserOffers[i].id) === parseInt(listCurrentWalletOffers[j].id) && !listUserOffers[i].completed) {
                                resultWalletOffers.push(listUserOffers.find(item => {
                                    return item.id === listCurrentWalletOffers[j].id;
                                }));
                            }
                        }

                    }
                }

                return resultWalletOffers;
            },
        },
        methods: {
            ...mapMutations({
                changeWallet: "CHANGE_SELECTED_WALLET",
                toggleCompletePortfolio: "TOGGLE_COMPLETE_PORTFOLIO",
                changeNewWallet: 'CHANGE_NEW_WALLET',
                toggleCompleteWalletOptions: 'TOGGLE_COMPLETE_WALLET_OPTIONS'
            }),
            checkBoxToggle(value) {
                this.toggleCompleteWalletOptions(value);
            },
        },
        mounted() {
            this.$on('toggleCheckBox', function (state, value) {
                this.checkBoxToggle(state, value)
            })
        }
    }
</script>