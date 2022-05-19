function asyncWrapper(fn) {
  return async function (req, res, next) {
    try {
      return await fn(req, res, next);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}

module.exports = asyncWrapper;
