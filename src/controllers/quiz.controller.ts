import { Request, Response, NextFunction } from 'express';
import QuizService from '../services/quiz.service';
import { responseSuccess, responseError } from '../helpers/response.helper';

export class QuizController {
  static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const difficulty = req.query.difficulty as string | undefined;
      const search = req.query.search as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const tenantId = (req as any).tenant?.id || undefined;

      const data = await QuizService.getQuestions({
        tenantId,
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
      const tenantId = (req as any).tenant?.id || undefined;
      const userId = (req as any).user?.id || undefined;
      const sessionId =
        (req.headers['x-session-id'] as string) ||
        (req.query.sessionId as string) ||
        'default-guest-session';

      const progress = await QuizService.getProgress({ tenantId, sessionId, userId });
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
      const tenantId = (req as any).tenant?.id || undefined;
      const userId = (req as any).user?.id || undefined;
      const sessionId =
        (req.headers['x-session-id'] as string) || req.body.sessionId || 'default-guest-session';
      const { answers, score, answeredCount } = req.body;

      const progress = await QuizService.saveProgress({
        tenantId,
        sessionId,
        userId,
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
      const tenantId = (req as any).tenant?.id || undefined;
      const userId = (req as any).user?.id || undefined;
      const sessionId =
        (req.headers['x-session-id'] as string) || req.body.sessionId || 'default-guest-session';

      const progress = await QuizService.resetProgress({ tenantId, sessionId, userId });
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
