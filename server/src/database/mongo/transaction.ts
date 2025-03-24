import mongoose from 'mongoose';

export const transactionQueries = async (queries) => {
  const session = await mongoose.connection.startSession();
  try {
    session.startTransaction();
    const result = await Promise.all(
      queries.map((query) => {
        query = query.session(session);
        return query;
      })
    );
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const transaction = async <T>(fn: (session: mongoose.ClientSession) => Promise<T>): Promise<T> => {
  const session = await mongoose.connection.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
