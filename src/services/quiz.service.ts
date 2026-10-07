import QuizRepository from '../repositories/quiz.repository';
import CacheUtil from '../utils/cache.util';

const QUESTIONS_CACHE_TTL = 600; // 10 minutes

export default class QuizService {
  /**
   * Get questions with tenant and filter caching
   */
  static async getQuestions(options?: {
    tenantId?: string;
    category?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
  }) {
    const cacheKey = `quiz:questions:${options?.tenantId || 'all'}:${options?.category || 'all'}:${options?.difficulty || 'all'}:${options?.search || 'all'}:${options?.limit || 0}`;

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

  static async getProgress(options: { tenantId?: string; sessionId: string; userId?: string }) {
    const key = options.userId
      ? `quiz:progress:${options.tenantId || 'default'}:user:${options.userId}`
      : `quiz:progress:${options.tenantId || 'default'}:session:${options.sessionId}`;

    return CacheUtil.remember(key, 60, async () => {
      return QuizRepository.getProgress(options);
    });
  }

  static async saveProgress(options: {
    tenantId?: string;
    sessionId: string;
    userId?: string;
    answers: any;
    score: number;
    answeredCount: number;
  }) {
    const result = await QuizRepository.saveProgress(options);

    // Invalidate progress cache
    const key = options.userId
      ? `quiz:progress:${options.tenantId || 'default'}:user:${options.userId}`
      : `quiz:progress:${options.tenantId || 'default'}:session:${options.sessionId}`;
    await CacheUtil.del(key);

    return result;
  }

  static async resetProgress(options: { tenantId?: string; sessionId: string; userId?: string }) {
    const result = await QuizRepository.resetProgress(options);

    const key = options.userId
      ? `quiz:progress:${options.tenantId || 'default'}:user:${options.userId}`
      : `quiz:progress:${options.tenantId || 'default'}:session:${options.sessionId}`;
    await CacheUtil.del(key);

    return result;
  }
}
