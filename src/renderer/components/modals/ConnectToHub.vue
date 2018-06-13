<template>
  <modal name="connectionmodal" height="auto" class="modal-md" :clickToClose="false">
    <div class="heading">
      <p class="title">Connect to hub</p>
    </div>

    <div class="body body-loader">
      <div class="modal-control text-center noLine">
        <span class="modal-desc">Trying to connect ALE-hub…</span>
      </div>
      <Spinner class="loader" />
    </div>
  </modal>
</template>

<script>
import Spinner from '../layouts/Spinner';

export default {
  name: 'connectToHub',
  components: {
    Spinner
  },
  data() {
    return {
      isLoader: false
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

  .modal-md {
    & .v--modal-box {
      & .body {
        & .modal-control {
          &.noLine {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      }
      & .body-loader {
        margin-bottom: 20px;

        & .loader {
          margin-top: 10px;
        }
      }
    }
  }

  .modal-btn {
    & .btn-large {
      padding: 11px 70px 11px 70px !important;
    }
  }
</style>
