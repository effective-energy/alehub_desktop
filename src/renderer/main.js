import Vue from 'vue';
import highcharts from 'highcharts';

import App from './App'
import router from './router'
import store from './store'
import VueHighcharts from 'vue-highcharts';
import VeeValidate from 'vee-validate';
import VModal from 'vue-js-modal';
import VueQriously from 'vue-qriously';
import VueNumeric from 'vue-numeric';
import VueClipboard from 'vue-clipboard2';
import VueTheMask from 'vue-the-mask';
import VueI18n from 'vue-i18n';
import Toasted from 'vue-toasted';
import VueResource from 'vue-resource';
import cors_proxy from 'cors-anywhere';
import lodash from 'lodash';


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

const NotifOptions = {
  position: 'bottom-center',
  fullWidth: true,
  singleton: true,
  containerClass: 'notifPanel',
  fitToScreen: true,
  closeOnSwipe: false
}

Vue.use(VueHighcharts);
Vue.use(VeeValidate);
Vue.use(VModal);
Vue.use(VueQriously);
Vue.use(VueNumeric);
Vue.use(VueClipboard);
Vue.use(VueTheMask);
Vue.use(VueI18n);
Vue.use(Toasted, NotifOptions);
Vue.use(VueResource);

import messages from './i18n.js';

let systemLang = '';
if(localStorage.getItem('systemLang') === null) systemLang = 'eng';
else systemLang = localStorage.getItem('systemLang');

const i18n = new VueI18n({
  locale: systemLang,
  messages
});

// var host = process.env.HOST || 'localhost';
// var port = process.env.PORT || 8080;
// cors_proxy.createServer({
//   originWhitelist: [], // Allow all origins
//   requireHeader: ['origin', 'x-requested-with'],
//   removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//   console.log('Running CORS Anywhere on ' + host + ':' + port);
// });


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
