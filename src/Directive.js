const Watcher = require("./Watcher");
const Filters = require("./Filter");
const Utils = require("./Utils");

const Directive = {
  text(node, vm, exp, filters) {
    this.bind(node, vm, exp, "text", filters);
  },
  show(node, vm, exp) {
    this.bind(node, vm, exp, "show");
  },
  bind(node, vm, exp, prefix, filters = []) {
    filters = filters.map(fn => {
      if (Filters[fn]) {
        return Filters[fn];
      }
    });
    let value = vm[exp];
    if (filters.length > 0) {
      value = Utils.compose(...filters)(value);
    }
    const updater = Updater[prefix];
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

const Updater = {
  text(node, val) {
    node.textContent = val;
  },
  show(node, val) {
    node.style.display = val ? "" : "none";
  }
};
