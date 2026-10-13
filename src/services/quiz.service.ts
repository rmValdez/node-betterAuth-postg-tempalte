import { Prisma } from '@prisma/client';
import QuizRepository from '../repositories/quiz.repository';
import CacheUtil from '../utils/cache.util';

const QUESTIONS_CACHE_TTL = 600; // 10 minutes

function progressCacheKey(options: { sessionId: string; userId?: string }) {
  return options.userId
    ? `quiz:progress:user:${options.userId}`
    : `quiz:progress:session:${options.sessionId}`;
}

export default class QuizService {
  /**
   * Get questions with filter caching
   */
  static async getQuestions(options?: {
    category?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
  }) {
    const cacheKey = `quiz:questions:${options?.category || 'all'}:${options?.difficulty || 'all'}:${options?.search || 'all'}:${options?.limit || 0}`;

    return CacheUtil.remember(cacheKey, QUESTIONS_CACHE_TTL, async () => {
      const items = await QuizRepository.findAll(options);
      return {
        items,
        total: items.length,
      };
    });
  }

  static async getQuestionById(id: number) {
    return CacheUtil.remember(`quiz:question:${id}`, QUESTIONS_CACHE_TTL, async () => {
      return QuizRepository.findById(id);
    });
  }

  static async getProgress(options: { sessionId: string; userId?: string }) {
    return CacheUtil.remember(progressCacheKey(options), 60, async () => {
      return QuizRepository.getProgress(options);
    });
  }

  static async saveProgress(options: {
    sessionId: string;
    userId?: string;
    answers: Prisma.InputJsonValue;
    score: number;
    answeredCount: number;
  }) {
    const result = await QuizRepository.saveProgress(options);

    // Invalidate progress cache
    await CacheUtil.del(progressCacheKey(options));

    return result;
  }

  static async resetProgress(options: { sessionId: string; userId?: string }) {
    const result = await QuizRepository.resetProgress(options);

    await CacheUtil.del(progressCacheKey(options));

    return result;
  }
}
