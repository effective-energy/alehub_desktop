<template>
  <modal name="rating" height="auto" class="modal-md">
    <div class="heading">
      <p class="title">Rate employer/contractor</p>
      <i class="close" @click="closeModal"></i>
    </div>
    <div class="body">
      <div class="modal-control text-center noLine">
        <span class="modal-desc">Task Telegram Haskell Bot was completed. Now please rate the employer/contractor.</span>
      </div>
      <div class="modal-rating">
        <div class="star" v-for="(star, starIndex) in starsCount" :class="{ 'active': starIndex <= activeStarCount}" @click="setStarCount(starIndex)"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="buttons btn-yellow openModal">Rate</button>
    </div>
  </modal>
</template>

<script>
import numeral from 'numeral';

export default {
  name: "rating",
  data () {
    return {
      starsCount: 10,
      activeStarCount: 10
    }
  },
  methods: {
    closeModal: function() {
      this.$modal.hide('rating');
    },
    setStarCount (count) {
      this.activeStarCount = count;
    }
  }
}
</script>

<style scoped lang="scss">
  .heading {
    margin-bottom: 42px;
  }

  .modal-rating {
    display: flex;
    justify-content: center;
    margin-top: 42px;

    & .star {
      width: 44px;
      height: 44px;
      background-image: url('../../assets/img/star-empty.svg');
      background-size: cover;

      &:not(:last-child) {
        margin-right: 3px;
      }

      &:hover {
        background-image: url('../../assets/img/star-filled.svg');
        cursor: pointer;
      }

      &.active {
        width: 44px;
        height: 44px;
        background-image: url('../../assets/img/star-filled.svg');
        background-size: cover;
      }
    }
  }

  .modal-footer {
    margin-bottom: 20px;
  }
</style>