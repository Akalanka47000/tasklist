import os from 'os';
import { Response } from 'express';
import context from 'express-http-context';
import { headers } from '@shared/constants';

/**
 * @description Middleware function used to add the hostname and correlation id to the response headers
 * @returns void
 * @example
 * app.use(responseInterceptor);
 */
export const responseInterceptor = (_req, res, next) => {
  if (res.headersSent) return;
  res.set(headers.hostName, os.hostname());
  res.set(headers.correlationId, context.get('correlationId'));
  next();
};

/**
 * @description This function is used to send a success response in a standardardized format. It also handles localization of messages.
 * @param res - The express response object
 * @param status - The status code of the response. Defaults to 200
 * @param data - The data to be sent in the response if any
 * @param message - The message to be sent in the response
 * @returns void
 * @example
 * toSuccess({ res, data: { user }, message: 'User created successfully' });
 */
export const toSuccess = ({
  res,
  status = 200,
  data,
  message
}: {
  res: Response;
  status?: number;
  data?: any;
  message: string;
}) => {
  if (res.polyglot) message = res.polyglot.t(message);
  const responseData = { data, message };
  if (!data) delete responseData.data;
  res.status(status).json(responseData);
  res.headersSent = true;
  return;
};
