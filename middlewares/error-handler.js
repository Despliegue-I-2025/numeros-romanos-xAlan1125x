function problemFromError(err, req) {
  const status = err.status || 500;
  const type = err.code ? `/errors/${err.code}` : (err.name ? `/errors/${err.name}` : '/errors/internal');
  return {
    type,
    title: err.message || 'Internal Server Error',
    status,
    detail: err.detail || err.message || undefined,
    instance: req ? req.originalUrl : undefined
  };
}

module.exports = (err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);

  const status = err.status || 500;
  const problem = problemFromError(err, req);

  res.setHeader('Content-Type', 'application/problem+json');
  res.status(status).json(problem);
};
