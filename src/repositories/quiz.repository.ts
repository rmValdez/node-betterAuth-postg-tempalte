import { prisma } from '../utils/prisma';

export default class QuizRepository {
  static async findAll(options?: {
    tenantId?: string;
    category?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
  }) {
    const where: any = {};

    if (options?.tenantId) {
      where.OR = [{ tenantId: options.tenantId }, { tenantId: null }];
    }

    if (options?.category && options.category !== 'ALL') {
      where.category = options.category;
    }

    if (options?.difficulty && options.difficulty !== 'ALL') {
      where.difficulty = options.difficulty;
    }

    if (options?.search) {
      where.OR = [
        { question: { contains: options.search, mode: 'insensitive' } },
        { explanation: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.quizQuestion.findMany({
      where,
      orderBy: { id: 'asc' },
      take: options?.limit || undefined,
    });

    return items;
  }

  static async findById(id: number) {
    return prisma.quizQuestion.findUnique({
      where: { id },
    });
  }

  /**
   * Get user or session quiz progress from PostgreSQL
   */
  static async getProgress(options: { tenantId?: string; sessionId: string; userId?: string }) {
    const { tenantId, sessionId, userId } = options;

    if (userId) {
      const byUser = await prisma.quizProgress.findFirst({
        where: { userId, tenantId: tenantId || null },
        orderBy: { updatedAt: 'desc' },
      });
      if (byUser) return byUser;
    }

    return prisma.quizProgress.findFirst({
      where: {
        sessionId,
        tenantId: tenantId || null,
      },
    });
  }

  /**
   * Save or update quiz progress in PostgreSQL
   */
  static async saveProgress(options: {
    tenantId?: string;
    sessionId: string;
    userId?: string;
    answers: any;
    score: number;
    answeredCount: number;
  }) {
    const { tenantId, sessionId, userId, answers, score, answeredCount } = options;

    const existing = await this.getProgress({ tenantId, sessionId, userId });

    if (existing) {
      return prisma.quizProgress.update({
        where: { id: existing.id },
        data: {
          answers,
          score,
          answeredCount,
          userId: userId || existing.userId,
        },
      });
    }

    return prisma.quizProgress.create({
      data: {
        tenantId: tenantId || null,
        sessionId,
        userId: userId || null,
        answers,
        score,
        answeredCount,
      },
    });
  }

  /**
   * Reset / clear quiz progress in PostgreSQL
   */
  static async resetProgress(options: { tenantId?: string; sessionId: string; userId?: string }) {
    const existing = await this.getProgress(options);
    if (existing) {
      return prisma.quizProgress.update({
        where: { id: existing.id },
        data: {
          answers: {},
          score: 0,
          answeredCount: 0,
        },
      });
    }
    return null;
  }
}
