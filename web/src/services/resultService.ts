import { connectToDatabase } from '@/db';
import { ObjectId } from 'mongodb';
import { B5Error, DbResult } from '@/types';

const collectionName = process.env.DB_COLLECTION || 'results';

export interface IResultService {
  getById(id: string): Promise<any>;
  save(result: DbResult): Promise<string>;
}

export const ResultService: IResultService = {
  async getById(id: string) {
    try {
      const query = { _id: new ObjectId(id) };
      const db = await connectToDatabase();
      const collection = db.collection(collectionName);
      const report = await collection.findOne(query);
      return report;
    } catch (error) {
      console.error(`Error fetching result ${id}:`, error);
      throw new B5Error({
        name: 'NotFoundError',
        message: `The test results with id ${id} were not found.`
      });
    }
  },

  async save(testResult: DbResult) {
    try {
      const db = await connectToDatabase();
      const collection = db.collection(collectionName);
      const result = await collection.insertOne(testResult);
      return result.insertedId.toString();
    } catch (error) {
      console.error('Error saving result:', error);
      throw new B5Error({
        name: 'SavingError',
        message: 'Failed to save test result!'
      });
    }
  }
};
