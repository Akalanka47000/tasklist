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
  } else if (err.code === '23505') {
    const key = err.detail.match(/\(([^)]+)\)/)[1];
    const value = err.detail.match(/=\(([^)]+)\)/)[1];
    return res.status(400).json({ message: `The ${key} ${value} is already taken` });
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
