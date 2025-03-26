import { default as crypto } from 'crypto';
import { default as fs } from 'fs';
import { default as express, NextFunction, Request, Response } from 'express';
import { default as context } from 'express-http-context';
import { ctxCorrelationId, headers } from '@shared/constants';
import { default as stack } from 'callsite';
import { default as compression } from 'compression';
import { default as cookieParser } from 'cookie-parser';
import { default as cors } from 'cors';
import { default as helmet } from 'helmet';
import { default as polyglot } from 'node-polyglot';
import { default as config } from '@/config';
import * as database from '@/database/mongo';
import { locales } from '@/locales';
import { errorHandler, expressHealth, httpLogger, rateLimiter, responseInterceptor, sentinel } from '@/middleware';

database.connect();

export const service = 'Todo Service';

export const app = express();

export const router = express.Router();

app.use(helmet());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression());

app.use(
  cors({
    origin: config.FRONTEND_BASE_URL,
    credentials: true
  })
);

app.use(context.middleware as any);

app.use((req: Request, _res: Response, next: NextFunction) => {
  context.set(ctxCorrelationId, req.headers[headers.correlationId] ?? crypto.randomBytes(16).toString('hex'));
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const locale = req.headers['accept-language'] ?? 'en';
  res.polyglot = new polyglot({
    allowMissing: true,
    onMissingKey: (key) => key
  });
  res.polyglot.extend(locales[locale]);
  context.set('locale', locale);
  context.set('translate', res.polyglot.t);
  next();
});

expressHealth({
  service,
  checkFunctions: {
    database: () => database.ping()
  }
})(router);

const routes = express.Router();

/* Automatically discovers and mounts all routes from the modules directory */
const root = stack()
  .find((site) => {
    const fileName = site.getFileName();
    return fileName.endsWith('app.ts') || fileName.endsWith('app.js');
  })
  ?.getFileName()
  ?.replace(/[\\/](app)\.(ts|js)$/, '');
fs.readdirSync(`${root}/modules`)?.forEach((module) => {
  if (module.startsWith('_')) return; // Ignore private routes
  fs.readdirSync(`${root}/modules/${module}/api`)?.forEach((v) => {
    routes.use(`/${v}/${module}`, require(`${root}/modules/${module}/api/${v}/controller`).default);
  });
});
/* End of route discovery */

router.use(['/api', '/'], rateLimiter, httpLogger, sentinel, routes);

app.use(responseInterceptor);

app.use('/', router);

app.all('*', (_req, res) => {
  res.status(404).send();
});

app.use(errorHandler);
