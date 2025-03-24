import { AggregatePaginateResult } from 'mongoose';
import '@sliit-foss/mongoose-aggregate-paginate-v2';

declare global {
  type IPaginatedResponseData<T> = AggregatePaginateResult<T>;
  interface IAPIResponse<T> {
    data: T | T[] | any;
    message: string;
  }
  interface IPaginatedAPIResponse<T> {
    data: IPaginatedResponseData<T>;
    message: string;
  }
}

export {};
