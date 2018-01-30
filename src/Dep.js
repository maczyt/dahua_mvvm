class Dep {
  constructor() {
    this.$watchers = [];
  }
  add(watcher) {
    this.$watchers.push(watcher);
  }
  notify() {
    this.$watchers.forEach(watcher => {
      watcher.update();
    });
  }
}

Dep.target = null;
module.exports = Dep;
