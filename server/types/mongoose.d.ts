declare module 'mongoose' {
  export interface ExtendedPaginateModel<T> extends PaginateModel<T>, AggregatePaginateModel<T> {
    aggregateUtils: {
      /**
       * @description This function is used to transform a mongoose select string into a projection stage which can be used in an aggregate pipeline
       * @example
       * User.aggregate([
       *  User.aggregateUtils.select(select)
       * ])
       **/
      select: (select?: string) => PipelineStage;
      /**
       * @description This function is used to transform a mongoose include string into a series of lookup stages which can be used in an aggregate pipeline
       * @example
       * User.aggregate([
       *  ...User.aggregateUtils.include(include)
       * ])
       */
      include: (include?: string[]) => PipelineStage[];
      /**
       * @description Combines the select and include functions into a single function
       * @example
       * User.aggregate([
       *  ...User.aggregateUtils.selectAndInclude(select, include)
       * ])
       */
      selectAndInclude: (select?: string, include?: string[]) => PipelineStage[];
      /**
       * @description This function is used to transform a mongoose match object into a match stage which can be used in an aggregate pipeline
       * @example
       * User.aggregate([
       *  User.aggregateUtils.match(match)
       * ])
       */
      match: (match?: Record<string, any>) => PipelineStage;
      /**
       * @description This function is used to transform a key value pair into a sort stage which can be used in an aggregate pipeline
       * @example
       * User.aggregate([
       *  User.aggregateUtils.sort(match)
       * ])
       */
      sort: (sort?: Record<string, any>) => PipelineStage;
      /**
       * @description This function is used to transform a mongoose retrieval options object into a series of aggregate pipeline stages which simplify the process of retrieving data from the database
       * @example
       * User.aggregate(User.aggregateUtils.retrieve(options))
       */
      retrieve: (options: RetrievalOptions, sort?: boolean) => PipelineStage[];
    };
  }

  export interface RetrievalOptions {
    filter?: Record<string, any>;
    /** Runs after any inclusions */
    secondaryFilter?: Record<string, any>;
    sort?: Record<string, any>;
    page?: number;
    limit?: number;
    select?: string;
    include?: string[];
    prepaginate?: boolean;
  }

  export type ModelDocument<T> = Omit<Document, '_id'> & T;

  export function paginatedModel<T>(
    name: string,
    schema: Schema,
    syncIndexes?: boolean
  ): ExtendedPaginateModel<ModelDocument<T>>;
}

export {};
