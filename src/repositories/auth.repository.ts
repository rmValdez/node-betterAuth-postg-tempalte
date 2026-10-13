import { prisma } from '../utils/prisma';

export default class AuthRepo {
  static async findUserById(userId: string) {
    return prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      include: {
        avatar: {
          select: {
            fileUrl: true,
          },
        },
      },
    });
  }
}
