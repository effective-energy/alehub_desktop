<template>
    <div class="apply-panel">

        <div>
            <div class="text username">{{ '@'+contractorName }}</div>
        </div>

        <div class="text">
            completed the task
        </div>

    </div>
</template>

<script>
    export default {
        name: "employer-complete-panel",
        props: {
            contractorName: {
                type: String,
                required: true
            }
        }
    }
</script>

<style lang="stylus" scoped>
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
</style>