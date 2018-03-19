<template>
    <modal name="applyOffer" height="auto" class="modal-xs">
        <div class="heading">
            <p class="title">APPLY</p>
            <i class="close" @click="closeModal"></i>
        </div>
        <div class="body">
            <div class="modal-control double" style="border-bottom: 1px solid #d1d1d1; padding-bottom: 18px;">
                <div class="modal-input">
                    <label class="title">AMOUNT</label>
                    <p class="count">
                        <span>{{ parseBalance(price) }}</span>
                    </p>
                </div>
            </div>
            <div class="modal-control">
                <div class="modal-input">
                    <label class="title">ADDRESS</label>
                    <span id="address"
                          style="color: #34343e; opacity: 0.5; text-decoration: underline;">{{ wallet }}</span>
                </div>
            </div>
            <div class="modal-control last">
                <div class="modal-input">
                    <label class="title">TOTAL</label>
                    <p class="total">
                        <span>{{ parseBalance(price) }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="buttons btn-yellow openModal" @click="changeApplyState">
                Aply
            </button>
        </div>
    </modal>
</template>

<script>
    import numeral from 'numeral';

    export default {
        name: "apply-offer",
        props: {
            price: {
                type: [String, Number],
                required: true
            },
            wallet: String
        },
        methods: {
            closeModal: function() {
                this.$modal.hide('applyOffer');
            },
            parseBalance: function(balance) {
                return numeral(balance).format('0,0') + " " + "ALC";
            },
            changeApplyState: function() {
                this.$parent.$emit('setApplyState', true);
            }
        }
    }
</script>

<style scoped>

</style>