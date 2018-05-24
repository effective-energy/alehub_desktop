<template>
  <modal name="newwallet" height="auto" class="modal-md" :clickToClose="isCloseModal" @opened="modalOpen">
    <div class="heading" v-if="newWalletStep == 1">
      <p class="title title-expand" @click="openDropDown">{{ modalTitle }}<i class="arrow"></i></p>
      <i class="close" @click="closeModal" v-if="isCloseModal"></i>
      <div class="dropdown-list list-select" v-show="isOpenOptions">
        <ul>
          <li v-for="(option, optionIndex) in dropDownOption" :key="optionIndex" :class="{ 'selected': option.isSelected }" @click="changeType(optionIndex)">
            {{ option.title }}
          </li>
        </ul>
      </div>
    </div>

    <div class="heading" v-if="newWalletStep != 1">
      <i class="back" @click="changeRecoveryStep"></i>
      <p class="title">{{ $t('modals.newWallet.recovery.phrase.title') }}</p>
      <i class="close" @click="closeModal" v-if="isCloseModal"></i>
    </div>

    <div v-if="newWalletStep == 1">

    <div class="body" v-if="walletType == 'new'">
      <div class="modal-control" @click="focusInput('newWalletName')">
        <div class="modal-input">
          <label class="title">{{ $t('modals.newWallet.new.fields.title.label') }}</label>
          <input id="newWalletName" type="text" class="input" v-model="walletName1" :placeholder="$t('modals.newWallet.new.fields.title.placeholder')" @keyup.enter="changeStepCreate('next')">
        </div>
      </div>

      <div class="modal-btn text-center">
        <button
          class="btn btn-yellow btn-large"
          @click="preCreate()"
          :disabled="checkNewWalletFields"
          :class="{ 'disabled': checkNewWalletFields }"
        >
          {{ $t('modals.newWallet.new.button') }}
        </button>
      </div>
    </div>

    <div class="body" v-if="walletType == 'import'">

      <div class="modal-control" @click="focusInput('redemptionWalletName')">
        <div class="modal-input">
          <label class="title">{{ $t('modals.newWallet.import.fields.title.label') }}</label>
          <input
            type="text"
            id="redemptionWalletName"
            class="input"
            :placeholder="$t('modals.newWallet.import.fields.title.placeholder')"
            v-model="walletName1"
          />
        </div>
      </div>

      <div class="modal-control" @click="focusInput('secretKey')">
        <div class="modal-input input-phrase">
          <!-- <label class="title">{{ $t('modals.newWallet.import.fields.mnemonic.label') }}</label> -->
          <label class="title">Secret key</label>
          <!-- <div class="badge-control" v-if="mnemonics.length !== 0">
            <span class="badge" v-for="(mnemonic, indexMnemonic) in mnemonics" :key="indexMnemonic">{{ mnemonic }}</span>
          </div> -->
          <!-- <input
            type="text"
            class="input"
            id="redemptionKey"
            placeholder="Mnemonic phrase"
            v-on:keyup.188="addMnemonic"
            v-model="mnemonicField"
            @keyup.enter="addMnemonic"
            @keyup.delete="removeMnemonic"
            @keyup.space="addMnemonic"
            @blur="onBlurNewWallet"
          /> -->
          <input
            type="text"
            class="input"
            id="secretKey"
            placeholder="Secret key"
            v-model="secretKey"
          />
        </div>
      </div>

      <div class="modal-btn text-center">
        <button
          class="btn btn-yellow btn-large"
          @click="createNewWallet()"
          :disabled="isImport"
          :class="{ 'disabled': isImport }"
        >
          {{ $t('modals.newWallet.import.button') }}
        </button>
      </div>

    </div>

    <div class="body" v-if="walletType == 'redeem'">

      <div class="modal-control">
        <div class="modal-input">
          <label class="title">{{ $t('modals.newWallet.redeem.fields.title.label') }}</label>
          <input
            type="text"
            id="preicoWalletName"
            class="input"
            v-model="walletName1"
            :placeholder="$t('modals.newWallet.redeem.fields.title.placeholder')"
          />
        </div>
      </div>

      <div class="modal-control">
        <div class="modal-input">
          <label class="title">{{ $t('modals.newWallet.redeem.fields.key.label') }}</label>
          <input
            type="text"
            class="input"
            id="redemptionPreico"
            :placeholder="$t('modals.newWallet.redeem.fields.key.placeholder')"
            @keyup.enter="createNewWallet"
            v-model="redemtionKey"
          />
        </div>
      </div>

      <div class="modal-control">
        <div class="modal-input input-phrase">
          <label class="title">{{ $t('modals.newWallet.redeem.fields.decrypt.label') }}</label>
          <div class="badge-control" v-if="mnemonics.length !== 0">
            <span class="badge" v-for="(mnemonic, indexMnemonic) in mnemonics" :key="indexMnemonic">{{ mnemonic }}</span>
          </div>
          <input
            type="text"
            class="input"
            id="redemptionKey"
            placeholder="Mnemonic phrase"
            v-on:keyup.188="addMnemonic"
            v-model="mnemonicField"
            @keyup.enter="addMnemonic"
            @keyup.delete="removeMnemonic"
            @keyup.space="addMnemonic"
            @blur="onBlurNewWallet"
          />
        </div>
      </div>

      <div class="modal-btn text-center">
        <button
          class="btn btn-yellow btn-large"
          @click="changeStepCreate('next')"
          :disabled="isRedeem"
          :class="{ 'disabled': isRedeem }"
        >
          {{ $t('modals.newWallet.redeem.button') }}
        </button>
      </div>

    </div>
    </div>

    <div v-if="newWalletStep == 2 && recoveryStep == 1">
      <div class="modal-warning">
        <p class="agreed">{{ $t('modals.newWallet.recovery.phrase.text') }}</p>

        <label class="control control-checkbox">
          <span>{{ $t('modals.newWallet.recovery.phrase.checkbox') }}</span>
          <input type="checkbox" class="type_project_arr" v-model="isAgreedRecovery" />
          <div class="control-indicator"></div>
        </label>

      </div>

      <div class="modal-btn text-center">
        <button class="btn btn-yellow btn-large btn-bottom btn-timer" :disabled="countTimer || !isAgreedRecovery" :class="{ 'disabled': countTimer !== 0 || !isAgreedRecovery }" @click="changeRecoveryStep('next')">
          {{ $t('modals.newWallet.recovery.phrase.btn') }} <span v-if="countTimer !== 0">({{ countTimer }})</span>
        </button>
      </div>

    </div>

    <div v-if="newWalletStep == 2 && recoveryStep == 2">
      <div class="modal-warning">
        <p class="agreed">{{ $t('modals.newWallet.recovery.mnemonic.text') }}</p>
      </div>

      <div class="phrase">
        <span>{{ secretKey }} </span>
      </div>

      <div class="modal-btn text-center">
        <button class="btn btn-yellow btn-large btn-bottom" @click="changeRecoveryStep('next')">
          {{ $t('modals.newWallet.recovery.mnemonic.btn') }}
        </button>
      </div>

    </div>

    <div v-if="newWalletStep == 2 && recoveryStep == 3" class="body">

      <!-- <div class="modal-warning agreed-border">
        <p class="agreed">{{ $t('modals.newWallet.recovery.finish.each') }}</p>
      </div>

      <div class="modal-control modal-control-noMargin" style="margin-left: 42px;margin-right: 42px;">
        <div class="modal-input input-phrase">
          <label class="title">{{ $t('modals.newWallet.recovery.finish.fields.phrase.title') }}</label>
          <div class="badge-control" v-if="mnemonicsRecovery.length !== 0">
            <span class="badge" v-for="(mnemonic, indexMnemonic) in mnemonicsRecovery" :key="indexMnemonic">{{ mnemonic }}</span>
          </div>
          <input
            type="text"
            class="input"
            :placeholder="$t('modals.newWallet.recovery.finish.fields.phrase.placeholder')"
            v-on:keyup.188="addMnemonicRecovery"
            v-model="mnemonicFieldRecovery"
            @keyup.enter="addMnemonicRecovery"
            @keyup.delete="removeMnemonicRecovery"
            @keyup.space="addMnemonicRecovery"
            @blur="recoveryBlur"
          />
        </div>
      </div> -->

      <div class="modal-warning">

        <label class="control control-checkbox">
          <span>{{ $t('modals.newWallet.recovery.finish.fields.deviceOnly') }}</span>
          <input type="checkbox" class="type_project_arr" v-model="restorationAgreements.deviceOnly" />
          <div class="control-indicator"></div>
        </label>

        <label class="control control-checkbox">
          <span>{{ $t('modals.newWallet.recovery.finish.fields.secure') }}</span>
          <input type="checkbox" class="type_project_arr" v-model="restorationAgreements.phraseSecure" />
          <div class="control-indicator"></div>
        </label>

      </div>

      <div class="modal-btn text-center">
        <button
          class="btn btn-default btn-large"
          :class="{ 'disabled': mnemonicsRecovery.length === 0 }"
          @click="clearRecoveryPhrase"
          :disabled="mnemonicsRecovery.length === 0"
        >
          {{ $t('modals.newWallet.recovery.finish.btn.clear') }}
        </button>
        <button
          class="btn btn-yellow btn-large"
          :class="{ 'disabled': isConfirmRecovery }"
          :disabled="isConfirmRecovery"
          @click="createNewWallet"
        >
          {{ $t('modals.newWallet.recovery.finish.btn.confirm') }}
        </button>
      </div>

    </div>

  </modal>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from 'vuex';
