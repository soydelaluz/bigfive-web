'use server';

import { ResultService } from '@/services/resultService';
import { FeedbackService } from '@/services/feedbackService';
import { B5Error, DbResult, Feedback } from '@/types';
import calculateScore from '@bigfive-org/score';
import generateResult, {
  getInfo,
  Language,
  Domain
} from '@bigfive-org/results';

const resultLanguages = getInfo().languages;

export type Report = {
  id: string;
  timestamp: number;
  availableLanguages: Language[];
  language: string;
  results: Domain[];
};

export async function getTestResult(
  id: string,
  language?: string
): Promise<Report | undefined> {
  'use server';
  try {
    const report = await ResultService.getById(id);
    if (!report) {
      throw new B5Error({
        name: 'NotFoundError',
        message: `The test results with id ${id} is not found in the database!`
      });
    }
    const selectedLanguage =
      language ||
      (!!resultLanguages.find((l) => l.id == report.lang) ? report.lang : 'en');
    const scores = calculateScore({ answers: report.answers });
    const results = generateResult({ lang: selectedLanguage, scores });
    return {
      id: report._id.toString(),
      timestamp: report.dateStamp,
      availableLanguages: resultLanguages,
      language: selectedLanguage,
      results
    };
  } catch (error) {
    if (error instanceof B5Error) {
      throw error;
    }
    throw new Error('Something wrong happend. Failed to get test result!');
  }
}

export async function saveTest(testResult: DbResult) {
  'use server';
  try {
    const id = await ResultService.save(testResult);
    return { id };
  } catch (error) {
    if (error instanceof B5Error) {
      throw error;
    }
    throw new B5Error({
      name: 'SavingError',
      message: 'Failed to save test result!'
    });
  }
}

export type FeebackState = {
  message: string;
  type: 'error' | 'success';
};

export async function saveFeedback(
  prevState: FeebackState,
  formData: FormData
): Promise<FeebackState> {
  'use server';
  const feedback: Feedback = {
    name: String(formData.get('name')),
    email: String(formData.get('email')),
    message: String(formData.get('message'))
  };
  try {
    await FeedbackService.save(feedback);
    return {
      message: 'Sent successfully!',
      type: 'success'
    };
  } catch (error) {
    return {
      message: 'Error sending feedback!',
      type: 'error'
    };
  }
}
