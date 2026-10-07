import UserRepository from '../repositories/user.repository';
import { getPermissionsForRole } from '../constants/permissions.constant';
import CacheUtil from '../utils/cache.util';

const USER_CACHE_TTL = 300; // 5 minutes

export default class UserService {
  /**
   * Get user by ID (cached via Redis)
   */
  static async getUser(id: string) {
    return CacheUtil.remember(`user:${id}`, USER_CACHE_TTL, async () => {
      const user = await UserRepository.findById(id);
      if (!user) {
        throw { status: 404, message: 'User not found' };
      }
      const { password: _password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        permissions: getPermissionsForRole(user.role),
      };
    });
  }

  /**
   * List users (cached with 1 minute TTL)
   */
  static async listUsers(page: number = 1, limit: number = 10) {
    const cacheKey = `users:list:${page}:${limit}`;
    return CacheUtil.remember(cacheKey, 60, async () => {
      const result = await UserRepository.findAll(page, limit);
      return {
        ...result,
        users: result.users.map((u: any) => ({
          ...u,
          permissions: getPermissionsForRole(u.role),
        })),
      };
    });
  }

  /**
   * Invalidate user cache
   */
  static async invalidateUserCache(userId: string) {
    await Promise.all([CacheUtil.del(`user:${userId}`), CacheUtil.delByPattern('users:list:*')]);
  }
}
