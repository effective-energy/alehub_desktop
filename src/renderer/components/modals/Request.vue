<template>
    <modal name="request" height="auto" class="modal-md" @opened='focusButton()'>
        <div class="heading">
            <p class="title">{{ $t('modals.request.title') }}</p>
            <i class="close" @click="closeModal"></i>
        </div>
        <div class="body">

            <!--<div class="modal-control double" @click="focusInput('amount')" v-if="false">-->
                <!--<div class="modal-input">-->
                    <!--<label class="title">AMOUNT</label>-->
                    <!--<p class="count" v-if="selectedСurrency === 'ale'">-->
                        <!--<vue-numeric separator="," v-model="amountAle" :precision="2" id="amount"></vue-numeric>-->
                        <!--ALC-->
                    <!--</p>-->
                    <!--<p class="count" v-if="selectedСurrency === 'usd'">-->
                        <!--<vue-numeric separator="," v-model="amountUsd" :precision="2" id="amount"></vue-numeric>-->
                        <!--USD-->
                    <!--</p>-->
                <!--</div>-->
            <!--</div>-->

            <!--<div class="modal-control double" @click="focusInput('amountusd')" v-if="false">-->
                <!--<div class="modal-input">-->
                    <!--<label class="title"></label>-->
                    <!--<p v-if="selectedСurrency === 'ale'" @click="toggleCurrency" class="muted" id="amountusd">
                      <vue-numeric separator="," v-model="total" :precision="2" :read-only="true"></vue-numeric> USD
                    </p>
                    <p v-if="selectedСurrency === 'usd'" @click="toggleCurrency" class="muted" id="amountusd">
                      <vue-numeric separator="," v-model="total" :precision="2" :read-only="true"></vue-numeric> ALC
                    </p>-->
                <!--</div>-->
            <!--</div>-->

            <div class="modal-control">
                <div class="modal-input">
                    <label class="title">{{ $t('modals.request.receiver') }}</label>
                    <p class="address" id="accountAddress">{{ getCurrentWalletAddress }}</p>
                </div>
            </div>

            <div class="qr-code">
                <qriously :value="getCurrentWalletAddress" :size="300"/>
                <span class="muted upperCase">{{ $t('modals.request.qrShare') }}</span>
            </div>

            <div class="modal-footer">
                <button class="buttons btn-yellow" id="btnCopyAddress" v-clipboard:copy="getCurrentWalletAddress" v-clipboard:success="successCopyAddress">
                    {{ $t('modals.request.button') }}
                </button>
            </div>

        </div>
    </modal>
</template>

<script>
    export default {
        name: "request",
        data() {
            return {
                // amountAle: 322,
                // amountUsd: 161,
                // selectedСurrency: "ale"
            };
        },
        computed: {
            // total: {
            //     get: function () {
            //         switch (this.selectedСurrency) {
            //             case "ale":
            //                 this.amountUsd = (this.amountAle / 2).toFixed(2);
            //                 this.hui = this.amountUsd;
            //                 return this.amountUsd;
            //                 break;
            //
            //             case "usd":
            //                 this.amountAle = (this.amountUsd * 2).toFixed(2);
            //                 this.hui = this.amountAle;
            //                 return this.amountAle;
            //                 break;
            //         }
            //     },
            //
            //     set: function () {
            //         return;
            //     }
            // },
            getCurrentWallet: function () {
                  return this.$store.state.Wallets.selectedWallet;
            },
            getCurrentWalletAddress: function () {
                if (this.getCurrentWallet !== null)
                    return this.getCurrentWallet;
                return 0;
            }
        },
        methods: {
            closeModal() {
                this.$modal.hide("request");
            },
            // toggleCurrency() {
            //     this.selectedСurrency = this.selectedСurrency == "ale" ? "usd" : "ale";
            // },
            focusInput(id) {
                document.getElementById(id).focus();
            },
            successCopyAddress() {
                this.$parent.$emit('successCopyAddress', this.getCurrentWalletAddress);
            },
            focusButton() {
                document.getElementsByTagName('html')[0].addEventListener('keyup', function(e) {
                    if (!document.getElementById('btnCopyAddress')) return false
                    if (e.key == 'Enter') document.getElementById('btnCopyAddress').click()
                })
            }
        }
    };
</script>

<style lang="scss">
    @import "./modals.scss";

    .modal-control {
        & .address {
            font-family: MuseoSansCyrl500;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.29;
            color: #34343e;
        }
    }
    .qr-code {
        & .upperCase {
            text-transform: uppercase;
            font-weight: bold;
        }
    }
</style>
