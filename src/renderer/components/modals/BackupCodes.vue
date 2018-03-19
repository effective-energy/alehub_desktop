<template>
  <modal name="bcodes" height="auto" class="modal-xs">
    <div class="heading">
      <p class="title">BACKUP CODES</p>
      <i class="close" @click="closeModal"></i>
    </div>
    <div class="body">

      <div class="modal-control text-center">
        <span class="modal-desc">Make sure you have saved this codes somewhere.</span>
      </div>

      <div class="text-center">
        <div class="codes-list">
          <p v-for="code in codes" :class="{canceled: code.used}">{{ code.code }}</p>
        </div>
      </div>

      <div class="modal-btn text-center">
        <button class="btn btn-yellow btn-large" @click="generateNewCodes">
          Generate new
        </button>
      </div>

    </div>
  </modal>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'backupCodes',
  props: {
    codes: {
      type: Array,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$modal.hide('bcodes');
    },
    generateNewCodes () {
      this.$parent.$emit('generateNewCodes');
    }
  }
}
</script>

<style lang="scss">
  @import './modals.scss';

  .modal-input {
    & input {
      width: 100%;
    }
  }

  .modal-xs {
    & .v--modal-box {
      width: 426px !important;
    }
  }

  .modal-btn {
    & .btn-yellow {
      &.disabled {
        opacity: 0.3;
      	border-radius: 2px;
      	background-color: #ffd24f;

        &:hover {
          cursor: default;
        }
      }
    }
    & .btn-large {
      padding: 11px 70px 11px 70px !important;
    }
  }
</style>
