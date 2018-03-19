<template>
    <div class="apply-panel">

        <div>
            <div class="text top">{{ text }}</div>
        </div>

        <div class="text username">{{ '@'+contractorName }}</div>

        <a class="btn btn-yellow btn-create btn-block" id="btnContact" :href="'mailto:' + to + '?subject=For offer #' + offerId">{{ btnText }}</a>

    </div>
</template>

<script>
    export default {
        name: 'EmployerContactPanel',
        data() {
            return {}
        },
        props: {
            btnText: String,
            text: String,
            offerId: Number,
            to: String,
            contractorName: String
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