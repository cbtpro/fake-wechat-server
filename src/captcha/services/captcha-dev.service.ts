import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CaptchaService } from './captcha.service.interface';
import { generateCaptchaImage } from '../utils/captcha-image';

@Injectable()
export class CaptchaDevService implements CaptchaService {
  private readonly devCode: string;

  constructor(private configService: ConfigService) {
    this.devCode = configService.get('CAPTCHA_DEV_CODE') || '6699';
  }

  generateCaptcha(): { code: string; image: string } {
    const image = generateCaptchaImage(this.devCode);
    return { code: this.devCode, image };
  }

  validateCaptcha(key: string, code: string): boolean {
    return true;
  }
}
