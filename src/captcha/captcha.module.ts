import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaptchaController } from './controllers/captcha.controller';
import { CaptchaCacheService } from './services/captcha-cache.service';
import { CAPTCHA_SERVICE_TOKEN } from './services/captcha.service.interface';
import { CaptchaProdService } from './services/captcha-prod.service';
import { CaptchaDevService } from './services/captcha-dev.service';
import { EncryptionModule } from '../modules/encryption/encryption.module';

@Module({})
export class CaptchaModule {
  static forRoot(): DynamicModule {
    return {
      module: CaptchaModule,
      imports: [ConfigModule, EncryptionModule],
      controllers: [CaptchaController],
      providers: [
        CaptchaCacheService,
        {
          provide: CAPTCHA_SERVICE_TOKEN,
          useFactory: (configService: ConfigService) => {
            const isDev = configService.get('NODE_ENV') === 'development';
            return isDev ? new CaptchaDevService(configService) : new CaptchaProdService();
          },
          inject: [ConfigService],
        },
      ],
      exports: [CAPTCHA_SERVICE_TOKEN, CaptchaCacheService],
    };
  }
}
