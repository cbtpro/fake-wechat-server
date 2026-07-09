import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile } from '../../common/decorators/profile.decorator';
import { IUploadFile, IUploadResult, StorageService } from './storage.service.interface';

@Profile('staging')
@Injectable()
export class HuaweiObsService implements StorageService {
  constructor(private configService: ConfigService) {
    // TODO: 初始化华为云 OBS 客户端
    // const { ObsClient } = require('esdk-obs-nodejs');
    // this.client = new ObsClient({
    //   access_key_id: this.configService.get('OBS_ACCESS_KEY_ID'),
    //   secret_access_key: this.configService.get('OBS_SECRET_ACCESS_KEY'),
    //   server: this.configService.get('OBS_SERVER'),
    // });
  }

  async upload(
    file: IUploadFile,
    prefix = 'default',
  ): Promise<IUploadResult> {
    throw new Error(
      'HuaweiObsService.upload() not implemented. Please install and configure esdk-obs-nodejs SDK.',
    );
  }

  async delete(filename: string): Promise<boolean> {
    throw new Error(
      'HuaweiObsService.delete() not implemented. Please install and configure esdk-obs-nodejs SDK.',
    );
  }

  getUrl(filename: string): string {
    throw new Error(
      'HuaweiObsService.getUrl() not implemented. Please install and configure esdk-obs-nodejs SDK.',
    );
  }
}