import mnGen from 'mngen';

export default {
  name: 'newWallet',
  data() {
    return {
      walletType: 'new',
      isOpenOptions: false,
      walletName1: '',
      wallet: {},
      dropDownOption: [
        { title: this.$t('modals.newWallet.new.label'), isSelected: true, value: 'new' },
        { title: this.$t('modals.newWallet.import.label'), isSelected: false, value: 'import' }
      ],
      redemtionKey: '',
      newWalletStep: 1,
      countTimer: 1,
      isAgreedRecovery: false,
      recoveryStep: 1,
      mnemonics: [],
      mnemonicField: '',
      recoveryMnemonicPhrase: mnGen.list(10),
      mnemonicFieldRecovery: '',
      mnemonicsRecovery: [],
      restorationAgreements: {
        deviceOnly: false,
        phraseSecure: false
      },
      publicKey: '',
      secretKey: ''
    }
  },
  computed: {
    ...mapGetters([
      'checkNewWalletMatchPassword'
    ]),
    isRedeem () {
      if(this.mnemonics.length === 0 || this.walletName1 === '' || this.redemtionKey === '') return true;
      return false;
    },
    isImport () {
      // if(this.mnemonics.length === 0 || this.walletName1 === '') return true;
      if(this.secretKey.length === 0 || this.walletName1 === '') return true;
      return false;
    },
    isConfirmRecovery () {
      if(this.restorationAgreements.deviceOnly === false || this.restorationAgreements.phraseSecure === false) return true;
      return false;
    },
    newWallets() {
      return this.$store.state.Wallets.newWallet
    },
    modalTitle() {
      let type = this.dropDownOption.filter(item => {
        return item.isSelected
      });
      return type[0].title;
    },
    getCurrentUserId () {
      return localStorage.getItem('id');
    },
    getFakeWalletId () {
      return this.$store.state.Wallets.wallets[this.$store.state.Wallets.wallets.length - 1].id + 1;
    },
    checkNewWalletFields () {
      if (this.walletName1.length === 0) {
        return true;
      }
      return false;
    },
    isCloseModal() {
      if (this.$store.state.Wallets.currentWallet == null) return false;
      return true;
    },
    getUserId () {
      return localStorage.getItem('id');
    },
    getUserWallets () {
      return this.$store.state.Wallets.wallets.filter(item => {
        return parseInt(item.ownerId) === parseInt(this.getUserId);
      });
    }
  },
  methods: {
    ...mapMutations({
      walletName: "NEW_WALLET_NAME",
      activityChecked: "CHECKED_ACTIVITY",
      walletPassword: "NEW_WALLET_PASSWORD",
      walletRepeatPassword: "WALLET_REPEAT_PASSWORD",
      // createNewWallet: "CREATE_NEW_WALLET",
      createNewNewWallet: "CREATE_NEW_NEW_WALLET"
    }),
    recoveryBlur () {
      this.mnemonicFieldRecovery = '';
    },
    onBlurNewWallet () {
      this.mnemonicField = '';
    },
    clearRecoveryPhrase () {
      this.mnemonicsRecovery = [];
    },
    changeRecoveryStep (step) {
      if(step == 'next') return this.recoveryStep = this.recoveryStep+1;
      if(this.recoveryStep == 1 && step !== 'next') {
        this.newWalletStep = 1;
      }
      else this.recoveryStep = this.recoveryStep-1;
    },
    removeMnemonicRecovery () {
      if(this.mnemonicFieldRecovery !== '' || this.mnemonicsRecovery.length === '') return false;
      this.mnemonicFieldRecovery = this.mnemonicsRecovery[this.mnemonicsRecovery.length-1];
      this.mnemonicsRecovery.pop();
    },
    removeMnemonic () {
      if(this.mnemonics.length === 0 || this.mnemonicField !== '') return false;
      this.mnemonicField = this.mnemonics[this.mnemonics.length-1];
      this.mnemonics.pop();
    },
    addMnemonic () {
      let newMnemonic = this.mnemonicField.replace(/,/g , '');
      if(newMnemonic === '') return false;
      this.mnemonics.push(newMnemonic);
      this.mnemonicField = '';
    },
    addMnemonicRecovery () {
      let newMnemonic = this.mnemonicFieldRecovery.replace(/,/g , ' ');
      if(newMnemonic === '') return false;
      for(let i=0;i<newMnemonic.split(' ').length;i++) {
        if(newMnemonic.split(' ')[i] !== '') this.mnemonicsRecovery.push(newMnemonic.split(' ')[i]);
      }
      this.mnemonicFieldRecovery = '';
    },
    countDown () {
      if(this.countTimer != 0) {
        setTimeout(() => {
          this.countTimer--;
          this.countDown();
        }, 1000);
      }
    },
    changeStepCreate (step) {
      if(step == 'next') this.newWalletStep = this.newWalletStep+1;
      else this.newWalletStep = this.newWalletStep-1;
      if(this.newWalletStep === 2) {
        this.countTimer = 10;
        this.countDown();
        this.recoveryStep = 1;
        this.isAgreedRecovery = false;
      }
    },
    focusInput (id) {
      setTimeout(() => {
        document.getElementById(id).focus()
      }, 40);
    },
    openDropDown () {
      this.isOpenOptions = !this.isOpenOptions;
    },
    changeType (index) {
      for (let i = 0; i < this.dropDownOption.length; i++) {
        this.dropDownOption[i].isSelected = false;
      }
      this.mnemonics = [];
      this.mnemonicField = '';
      this.walletName1 = '';
      this.dropDownOption[index].isSelected = true;
      this.isOpenOptions = false;
      this.walletType = this.dropDownOption[index].value;
      if (this.walletType === 'new') this.focusInput('newWalletName');
      if (this.walletType === 'redemption') this.focusInput('redemptionWalletName');
      if (this.walletType === 'preico') this.focusInput('preicoWalletName');
    },
    repeatPassowrd (e) {
      this.walletRepeatPassword(e.target.value);
    },
    changePassword (e) {
      this.walletPassword(e.target.value);
    },
    changeActivity (e) {
      this.activityChecked(e.target.checked);
    },
    changeWalletname (e) {
      this.walletName(e.target.value);
    },
    closeModal () {
      this.$modal.hide('newwallet');
    },
    // createNew() {
    //     this.createNewWallet();
    //     this.closeModal();
    // },
    modalOpen () {
      this.walletType = 'new';
      this.newWalletStep = 1;
      this.recoveryStep = 1;
      this.isOpenOptions = false;
      //this.activityChecked(false);
      //this.walletName('');
      for (let i = 0; i < this.dropDownOption.length; i++) {
        this.dropDownOption[i].isSelected = false;
      }
      this.dropDownOption[0].isSelected = true;
      this.walletName1 = '';
      this.focusInput('newWalletName');
      this.redemtionKey = '';
      this.newWalletStep = 1;
      this.countTimer = 10;
      this.isAgreedRecovery = false;
      this.recoveryStep = 1;
      this.mnemonics = [];
      this.mnemonicField = '';
      this.recoveryMnemonicPhrase = mnGen.list(10);
      this.mnemonicFieldRecovery = '';
      this.mnemonicsRecovery = [];
      this.restorationAgreements.deviceOnly = false;
      this.restorationAgreements.phraseSecure = false;
      this.secretKey = '';
    },
    generateWalletAddress (length) {
      let address = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < length; i++)
        address += possible.charAt(Math.floor(Math.random() * possible.length));
      return address;
    },
    setNewWalletId (id) {
      this.wallet.id = id;
    },
    setNewWalletOwnerId (ownerId) {
      this.wallet.ownerId = parseInt(ownerId);
    },
    setNewWalletAddress (address) {
      this.wallet.address = address;
    },
    setNewWalletName (name) {
      this.wallet.name = name;
    },
    setNewWalletBalance (balance) {
      this.wallet.balance = balance;
    },
    setSecurityLevel (securityLevel) {
      this.wallet.securityLevel = securityLevel;
    },
    setPassword (password) {
      this.wallet.password = password;
    },
    setActivitySummary (activitySummary) {
      this.wallet.activitySummary = activitySummary;
    },
    setActivityPortfolio (activityPortfolio) {
      this.wallet.activityPortfolio = activityPortfolio;
    },
    setOffers (offers) {
      this.wallet.offers = offers;
    },
    setPortfolio (portfolio) {
      this.wallet.portfolio = portfolio;
    },
    eraseNewWallet () {
      this.wallet = {};
      this.walletName1 = '';
    },
    createNewWallet () {
      if (!this.walletName1) {
        switch (this.walletType) {
          case 'new':
            this.focusInput('newWalletName');
            return false;
          case 'redemption':
            this.focusInput('redemptionWalletName');
            return false;
          case 'preico':
            this.focusInput('preicoWalletName');
            return false;
          }
      }
      if (this.walletType === 'redemption' || this.walletType === 'preico') {
        if (!this.redemtionKey) {
          switch (this.walletType) {
            case 'redemption':
              this.focusInput('redemptionKey');
              return false;
            case 'redemption':
              this.focusInput('redemptionPreico');
              return false;
          }
        }
      }
      // this.setNewWalletId(this.getFakeWalletId);
      // this.setNewWalletOwnerId(this.getCurrentUserId);
      // this.setNewWalletAddress(this.generateWalletAddress(42));
      // this.setNewWalletName(this.walletName1);
      // this.setNewWalletBalance(0);
      // this.setSecurityLevel('normal');
      // this.setPassword('');
      // this.setActivitySummary([]);
      // this.setActivityPortfolio([]);
      // this.setOffers([]);
      // this.setPortfolio([]);
      // this.wallet.transactions = [];
      // this.createNewNewWallet(this.wallet);

      // if (this.getUserWallets.length === 1) {
      //   this.$store.state.Wallets.currentWallet = this.getUserWallets[0];
      //   localStorage.setItem('walletId', this.$store.state.Wallets.currentWallet.id);
      // }
      // this.eraseNewWallet();
      // this.closeModal();
      if (!this.secretKey)
        this.$parent.$emit('createNewWallet', this.walletName1)
      else
        this.$parent.$emit('importWallet', {name: this.walletName1, secret: this.secretKey})
    },
    preCreate: function () {
      this.$http.post(`http://localhost:9757/http://127.0.0.1:12348/newWallet`, {
      headers : {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json'
      }
      }).then(response => {
        this.secretKey = response.body.wisSecretKey;
        this.publicKey = response.body.wiPublicKey;
        this.changeStepCreate('next');
      }, response => {
        this.$toasted.show("Server error when creating wallet", {
          duration: 10000,
          type: 'error',
        });
      });
    }
  },
  created() {
    let self = this;
    setTimeout(() => {
      window.onclick = function (e) {
        let t = e.target;
        if (t.className.indexOf('value') == -1 && t.className.indexOf('selected') == -1) {
          let lists = document.getElementsByClassName('list-select');
          for (let i = 0; i < lists.length; i++) {
              lists[i].style.display = 'none';
          }
        }
      }
    }, 5);
  }
}
</script>

