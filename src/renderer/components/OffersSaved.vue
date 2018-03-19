<template>
    <div class="offers-saved">
        <Navbar
                :title="'Saved Offers'"
                :isNavigate="true"
                :isBalance="false"
                :isHide="true"
                :isBack="true"
        />


        <section class="main">
            <div class="content nomenu">
                <div class="container">
                    <div class="row" v-if="notFoundOffers">
                        <div class="col-12">
                            <action-panel
                                    :btn-router-text="'Search for an offers'"
                                    :action-router-text='"You didn’t save offers yet"'
                                    to="/offers"
                                    is-top-offers-action="true"
                                    top-offers-apply-panel="true"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="row-flex" v-if="!notFoundOffers">
                                <div class="col">
                                    <div class="list-panel-heading list-panel-heading-offers list-panel-count-offers">
                                        <h3>{{ currentNumSavedOffers }} offers</h3>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="list-panel-heading list-panel-heading-offers list-panel-offers">
                                        <p>offers on page: </p>
                                        <Select
                                                current="10"
                                                :all-options="optionsOffersOnPage"
                                                type-select="offer"
                                                count-offers="true"
                                                :id="'offersonpage'"
                                                @onselect="newSelect"
                                        />
                                    </div>
                                    <div class="list-panel-heading list-panel-heading-offers list-panel-sort">
                                        <p>sort by: </p>
                                        <Select
                                                current="CONTRACTOR RATING"
                                                :all-options="optionsSortBy"
                                                type-select="offer"
                                                sort-by="true"
                                                :id="'sortby'"
                                                @onselect="newSelect"
                                        />
                                    </div>
                                    <div class="list-panel-heading mr-t0 mr-b0 mr-l0">
                                        <div class="control-arrow-container">
                                            <a
                                                    v-if="getSortPriority === 'decrease'"
                                                    type="button"
                                                    class="control-arrow"
                                                    @click="doIncreasePriority"
                                            >
                                                <img class="arrow down" src="../assets/img/change-arrow-ic.svg" alt=""/>
                                            </a>
                                            <a
                                                    v-if="getSortPriority === 'increase'"
                                                    type="button"
                                                    class="control-arrow"
                                                    @click="doDecreasePriority"
                                            >
                                                <img class="arrow up" src="../assets/img/change-arrow-ic.svg" alt="">
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <offers-list
                                    v-if="!notFoundOffers"
                                    :current-list-offers="getPartOfferSavedList"
                                    isSaved="true"
                            />

                            <pagination
                                    v-if="!notFoundOffers"
                                    :num-offers="currentNumSavedOffers"
                            />

                            <!--<action-panel-->
                            <!--btnRouterText="Create your own task"-->
                            <!--actionRouterText="You are an employer?"-->
                            <!--to="/offers/new"-->
                            <!--isBottomOffersAction="true"-->
                            <!--/>-->

                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>

    import Navbar from './layouts/Navbar';
    import Select from './layouts/forms/Select';
    import OffersList from './layouts/OffersList';
    import Pagination from './layouts/Pagination';
    import ActionPanel from './layouts/ActionPanel';

    import {mapMutations} from 'vuex';
    import {mapGetters} from 'vuex';

    export default {
        name: "saved-offers",
        components: {
            Navbar,
            Select,
            OffersList,
            Pagination,
            ActionPanel
        },
        data() {
            return {
                optionsOffersOnPage: [10, 20, 50],
                optionsSortBy: ["CONTRACTOR RATING", "PRICE", "END DATE"],
                notFoundOffers: false
            }
        },
        watch: {
            getSortPriority: function (val) {
                console.log(val);
            }
        },
        computed: {
            ...mapGetters([
                'doSortByRatingIncrease',
                'doSortByRatingDecrease',
                'doSortByPriceIncrease',
                'doSortByPriceDecrease',
                'doSortByEndDateIncrease',
                'doSortByEndDateDecrease',

                'getPartOfferSavedList'
            ]),
            currentNumOffers: function () {
                return this.$store.state.Offers.offersList.length;
            },
            currentNumSavedOffers: function () {
                return this.getOffersSavedList.length;
            },
            currentSortBy: function () {
                return this.$store.state.Offers.currentSortBy;
            },
            getOffersList: function () {
                return this.$store.state.Offers.offersList;
            },
            getOffersSavedList: function () {
                return this.getOffersList.filter(function (el) {
                    return el.saved;
                });
            },
            getSortPriority: function () {
                return this.$store.state.Offers.sortPriority;
            }
        },
        methods: {
            ...mapMutations({
                setNewSelect: 'SET_NEW_SELECT',
                setCurrentPage: 'SET_CURRENT_PAGE',
                setCurrentPriority: 'SET_CURRENT_PRIORITY',
                setSortPriority: 'SET_SORT_PRIORITY',
                setCountOffersPerPage: 'SET_COUNT_OFFERS_PER_PAGE'
            }),
            doIncreasePriority: function () {
                this.setSortPriority('increase');

                if (this.currentSortBy === 'CONTRACTOR RATING')
                    return this.doSortByRatingIncrease;

                if (this.currentSortBy === 'PRICE') {
                    return this.doSortByPriceIncrease;
                }

                if (this.currentSortBy === 'END DATE')
                    return this.doSortByEndDateIncrease;
            },
            doDecreasePriority: function () {
                this.setSortPriority('decrease');

                if (this.currentSortBy === 'CONTRACTOR RATING')
                    return this.doSortByRatingDecrease;

                if (this.currentSortBy === 'PRICE') {
                    return this.doSortByPriceDecrease;
                }

                if (this.currentSortBy === 'END DATE')
                    return this.doSortByEndDateDecrease;
            },
            newSelect: function (value, id) {
                if (id === 'offersonpage')
                    this.selectedOffersOnPage = value;

                if (id === 'sortby')
                    this.selectedSortBy = value;
            },
            initiateStateOffers: function () {
                this.doSortByRatingDecrease;
                this.setCountOffersPerPage(10);
                this.setCurrentPage(1);

                if (this.getPartOfferSavedList.length === 0)
                    this.notFoundOffers = true;
            }
        },
        created() {
            this.$on('onselect', function (item, id) {
                this.setNewSelect(item);

                if (this.currentSortBy === 'CONTRACTOR RATING') {
                    if (this.getSortPriority === 'increase')
                        return this.doSortByRatingIncrease;
                    else
                        return this.doSortByRatingDecrease;
                }

                if (this.currentSortBy === 'PRICE') {
                    if (this.getSortPriority === 'increase') {
                        return this.doSortByPriceIncrease;
                    }
                    else {
                        return this.doSortByPriceDecrease;
                    }
                }

                if (this.currentSortBy === 'END DATE') {
                    if (this.getSortPriority === 'increase')
                        return this.doSortByEndDateIncrease;
                    else
                        return this.doSortByEndDateDecrease;
                }

                if (id === 'offersonpage')
                    this.setCurrentPage(1);
            });

            this.$on("changeCurrentPage", function (item) {
                this.setCurrentPage(item);
            });

            this.initiateStateOffers();
        }
    }
</script>

<style lang="stylus" scoped>

    .list-panel-count-offers,
    .list-panel-sort
        margin-top 0
        margin-bottom 0

    .list-panel-offers
        margin 0

    .list-panel-sort
        margin-left 0

</style>