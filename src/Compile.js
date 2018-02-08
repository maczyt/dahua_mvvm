/**
 * @author maczyt
 */

const prefix = "d";
const Directive = require("./Directive");
const Watcher = require("./Watcher");
const Dep = require("./Dep");
class Compile {
  constructor(vm, root) {
    this.vm = vm;
    this.parseNode(root, true);
  }

  /**
   * parse 元素
   * @param {*} node
   * @param {*} ifRoot
   */
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

  /**
   * 处理文本节点
   * @param {*} node
   */
  parseTextNode(node) {
    const text = node.wholeText;
    const reg = /\{\{(.*?)\}\}/g;
    const exec = reg.exec(text);
    if (exec) {
      const value = exec[1];
      const pipeIndex = value.indexOf("|");
      const exp =
        pipeIndex !== -1 ? value.slice(0, pipeIndex).trim() : value.trim();
      const filters =
        pipeIndex !== -1
          ? value
              .slice(pipeIndex + 1)
              .split("|")
              .map(filter => filter.trim())
          : [];
      const def = Directive["text"];
      def && def.call(Directive, node, this.vm, exp, filters);
    }
  }

  cloneAttribute(attributes) {
    return Array.prototype.map.call(attributes, attr => ({
      name: attr.name,
      value: attr.value
    }));
  }

  /**
   * 处理元素节点
   * 编译指令并添加watcher
   * @param {*} node
   * @param {*} attr
   */
  bindDirective(node, attr) {
    node.removeAttribute(attr.name);
    const name = attr.name;
    const value = attr.value;
    const directive = name.slice(prefix.length + 1);
    const pipeIndex = value.indexOf("|");
    const exp =
      pipeIndex !== -1 ? value.slice(0, pipeIndex).trim() : value.trim();
    const filters =
      pipeIndex !== -1
        ? value
            .slice(pipeIndex + 1)
            .split("|")
            .map(filter => filter.trim())
        : [];
    if (directive.indexOf("on") === 0) {
      const def = Directive["on"];
      def &&
        def.call(
          Directive,
          node,
          this.vm,
          this.vm.$methods[exp],
          directive.slice(2)
        );
    } else {
      const def = Directive[directive];
      def && def.call(Directive, node, this.vm, exp, filters);
    }
  }
}

module.exports = Compile;
