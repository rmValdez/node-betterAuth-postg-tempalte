import { createClient, RedisClientType } from 'redis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../config';

export default class RedisUtil {
  static client: RedisClientType;

  static async initialize() {
    try {
      this.client = createClient({
        password: REDIS_PASSWORD,
        socket: {
          host: REDIS_HOST,
          port: REDIS_PORT,
          connectTimeout: 2000,
          reconnectStrategy: false,
        },
      }) as RedisClientType;

      this.client.on('error', (err) => console.warn(`[Redis] Offline notice: ${err.message}`));

      await this.client.connect();
      console.log(`[Redis] Connected to ${REDIS_HOST}:${REDIS_PORT}`);
    } catch (err: any) {
      console.warn(`[Redis] Optional Redis connection skipped: ${err?.message || err}`);
    }
  }

  /**
   * Simple fixed-window rate limiter
   */
  static async isRateLimited(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    const count = await this.client.incr(`ratelimit:${key}`);
    if (count === 1) await this.client.expire(`ratelimit:${key}`, windowSeconds);
    return count > limit;
  }
}
