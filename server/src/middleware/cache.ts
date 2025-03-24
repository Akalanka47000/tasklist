import type { Request, Response } from 'express';
import apicache from 'apicache';

export { apicache as cache };

export const cacheSuccess = (duration: string) =>
  apicache.middleware(duration, (_: Request, res: Response) => res.statusCode === 200);
