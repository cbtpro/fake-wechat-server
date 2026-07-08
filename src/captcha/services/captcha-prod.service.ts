import { Injectable } from '@nestjs/common';
import { CaptchaService } from './captcha.service.interface';
import { generateCaptchaImage } from '../utils/captcha-image';
import { Profile } from '../../common/decorators/profile.decorator';

@Profile('production')
@Injectable()
export class CaptchaProdService implements CaptchaService {
  private readonly chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  generateCaptcha(): { code: string; image: string } {
    const code = this.generateRandomCode();
    const image = generateCaptchaImage(code);
    return { code, image };
  }

  validateCaptcha(key: string, code: string): boolean {
    return true;
  }

  private generateRandomCode(length: number = 4): string {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
    }
    return code;
  }
}
