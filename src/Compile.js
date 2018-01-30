const prefix = "d";
const Directive = require("./Directive");
const Watcher = require("./Watcher");
const Dep = require("./Dep");
class Compile {
  constructor(vm, root) {
    this.vm = vm;
    this.parseNode(root, true);
  }

  parseNode(node, ifRoot) {
    const self = this;
    if (node.nodeType === 3) {
      return this.parseTextNode(node);
    }
    if (!ifRoot) {
      this.cloneAttribute(node.attributes).forEach(attr => {
        if (RegExp(`^${prefix}-`).test(attr.name)) {
          self.bindDirective(node, attr);
        }
      });
    }
    Array.prototype.forEach.call(node.childNodes, el => {
      self.parseNode(el);
    });
  }

  parseTextNode(node) {
    const text = node.wholeText;
    const reg = /\{\{(.*?)\}\}/g;
    const exec = reg.exec(text);
    if (exec) {
      const exp = exec[1];
      const def = Directive["text"];
      def && def.call(Directive, node, this.vm, exp);
    }
  }

  cloneAttribute(attributes) {
    return Array.prototype.map.call(attributes, attr => ({
      name: attr.name,
      value: attr.value
    }));
  }

  bindDirective(node, attr) {
    const name = attr.name;
    const value = attr.value;
    const directive = name.slice(prefix.length + 1);
    const pipeIndex = value.indexOf("|");
    const exp =
      pipeIndex !== -1 ? value.slice(0, pipeIndex).trim() : value.trim();
    const filters =
      pipeIndex !== -1
        ? value
            .slice(pipeIndex)
            .split("|")
            .map(filter => filter.trim())
        : [];
    const def = Directive[directive];
    def && def.call(Directive, node, this.vm, exp);
  }
}

module.exports = Compile;
