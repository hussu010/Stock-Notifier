import { ErrorRequestHandler } from 'express';

import winston from '../config/winston';

const errorLogger: ErrorRequestHandler = (err, req, res, next) => {
  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  // Continue to the next middleware or route handler
  next(err);
};

const errorResponder: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || 500;
  // Send the error response
  res.status(status).json({ message: err.message });

  // Continue to the next middleware or router handler
  next();
};

export { errorLogger, errorResponder };
