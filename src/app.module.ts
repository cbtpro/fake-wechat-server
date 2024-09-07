import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { WeChatModule } from 'nest-wechat';
import { EncryptionService } from '@/services/encryption.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockModule } from './mock/mock.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      // envFilePath: join(__dirname, '../.env'),
    }),
    MockModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DATABASE_HOST'), // 主机，默认为localhost
          port: configService.get<number>('DATABASE_PORT'), // 端口号
          username: configService.get('DATABASE_USER'), // 用户名
          password: configService.get('DATABASE_PASSWORD'), // 密码
          database: configService.get('DATABASE_NAME'), //数据库名
          entities: [User],
          synchronize: true,
        };
      },
    }),
    AuthModule,
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
    EncryptionService,
    AppService,
    /** 设置jwt验证为全局守卫 */
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
