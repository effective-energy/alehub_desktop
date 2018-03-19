<template>
    <div>
        <modal name="send" height="auto" class="modal-md" @opened="resetState">
            <div @click="hideDesc">
                <div class="heading">
                    <i v-if="step==2" class="back" @click="step=1"></i>
                    <p class="title">{{ $t('modals.send.title') }}</p>
                    <i class="close" @click="closeModal"></i>
                </div>
                <div class="body" v-if="step == 1">
                    <div class="modal-control double" @click="focusInput('amount')">
                        <div class="modal-input">
                            <label class="title">AMOUNT</label>
                            <p class="count" v-if="selectedСurrency === 'ale'">
                                <input type="text" v-model='amountAle' id="amount"
                                       :maxlength="maxlength" placeholder="0.00" @keypress="checkTypingChar">
                                <!--<vue-numeric :max="99999999999999" maxlength="14"-->
                                <!--v-model="amountAle" decimal-separator="."-->
                                <!--id="amount" placeholder="0.00" @input="resetError('amount')"></vue-numeric>-->
                                ALC
                            </p>
                            <p class="count" v-if="selectedСurrency === 'usd'">
                                <vue-numeric separator="," v-model="amountUsd" :precision="2" id="amount"></vue-numeric>
                                USD
                            </p>
                        </div>
                    </div>
                    <div class="modal-control double">
                        <div class="modal-input">
                            <label class="title clicked" @click="useMax">use max</label>
                            <!-- <p v-if="selectedСurrency === 'ale'" @click="toggleCurrency" class="muted" id="amountusd">
                              <vue-numeric separator="," v-model="total" :precision="2" :read-only="true"></vue-numeric> USD
                            </p>
                            <p v-if="selectedСurrency === 'usd'" @click="toggleCurrency" class="muted" id="amountusd">
                              <vue-numeric separator="," v-model="total" :precision="2" :read-only="true"></vue-numeric> ALC
                            </p> -->
                        </div>
                    </div>
                    <div class="modal-control" @click="focusInput('address')">
                        <div class="modal-input">
                            <label class="title">ADDRESS</label>
                            <!-- <the-mask mask="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" type="text"
                                      :masked="false" placeholder="Enter the address of the cryptographic wallet"
                                      class="input" :class="{error:errorAddress}" @keyup.enter.native="nextCheck"
                                      @input="resetError('address')" v-model="address" id="address"
                                      @paste.native="pasteHandler"></the-mask> -->
                            <input type="text" placeholder="Enter the address of the cryptographic wallet"
                                      class="input" :class="{error:errorAddress}" @keyup.enter.native="nextCheck"
                                      @input="resetError('address')" v-model="address" id="address"
                                      @paste.native="pasteHandler">
                        </div>
                    </div>
                    <!-- <div class="modal-control">
                      <div class="modal-input fees-type">
                        <label class="title">FEES TYPE</label>
                        <select-control
                          :current="'Excluded from the amount'"
                          :allOptions="['Type 1', 'Type 2', 'Type 3', 'Type 4']"
                          :isTextRight="true"
                          :id="'selectFeesType'"
                          @onselect="newSelect"
                        />
                      </div>
                    </div>
                    <div class="modal-control" id="description-div" @click="openDesc">
                      <div class="modal-input description" id="description-child">
                        <label class="title" id="description-label">DESCRIPTION</label>
                        <p v-if="!description.selected" class="muted" id="description" v-html="descriptionText"></p>
                        <textarea @keydown.enter="hideDescEnter" v-if="description.selected" name="" id="description-area" rows="4" resize="none" v-model="description.text"></textarea>
                      </div>
                    </div> -->
                    <div class="modal-control last">
                        <div class="modal-input">
                            <label class="title">TOTAL</label>
                            <p class="total">
                                <vue-numeric :separator='correctLangSep' :decimal-separator='correctLangDecSep'
                                             :value="amountAle" :precision="correctValuePrecision"
                                             :read-only="true"></vue-numeric>
                                ALC
                                <!-- <span class="small">(with </span>{{fees}} ALC
                                <span class="small">of fees)</span> -->
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="buttons btn-yellow openModal" @click="nextCheck"
                                :disabled="!amountAle || !address">
                            Next
                        </button>
                    </div>
                </div>
                <div class="body" v-if="step == 2">
                    <div class="modal-control">
                        <div class="modal-input">
                            <p class="small">
                                You are sending
                                <vue-numeric separator="," v-model="amountAle" :precision="2"
                                             :read-only="true"></vue-numeric>
                                <span>ALC</span> <!-- (with <span>{{fees}}</span> ALC of fees) --> to
                                <span>{{address}}</span>. <!-- Type your spending password to confirm transaction. -->
                            </p>
                        </div>
                    </div>
                    <!-- <div class="modal-control last" @click="focusInput('spending')" v-if="getWalletPassword">
                        <div class="modal-input">
                            <label class="title">Spending password</label>
                            <input id="spending" class="input" :class="{error:errorPassword}" @keyup.enter="send"
                                   @input="resetError('spending')" type="password" placeholder="password"
                                   v-model="password">
                        </div>
                    </div> -->
                    <div class="modal-footer">
                        <button class="buttons btn-yellow openModal" @click="send">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import SelectControl from "../layouts/forms/Select";
