import { default as aggregatePaginate } from '@sliit-foss/mongoose-aggregate-paginate-v2';
import { ModelDocument, default as mongoose } from 'mongoose';
import { default as mongooseLeanDefaults } from 'mongoose-lean-defaults';
import { default as mongoosePaginate } from 'mongoose-paginate-v2';
import { registerUtilities } from './utilities';

const paginatedModel = <T>(name: string, schema: mongoose.Schema, syncIndexes = true) => {
  schema.plugin(mongoosePaginate);

  schema.plugin(aggregatePaginate);

  schema.plugin(mongooseLeanDefaults);

  schema.index({ createdAt: 1 });

  const model = mongoose.model<ModelDocument<T>, mongoose.ExtendedPaginateModel<ModelDocument<T>>>(name, schema);

  if (syncIndexes) {
    model.syncIndexes();
  }

  registerUtilities<T>(model);

  return model;
};

mongoose.paginatedModel = paginatedModel;
