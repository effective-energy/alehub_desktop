<template>
    <div class="searchPanel">
        <div class="top" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="searchControl" @click="makeFocusSearch">
                <img src="../../assets/img/search-ic.svg" width="16" height="16">
                <input type="text" id="search-transactions" placeholder="Search transactions" @input="searchTransaction"
                       v-model="searchText">
            </div>
            <!--style="display: flex; justify-content: space-between; align-items: center"-->
            <div class="filters">
                <span v-for="(filter, filterIndex) in filters" :class="{ 'active': filterIndex == activeFilter }"
                      @click="changeFilter(filterIndex)">{{ filter }}</span>
                <span @click="switchFilter()">
                    Date range
                </span>
            </div>
        </div>
        <div class="bottom" v-if="!hideFilter">
            <div class="date">
                <h3 class="date-title">
                    Select a date range
                </h3>
                <div class="datepicker-wrap">
                    <datepicker
                            id="datepickerFrom"
                            v-model="dateFrom"
                            language="en"
                            :placeholder="placeholderDateFrom"
                    />

                    <datepicker
                            id="datepickerTo"
                            v-model="dateTo"
                            language="en"
                            :placeholder="placeholderDateTo"
                    />
                </div>
            </div>
            <div class="docs">
                <button class="buttons btn-yellow">
                    Download PDF
                </button>
                <button class="buttons btn-default">
                    Share
                </button>
            </div>
            <div class="info" style="display: flex;">
                <div class="stats-col" style="display: flex; flex-direction: column;">
                    <div class="title-opt-span">
                        <span class="title">
                            Received
                        </span>
                    </div>
                    <div class="title-opt-span sent">
                        <span class="title">
                            Sent
                        </span>
                    </div>
                    <div class="title-opt-span">
                        <span class="title">
                            Starting
                        </span>
                    </div>
                    <div class="title-opt-span">
                        <span class="title">
                            Total
                        </span>
                    </div>
                </div>
                <div class="stats-col" style="display: flex; flex-direction: column;">
                    <div class="result-opt-span">
                        <span class="count">
                            <FormattingPrice
                                    :value="currentReceiveBalance()"
                            />
                        </span>
                        ALC
                    </div>
                    <div class="result-opt-span sent">
                        <span class="count">
                            <FormattingPrice
                                    :value="currentSentBalance()"
                            />
                        </span>
                        ALC
                    </div>
                    <div class="result-opt-span">
                        <span class="count">
                            <FormattingPrice
                                    :value="currentBalanceBeginPeriod()"
                            />
                        </span>
                        ALC
                    </div>
                    <div class="result-opt-span">
                        <span class="count">
                            <FormattingPrice
                                    :value="currentBalanceEndPeriod()"
                            />
                        </span>
                        ALC
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import FormattingPrice from '../layouts/FormattingPrice';
    import path from 'path';

    import {mapMutations} from 'vuex';

    export default {
        name: 'searchPanel',
        components: {
            Datepicker,
            FormattingPrice
        },
        props: {
            filters: [Object, Array],
            activeFilter: [String, Number]
        },
        data() {
            return {
                dateFrom: null,
                dateTo: null,
                placeholderDateFrom: 'Date from',
                placeholderDateTo: 'Date to',
                searchText: ''
            }
        },
        watch: {
            dateFrom: function (val) {
                this.$parent.$emit('changeDateFrom', val);
            },
            dateTo: function (val) {
                this.$parent.$emit('changeDateTo', val);
            }
        },
        computed: {
            currentTransactions: function () {
                return this.$store.state.Transactions.transactions.filter(item => {
                    return item.walletId === parseInt(localStorage.getItem('walletId'));
                });
            },

            currentTmpTransactions: function () {
                let dateFrom = this.dateFrom.getTime(),
                    dateTo = this.dateTo.getTime();

                return this.currentTransactions.filter(item => {
                    return item.date > dateFrom && item.date < dateTo;
                });
            },

            hideFilter: function () {
                return this.$store.state.Transactions.hideFilter;
            }

        },
        methods: {
            ...mapMutations({
                setHideFilter: 'SET_HIDE_FILTER'
            }),
            changeFilter: function (index) {
                this.$parent.$emit('changeFilterType', index);
            },
            searchTransaction: function () {
                this.$parent.$emit('searchTransaction', this.searchText)
            },
            makeFocusSearch: function () {
                document.getElementById('search-transactions').focus();
            },

            switchFilter: function () {
                (this.hideFilter) ? this.setHideFilter(false) : this.setHideFilter(true);
            },

            initiateDatepickers: function () {
                this.dateFrom = new Date(this.currentTransactions.reduce(
                    (acc, loc) =>
                        acc.date < loc.date
                            ? acc
                            : loc
                ).date);
                this.dateTo = new Date();
            },


            currentBalanceBeginPeriod: function () {
                return this.currentTmpTransactions.reduce(
                    (acc, loc) =>
                        acc.date <= loc.date
                            ? acc
                            : loc
                ).result;
            },
            currentBalanceEndPeriod: function () {
                return this.currentTmpTransactions.reduce(
                    (acc, loc) =>
                        acc.date >= loc.date
                            ? acc
                            : loc
                ).result;
            },
            currentSentBalance: function () {
                let sentBalance = this.currentTmpTransactions.filter(item => {
                    return item.type === 'sent';
                }).reduce(
                    (sum, current) => {
                        return {total: parseInt(sum.total) + parseInt(current.total)};
                    }
                );
                return sentBalance.total;
            },
            currentReceiveBalance: function () {
                let receiveBalance = this.currentTmpTransactions.filter(item => {
                    return item.type === 'received';
                }).reduce(
                    (sum, current) => {
                        return {total: parseInt(sum.total) + parseInt(current.total)};
                    }
                );
                return receiveBalance.total;
            },
        },
        created() {
            this.initiateDatepickers();
        }
    }
