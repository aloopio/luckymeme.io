// Create connection
const { createApp } = Vue;
createApp({
  data() {
    return {
      contract: {
        bsc: '0x8C5cDFD7F6aCEe315D7F5C2d7ed31cBBB62A81cd',
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
        minHoldingBalance: '10,000',
        minHolders: 10,
        buyTax: 5,
        sellTax: 0,
        receivedTax: 10
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
    }
  },

  mounted() {
    this.$el.parentNode.classList.remove("hidden");
    this.setTime();
  },
}).mount("#app");
