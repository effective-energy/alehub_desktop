<template>
  <div id="app" :class="systemLanguage">
    <router-view v-if="hubConnection"  />
    <Connection-modal v-if="hubConnection" />
    <connect-to-hub v-if="!hubConnection" />
  </div>
</template>

<script>
import ConnectionModal from './components/modals/ConnectionModal';
import ConnectToHub from './components/modals/ConnectToHub';
import { exec } from 'child_process';
import { join as joinPath, dirname } from 'path';
import appRootDir from 'app-root-dir';
import getPlatform from '../main/get-platform.js';

export default {
  name: 'alehub',
  components: {
    ConnectionModal,
    ConnectToHub
  },
  data() {
    return {
      language: localStorage.getItem('systemLang'),
      hubConnection: false
    }
  },
  methods: {
    updateOnlineStatus (e) {
      if(!navigator.onLine) return this.$modal.show('connectionmodal');
    },
    startnode (execPath, cmd) {
      let _this = this;
      this.hubConnection = true;
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.warn(`exec error: ${err}`);
          _this.startnode(execPath, cmd);
        }
        console.log(`stduot: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
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

    this.startnode(execPath, cmd);
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