import numeral from 'numeral';
import {mapMutations} from "vuex";
import storage from 'electron-json-storage';
import { throws } from 'assert';

export default {
    name: "send",
    components: {
        SelectControl
    },
    data() {
        return {
            amountAle: '',
            amountUsd: '',
            selectedСurrency: "ale",
            step: 1,
            description: {
                selected: false,
                text: 'Add a note to remember what this transaction was for. Only you will see this note.'
            },
            fees: 0.02,
            address: '',
            defaultDescriptionText: 'Add a note to remember what this transaction was for. Only you will see this note.',
            selectedType: '',
            errorAddress: false,
            errorAmount: false,
            errorPassword: false,
            password: '',
            maxlength: 18
        };
    },
    computed: {
        currentWallet: function () {
            return this.$store.state.Wallets.currentWallet;
        },
        getWalletPassword() {
            return this.$store.state.Wallets.selectedWallet.password;
        },
        getWalletId() {
            return this.$store.state.Wallets.currentWallet.id;
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
        },
        correctValuePrecision: function () {
            if (Number(this.amountAle) % 1 !== 0) {
                return this.amountAle.toString().split('.')[1].toString().length;
            }
            else
                return 0;
        },
        descriptionText() {
            return this.description.text.replace(/\n/g, '<br>');
        },
        selectedWallet() {
            return this.$store.state.Wallets.selectedWallet
        },
        selectedWalletUrl() {
            return this.selectedWallet.replace(/\//g,"\%2F");
        }
    },
    methods: {
        ...mapMutations({
            addNewNotificaiton: "ADD_NEW_NOTIFICATION",
            toggleNotifBadge: "TOGGLE_NOTIF_BADGE"
        }),
        checkTypingChar: function (e) {
            let event = e || window.event;
            let key = event.keyCode || event.which;
            key = String.fromCharCode(key);
            let regex = /[0-9]|\./;
            if (key === '.')
                this.maxlength;
            if (!regex.test(key)) {
                event.returnValue = false;
                if (event.preventDefault) event.preventDefault();
            }
        },
        amountEnterHandler() {
            let self = this;
            setTimeout(() => {
                document.getElementById('amount').addEventListener('keypress', function (e) {
                    if (e.keyCode == 13) {
                        if (!self.address) {
                            self.focusInput('address');
                        } else {
                            self.nextCheck();
                        }
                    }
                })
            }, 40);
        },
        resetState() {
            this.step = 1;
            this.amountAle = '';
            this.address = '';
            this.password = '';
            this.errorPassword = false;
            this.errorAmount = false;
            this.errorAddress = false;
            setTimeout(() => {
                this.focusInput('amount');
            }, 100);
            this.amountEnterHandler();
        },
        pasteHandler () {
            setTimeout(() => {
                this.address = document.getElementById('address').value;
            }, 100);
        },
        closeModal() {
            this.$modal.hide("send");
        },
        focusInput(id) {
            document.getElementById(id).focus();
        },
        hideDesc(event) {
            if (event.target.id !== 'description-area' &&
                event.target.id !== 'description' &&
                event.target.id !== 'description-div' &&
                event.target.id !== 'description-child' &&
                event.target.id !== 'description-label') {
                this.description.selected = false;
                if (this.description.text === '') this.description.text = this.defaultDescriptionText;
            }
        },
        // openDesc(event) {
        //     if (this.description.text === this.defaultDescriptionText) this.description.text = '';
        //     this.description.selected = true;
        //     setTimeout(() => {
        //         document.getElementById('description-area').focus()
        //     }, 10)
        // },
        // hideDescEnter() {
        //     this.description.selected = false
        //     if (this.description.text == '' || this.descriptionText == "<br>") this.description.text = this.defaultDescriptionText
        // },
        newSelect(value, id) {
            if (id === "selectFeesType") {
                this.selectedType = value;
            }
        },
        nextCheck() {
            if (this.amountAle <= 0) {
                this.$toasted.show('Transaction amount must be greater than 0', {
                    duration: 10000,
                    type: 'error',
                })
                this.errorAmount = true;
                this.focusInput('amount');
                return false;
            }

            let maxBalance = 0,
                _this = this;

            storage.getAll(function(error, data) {
                if (error) throw error;
                let wallets = data.wallets,
                    address = data.selectedWallet;
                maxBalance = wallets.find(function(item) {
                    return item.address === address;
                }).balance
                // if (maxBalance < _this.amountAle) {
                //     _this.$toasted.show('You can not send more coins than there are in your account', {
                //         duration: 10000,
                //         type: 'error',
                //     });
                //     _this.amountAle = maxBalance;
                //     _this.errorAddress = true;
                //     _this.focusInput('address');
                //     return false;
                // }
                if (!_this.address) {
                    // this.isNotif = true;
                    _this.errorAddress = true;
                    // this.isSuccess = false;
                    // this.notifText = 'Enter the correct wallet address';
                    // this.startNotif();
                    _this.focusInput('address');
                    return false;
                }

                if (_this.address === address) {
                    _this.$toasted.show('You can not send tokens to yourself', {
                        duration: 10000,
                        type: 'error',
                    });
                    _this.errorAddress = true;
                    _this.address = '';
                    _this.focusInput('address');
                    return false;
                }

                else {
                    _this.step = 2;
                }
            })
            
            setTimeout(() => {
                
            }, 500);
        
            // if (!this.getWalletPassword)
            //     return;
            // this.focusInput('spending');
        },
        send() {
            // if (!this.password && this.getWalletPassword) {
            //     this.isNotif = true;
            //     this.errorPassword = true;
            //     this.isSuccess = false;
            //     this.notifText = 'Input your spending password';
            //     this.startNotif();
            //     this.focusInput('spending');
            //     return
            // }
            // if (this.password != this.getWalletPassword) {
            //     this.isNotif = true;
            //     this.errorPassword = true;
            //     this.isSuccess = false;
            //     this.notifText = 'Wrong password, try again';
            //     this.startNotif();
            //     this.focusInput('spending');
            //     return
            // }



            // let sendingData = {
            //     walletId: this.getWalletId,
            //     sendedBalance: this.amountAle,
            //     address: this.address,
            //     result: this.$store.state.Wallets.currentWallet.balance - this.amountAle
            // };
            // this.$toasted.show('Sending success', {
            //     duration: 5000,
            //     type: 'success',
            // });
            // if (this.nextCheck) {
            //     this.$parent.$emit('sendMoney', sendingData);
            //     this.addNewNotificaiton(`**${numeral(this.amountAle).format('0,0')}** ALE ++success send++ to **${this.address}**`);
            //     this.toggleNotifBadge(true);
            //     this.closeModal();
            // }

            this.$http.post(`http://localhost:8080/http://127.0.0.1:12348/wallets/${this.selectedWalletUrl}/transactions/create/${this.address.replace(/\//g,"\%2F")}/${this.amountAle}`, 
            {
                headers : {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                }
            }).then(response => {
                this.$modal.hide('send')
            }, response => {
                console.log('Все сломалось(')
            })
        },
        resetError(type) {
            switch (type) {
                case 'address':
                    this.errorAddress = false;
                    break;
                case 'amount':
                    this.errorAmount = false;
                    break;
                case 'spending':
                    this.errorPassword = false;
                    break;
            }
        },
        useMax() {
            let _this = this;
            storage.getAll(function(error,data) {
                if(error) throw error;
                let wallets = data.wallets,
                    address = data.selectedWallet;
                _this.amountAle = wallets.find(function(item) {
                    return item.address === address;
                }).balance
                _this.focusInput('address');
            })
        }
    }
};
</script>

<style lang="scss">
@import "./modals.scss";

.buttons {
    &:disabled {
        opacity: 0.4;
        border-radius: 2px;
        background-color: #ffd24f;

        &:hover {
            cursor: default;
        }
    }
}

.clicked {
    cursor: pointer;
}

.modal-input {
    & input {
        width: 350px !important;
    }
}

.no-spinners {
    -moz-appearance: textfield;
}

.no-spinners::-webkit-outer-spin-button,
.no-spinners::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
