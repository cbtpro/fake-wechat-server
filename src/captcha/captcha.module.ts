import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CaptchaController } from './controllers/captcha.controller';
import { CaptchaCacheService } from './services/captcha-cache.service';
import { CAPTCHA_SERVICE_TOKEN } from './services/captcha.service.interface';
import { CaptchaProdService } from './services/captcha-prod.service';
import { CaptchaDevService } from './services/captcha-dev.service';
import { EncryptionModule } from '../modules/encryption/encryption.module';
import { createProfileProvider } from '../common/utils/profile.util';

@Module({})
export class CaptchaModule {
  static forRoot(): DynamicModule {
    return {
      module: CaptchaModule,
      imports: [ConfigModule, EncryptionModule],
      controllers: [CaptchaController],
      providers: [
        CaptchaCacheService,
        createProfileProvider({
          provide: CAPTCHA_SERVICE_TOKEN,
          useClasses: [CaptchaDevService, CaptchaProdService],
        }),
      ],
      exports: [CAPTCHA_SERVICE_TOKEN, CaptchaCacheService],
    };
  }
}
