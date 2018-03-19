<template>
    <div class="activityList">
        <div v-for="(activity, activityIndex) in activities" :key="activityIndex" class="activityListBlock">
            <Panel-heading :title="showDate(activity.date)" v-if="checkShow(activityIndex) && isShowDate"/>
            <div class="activity-list">
                <div class="status" :class="activity.type">
                    <span>{{ upperCase(activity.type) }}</span>
                </div>
                <div class="details" :class="typeTransaction(activity.from)">
                    <div class="info">
                        <p v-if="activity.to">To: {{ activity.to }}</p>
                        <p v-if="activity.from">From: {{ activity.from }}</p>
                        <p>{{ parseDate(activity.date) }} / {{ parseTime(activity.date) }}</p>
                    </div>
                    <div class="purpose">
                        <div>
                            Purpose transaction
                        </div>
                    </div>
                    <div class="count" :class="{ 'active': activity.from }">
                        <span>
                            <FormattingPrice
                                    :value="activity.total"
                            />
                            ALC
                        </span>
                    </div>
                </div>
            </div>
            <div class="result-day" v-if="checkShowResultActivityPanel(activityIndex)">

                <div class="result-day-col">
                    <div class="result-day-status">
                        <span class="result-day-field">
                            Recieved
                        </span>
                    </div>
                    <div class="result-day-status">
                        <span class="result-day-field">
                            Sent
                        </span>
                    </div>
                    <div class="result-day-status">
                        <span class="result-day-field">
                            Total
                        </span>
                    </div>
                </div>
                <div class="result-day-col">
                    <div class="result-day-line">
                        <span class="result-day-span">
                            <span class="count">
                                <FormattingPrice
                                        :value="resultSent(activity.date)"
                                />
                            </span>
                            ALC
                        </span>
                    </div>
                    <div class="result-day-line">
                        <span class="result-day-span sent">
                            <span class="count">
                                 <FormattingPrice
                                         :value="resultReceived(activity.date)"
                                 />
                            </span>
                            ALC
                        </span>
                    </div>
                    <div class="result-day-line">
                        <span class="result-day-span">
                            <span class="count">
                                <FormattingPrice
                                        :value="cur"
                                />
                            </span>
                            ALC
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PanelHeading from './PanelHeading';
    import Moment from 'moment';
    import FormattingPrice from './FormattingPrice';
    import storage from 'electron-json-storage';

    export default {
        name: 'activityList',
        components: {
            PanelHeading,
            FormattingPrice
        },
        props: {
            activities: {
                type: Array,
                required: true
            },
            isShowDate: {
                type: Boolean,
                required: false
            }
        },
        data () {
            return {
                cur: 0
            }
        },
        computed: {
            currentWallet() {
                return this.$store.state.Wallets.currentWallet;
            },
            currentBalance: function () {
                return this.currentWallet.balance;
            },
        },
        watch: {
            activities () {
                this.getCurrentWalletBalance()
            }
        },
        methods: {
            currentTransactions: function (date) {
                // return this.$store.state.Transactions.transactions.filter(item => {
                //     let itemDate = Moment(item.date).format('YYYY/MM/DD');
                //     return itemDate === Moment(date).format('YYYY/MM/DD') && parseInt(localStorage.getItem('walletId')) === parseInt(item.walletId);
                // });
                return this.activities.filter(item => {
                    let itemDate = Moment(item.date).format('YYYY/MM/DD');
                    return itemDate === Moment(date).format('YYYY/MM/DD');
                });
            },
            resultTotal: function (date) {
                let currentTransactions = this.currentTransactions(date),
                    minDate = currentTransactions[0].date,
                    minDateTruncResult = currentTransactions[0].result;

                for (let i = 0; i < currentTransactions.length; i++) {
                    if (currentTransactions[i].date < minDate) {
                        minDate = currentTransactions[i].date;
                        minDateTruncResult = currentTransactions[i].result;
                    }
                }

                return minDateTruncResult;
            },
            resultSent: function (date) {
                let sent = 0,
                    currentTransactions = this.currentTransactions(date);

                for (let i = 0; i < currentTransactions.length; i++)
                    if (parseInt(currentTransactions[i].total) < 0)
                        sent += parseInt(currentTransactions[i].total);

                return sent;
            },
            resultReceived: function (date) {
                let received = 0,
                    currentTransactions = this.currentTransactions(date);

                for (let i = 0; i < currentTransactions.length; i++)
                    if (parseInt(currentTransactions[i].total) > 0)
                        received += parseInt(currentTransactions[i].total);

                return received;
            },


            parseTime(date) {
                return Moment(date).format('HH:mm');
            },
            parseDate(date) {
                return Moment(date).format('MMM DD');
            },
            checkShow(index) {
                if (index === 0) return true;
                if (index === this.activities.length) {
                    if (Moment(this.activities[index].date).format('YYYY/MM/DD') === Moment(this.activities[index + 1].date).format('YYYY/MM/DD')) return false;
                    return true;
                } else {
                    if (Moment(this.activities[index].date).format('YYYY/MM/DD') === Moment(this.activities[index - 1].date).format('YYYY/MM/DD')) return false;
                    return true;
                }
            },
            checkShowResultActivityPanel: function (index) {
                let currentDay = new Date(this.activities[index].date);
                if (index !== this.activities.length - 1) {
                    let nextDay = new Date(this.activities[index + 1].date);

                    if (currentDay.getDay() === nextDay.getDay() && currentDay.getMonth() === nextDay.getMonth() &&
                        currentDay.getFullYear() === nextDay.getFullYear()) {
                        return false;
                    }
                }
                return true;
            },
            upperCase(text) {
                return text.toUpperCase();
            },
            showDate: function (date) {
                let currentDate = new Date();
                let yesterdayDate = new Date();
                yesterdayDate = yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                if (Moment(date).format('YYYY/MM/DD') === Moment(currentDate).format('YYYY/MM/DD')) {
                    return 'today';
                }
                if (Moment(date).format('YYYY/MM/DD') === Moment(yesterdayDate).format('YYYY/MM/DD')) {
                    return 'yesterday'
                }
                return Moment(date).format('MM/DD');
            },


            typeTransaction: function (received) {
                if (received) {
                    return 'received'
                }
                return 'sent';
            },

            getCurrentWalletBalance: function () {
                let _this = this;
                storage.getAll(function(error, data) {
                    if (error) throw error
                    let selectedWallet = data.selectedWallet
                    let wallets = data.wallets
                    _this.cur = wallets.find(function(item) {
                        return item.address == selectedWallet
                    }).balance
                })
            }
        }
    }
