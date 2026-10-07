import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import { parsePagination, buildPage } from '../helpers/pagination.helper';
import { responseSuccess, responseError } from '../helpers/response.helper';

export default class UserController {
  /**
   * Get current user
   */
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return responseError(res, 401, 'Unauthorized');

      const user = await UserService.getUser(userId);
      return responseSuccess(res, 200, user, 'Profile fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * List users (with search and pagination)
   */
  static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const params = parsePagination(req.query);
      const result = await UserService.listUsers(params.page, params.limit);
      return responseSuccess(
        res,
        200,
        buildPage(result.users, result.total, params),
        'Users retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  }
}
