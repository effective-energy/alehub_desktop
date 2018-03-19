<template>
    <div class="empty-summary-list" :class="{ 'noButton': !isBtn }">
        <span>{{ textMessage }}</span>
        <button
                v-if="isBtn"
                @click="onClick"
                class="buttons"
                :class="yellowBtn?'btn-yellow':'btn-default'">
            {{ textButton }}
        </button>
    </div>
</template>

<script>
    export default {
        name: "emptyList",
        data() {
            return {}
        },
        props: {
            textMessage: String,
            yellowBtn: [Boolean, String],
            textButton: String,
            type: String,
            isBtn: [Boolean, String]
        },
        methods: {
            onClick: function () {
                if (this.type === 'portfolio')
                    this.$router.push('/offers');

                if (this.type === 'offer')
                    this.$router.push('/offers/new');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .empty-summary-list {
        height: auto;
        background: #ececec;
        margin-bottom: 24px;
        padding: 36px;
        text-align: center;
        font-family: MuseoSansCyrl500;
        color: #34343e;

        & span {
            display: block;
            opacity: 0.7;
        }

        & button {
            margin-bottom: 0;
            margin-top: 12px;
            padding: 0;
            width: 308px;
        }

        &.noButton {
            padding: 18px;
        }
    }
</style>
