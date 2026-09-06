/**
 * asyncHandler
 * ------------
 * Wraps an async controller so rejected promises are forwarded
 * to Express error middleware instead of becoming unhandled
 * promise rejections.
 *
 * Usage: router.get("/", asyncHandler(controller.getUsers));
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
