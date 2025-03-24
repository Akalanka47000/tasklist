import { default as serviceConnector } from '@sliit-foss/service-connector';
import config from '@/config';

const options = {
  baseURL: config.FINNHUB_BASE_URL,
  service: 'Finhub',
  headerIntercepts: () => ({
    'X-Finnhub-Token': config.FINNHUB_API_KEY
  })
};

export const connector = serviceConnector(options);

connector.enableRetry();
