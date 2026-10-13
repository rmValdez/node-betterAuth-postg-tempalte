import AuthRepo from '../repositories/auth.repository';
import { getPermissionsForRole } from '../constants/permissions.constant';

export default class AuthSvc {
  /**
   * Get current authenticated user
   */
  static async getCurrentUser(userId: string) {
    const user = await AuthRepo.findUserById(userId);
    if (!user) throw { status: 404, message: 'User not found' };

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      avatar: user.avatar?.fileUrl,
      onboardingCompleted: user.onboardingCompleted,
      permissions: getPermissionsForRole(user.role),
    };
  }
}
