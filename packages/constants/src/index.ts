export * from './enums';
export * from './patterns';

export const headers = {
  authorization: 'authorization',
  userAgent: 'user-agent',
  origin: 'origin',
  cookie: 'cookie',
  userId: 'x-user-id',
  userEmail: 'x-user-email',
  correlationId: 'x-correlation-id',
  hostName: 'x-host-name',
  serviceRequestKey: 'x-service-request-key'
};

export const ctxHeaders = 'headers';
export const ctxAuthorizerError = 'authorizerError';
export const ctxCorrelationId = 'correlationId';
export const ctxUser = 'user';
