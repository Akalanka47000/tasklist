import type { NextFunction, Request, Response, Router } from 'express';

export const systemRoutePrefix = '/system';

const defaultOptions = {
  checkFunctions: {
    app: function () {
      return new Promise(function (resolve) {
        resolve({ status: 'ok' });
      });
    }
  },
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    if (process.env.HEALTH_CHECK_ACCESS_TOKEN) {
      if (req.query.token !== process.env.HEALTH_CHECK_ACCESS_TOKEN) {
        return res.status(404).send('');
      }
    }
    next();
  },
  routes: {
    health: `${systemRoutePrefix}/health`,
    readiness: `${systemRoutePrefix}/readiness`,
    liveness: `${systemRoutePrefix}/liveness`
  }
};

export const expressHealth = (options) => {
  options = Object.assign(defaultOptions, options);
  return function (app: Router) {
    app.get(options.routes.health, options.authMiddleware, function (req: Request, res: Response) {
      res.send(options?.service ? `${options.service} - OK` : 'OK');
    });

    function serveReadinessOrLiveness(req: Request, res: Response) {
      const response = {};
      const promises = [];

      const fn = function (key) {
        return function (result) {
          response[`${key}_check`] = result instanceof Error ? result.toString() : result;
        };
      };

      let isError = false;
      for (const key in options.checkFunctions) {
        const f = options.checkFunctions[key];
        if (!f) continue;
        promises.push(
          f(req)
            .then(fn(key))
            .catch((err) => {
              isError = true;
              fn(key)(err);
            })
        );
      }

      Promise.all(promises)
        .then(function () {
          res.status(isError ? 500 : 200).json(response);
        })
        .catch(function () {
          res.status(500).json(response);
        });
    }

    app.get(options.routes.readiness, options.authMiddleware, serveReadinessOrLiveness);

    app.get(options.routes.liveness, options.authMiddleware, serveReadinessOrLiveness);

    return function (req: Request, res: Response, next: NextFunction) {
      next();
    };
  };
};

export default expressHealth;
