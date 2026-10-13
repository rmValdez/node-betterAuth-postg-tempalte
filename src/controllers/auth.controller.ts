import { Request, Response, NextFunction } from 'express';
import AuthSvc from '../services/auth.service';

export default class AuthController {
  /**
   * Get current authenticated user profile (with avatar and role permissions)
   */
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res.status(401).json({ status: 'error', statusCode: 401, message: 'Unauthorized' });

      const user = await AuthSvc.getCurrentUser(userId);
      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'User profile retrieved',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
