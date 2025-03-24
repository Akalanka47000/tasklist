import { moduleLogger } from '@sliit-foss/module-logger';
import { isCelebrateError } from 'celebrate';

const logger = moduleLogger('Error-handler');

/**
 * @description Middleware function used to handle errors in the application. It logs the error and sends a response to the client. It also handles the localization of the error message.
 * @returns void
 * @example
 * app.use(errorHandler);
 */
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
export const errorHandler = (err, _req, res, next) => {
  if (isCelebrateError(err)) {
    for (const [, value] of err.details.entries() as any) {
      const message = value.details[0].message;
      if (!res.errorLogged) logger.error(err.message, { details: message });
      return res.status(422).json({ message });
    }
  } else if ((err.name === 'MongoServerError' || err.name === 'MongoBulkWriteError') && err.code === 11000) {
    if (err.name === 'MongoBulkWriteError') {
      return res.status(400).json({ message: `A resource that you're trying to create already exists on the server` });
    }
    const key = Object.keys(err.keyValue)[0];
    return res
      .status(400)
      .json({ message: `The ${key} ${!err.hexEncoded ? err.keyValue[key] : 'you entered'} is already taken` });
  } else if (err.name === 'VersionError') {
    return res.status(409).json({
      message: 'The resource you are trying to update has been modified in the background. Please refresh and try again'
    });
  } else {
    if (!res.errorLogged) logger.error(err.message, err);
  }
  res.errorLogged = true;
  err.status ??= 500;
  err.message =
    !err.message || err.status === 500 ? "Just patching things up. This'll be over in a jiffy" : err.message;
  if (res.polyglot) err.message = res.polyglot.t(err.message);
  return res.status(err.status).json({
    message: err.message
  });
};
