import { NextFunction, Request, Response } from 'express';
import { default as context } from 'express-http-context';
import { headers } from '@shared/constants';
import { default as logger } from '@sliit-foss/http-logger';
import { omit, pick } from 'lodash';

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  return logger({
    loggable: ({ headers: hdrs, body: payload }) => ({
      headers: pick(hdrs, [headers.userId, headers.userEmail, headers.userAgent, headers.origin]),
      payload: omit(payload, ['password', 'new_password', 'old_password'])
    }),
    onFinish: () => {
      context.ns.disable();
    }
  })(req, res, next);
};

export default httpLogger;