</script>

<style lang="scss" scoped>

    .searchPanel {
        width: 100%;
        margin-bottom: 18px;
        padding-bottom: 18px;
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*align-items: center;*/

        & .filters {
            span {
                opacity: 0.5;
                font-family: MuseoSansCyrl300;
                font-size: 14px;
                line-height: 1.29;
                text-align: right;
                color: #34343e;
                min-width: 20px;

                &:not(:last-child) {
                    margin-right: 18px;
                }

                &.active {
                    opacity: 1;
                }

                &:hover {
                    &:not(.active) {
                        cursor: pointer;
                        opacity: 1;
                    }
                }
            }
        }

        & .searchControl {
            /*display: flex;*/
            /*align-items: center;*/
            /*width: calc(100% - 350px); // переписать динамически*/
            cursor: pointer;

            & input {
                background: none;
                outline: none;
                border: none;
                border-bottom: 1px solid #ccc;
                opacity: 0.5;
                font-family: MuseoSansCyrl300;
                font-size: 14px;
                line-height: 1.29;
                color: #34343e;
                margin-left: 18px;
                padding: 0;
                margin-top: 0;

                &:focus {
                    width: 100%;
                }
            }
        }
    }
</style>

<style lang="stylus">
    .prev
        background-image: url('../../assets/img/arrow-left.svg')
        background-position: center
        background-repeat: no-repeat
        &:hover
            background-image: url('../../assets/img/arrow-left.svg') !important
            background-position: center !important
            background-repeat: no-repeat !important
    .next
        background-image: url('../../assets/img/arrow-right.svg')
        background-position: center
        background-repeat: no-repeat
        &:hover
            background-image: url('../../assets/img/arrow-right.svg') !important
            background-position: center !important
            background-repeat: no-repeat !important
    input#datepickerFrom, input#datepickerTo
        font-family MuseoSansCyrl500
        background inherit
        border none
        border-bottom 1px solid rgba(52, 52, 62, 0.2)
        width 80px
        margin-right 30px
        outline none
        font-size 14px
        font-weight 500
        line-height 1.29
        text-align left
        color #34343e
        position relative
        z-index 1


    #datepickerFrom, #datepickerTo
        cursor pointer

    #datepickerFrom::-webkit-input-placeholder, #datepickerTo::-webkit-input-placeholder
        opacity 1
        line-height 1.29
        font-size 14px

    .vdp-datepicker__calendar
        background-color #f7f7f7
        box-shadow 0 5px 20px 0 rgba(0, 0, 0, 0.12)
        border 0 !important
        padding 7px
        font-family MuseoSansCyrl500 !important

        header
            .next, .prev
                display flex
                justify-content center
                align-items center
                height 40px

                .arrow
                    width 7.5px

            .next:after, .prev:after
                content initial !important

        .day-header
            font-family MuseoSansCyrl500 !important
            color #0d1717 !important
            font-size 12px !important

        .day:hover, .month:hover, .year:hover
            background-color #f0f0f0 !important
            border 1px solid #f0f0f0 !important

        .selected
            background-color #f0f0f0 !important
    
    @media(max-width: 840px)
        input#datepickerFrom, input#datepickerTo
            margin-right 0
</style>

<style lang="stylus" scoped>
    .top
        padding-bottom 18px
        border-bottom 1px solid #d1d1d1
        margin-bottom 24px

    .bottom
        background-color #f0f0f0
        padding 16px
        display flex
        justify-content space-between
        align-items center

        .row-sm-screen
            display flex

        .date
            display flex
            flex-direction column
            flex-grow 1
            padding-left 15px

            .date-title
                font-family MuseoSansCyrl500
                font-size 14px
                color #34343e
                text-transform uppercase

            .datepicker-wrap
                display flex


        .docs
            display flex
            flex-direction column

            button:last-of-type
                margin-bottom 0


    .title-opt-span, .result-opt-span
        font-family MuseoSansCyrl500
        font-size 14px
        color #34343e

    .title-opt-span
        padding 5px
        align-self flex-start

        .title
            padding 5px
            margin 0 10px 0 10px

    .sent
        color #b10303

    .result-opt-span
        white-space nowrap
        padding 5px
        margin 0 10px 0 10px
        align-self flex-end

        .count
            padding 5px
            margin 0 10px 0 10px

    @media(max-width: 1100px)
        .bottom 
            flex-direction row

            .info
                margin-bottom 5px

            .date
                .datepicker-wrap
                    flex-direction column
                    
                    .vdp-datepicker
                        margin-bottom 10px

            .docs
                padding-left 15px

                .buttons
                    margin-right 4px


    @media(max-width: 920px)
        .bottom
            .info
                margin-bottom 0

                .result-opt-span
                    margin-right 0

            .date
                padding-left 5px
                margin-right 10px

            .docs
                flex-direction column
                padding-left 0

                .buttons
                    width 140px
                    margin-bottom 10px

    @media(max-width: 840px)
        .bottom 
            flex-direction column

            .date
                width 190px
                align-items center

                .datepicker-wrap
                    width 100%
                    flex-direction row
                    justify-content space-between

            .docs
                flex-direction row
                width 300px
                justify-content space-between

</style>
