import { NextFunction, Request, Response } from 'express';
import { moduleLogger } from '@sliit-foss/module-logger';
import { isZelebrateError } from '@sliit-foss/zelebrate';

const logger = moduleLogger('Error-handler');

/**
 * @description Middleware function used to handle errors in the application. It logs the error and sends a response to the client. It also handles the localization of the error message.
 * @returns void
 * @example
 * app.use(errorHandler);
 */
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
export const errorHandler = (err, _req: Request, res: Response, next: NextFunction) => {
  if (isZelebrateError(err)) {
    for (const zodErr of err.details.values()) {
      err.message = zodErr.pretty();
      break;
    }
  } else if ((err.name === 'MongoServerError' || err.name === 'MongoBulkWriteError') && err.code === 11000) {
    if (err.name === 'MongoBulkWriteError') {
      err.status = 400;
      err.message = `A resource that you're trying to create already exists on the server`;
    } else {
      const key = Object.keys(err.keyValue)[0];
      err.status = 400;
      err.message = `The ${key} ${!err.hexEncoded ? err.keyValue[key] : 'you entered'} is already taken`;
    }
  } else if (err.name === 'VersionError') {
    err.status = 409;
    err.message = `The resource you are trying to update has been modified in the background. Please refresh and try again`;
  }
  if (!res.errorLogged) {
    logger.error(err.message, err);
    res.errorLogged = true;
  }
  err.status ??= 500;
  err.message =
    !err.message || err.status === 500 ? "Just patching things up. This'll be over in a jiffy" : err.message;
  if (res.polyglot) err.message = res.polyglot.t(err.message);
  return res.status(err.status).json({
    message: err.message
  });
};