</script>

<style lang="scss">

    .reset-style {
        /*padding: 0 !important;*/
        /*margin: 0 !important;*/
    }

    .activity-list {
        & .status {
            min-width: 100px;

            & span {
                color: #34343e !important;
            }
        }
        & .details {

            margin: 0;
            padding-right: 16px;
            padding-left: 16px;

            & .count {
                background-color: transparent;

                & .count-received, .count-total {
                    color: #0d1717 !important;

                    & span {
                        color: #0d1717 !important;
                    }
                }

                & span {
                    color: #b10303 !important;
                }
            }
            & .count.active {
                background-color: transparent !important;
                & span {
                    color: #34343e !important;
                }
            }

            & .info {
                min-width: 400px;
            }

            & .count {
                display: flex;
                justify-content: flex-end;
                min-width: 150px;
            }

            & .purpose {
                width: 100%;
                display: flex;
                color: #34343e;
                justify-content: flex-start;
                font-family: MuseoSansCyrl500;

                & div {
                    font-weight: 500;
                }
            }

            & .info, & .count {
                -webkit-touch-callout: text;
                -webkit-user-select: text;
                -khtml-user-select: text;
                -moz-user-select: text;
                -ms-user-select: text;
                user-select: text;
            }
        }
    }

    .activityListBlock {

        & .result-day {
            display: flex;
            justify-content: flex-end;
            margin: 16px 16px 0 0;

            & .result-day-col {
                font-family: MuseoSansCyrl500;
                color: #34343e;
                display: flex;
                flex-direction: column;
                align-self: flex-end;

                & .result-day-status {
                    /*margin-bottom: 5px;*/
                    font-size: 14px;
                    padding: 5px;

                    & .result-day-field {
                        margin: 0 10px 0 10px;
                        padding: 5px;
                    }
                }

                & .result-day-line {
                    font-family: MuseoSansCyrl500;
                    line-height: 1.4;
                    align-self: flex-end;
                    color: #34343e;
                    font-weight: 500;
                    font-size: 14px;
                    margin-bottom: 5px;

                    & .result-day-span {
                        margin: 0 10px 0 10px;
                        padding: 5px;

                        & .count {
                            margin: 0 10px 0 10px;
                            padding: 5px;
                        }
                    }

                    & .sent {
                        color: #b10303;
                    }
                }
            }

        }

        & .activity-list {
            background: inherit;
            margin-bottom: 6px;

            & .received {
                background-color: rgba(255, 210, 79, 0.6) !important;
            }

            & .sent {
                background-color: #f0f0f0 !important;
            }
        }

        &:nth-child(odd) {
            & .activity-list {
                background: inherit;
            }
        }

        &:nth-child(even) {
            & .activity-list {
                background: #f0f0f0;
            }
        }

        &:nth-child(1) {
            & .activity-list {
                background: #f0f0f0;
            }
        }
    }
</style>