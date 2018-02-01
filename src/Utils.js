module.exports = {
  compose(...fns) {
    return (...args) => {
      return fns.reduce((args, fn) => {
        return fn(...[].concat(args));
      }, [].concat(args));
    };
  },
  curry(fn, arity = fn.length, ...args) {
    return arity <= args.length
      ? fn(...args)
      : this.curry.bind(fn, arity, ...args);
  }
};
