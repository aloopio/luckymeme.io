// Create connection
const { createApp } = Vue;
createApp({
  data() {
    return {
      contract: {
        bsc: '0xBE200967a508eB8195C0B968466A0d404120955c',
        eth: 'Coming soon',
        arb: 'Coming soon',
      },
      tab: 'bsc',
      isDuring: false,
      time: {
        h: 0,
        m: 0,
        s: 0
      },
      token: {
        decimals: 8,
        rewardMinHoldingBalance: '10,000',
        rewardMinHoldersToGenerate: 10,
        buyTax: 5,
        sellTax: 0,
        rewardTax: 10,
        totalRewardHolders: 0,
        rewardBalance: 0
      }
    };
  },

  methods: {
    calcTime(diff){
      if (diff <= 0) {
        this.isDuring = true;
        this.time.h = '00';
        this.time.m = '00';
        this.time.s = '00';
      } else {
        this.isDuring = false;
        let c = diff % 3600;
        this.time.h = (diff - c) / 3600;
        this.time.s = parseInt(c % 60);
        this.time.m = parseInt((c - this.time.s) / 60);

        if (this.time.h < 10) this.time.h = '0' + this.time.h;
        if (this.time.m < 10) this.time.m = '0' + this.time.m;
        if (this.time.s < 10) this.time.s = '0' + this.time.s;
      }
      window.setTimeout(() => {
        this.calcTime(diff - 1);
      }, 1000);
    },

    setTime(){
      let current = new Date().getTime();
      let xoso = new Date();
      xoso.setHours(17);
      xoso.setMinutes(0);
      xoso.setSeconds(0);
      xoso.setMilliseconds(0);
      let diff = xoso.getTime() - current;

      if (diff < 0 && (diff + 30 * 60000) < 0) {
        xoso.setDate(xoso.getDate() + 1);
        diff = xoso.getTime() - current;
      }

      this.calcTime(diff / 1000);
    },

    getTokenInfo(){
      const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
      const token = new web3.eth.Contract(contractABI, this.contract.bsc);
      token.methods.decimals().call().then((data) => {
        this.token.decimals = data;
        
        token.methods.rewardBalance().call().then((data) => {
          data = data.toString();
          data = data.slice(0, -1 * this.token.decimals);
          this.token.rewardBalance = data ? data.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
        });

        token.methods.buyTax().call().then((data) => {
          this.token.buyTax = data;
        });

        token.methods.rewardTax().call().then((data) => {
          this.token.rewardTax = data;
        });

        token.methods.rewardMinHoldingBalance().call().then((data) => {
          data = data.toString();
          data = data.slice(0, -1 * this.token.decimals);
          this.token.rewardMinHoldingBalance = data ? data.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
        });

        token.methods.rewardMinHoldersToGenerate().call().then((data) => {
          data = data.toString();
          this.token.rewardMinHoldersToGenerate = data.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
      });
    }
  },

  mounted() {
    this.$el.parentNode.classList.remove("hidden");
    this.setTime();
    this.getTokenInfo();
  },
}).mount("#app");
