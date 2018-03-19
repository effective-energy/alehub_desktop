<template>
    <div>
        <header class="navbar">
            <div class="navbar-nav" v-if="isNavigate">
                <div v-if="isBack" class="back-icon" @click="backLink">
                    <img src="../../assets/img/back-ic.svg" width="24.5" height="17">
                </div>

                <router-link :to="{ path: '/wallet' }" v-else>
                    <div class="logo">ALE</div>
                </router-link>


                <div class="actions">
                    <router-link v-for="(link, indexLink) in navbarLinks" :key="indexLink" :to="{ path: link.path }"
                                 class="item" active-class="active">
                        <img :src="getNavbarIcon(link.iconName)" :width="link.iconWidth" :height="link.iconHeight">
                        <span class="badge" v-if="notifBadge && link.isBadge == true"></span>
                    </router-link>
                </div>

            </div>
            <span class="title">{{ title }}</span>
            <div class="balance" :class="{ 'gridBalance': !rightMenu }" v-if="isBalance || rightMenu">
                <span class="count" v-if="isBalance">
                    <vue-numeric
                            :value="cur"
                            :separator="correctLangSep"
                            :decimal-separator="correctLangDecSep"
                            :precision="correctValuePrecision"
                            :read-only="true"
                    />
                </span>
                <div
                        v-if="isBalance"
                        class="count count-currency"
                        :style="setMarginWhenOpenDropdown"
                        @click="toOpenDropdownCurrency"
                >
                    <span id="current-currency">{{ currencies[0].name }}</span>
                    <span class="caret" v-if="!openDropdownCurrency"></span>
                </div>
                <ul class="dropdown-currency" v-if="openDropdownCurrency">
                    <li
                            v-for="item in currencies"
                            :key="item.id"
                            :class="{'active-currency': item.current}"
                            @click="chooseCurrency(item)"
                    >
                        {{ item.name }}
                    </li>
                </ul>

                <div class="options" v-if="rightMenu">
                    <img src="../../assets/img/options.svg" alt="" width="3" height="16">

                    <div class="dropdown-options"
                         :class="{'horizontal-dropdown-options': rightMenu.horizontal, 'textList': !rightMenu.horizontal }">
                        <div class="item" v-for="(item, index) in rightMenu.list" :key="index">
                            <router-link v-if="item.type == 'link' && !item.isHide && !item.mail"
                                         :to="{ path: item.link }"
                                         active-class="active">
                                <span>{{ item.name }}</span>
                            </router-link>
                            <a v-if="item.mail" :href="'mailto:'+item.mail"><span>{{ item.name }}</span></a>
                            <a v-if="item.type === 'event'"
                               @click="startEvent(item.function)"><span>{{ item.name }}</span></a>
                            <span v-if="item.type == 'modal' && !item.isHide" @click="openModal(item.target)">{{ item.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else></div>
        </header>

    </div>
</template>

<script>
    import VueNumeric from 'vue-numeric';
    import storage from 'electron-json-storage';

    export default {
        name: 'Navbar',
        component: {
            VueNumeric,
        },
        props: {
            title: {
                type: String,
                required: true
            },
            isNavigate: [String, Boolean],
            isBalance: [String, Boolean],
            rightMenu: Object,
            isBack: [String, Boolean]
        },
        data() {
            return {
                openDropdownCurrency: false,
                isFullScreen: false,
                currencies: [
                    {
                        id: 1,
                        name: 'ALE',
                        current: true
                    },
                    {
                        id: 2,
                        name: 'BTC',
                        current: false
                    },
                    {
                        id: 3,
                        name: 'USD',
                        current: false
                    }
                ],
                cur: 0
            }
        },
        watch: {
            selectedWalletAddress() {
                this.getCurrentWalletBalance()
            }
        },
        computed: {
            navbarLinks() {
                return this.$store.state.Navbar.links;
            },
            selectedWalletAddress() {
                return this.$store.state.Wallets.selectedWallet;
            },
            notifBadge() {
                return this.$store.state.Notifications.isNewNotification
            },

            getCurrentWallet: function () {
                return this.$store.state.Wallets.currentWallet;
            },

            
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
                if (Number(this.getCurrentWalletBalance) % 1 !== 0 && Number(this.getCurrentWalletBalance) === this.getCurrentWalletBalance)
                    return this.getCurrentWalletBalance.toString().split('.')[1].toString().length;
                else
                    return 0;
            },
            setMarginWhenOpenDropdown: function () {
                if (this.openDropdownCurrency) {
                    // return 'marginRight: 35px';
                }
            }
        },
        methods: {
            getNavbarIcon: function (name) {
                return require('../../assets/img/' + name + '.svg');
            },
            parseBalance: function (count) {
                return numeral(count).format('0,0');
            },
            backLink: function () {
                this.$router.go(-1);
            },
            openModal: function (name) {
                this.$modal.show(name);
            },
            startEvent(type) {
                this.$parent.$emit(type)
            },
            newSelect(value, id) {
                if (id === 'offersonpage') {
                    this.selectedOffersOnPage = value;
                }
                if (id === 'sortby') {
                    this.selectedSortBy = value;
                }
            },
            toOpenDropdownCurrency: function () {
                (this.openDropdownCurrency) ? this.openDropdownCurrency = false : this.openDropdownCurrency = true;
            },
            chooseCurrency: function (item) {
                document.getElementById('current-currency').innerText = item.name;
                this.openDropdownCurrency = false;
                this.currencies.find(el => {
                    return el.current;
                }).current = false;
                item.current = true;
            },
            getCurrentWalletBalance: function () {
                // if (this.getCurrentWallet !== null)
                //     return this.getCurrentWallet.balance;
                // return 0;
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
        },
        created () {
            this.getCurrentWalletBalance()
            console.log(this.cur)
        }
    }
</script>

<style lang="stylus" scoped>
    .count-currency
        cursor pointer
        display inline-block
        width 70px
        padding 0 10px 0 10px
        margin-right 0 !important

    .dropdown-currency
        position absolute
        background-color #0d1717
        list-style none
        padding 0
        margin-top 0
        top 11px
        right 84px

        li.active-currency
            background-color #ffd24f
            color #34343e

        li
            font-family Fairview
            font-size 32px
            color white
            padding 5px 10px 5px 10px
            cursor pointer

            &:hover
                background-color #ffd24f
                color #34343e

</style>
