<template>
  <div id="app" :class="systemLanguage">
    <router-view />
    <Connection-modal />
  </div>
</template>

<script>
import ConnectionModal from './components/modals/ConnectionModal';

export default {
  name: 'alehub',
  components: {
    ConnectionModal
  },
  data() {
    return {
      language: localStorage.getItem('systemLang')
    }
  },
  methods: {
    updateOnlineStatus (e) {
      if(!navigator.onLine) return this.$modal.show('connectionmodal');
    }
  },
  computed: {
    systemLanguage() {
      if(this.language === null) return 'eng';
      else return this.language;
    }
  },
  mounted() {
    if(!navigator.onLine) return this.$modal.show('connectionmodal');
    this.$on('changeSystemLanguage', function() {
      this.language = localStorage.getItem('systemLang');
    });
  },
  created() {
    window.addEventListener('offline', this.updateOnlineStatus);
  }
}
</script>

<style lang="scss">
  body {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .rus {
    & .navbar {
      & .title {
        font-family: DINProCondensedBold;
      }
    }
  }

  .china {
    & .navbar {
      & .title {
        font-family: PingFangSCBold;
      }
    }
  }
</style>
