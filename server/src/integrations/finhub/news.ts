import { connector } from './core';

interface IFinhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export const getNews = (category, v = 'v1'): Promise<IFinhubNews[]> => {
  return connector.get(`/api/${v}/news?category=${category}`).then(connector.resolve);
};
