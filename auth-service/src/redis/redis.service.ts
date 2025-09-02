import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, type RedisClientType } from 'redis';

// Khai báo client với generic rõ ràng
type RedisClient = RedisClientType<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>
>;

@Injectable()
export class RedisService implements OnModuleInit {
  private client!: RedisClient;

  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT),
      },
    });
    await this.client.connect();
    console.log('[AUTH-REDIS] Connected');
  }

  async get(key: string): Promise<string | null> {
    const v = await this.client.get(key as any);
    return (v ?? null) as string | null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl && ttl > 0) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }
}
