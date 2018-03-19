<template>
    <modal name="contactContractor" height="auto" class="modal-xs">
        <div class="heading">
            <p class="title">CONTACT</p>
            <i class="close" @click="closeModal"></i>
        </div>
        <div class="body">
            <div class="modal-control">
                <div class="">
                    <div class="row-flex row-summary-contact">
                        <h3 class="title">Summary</h3>
                        <h3 class="title">{{ title }}</h3>
                    </div>

                    <label class="title"></label>
                    <textarea class="textarea" ref="textarea" name="" id="" rows="1" @input="autosize" placeholder="Type the text of the letter here">
                    </textarea>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="buttons btn-yellow openModal" @click="closeModal">
                Send
            </button>
        </div>
    </modal>
</template>

<script>
    export default {
        name: 'contact-contractor',
        props: {
            title: {
                type: String,
                required: true
            }
        },
        components: {

        },
        methods: {
            closeModal: function() {
                this.$modal.hide('contactContractor');
            },
            autosize: function(e) {
                let el = this.$refs.textarea;
                setTimeout(function(){
                    el.style.cssText = 'height:auto; padding:0';
                    el.style.cssText = '-moz-box-sizing:content-box';
                    el.style.cssText = 'height:' + el.scrollHeight + 'px';
                },0);
            }
        }
    }
</script>

<style lang="stylus" scoped>
    h3.title
        font-family MuseoSansCyrl700
        line-height 1.08
        font-size 13px
        text-transform uppercase

    .textarea
        overflow hidden
        width 100%
        background transparent
        border 1px solid #d1d1d1
        border-left 0 !important
        border-right 0 !important
        border-top 0 !important
        resize none
        color #34343e
        font-family MuseoSansCyrl500
        padding-bottom 20px
        padding-left 22px

    .textarea::-webkit-input-placeholder
        color #34343e
        opacity 0.5


    .modal-control
        border-bottom 0 !important

    .row-summary-contact
        justify-content space-between


</style>