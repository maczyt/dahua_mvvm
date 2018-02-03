const Dep = require("./Dep");

class Observer {
  constructor(data) {
    observe(data);
  }
}

module.exports = Observer;

/**
 * 监听data
 * @param {*} data
 */
function observe(data) {
  if (!data || typeof data !== "object") return;
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key]);
  });
}

/**
 * 监听key
 * @param {*} data
 * @param {*} key
 * @param {*} val
 */
function defineReactive(data, key, val) {
  const dep = new Dep();
  observe(val);

  Object.defineProperty(data, key, {
    enumerable: true,
    get() {
      Dep.target && dep.add(Dep.target, Dep.targetId);
      return val;
    },
    set(newVal) {
      val = newVal;
      dep.notify();
    }
  });
}
