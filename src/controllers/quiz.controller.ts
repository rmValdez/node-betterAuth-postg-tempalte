import { Request, Response, NextFunction } from 'express';
import QuizService from '../services/quiz.service';
import { responseSuccess, responseError } from '../helpers/response.helper';

const USER_SESSION_PREFIX = 'user:';

/**
 * Resolves who owns the quiz progress. Signed-in users are keyed by their id;
 * guests must send their own `x-session-id` (e.g. a client-generated UUID).
 * Returns null when a guest sends no session id, or tries to use a reserved
 * `user:` key to reach someone else's progress.
 */
function resolveProgressOwner(req: Request): { sessionId: string; userId?: string } | null {
  const userId: string | undefined = req.user?.id;
  if (userId) return { sessionId: `${USER_SESSION_PREFIX}${userId}`, userId };

  const sessionId =
    (req.headers['x-session-id'] as string) ||
    (req.query.sessionId as string) ||
    req.body?.sessionId;
  if (!sessionId || typeof sessionId !== 'string' || sessionId.startsWith(USER_SESSION_PREFIX)) {
    return null;
  }
  return { sessionId };
}

const MISSING_SESSION_MESSAGE = 'Sign in or send an x-session-id header to track quiz progress';

export class QuizController {
  static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const difficulty = req.query.difficulty as string | undefined;
      const search = req.query.search as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      const data = await QuizService.getQuestions({
        category,
        difficulty,
        search,
        limit,
      });
      return responseSuccess(res, 200, data, 'Quiz questions retrieved from PostgreSQL');
    } catch (error) {
      next(error);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await QuizService.getQuestionById(id);
      if (!data) {
        return responseError(res, 404, 'Quiz question not found');
      }
      return responseSuccess(res, 200, data, 'Quiz question retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = resolveProgressOwner(req);
      if (!owner) return responseError(res, 400, MISSING_SESSION_MESSAGE);

      const progress = await QuizService.getProgress(owner);
      return responseSuccess(
        res,
        200,
        progress || { answers: {}, score: 0, answeredCount: 0 },
        'Quiz progress retrieved from PostgreSQL',
      );
    } catch (error) {
      next(error);
    }
  }

  static async saveProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = resolveProgressOwner(req);
      if (!owner) return responseError(res, 400, MISSING_SESSION_MESSAGE);
      const { answers, score, answeredCount } = req.body;

      const progress = await QuizService.saveProgress({
        ...owner,
        answers: answers || {},
        score: score || 0,
        answeredCount: answeredCount || 0,
      });

      return responseSuccess(
        res,
        200,
        progress,
        'Quiz progress successfully saved to PostgreSQL database',
      );
    } catch (error) {
      next(error);
    }
  }

  static async resetProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = resolveProgressOwner(req);
      if (!owner) return responseError(res, 400, MISSING_SESSION_MESSAGE);

      const progress = await QuizService.resetProgress(owner);
      return responseSuccess(
        res,
        200,
        progress || { answers: {}, score: 0, answeredCount: 0 },
        'Quiz progress reset in PostgreSQL',
      );
    } catch (error) {
      next(error);
    }
  }
}
