class Dep {
  constructor() {
    this.$watchers = new Map();
  }
  add(watcher, id) {
    if (!this.$watchers.has(id)) {
      this.$watchers.set(id, watcher);
    }
  }
  notify() {
    this.$watchers.forEach(watcher => {
      watcher.update();
    });
  }
}

Dep.target = null;
Dep.targetId = "";
module.exports = Dep;
