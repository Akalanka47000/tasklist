import Polyglot from 'node-polyglot';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      /** Part of the apicache library. Used to group cache keys */
      apicacheGroup?: any;
    }

    interface Response {
      polyglot: Polyglot;
    }
  }

  export interface QueryOptions {
    filter?: Record<string, any>;
    sort?: Record<string, any>;
    page?: number;
    limit?: number;
    include?: string[];
  }
}

export {};
