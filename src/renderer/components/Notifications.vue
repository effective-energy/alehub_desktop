<template>
  <div class="wallet">

    <Navbar
      :title="$t('pages.notifications.navbarTitle')"
      :isNavigate="true"
      :isBalance="false"
      :isHide="true"
    />

    <section class="main">
      <div class="content nomenu">

        <div class="container">
          <div class="row">

            <div class="col-12">

              <Spinner v-if="isLoader" />
              <Notif-panel :notifications="notifications" v-else-if="!isLoader && notifications.length !== 0" />

              <p v-else class="no-found">{{ $t('pages.notifications.notFound') }}</p>

            </div>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script>
import Navbar from "./layouts/Navbar";
import NotifPanel from "./layouts/NotifPanel";
import Spinner from './layouts/Spinner';

import { mapMutations } from "vuex";

export default {
  name: "Notifications",
  components: {
    Navbar,
    NotifPanel,
    Spinner
  },
  data() {
    return {
      isLoader: false
    }
  },
  computed: {
    notifications() {
      return this.$store.state.Notifications.notifications
    }
  },
  methods: {
    ...mapMutations({
      changeWallet: "CHANGE_SELECTED_WALLET",
      toggleNotifBadge: "TOGGLE_NOTIF_BADGE"
    }),
    imitationLoadPage() {
      this.isLoader = true;
      setTimeout(() => {
        this.isLoader = false;
      }, 750);
    }
  },
  mounted() {
    this.$on("selectWallet", function(index) {
      this.changeWallet(index);
    })
  },
  created() {
    this.toggleNotifBadge(false);
    this.imitationLoadPage();
  }
};
</script>

<style scoped lang="scss">
  .no-found {
    text-align: center;
    color: #34343e;
    font-size: 14px;
    font-family: MuseoSansCyrl500;
    line-height: calc(100vh - 250px);
  }
</style>