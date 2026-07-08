import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface CacheEntry {
  code: string;
  expiresAt: number;
}

@Injectable()
export class CaptchaCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly expireMinutes: number;

  constructor(private configService: ConfigService) {
    this.expireMinutes = parseInt(configService.get('CAPTCHA_EXPIRE_MINUTES')) || 5;
  }

  set(key: string, code: string): void {
    const expiresAt = Date.now() + this.expireMinutes * 60 * 1000;
    this.cache.set(key, { code, expiresAt });
    this.cleanup();
  }

  get(key: string): string | null {
    this.cleanup();
    const entry = this.cache.get(key);
    if (!entry || entry.expiresAt < Date.now()) {
      return null;
    }
    return entry.code;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }
}
