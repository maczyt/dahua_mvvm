const string = {
  upperCase(val) {
    return val.toUpperCase();
  },
  reverse(val) {
    return val
      .split("")
      .reverse()
      .join("");
  },
  trim(val) {
    return val.trim();
  }
};

const boolean = {
  isNull(val) {
    return !val && typeof val === "object";
  },
  isString(val) {
    return typeof val === "string";
  }
};

module.exports = Object.assign({}, string);
