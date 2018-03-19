<template>
  <div class="trading">

    <Navbar
      :title="'Trading'"
      :isNavigate="true"
      :isBalance="true"
      :rightMenu="rightMenu"
      :isBack="true"
    />

    <section class="main">
      <div class="content nomenu">
        <div class="container">
          <div class="row">

            <div class="col-6">

              <Panel-heading :title="'Buy Alc'" :isTop="true" :isSmall="true" :smallTitle="'2,000 usd available'" />

              <div class="panel">

                <div class="panel-group">
                  <div class="input-label">
                    <label>Amount</label>
                  </div>
                  <Input-group
                    :btnValue="'Max'"
                    :addonValue="'ALC'"
                    :isBtn="true"
                    :isInput="true"
                    :inputValue="10000"
                  />
                </div>

                <div class="panel-group">
                  <div class="input-label">
                    <label>Price</label>
                  </div>
                  <Input-group
                    :isDropDown="true"
                    :addonValue="'ALC'"
                    :isInput="true"
                    :inputValue="0.00012"
                    :dropDownValue="'Bid'"
                  />
                </div>

                <div class="panel-group">
                  <div class="input-label">
                    <label>Type</label>
                  </div>
                  <Input-group
                    :isDropDown="true"
                    :isInput="false"
                    :dropDownValue="'Conditional'"
                  />
                </div>

                <div class="panel-group">
                  <div class="input-label">
                    <label>Buy when</label>
                  </div>
                  <Input-group
                    :isDropDown="true"
                    :addonValue="'USD'"
                    :isInput="true"
                    :inputValue="0.00012"
                    :dropDownValue="'<='"
                  />
                </div>

                <div class="panel-group">
                  <div class="input-label">
                    <label>Total</label>
                  </div>
                  <Input-group
                    :addonValue="'USD'"
                    :isInput="true"
                    :inputValue="1.2"
                  />
                </div>

                <div class="text-center">
                  <button class="btn btn-yellow btn-send">Buy</button>
                </div>

              </div>
            </div>

            <div class="col-6">
              <Panel-heading :title="'Sell Alc'" :isTop="true" :isSmall="true" :smallTitle="'6,000,000 ALC available'" />
              <div class="panel">

                <div class="panel-group">
                  <div class="input-label">
                    <label>Amount</label>
                  </div>
                  <Input-group
                    :btnValue="'Max'"
                    :addonValue="'ALC'"
                    :isBtn="true"
                    :isInput="true"
                    :inputValue="10000"
                  />
                </div>

                <div class="panel-group">
                  <div class="input-label">
                    <label>Price</label>
                  </div>
                  <Input-group
                    :isDropDown="true"
                    :addonValue="'USD'"
                    :isInput="true"
                    :inputValue="0.00012"
                    :dropDownValue="'Ask'"
                  />
                </div>

                <div class="panel-group">
                  <div class="input-label">
                    <label>Type</label>
                  </div>
                  <Input-group
                    :isDropDown="true"
                    :isInput="false"
                    :dropDownValue="'Limit'"
                  />
                </div>

                <div class="panel-group">
                  <div class="input-label">
                    <label>Total</label>
                  </div>
                  <Input-group
                    :addonValue="'USD'"
                    :isInput="true"
                    :inputValue="1.3"
                  />
                </div>

                <div class="text-center">
                  <button class="btn btn-yellow btn-send">Sell</button>
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
import WalletsList from './layouts/WalletsList';
import InputGroup from './layouts/forms/InputGroup';
import PanelHeading from './layouts/PanelHeading';

export default {
  name: 'trading',
  components: {
    Navbar,
    WalletsList,
    InputGroup,
    PanelHeading
  },
  data() {
    return {
      rightMenu: {
        horizontal: false,
        list: [{
          type: "link",
          name: "Summary",
          link: "/wallet"
        }, {
          type: "modal",
          name: "Send",
          target: "send"
        }, {
          type: "modal",
          name: "Request",
          target: "recive"
        }, {
          type: "link",
          name: "Transactions",
          link: "/wallet/transactions"
        }, {
          type: "link",
          name: "Trading",
          link: "/wallet/trading"
        }, {
          type: "link",
          name: "Wallet settings",
          link: "/wallet/settings"
        }]
      }
    }
  }
}
</script>
