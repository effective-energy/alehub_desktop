<template>
  <div class="panel">
    <div class="panel-heading">
      <h3>{{ parseBalance(walletBalance) }} ALC</h3>
      <span class="parse-usd">{{ parseBalance(walletBalance / 2) }}</span>
      <select-control
        :current="'USD'"
        :allOptions="['USD', 'BTC', 'ETH']"
        :id="'changeCurrency'"
        @onselect="newSelect"
        :typeSelect="'curency'"
      />
    </div>
    <div class="panel-graphs">
      <div class="data">
        <highcharts
                style="height: 250px;width:100%;"
                :options="options"
                ref="highcharts"
        />
      </div>
      <div class="period">
        <a
          v-for="(period, index) in periods"
          :key="period.type"
          :class="{ 'active': activePeriod == period.type }"
          @click="setPeriod(period.type)"
        >
          {{ period.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral';
import SelectControl from '../layouts/forms/Select';

export default {
  name: 'chartsPanel',
  components: {
    SelectControl
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    walletBalance: [String, Number],
    activePeriod: String,
    periods: Array
  },
  data() {
    return {
      selectedType: 'USD'
    }
  },
  methods: {
    parseBalance(balance) {
      return numeral(balance).format('0,0');
    },
    setPeriod(type) {
      this.$parent.$emit('setPeriod', type);
    },
    newSelect(value, id) {
      if (id == "changeCurrency") {
        this.selectedType = value
      }
    }
  }
}
</script>

<style scoped>
  .period a:hover {
    cursor: pointer;
  }

  .panel-heading {
    display: flex;
    align-items: center;
  }

  .panel-heading h3 {
    margin-bottom: 0;
  }

  .panel-heading span {
    font-family: MuseoSansCyrl300;
  	font-size: 14px;
  	font-weight: 300;
  	line-height: 1.14;
  	color: #34343e;
  }
</style>
