"use strict";

module.exports = (err, req, res, next) => {
  const errorStatusCode = res.errorStatusCode ?? 500;

  const data = {
    error: true,
    message: err.message,
    cause: err.cause,
    body: req.body,
  };

  if (req.url.startsWith("/api")) {
    res.status(errorStatusCode).send(data);
  } else {
    res.render("error", { data });
  }
};
