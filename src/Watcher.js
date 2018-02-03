const uuidv1 = require("uuid/v1");
const Dep = require("./Dep");

class Watcher {
  constructor(node, vm, exp, cb) {
    this.node = node;
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.targetId = uuidv1();
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
    Dep.targetId = this.targetId;
    const value = this.vm[this.exp];
    Dep.target = null;
    Dep.targetId = "";
    return value;
  }
}

module.exports = Watcher;
