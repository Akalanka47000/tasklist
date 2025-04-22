import { default as dot } from 'dot-object';
import { ChangeStreamDeleteDocument, ChangeStreamInsertDocument, ChangeStreamUpdateDocument } from 'mongodb';
import { ModelDocument, default as mongoose } from 'mongoose';

/**
 * @description This function registers a set of additional change stream utilities on a mongoose model
 **/
export const registerEvents = <T>(model: mongoose.ExtendedPaginateModel<ModelDocument<T>>) => {
  model.onInsert = (
    fn: (document: ModelDocument<T>, change: ChangeStreamInsertDocument) => void,
    filters?: Record<string, any>
  ) => {
    if (filters) {
      filters = Object.keys(filters).reduce((acc, key) => {
        acc[`fullDocument.${key}`] = filters?.[key];
        return acc;
      }, {});
    }
    const changeStream = model.watch([{ $match: { operationType: 'insert', ...filters } }], {
      fullDocument: 'updateLookup'
    });
    changeStream.on('change', (change: ChangeStreamInsertDocument) => {
      fn(change.fullDocument as any, change);
    });
    return changeStream;
  };
  model.onUpdate = (
    fn: (update: ModelDocument<T>, original: ModelDocument<T>, change: ChangeStreamUpdateDocument) => void,
    filters?: Record<string, any>
  ) => {
    if (filters) {
      filters = Object.keys(filters).reduce((acc, key) => {
        acc[`updateDescription.updatedFields.${key}`] = filters?.[key];
        return acc;
      }, {});
    }
    const changeStream = model.watch([{ $match: { operationType: 'update', ...filters } }], {
      fullDocument: 'updateLookup'
    });
    changeStream.on('change', (change: ChangeStreamUpdateDocument) => {
      fn(
        dot.object(change.updateDescription.updatedFields as object) as ModelDocument<T>,
        change.fullDocument as any,
        change
      );
    });
    return changeStream;
  };
  model.onDelete = (
    fn: (document: ModelDocument<T>, change: ChangeStreamDeleteDocument) => void,
    filters?: Record<string, any>
  ) => {
    if (filters) {
      filters = Object.keys(filters).reduce((acc, key) => {
        acc[`fullDocumentBeforeChange.${key}`] = filters?.[key];
        return acc;
      }, {});
    }
    const changeStream = model.watch([{ $match: { operationType: 'delete', ...filters } }], {
      fullDocumentBeforeChange: 'updateLookup'
    });
    changeStream.on('change', (change: ChangeStreamDeleteDocument) => {
      fn(change.fullDocumentBeforeChange as any, change);
    });
    return changeStream;
  };
};
