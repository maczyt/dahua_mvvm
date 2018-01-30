const Dep = require("./Dep");

class Watcher {
  constructor(node, vm, exp, cb) {
    this.node = node;
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
  }
  update() {
    this.run();
  }
  run() {
    const value = this.get();
    this.cb.call(this.vm, value);
  }
  get() {
    Dep.target = this;
    const value = this.vm[this.exp];
    Dep.target = null;
    return value;
  }
}

module.exports = Watcher;
