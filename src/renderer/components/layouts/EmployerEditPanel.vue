<template>
    <div class="apply-panel">

        <div>
            <h1><vue-numeric :value="price" :separator="correctLangSep" :precision="correctValuePrecision"
                             :decimal-separator="correctLangDecSep" :read-only="true"></vue-numeric>{{ " " + "ALC" }}</h1>
        </div>

        <div class="text">{{ text }}</div>
        
       <button class="btn btn-yellow btn-create btn-block" id="btnEdit" @click="toEditOffer">{{ btnText }}</button>

    </div>
</template>

<script>
    export default {
        name: 'EmployerEditPanel',
        data() {
            return {}
        },
        props: {
            btnText: String,
            price: [String, Number],
            text: String,
            offerId: Number
        },
        computed: {
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
                if (Number(this.price) % 1 !== 0 && Number(this.price) === this.price)
                    return this.price.toString().split('.')[1].toString().length;
                else
                    return 0;
            }
        },
        methods: {
            toEditOffer: function () {
                this.$router.push('/offers/edit/' + this.$route.params.id);
            }
        }
    }
</script>

<style lang="stylus" scoped>

    .offers-apply-panel
        margin-bottom 24px
        margin-top 32px

    .row-flex
        display flex
        justify-content space-between
        margin-bottom 14px
        align-items center

        .is-3
            width 25% !important

        .col
            display flex
            justify-content center
            width 100%

            .btn-grey
                background-color #dedfdf

    .row-flex-router
        margin-bottom 0
        justify-content center

    a.btn
        text-decoration none
        color inherit
        font-family MuseoSansCyrl500



    .apply-panel
        -webkit-touch-callout text
        -webkit-user-select text
        -khtml-user-select text
        -moz-user-select text
        -ms-user-select text
        user-select text
        .btn-block
            margin-bottom 0

        .link
            margin-top 16px

    .text
        font-family MuseoSansCyrl500
        font-size 12px
        
    .text.username
        font-family MuseoSansCyrl700
        font-size 18px
    
    .text.top
        margin-bottom 4px

</style>