<style lang="scss" scoped>

  .input-phrase {
    display: flex !important;
    align-items: flex-start !important;
  }

  .control-checkbox {
    font-size: 14px;
    color: rgba(52, 52, 62, 0.7);
    padding-left: 26px;
    margin-top: 12px;
    width: 100%;

    & span {
      margin-left: 10px;
      display: flex;
    }

    & .control-indicator {
      height: 18px;
      width: 18px;

      &:after {
        top: 1.5px;
        left: 5px;
        width: 5px;
        height: 9px;
        border-width: 0px 1.5px 1.5px 0;
      }
    }
  }

  .phrase {
    background-color: rgba(13, 23, 23, 0.04);
    border-radius: 2px;
    padding: 12px 0;
    text-align: center;
    margin: 24px 42px 42px;

    & span {
      font-family: MuseoSansCyrl700;
      font-size: 14px;
      font-weight: bold;
      color: #34343e;
      user-select: text;
    }
  }

  .modal-warning {
    margin: 0 42px;
    position: relative;
    top: 4px;

    & .agreed {
      font-family: MuseoSansCyrl300;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.29;
      color: #34343e;

      & b {
        font-family: MuseoSansCyrl700;
        font-weight: bold;
      }
    }

    &.agreed-border {
      margin-bottom: 0;
      & .agreed {
        border-bottom: 1px solid #d1d1d1;
        padding-bottom: 18px;
      }
    }

    & .checkbox-contol {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 20px;

      & label {
        margin: 0;
        & input {
          position: absolute;
          z-index: -1;
          opacity: 0;
        }

        .checkbox-indicator {
          width: 18px;
          height: 18px;
          border-radius: 2px;
          background-color: #f7f7f7;
          border: solid 0.5px #979797;
          margin-right: 18px;

          &:after {
            left: 30%;
            top: 1px;
            width: 3px;
            height: 7px;
            border: solid #34343e;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        }
      }

      & label {
        font-family: MuseoSansCyrl300;
        font-size: 14px;
        line-height: 1.29;
        color: #34343e;
      }
    }
  }

  .modal-input {
    margin: 0;

    & input {
      width: 100%;
    }
  }

  .modal-btn {
    & .btn-timer {
      margin-top: 24px;
    }
    & .btn-yellow {
      color: #34343e;
      &.disabled {
        opacity: 0.5;
        border-radius: 2px;
        background-color: #ffd24f;

        &:hover {
          cursor: default;
        }
      }

      &.btn-bottom {
        margin-bottom: 24px;
      }
    }

    & .btn-large {
      padding: 10px 70px 10px 70px;
      font-size: 16px;
      font-family: MuseoSansCyrl500;
    }
  }

  .heading {
    & .title-expand {
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        cursor: pointer;
      }

      & .arrow {
        background-image: url('../../assets/img/expand-arrow.svg');
        width: 11.5px;
        height: 7px;
        background-size: cover;
        opacity: 0.5;
        margin: -2px 0 0 8px;
      }
    }
  }

  .modal-control {
    padding-bottom: 18px;
    border-bottom: 1px solid #d1d1d1;
    margin-right: 42px;
    margin-left: 42px;

    & .badge-control {
      width: 70%;
      display: flex;
      flex-wrap: wrap;

      & .badge {
        border-radius: 2px;
        background-color: rgba(13, 23, 23, 0.08);
        padding: 0 6px;
        font-family: MuseoSansCyrl500;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.29;
        color: #34343e;
        margin: 0 3px;
        margin-bottom: 6px;
      }
    }

    & .modal-input {
      margin: 0;
    }

    &.modal-control-noMargin {
      margin-bottom: 0;
      padding-top: 10px;

      & .modal-input {
        margin: 0 !important;
      }
    }

    & .modal-desc {
      margin-top: 0;

      &.errorText {
        color: red;
      }
    }
  }

  .no-activate {
    border-bottom: none !important;

    & .modal-checkbox {
      margin-bottom: 0 !important;
    }
  }

  $l-r-padding: 18px;
  $t-b-padding: 9px;

  .dropdown-list {
    position: absolute;
    top: 50px;
    min-width: 200px;
    max-width: 250px;
    width: 100%;
    left: 230px;
    height: auto;
    background: #fff;
    opacity: 1;
    outline: none;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.12);
    overflow: hidden;
    transition: opacity 0.25s cubic-bezier(0.39, 0.575, 0.565, 1);
    z-index: 2;

    & ul {
      display: block;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;

      & li {
        display: block;
        list-style: none;
        font-family: MuseoSansCyrl500;
        font-size: 14px;
        color: #1f202a;
        padding: $t-b-padding $l-r-padding;
        cursor: pointer;
        position: relative;

        &:hover {
          background-color: #f0f0f0;
        }

        &.selected {
          &::before {
            content: "";
            position: absolute;
            background: url(../../assets/img/selected-ic.svg);
            background-size: cover;
            width: 11.5px;
            height: 7px;
            top: 13px;
            right: 18px;
            z-index: 1;
            color: #000;
            line-height: 40px;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .v--modal {
    width: 776px !important;
    border-radius: 10px;
    background-color: #fafafa;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.25);
  }
  /*@import './modals.scss'*/
</style>