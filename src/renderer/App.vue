<template>
  <div id="app" :class="systemLanguage">
    <router-view />
    <Connection-modal />
  </div>
</template>

<script>
import ConnectionModal from './components/modals/ConnectionModal';
import { exec } from 'child_process';
import { join as joinPath, dirname } from 'path';
import appRootDir from 'app-root-dir';
import getPlatform from '../main/get-platform.js';

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

    const execPath = (process.env.NODE_ENV !== 'development') ?
      joinPath(dirname(appRootDir.get()), 'bin'):
      joinPath(appRootDir.get().replace(/ /g, "\\ "), 'resources', getPlatform());

    const cmd = `${joinPath('cd '+execPath+ '; chmod 777 ./run.sh; ./run.sh')}`

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.warn(`exec error: ${err}`);
      }
      console.log(`stduot: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    });
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
