module.exports = {
  compose(...fns) {
    return (...args) => {
      return fns.reduce((args, fn) => {
        return fn(...[].concat(args));
      }, [].concat(args));
    };
  }
};
