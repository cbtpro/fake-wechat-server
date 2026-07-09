import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile } from '../../common/decorators/profile.decorator';
import { IUploadFile, IUploadResult, StorageService } from './storage.service.interface';

@Profile('production')
@Injectable()
export class AliyunOssService implements StorageService {
  constructor(private configService: ConfigService) {
    // TODO: 初始化阿里云 OSS 客户端
    // const OSS = require('ali-oss');
    // this.client = new OSS({
    //   region: this.configService.get('OSS_REGION'),
    //   accessKeyId: this.configService.get('OSS_ACCESS_KEY_ID'),
    //   accessKeySecret: this.configService.get('OSS_ACCESS_KEY_SECRET'),
    //   bucket: this.configService.get('OSS_BUCKET'),
    // });
  }

  async upload(
    file: IUploadFile,
    prefix = 'default',
  ): Promise<IUploadResult> {
    throw new Error(
      'AliyunOssService.upload() not implemented. Please install and configure ali-oss SDK.',
    );
  }

  async delete(filename: string): Promise<boolean> {
    throw new Error(
      'AliyunOssService.delete() not implemented. Please install and configure ali-oss SDK.',
    );
  }

  getUrl(filename: string): string {
    throw new Error(
      'AliyunOssService.getUrl() not implemented. Please install and configure ali-oss SDK.',
    );
  }
}
