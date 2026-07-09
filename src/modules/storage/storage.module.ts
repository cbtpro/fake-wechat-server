import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { STORAGE_SERVICE_TOKEN } from './storage.service.interface';
import { LocalStorageService } from './local-storage.service';
import { AliyunOssService } from './aliyun-oss.service';
import { HuaweiObsService } from './huawei-obs.service';
import { createProfileProvider } from '../../common/utils/profile.util';

@Module({})
export class StorageModule {
  static forRoot(): DynamicModule {
    return {
      module: StorageModule,
      imports: [ConfigModule],
      providers: [
        createProfileProvider({
          provide: STORAGE_SERVICE_TOKEN,
          useClasses: [
            LocalStorageService,
            HuaweiObsService,
            AliyunOssService,
          ],
        }),
      ],
      exports: [STORAGE_SERVICE_TOKEN],
    };
  }
}
