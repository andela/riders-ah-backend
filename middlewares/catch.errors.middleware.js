/**
 * @exports catchErrors
 * @description This chains a catch method to a function and calls the next error handler
 *
 * */

const catchErrors = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};
export default catchErrors;
