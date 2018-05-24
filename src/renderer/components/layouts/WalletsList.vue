<template>
    <div class="menu">
        <div class="wallet-list wallet-search" v-if="newWallets.length">
            <div class="wrap-in-wallet">
                <img src="../../assets/img/loupe.svg" width="18" height="15" class="icon" id="loupe">
                <input
                        type="text"
                        :placeholder="$t('pages.walletsList.search')"
                        v-model="searchField"
                >
            </div>
        </div>

        <div
                class="wallet-list wallet-element"
                v-for="wallet in newWalletsList"
                :key="wallet.address"
                :id="wallet.address"
                :class="{ active: checkActive(wallet.address) }"
                @click="selectNewWallet(wallet.address)"
        >
            <div class="wrap-in-wallet">
                <p>{{ wallet.name }}</p>
                <div style="content: ''; width: 100%;"></div> <!-- fix this shit -->
                <p class="wallet">
                    <vue-numeric
                            :separator='correctLangSep'
                            :decimal-separator='correctLangDecSep'
                            :value="wallet.balance"
                            :precision="correctValuePrecision(wallet.balance)"
                            :read-only="true">
                    </vue-numeric>
                    {{ ' ' + 'ALC'}}
                </p>
            </div>

        </div>

        <div v-if="!isSettings" class="wallet-list wrap-between" @click="show">
            <div class="wrap-in-wallet">
                <p class="new-wallet">{{ $t('pages.walletsList.addNew') }}</p>
            </div>
            <img src="../../assets/img/add-ic.svg" width="18" height="18"/>
        </div>

        <!--<div class="type-list" v-if="false">-->
        <!--<span>Type: </span>-->
        <!--<select-control-->
        <!--:current="'wallet list'"-->
        <!--:allOptions="['wallet list', 'combine by currency']"-->
        <!--:id="'walletList'"-->
        <!--@onselect="newSelect"-->

        <!--/>-->
        <!--</div>-->

    </div>
</template>

<script>
    import numeral from 'numeral';
    import SelectControl from '../layouts/forms/Select';
    import NewWallet from '../modals/NewWallet';
    import storage from 'electron-json-storage';

    import {mapMutations} from 'vuex';

    export default {
        name: 'walletsList',
        components: {
            SelectControl,
            NewWallet,
        },
        props: {
            newWallets: {
                type: Array,
                required: true
            },
            isSettings: {
                type: Boolean
            }
        },
        data() {
            return {
                keys: ["name", "balance"],
                selectedType: 'wallets list',
                searchField: '',
                activeWallet: ''
            }
        },
        watch: {
            // activeWallet(value) {
            //     this.activeWallet = value;
            // },
            newWallets(value) {
                // this.activeWallet = value[value.length-1].id
                this.getSelectedWallet()
            }
        },
        computed: {
            newWalletsList: function () {
                if (this.searchField === '') return this.newWallets
                return this.newWallets.filter(item => {
                    return item.name.toLowerCase().includes(this.searchField.toLowerCase());
                });
            },
            getUserId: function () {
                return localStorage.getItem('id');
            },
            getCurrentWalletFromLS: function () {
                return parseInt(localStorage.getItem('walletId'));
            },
            getCurrentWallet: function () {
                return this.$store.state.Wallets.currentWallet;
            },
            correctLangSep: function () {
                if (localStorage.getItem('systemLang') === 'eng')
                    return ',';
                return 'space';
            },
            correctLangDecSep: function () {
                if (localStorage.getItem('systemLang') === 'eng')
                    return '.';
                return ',';
            }
        },
        methods: {
            ...mapMutations({
                changeNewWallet: 'CHANGE_NEW_WALLET'
            }),
            checkActive: function (walletId) {
                if (walletId === this.activeWallet)
                    return true;
                return false;
            },
            show: function () {
                this.$modal.show('newwallet');
            },
            selectNewWallet: function (address) {
                let _this = this
                this.activeWallet = address;
                // localStorage.setItem('walletId', walletId);

                storage.set('selectedWallet', address, function(error) {
                    if (error) throw error
                    _this.getSelectedWallet();
                    _this.changeNewWallet(address);
                })

                this.$parent.$emit('selectWallet', address);

                // this.changeNewWallet(address);
            },

            getSelectedWallet() {
                let _this = this
                storage.getAll(function(error, data) {
                    if (error) throw error
                    _this.activeWallet = data.selectedWallet
                })
            },

            parseBalance(balance) {
                return numeral(balance).format('0,0');
            },
            newSelect(value, id) {
                if (id === "walletList") {
                    this.selectedType = value
                }
            },
            correctValuePrecision: function (balance) {
                if (Number(balance) % 1 !== 0) {
                    return balance.toString().split('.')[1].toString().length;
                }
                else
                    return 0;
            }
        },
        created () {
            let _this = this
            this.getSelectedWallet();
            storage.getAll(function(error, data) {
                if (error) throw error
                _this.changeNewWallet(data.selectedWallet)
            })
        }
    }
</script>

<style lang="scss" scoped>
    .menu {
        z-index: 1000;
        & .wallet-list {
            &:not(.active) {
                &:not(.wallet-search) {
                    &:hover {
                        background-color: rgba(247, 247, 247, 0.15);

                        & .wrap-in-wallet {
                            & p {
                                color: #fcfcfc;
                            }

                            & .wallet {
                                color: #fcfcfc;
                                opacity: 0.7;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    .menu {
        z-index: 1000;
        & .type-list {
            opacity: 1;

            & .select {
                min-width: 200px;
                display: inline-grid;

                & .list {
                    top: inherit;
                    bottom: 25px;

                    & ul {
                        background-color: rgba(252, 252, 252, 0.7);
                        color: #34343e;

                        & li {
                            padding: 9px 12px;

                            &::before {
                                top: 14px;
                                right: 12px;
                            }
                        }
                    }
                }

                & .value {
                    color: rgba(252, 252, 252, 0.7);

                    &::before {
                        background: none;
                    }
                }
            }
        }
    }

    .wrap-between {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & .new-wallet {
            opacity: 0.4;
            font-family: MuseoSansCyrl500 !important;
            font-size: 16px;
            line-height: 1.25;
            color: #fcfcfc;
        }

        & img {
            margin-right: 20px;
        }
    }
</style>
