import { Controller, Get, Post, Body, UseInterceptors, Inject } from '@nestjs/common';
import EncryptionInterceptor from '@/interceptor/encryption.interceptor';
import { SkipAuth } from '@/common/decorators/skip-auth.decorator';
import { CaptchaService, CAPTCHA_SERVICE_TOKEN } from '../services/captcha.service.interface';
import { CaptchaCacheService } from '../services/captcha-cache.service';
import { randomNatural } from '@/common/utils/random';

@UseInterceptors(EncryptionInterceptor)
@Controller('captcha')
export class CaptchaController {
  constructor(
    @Inject(CAPTCHA_SERVICE_TOKEN) private readonly captchaService: CaptchaService,
    private readonly cacheService: CaptchaCacheService,
  ) {}

  @SkipAuth()
  @Get('image')
  async getCaptchaImage(): Promise<IResponseBody<{ captchaId: string; image: string }>> {
    const { code, image } = this.captchaService.generateCaptcha();
    const captchaId = Math.random().toString(36).substring(2, 34);
    const cacheKey = `${captchaId}_captcha`;
    this.cacheService.set(cacheKey, code);

    const responseBody: IResponseBody<{ captchaId: string; image: string }> = {
      success: true,
      message: '验证码获取成功',
      data: { captchaId, image },
    };
    return responseBody;
  }

  @SkipAuth()
  @Post('verify')
  async verifyCaptcha(
    @Body() body: { captchaId: string; code: string },
  ): Promise<IResponseBody<{ valid: boolean }>> {
    const { captchaId, code } = body;
    const cacheKey = `${captchaId}_captcha`;
    const storedCode = this.cacheService.get(cacheKey);

    if (!storedCode) {
      const responseBody: IResponseBody<{ valid: boolean }> = {
        success: false,
        message: '验证码已过期',
        data: { valid: false },
      };
      return responseBody;
    }

    const isValid = storedCode.toLowerCase() === code.toLowerCase();

    if (isValid) {
      this.cacheService.delete(cacheKey);
    }

    const responseBody: IResponseBody<{ valid: boolean }> = {
      success: isValid,
      message: isValid ? '验证码验证成功' : '验证码错误',
      data: { valid: isValid },
    };
    return responseBody;
  }
}
