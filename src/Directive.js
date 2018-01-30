const Watcher = require("./Watcher");
const Filters = require("./Filter");
const Utils = require("./Utils");

const Directive = {
  text(node, vm, exp, filters) {
    this.bind(node, vm, exp, filters);
  },
  bind(node, vm, exp, filters) {
    filters = filters.map(fn => {
      if (Filters[fn]) {
        return Filters[fn];
      }
    });
    let value = vm[exp];
    if (filters.length > 0) {
      value = Utils.compose(...filters)(value);
    }
    // initial view
    updater(node, value);
    new Watcher(node, vm, exp, val => {
      if (filters.length > 0) {
        updater(node, Utils.compose(...filters)(val));
      } else {
        updater(node, val);
      }
    });
  }
};

module.exports = Directive;

function updater(node, val) {
  node.textContent = val;
}
