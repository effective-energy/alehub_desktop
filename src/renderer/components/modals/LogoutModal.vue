<template>
	<modal name="confirmlogout" height="auto" class="modal-md">
    <div class="heading">
      <p class="title">Confirm logout</p>
      <i class="close" @click="closeModal"></i>
    </div>
    <div class="body">

      <div class="modal-btn text-center">
        <button class="btn btn-default btn-large" @click="closeModal">Cancel</button>
        <button class="btn btn-yellow btn-large" @click="confirmLogout">Logout</button>
      </div>

    </div>
  </modal>
</template>

<script>
export default {
	name: 'logoutModal',
	methods: {
		closeModal() {
      this.$modal.hide('confirmlogout');
    },
    confirmLogout() {
    	localStorage.removeItem('token');
      this.$router.push('/');
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
    & .v--modal {
      width: 776px !important;
    }
  }

  .nobl {
    border-bottom: none !important;
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
  }

  .lc {
    text-transform: capitalize !important;
  }

  .modal-warning {
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 4px;

    & .agreed {
      font-family: MuseoSansCyrl300;
      font-size: 14px;
      line-height: 1.29;
      color: #34343e;
    }
  }

  .no-activate {
    border-bottom: none !important;

    & .modal-checkbox {
      margin-bottom: 0 !important;
    }
  }
</style>