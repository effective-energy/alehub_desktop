<template>
  <div class="settings">
    <Navbar
      :title="$t('pages.settings.navbarTitle')"
      :isNavigate="true"
      :isBalance="false"
    />

    <section class="main">
      <div class="content nomenu">

        <div class="container">
          <div class="row">
            <div class="col-12">

              <Panel-heading :title="$t('pages.settings.panelHeadingGeneral')" :isTop="true"/>

              <div class="form">

                <div class="control" @click.stop="changeLanguage">
                  <div class="wrap-input">
                    <label>{{ $t('pages.settings.language') }}</label>
                    <select-control
                      :current="selectedLang"
                      :allOptions="['English', 'Русский']"
                      :id="'language'"
                    />
                  </div>
                </div>

              </div>

              <panel-heading :title="$t('pages.settings.theme')" :isTop="false"/>

              <div class="form">
                <div class="theme-list">
                  <div class="theme-item active" v-for="theme in themes" :key="theme" @click="selectTheme(theme)" :class="'theme-' + theme">
                    <div class="theme-header">
                      <span class="theme-logo">ALEHUB</span>
                    </div>
                    <div style="display: flex; height: 100%;">
                      <div class="theme-menu">
                        <div class="menu-item"></div>
                      </div>
                      <div class="theme-main">
                        <div class="theme-btn">
                          <div class="button button-first"></div>
                          <div class="button button-second"></div>
                        </div>
                        <div class="theme-block"></div>
                        <div class="theme-line recieved"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from './layouts/Navbar';
import SelectControl from './layouts/forms/Select';
import PanelHeading from './layouts/PanelHeading';

import { mapMutations } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  name: 'settings',
  data() {
    return {
      selectedLanguage: 'English',
      themes: [
        'main',
        'dark',
        'white'
      ],
    }
  },
  components: {
      Navbar,
      SelectControl,
      PanelHeading
  },
  computed: {
    selectedLang() {
      switch (localStorage.getItem('systemLang')) {
        case 'eng':
          return 'English'
        case 'rus':
          return 'Русский'
        default:
          return 'English';
      }
    }
  },
  methods: {
    ...mapMutations({
      setTheme: 'SET_THEME'
    }),
    newSelect(value, id) {
      if (id == "language") {
        if (value === 'English') localStorage.setItem('systemLang', 'eng')
        if (value === 'Русский') localStorage.setItem('systemLang', 'rus')
          this.selectedLanguage = value
          this.$i18n.locale = localStorage.getItem('systemLang');
          this.$parent.$emit('changeSystemLanguage');
        }
    },
    changeLanguage(e) {
      if (e.target.localName === 'li') return false;
      if (e.target.className === 'value') return false;
      document.getElementsByClassName('value')[0].click();
    },
    importWallet(data) {
      this.$http.put(`${window.nodeHost}/importWallet`,JSON.stringify(data.secret), {
      headers : {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
      }
      }).then(response => {
          let dif = this.walletList.find(item => {
              return item.address === response.body.wiPublicKey;
          });
          if (dif !== undefined) return this.$modal.hide('newwallet');
          this.setNewWalletToStorage(data.name, response.body.wiPublicKey)
      }, response => {
          this.$toasted.show("Invalid secret key", {
              duration: 10000,
              type: 'error',
          });
      })
    },
    selectTheme: function (name) {
      let body = document.getElementsByTagName('body')[0];
      this.setTheme(name);
      switch (name) {
        case 'main':
          body.classList.remove("dark", "white");
          break;
        case 'dark':
          body.classList.remove("white");
          body.classList.add("dark");
          break;
        case 'white':
          body.classList.remove("dark");
          body.classList.add("white");
          break;
      }
    },
  },
  mounted() {
    this.$on("onselect", function (id, value) {
      this.newSelect(id, value)
    });
    this.$on("importWallet", function (data) {
      this.importWallet(data)
    });
  }
}
</script>

<style lang="scss" scoped>
  .control {
    border-bottom: none;
    & .wrap-input {
      & .full-line {
        width: 100%;
      }
    }
  }

  .form .deletelink {
    margin-top: -8px;
    padding-top: 0px;
  }

  .theme-list {
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 22px;
    margin-bottom: 22px;
    display: flex;

    @media(max-width: 790px) {
      flex-wrap: wrap;
    }

    .theme-item {
      background-color: #f7f7f7;
      width: 200px;
      height: 120px;
      margin-right: 40px;
      border: 1px solid #d1d1d1;
      display: flex;
      flex-direction: column;
      opacity: 1;
      cursor: pointer;

      @media(max-width: 790px) {
        margin-bottom: 24px;
      }

      &:last-child {
        margin-right: 0;
      }

      &:nth-child(2) {
        @media(max-width: 600px) {
          margin-right: 0;
        }

        @media(max-width: 550px) {
          margin-right: 40px;
        }
      }

      &.theme-main {
        .theme-menu {
          background-color: #474b4b;
        }

        .theme-btn {
          .button-first {
            background-color: #ffd24f;
          }

          .button-second {
            background-color: #e6e7e7;
          }
        }

        .theme-line {
          &.recieved {
            background-color: #f9e095;
          }
        }
      }

      &.theme-dark {
        &.theme-item {
          background-color: #4a4e65;
        }

        .theme-header {
          background-color: #3a3a4b;
        }

        .theme-menu {
          background-color: #464657;

          .menu-item {
            background-color: #4a4e65;
          }
        }

        .theme-btn {
          .button-first {
            background-color: rgba(222, 223, 223, 0.2);
          }

          .button-second {
            background-color: #2c2c42;
          }
        }

        .theme-line, .theme-block {
          background-color: #3f435d;

          &.recieved {
            background-color: rgba(222, 223, 223, 0.1);
          }
        }
      }

      &.theme-white {
        .theme-menu {
          background-color: #aaaec1;
        }

        .theme-header {
          background-color: #eff0f3;
        }

        .theme-logo {
          color: #43414a;
        }

        .theme-btn {
          .button-first {
            background-color: #3c4af0;
          }

          .button-second {
            background-color: #adb1c3;
          }
        }

        .theme-line, .theme-block {
          background-color: #eff0f3;

          &.recieved {
            background-color: #fff;
          }
        }
      }

      .theme-header {
        height: 20px;
        width: 100%;
        background-color: #0d1717;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .theme-logo {
        font-family: Fairview;
        color: #fcfcfc;
        font-size: 14px;
      }

      .theme-menu {
        height: 100%;
        width: 50px;
        position: relative;

        .menu-item {
          position: absolute;
          background-color: #f7f7f7;
          height: 15px;
          width: 48px;
          top: 15px;
        }
      }

      .theme-main {
        margin: 5px;
      }

      .theme-btn {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 5px;
        margin-top: 3px;

        .button {
          width: 30px;
          height: 10px;
          background-color: #e6e7e7;

          &:first-child {
            margin-right: 5px;
          }
        }
      }

      .theme-block {
        width: 140px;
        height: 20px;
        background-color: #f0f0f0;
        margin-bottom: 10px;
      }

      .theme-line {
        width: 140px;
        height: 10px;
        background-color: #f0f0f0;
        margin-bottom: 12px;
      }
    }
  }
</style>
