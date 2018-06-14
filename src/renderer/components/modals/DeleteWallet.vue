<template>
    <modal name="deletewallet" height="auto" class="modal-md" @before-close="beforeClose" @opened="modalOpen">
        <div class="heading">
            <p class="title">{{ $t('modals.deleteWallet.title') }}</p>
            <i class="close" @click="closeModal"></i>
        </div>
        <div class="body">

            <div class="modal-warning" :class="{ 'bl': delWallet.isAgreed }">
                <p class="agreed">{{ $t('modals.deleteWallet.confirm.titleStart') }} <b>{{ activeWallet.name }}</b> {{
                    $t('modals.deleteWallet.confirm.titleEnd') }}</p>
                <label class="control control-checkbox">
                    <span id="label-checkbox" @click="makeFocusCheckbox">{{ $t('modals.deleteWallet.confirm.subtitle') }}</span>
                    <input id="checkbox-access" type="checkbox"  class="type_project_arr" v-model="isAgreed"/>
                    <div class="control-indicator"></div>
                </label>
            </div>

            <div class="modal-control nobl" id="modal-wallet-name" @click="makeWalletNameFocus" v-if="isAgreed">
                <div class="modal-input">
                    <label id="wallet-name-label" class="title lc" >{{ $t('modals.deleteWallet.fields.walletName.label') }}</label>
                    <input type="text" class="input" id="wallet-name-input"
                           :placeholder="$t('modals.deleteWallet.fields.walletName.placeholder')"
                           v-model="delWalletName"/>
                </div>
            </div>

            <div class="modal-btn text-center">
                <button class="btn btn-default btn-large" @click="closeModal">{{ $t('modals.deleteWallet.buttons.cancel') }}</button>
                <button
                        class="btn btn-yellow btn-large"
                        :class="{ 'disabled': checkCorrectDeleteWallet || timer != 0 }"
                        :disabled="checkCorrectDeleteWallet || timer != 0"
                        @click="removeCurrentWallet()">
                    {{ $t('modals.deleteWallet.buttons.delete') }}
                    <span v-if="timer != 0">({{ timer }})</span>
                </button>
            </div>

        </div>
    </modal>
</template>

<script>
    import {mapMutations} from "vuex";
    import storage from 'electron-json-storage';

    export default {
        name: 'deletewallet',
        data() {
            return {
                timer: 0,
                delWalletName: '',
                activeWallet: {},
                walletList: [],
                isAgreed: false
            }
        },
        computed: {
            newWallets() {
                return this.$store.state.Wallets.wallets;
            },
            userId: function () {
                return localStorage.getItem('id');
            },
            currentWallet: function() {
                return this.$store.state.Wallets.currentWallet;
            },

            delWallet: function() {
                return this.$store.state.Wallets.delWalletProperty;
            },
            checkCorrectDeleteWallet: function() {
                if (this.activeWallet.name === this.delWalletName)
                    return false;
                return true;
            }
        },
        methods: {
            ...mapMutations({
                deleteWallet: "DELETE_WALLET",
                agreedDelete: "AGREED_DELETE",

                removeWallet: 'REMOVE_WALLET',
                removeOffers: 'REMOVE_OFFERS',
                changeNewWallet: 'CHANGE_NEW_WALLET',
                removeTransactions: 'REMOVE_TRANSACTIONS'
            }),
            beforeClose: function () {
                this.agreedDelete();
                this.delWalletName = '';
            },
            closeModal() {
                this.$modal.hide('deletewallet');
                this.agreedDelete();
                this.delWalletName = '';
            },
            setMnemonic(e) {
                this.setMnemonicCode(e.target.value);
            },
            countDown() {
                if (this.timer != 0) {
                    setTimeout(() => {
                        this.timer--;
                        this.countDown();
                    }, 1000);
                }
            },
            makeFocusCheckbox: function () {
                this.isAgreed = !this.isAgreed;
            },
            makeWalletNameFocus: function () {
                document.getElementById('wallet-name-input').focus();
            },
            modalOpen() {
                this.timer = 10;
                this.countDown();
                this.getWalletList();
            },
            getFirstAnotherWallet: function (rmWalletId) {
                return this.newWallets.find(item => {
                    return parseInt(item.ownerId) === parseInt(this.userId) && parseInt(item.id) !== parseInt(rmWalletId);
                });
            },
            removeCurrentWallet: function () {
                let _this = this;
                for (let i = 0; i < this.walletList.length; i++) {
                    if (this.walletList[i].address === this.activeWallet.address) {
                        this.walletList.splice(i,1);
                        storage.set('wallets', this.walletList, function(error) {
                            if (error)
                                return console.error(error);
                            if (_this.walletList.length === 0) 
                                _this.$router.push('/');
                            else {
                                storage.set('selectedWallet', _this.walletList[0].address, function(error) {
                                    if (error)
                                        return console.error(error);
                                        _this.$parent.$emit('selectWallet', _this.walletList[0]);
                                })
                            }
                            _this.$parent.$emit('getWalletList');
                            _this.$modal.hide('deletewallet');
                        })
                    }
                }
            },
            getWalletList() {
                let _this = this;
                storage.getAll(function(error, data) {
                    if (error) throw error
                    _this.walletList = data.wallets;
                    _this.activeWallet = data.wallets.find(item => {
                        return data.selectedWallet === item.address
                    });
                })
            }
        }
    }
</script>

<style lang="scss">
    @import './modals.scss';

    .modal-input {
        & input {
            width: 100%;
        }
    }

    .modal-md {
        & .v--modal {
            width: 776px !important;
        }
    }

    .nobl {
        border-bottom: none !important;
    }

    .modal-btn {
        & .btn-yellow {
            &.disabled {
                opacity: 0.3;
                border-radius: 2px;
                background-color: #ffd24f;

                &:hover {
                    cursor: default;
                }
            }
        }
    }

    .lc {
        text-transform: capitalize !important;
    }

    .modal-warning {
        margin-left: 42px;
        margin-right: 42px;
        margin-top: 4px;

        & .agreed {
            font-family: MuseoSansCyrl300;
            font-size: 14px;
            line-height: 1.29;
            color: #34343e;

            & b {
                font-family: MuseoSansCyrl700;
                font-weight: bold;
            }
        }

        & .checkbox-contol {
            display: flex;
            justify-content: space-between;
            align-items: center;

            & input {
                width: 18px;
                height: 18px;
                border-radius: 2px;
                background-color: #f7f7f7;
                border: solid 0.5px #979797;
                margin-right: 18px;
                cursor: pointer;
            }

            & span {
                font-family: MuseoSansCyrl300;
                font-size: 14px;
                line-height: 1.29;
                color: #34343e;
                cursor: pointer;
            }
        }

        &.bl {
            border-bottom: 1px solid #d1d1d1;
            padding-bottom: 18px;
        }
    }

    .no-activate {
        border-bottom: none !important;

        & .modal-checkbox {
            margin-bottom: 0 !important;
        }
    }

    #wallet-name-label, #modal-wallet-name {
        cursor: pointer;
    }

    .control-checkbox {
        font-size: 14px;
        color: rgba(52, 52, 62, 0.7);
        padding-left: 26px;
        margin-top: 12px;
        width: auto;

        & span {
            margin-left: 5px;
            display: flex;
        }

        & .control-indicator {
            height: 18px;
            width: 18px;
            top: 2px;

            &:after {
                top: 1.5px;
                left: 5px;
                width: 5px;
                height: 9px;
                border-width: 0px 1.5px 1.5px 0;
            }
        }
    }
</style>
