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
      selectedLanguage: 'English'
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
      this.$http.put(`http://127.0.0.1:12348/importWallet`,JSON.stringify(data.secret), {
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
    }
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
</style>
