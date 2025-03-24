import { default as context } from 'express-http-context';
import { ctxUser } from '@shared/constants';
import { AuditType, Options, plugin } from '@sliit-foss/mongoose-audit';
import { default as mongoose } from 'mongoose';

export const audit = (schema: mongoose.Schema, opts: Options) => {
  schema.plugin<typeof plugin>(plugin, {
    getUser: () => {
      const userId = context.get(ctxUser)?._id;
      if (userId) return new mongoose.Types.ObjectId(userId);
      return 'System';
    },
    exclude: ['created_at', 'updated_at'],
    ...opts
  });
};

export { AuditType };

export default audit;
