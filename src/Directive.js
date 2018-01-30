const Watcher = require("./Watcher");

const Directive = {
  text(node, vm, exp) {
    this.bind(node, vm, exp);
  },
  bind(node, vm, exp) {
    // initial view
    updater(node, vm[exp]);
    new Watcher(node, vm, exp, val => {
      updater(node, val);
    });
  }
};

module.exports = Directive;

function updater(node, val) {
  node.textContent = val;
}
