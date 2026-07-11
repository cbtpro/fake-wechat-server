import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { WeChatModule } from 'nest-wechat';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockModule } from './mock/mock.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { EncryptionModule } from './modules/encryption/encryption.module';
import { CaptchaModule } from './captcha/captcha.module';
import { StorageModule } from './modules/storage/storage.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { SplashModule } from './splash/splash.module';
import { SplashConfig } from './splash/entities/splash-config.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV === 'development' ? '.dev' : ''}`,
    }),
    MockModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [User, SplashConfig],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    AdminAuthModule,
    AdminUserModule,
    SplashModule,
    EncryptionModule,
    CaptchaModule.forRoot(),
    StorageModule.forRoot(),
    WeChatModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          appId: configService.get('WECHAT_APP_ID'),
          secret: configService.get('WECHAT_SECRET'),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
