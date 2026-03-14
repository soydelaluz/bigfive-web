import { connectToDatabase } from '@/db';
import { Feedback } from '@/types';

export interface IFeedbackService {
  save(feedback: Feedback): Promise<void>;
}

export const FeedbackService: IFeedbackService = {
  async save(feedback: Feedback) {
    const db = await connectToDatabase();
    const collection = db.collection('feedback');
    await collection.insertOne({ feedback, date: new Date() });
  }
};
