<template>
    <div class="walletSettings">
        <Navbar
                :title="$t('pages.walletSettings.navbarTitle')"
                :isNavigate="true"
                :isBalance="true"
                :rightMenu="rightMenu"
        />

        <section class="main">
            <Wallets-list
                    :selectedWallet="currentWallet"
                    :new-wallets="walletList"
                    :isSettings="true"
            />

            <div class="content">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="form">
                                <div class="control">
                                    <div class="wrap-input">
                                        <label for="walletname">{{ $t('pages.walletSettings.fields.name.walletName')
                                            }}</label>
                                        <input type="text" id="walletname" :value="activeWallet.name"
                                               @input="changeWalletName" v-on:blur="changeWalname"
                                               @keyup.enter="changeWalname">
                                    </div>
                                </div>

                                <div class="text-center">
                                    <a class="deletelink" @click="deleteWallet">{{
                                        $t('pages.walletSettings.fields.deleteWallet') }}</a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Modal-delete-wallet/>
        <Modal-send/>
        <New-wallet/>
    </div>
</template>

<script>
    import Navbar from './layouts/Navbar';
    import WalletsList from './layouts/WalletsList';
    import SelectControl from './layouts/forms/Select';
    import SwitchControl from './layouts/forms/SwitchControl';
    import ModalDeleteWallet from './modals/DeleteWallet';
    import ModalSend from "./modals/Send";
    import NewWallet from './modals/NewWallet';
    import storage from 'electron-json-storage';

    import {mapMutations} from 'vuex';
    import { setInterval } from 'timers';

    export default {
        name: 'walletSettings',
        components: {
            Navbar,
            WalletsList,
            SelectControl,
            SwitchControl,
            ModalDeleteWallet,
            ModalSend,
            NewWallet
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
                        type: "modal",
                        name: this.$t('pages.summary.rightMenu.send'),
                        target: "send"
                    }]
                },
                spendingPassword: false,
                newWalletName: '',
                selectedSecurityLevel: 'normal',
                activeWallet: '',
                walletList: [],
                getWalletListId: 0
            }
        },
        computed: {
            currentWallet() {
                return this.$store.state.Wallets.currentWallet;
            }
        },
        methods: {
            ...mapMutations({
                changeWallet: 'CHANGE_SELECTED_WALLET',
                updateWalletName: 'CHANGE_WALLET_NAME',
                deleteWallet: 'DELETE_WALLET',

            }),
            changeWalname(e) {
                e.target.blur();
                let _this = this;
                for (let i = 0; i < this.walletList.length; i++) {
                    if (this.walletList[i].address === this.activeWallet.address) {
                        this.walletList[i].name = this.newWalletName;
                        storage.set('wallets', this.walletList, function(error) {
                            if (error)
                                return console.error(error);
                            _this.getWalletList()
                        })
                    }
                }
            },
            deleteWallet() {
                this.$modal.show('deletewallet');
            },
            changeWalletName(e) {
                this.newWalletName = e.target.value;
            },
            changeChecker(id, value) {
                if (id == 'spendingPassword') {
                    this.spendingPassword = value
                }
            },
            initComponent() {
                let _this = this;
                this.getWalletList();
                this.getWalletListId = setInterval(function () {
                    _this.getWalletList();
                }, 15000);
            },
            newSelect(value, id) {
                if (id == "security")
                    this.selectedSecurityLevel = value;
            },
            getSelectedWallet() {
                let _this = this
                storage.getAll(function(error, data) {
                    if (error) throw error
                    _this.activeWallet = _this.walletList.find(item => {
                        return data.selectedWallet === item.address
                    })
                })
            },
            getWalletList: function () {
                let _this = this;
                storage.getAll(function(error, data) {
                    if (error) throw error;
                    if (!data.wallets) return _this.initialCurrentWallet();
                    _this.walletList = data.wallets;
                    _this.getSelectedWallet();
                })
            },
            changeeWallet: function (address) {
                this.activeWallet = this.walletList.find(item => {
                    return item.address === address;
                })
            }
        },
        mounted() {
            this.$on('selectWallet', function (address) {
                this.changeeWallet(address);
            });
            this.$on("changeChecker", function (id, value) {
                this.changeChecker(id, value);
            });
            this.$on('selectNewWallet', function (walletId) {
                this.changeNewWallet(walletId);
            });
        },
        created() {
            this.initComponent();
        }
    }
</script>

<style lang="stylus" scoped>
    .deletelink:hover
        cursor: pointer

    .control
        .wrap-input
            input
                &:focus
                    color #1f202a
                    opacity 1
</style>
