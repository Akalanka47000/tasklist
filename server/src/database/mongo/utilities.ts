import { PREPAGINATION_PLACEHOLDER } from '@sliit-foss/mongoose-aggregate-paginate-v2';
import { compact } from 'lodash';
import { ModelDocument, default as mongoose, PipelineStage } from 'mongoose';

/**
 * @description This function registers a couple of powerful utilities on a mongoose model
 **/
export const registerUtilities = <T>(model: mongoose.ExtendedPaginateModel<ModelDocument<T>>) => {
  model.aggregateUtils = {
    select(select?: string): PipelineStage {
      if (!select) return undefined;
      return {
        $project: select
          ?.split(' ')
          .reduce((acc, curr) => ({ ...acc, [curr.replace('-', '')]: !curr.startsWith('-') ? 1 : 0 }), {})
      };
    },
    include(include?: string[]): PipelineStage[] {
      const nonArrayFields = [];
      const stages =
        include?.reduce((acc, curr) => {
          let collection: string | undefined;
          const targets = curr.split('->');
          let localField = targets[0];
          // eslint-disable-next-line prefer-const
          [localField, collection] = localField.split('<-');
          const subInclude = targets[1]?.replace(/\(|\)/g, '')?.split(',');
          const field = model.schema.path(localField);
          const collectionName =
            field?.options?.collection ??
            field?.options?.type?.[0]?.collection ??
            mongoose.models[field?.options?.ref ?? field?.options?.type?.[0]?.ref]?.collection?.name ??
            collection;
          if (collectionName && field?.instance !== 'Array') {
            nonArrayFields.push(localField);
          }
          return [
            ...acc,
            collectionName && {
              $lookup: {
                from: collectionName,
                localField,
                foreignField: '_id',
                as: localField,
                ...(subInclude?.length && { pipeline: this.include(subInclude) })
              }
            }
          ];
        }, []) ?? [];
      if (nonArrayFields.length) {
        stages.push({
          $set: nonArrayFields.reduce(
            (acc, curr) => ({
              ...acc,
              [curr]: { $arrayElemAt: [`$${curr}`, 0] }
            }),
            {}
          )
        });
      }
      return compact(stages);
    },
    selectAndInclude(select?: string, include?: string[]): PipelineStage[] {
      return compact([this.select(select), ...this.include(include)]);
    },
    match(match?: Record<string, any>): PipelineStage {
      return {
        $match: match ?? {}
      };
    },
    sort(sort: Record<string, any> = {}): PipelineStage {
      sort.created_at ??= -1;
      return {
        $sort: sort
      };
    },
    retrieve(options: mongoose.RetrievalOptions, sort: boolean = true): PipelineStage[] {
      const stages = [this.match(options.filter)];
      if (options.prepaginate) {
        if (sort) stages.push(this.sort(options.sort));
        stages.push(PREPAGINATION_PLACEHOLDER);
        stages.push(...this.include(options.include));
        if (options.secondaryFilter) stages.push(this.match(options.secondaryFilter));
        if (options.select) stages.push(this.select(options.select));
      } else {
        stages.push(...this.include(options.include));
        if (options.secondaryFilter) stages.push(this.match(options.secondaryFilter));
        if (sort) stages.push(this.sort(options.sort));
        if (options.select) stages.push(this.select(options.select));
      }
      return stages;
    }
  };
};

export const isDuplicateErrorForKey = (err: any, key: string): boolean => {
  return err?.code === 11000 && Object.keys(err.keyValue ?? {})?.[0] === key;
};
