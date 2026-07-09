import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Profile } from '../../common/decorators/profile.decorator';
import { IUploadFile, IUploadResult, StorageService } from './storage.service.interface';

@Profile('development')
@Injectable()
export class LocalStorageService implements StorageService {
  private uploadDir: string;
  private publicPath: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    this.publicPath = '/uploads';
    this.baseUrl =
      this.configService.get('APP_BASE_URL') || 'http://localhost:3000';
    this.ensureDir(this.uploadDir);
  }

  private ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private generateFilename(originalname: string): string {
    const ext = path.extname(originalname).toLowerCase();
    return `${randomUUID().replace(/-/g, '')}${ext}`;
  }

  async upload(
    file: IUploadFile,
    prefix = 'default',
  ): Promise<IUploadResult> {
    const targetDir = path.join(this.uploadDir, prefix);
    this.ensureDir(targetDir);

    const filename = this.generateFilename(file.originalname);
    const filePath = path.join(targetDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    const relativePath = `${prefix}/${filename}`;
    return {
      url: `${this.baseUrl}${this.publicPath}/${relativePath}`,
      filename: relativePath,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async delete(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getUrl(filename: string): string {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    return `${this.baseUrl}${this.publicPath}/${filename}`;
  }
}
