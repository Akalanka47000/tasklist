import mongoose from 'mongoose';
import { audit, AuditType, schemaOptions } from '@/database/mongo';

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: {
          email: { $type: 'string' }
        },
        collation: { locale: 'en', strength: 2 }
      }
    },
    password: String,
    last_login_time: Date
  },
  schemaOptions
);

UserSchema.index({ created_at: -1 });

UserSchema.plugin(audit, {
  types: [AuditType.Edit, AuditType.Delete]
});

// ------------------ Methods ------------------

UserSchema.method('cleanse', function () {
  scrubbable.split(' ').forEach((k) => {
    this[k.replace('-', '')] = undefined;
  });
  return this;
});

// ------------------ Exports ------------------

export const User = mongoose.paginatedModel<IUser>('User', UserSchema);

export const scrubbable = '-password -last_login_time';

export default User;
