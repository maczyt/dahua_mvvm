const Observer = require("./Observer");
const Compile = require("./Compile");

class Dahua {
  constructor(opts) {
    this.$el = document.querySelector(opts.el);
    this.$data = opts.data;
    this.proxy();
    this.init();
  }
  init() {
    this.observe();
    this.compile();
  }
  proxy() {
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return this.$data[key];
        },
        set(newVal) {
          this.$data[key] = newVal;
        }
      });
    });
  }

  observe() {
    this.$observer = new Observer(this.$data);
  }

  compile() {
    this.$compile = new Compile(this, this.$el);
  }
}

window.Dahua = Dahua;
