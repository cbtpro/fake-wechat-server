import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import EncryptionInterceptor from '@/interceptor/encryption.interceptor';
import { UserService } from './user.service';
import { SkipAuth } from '../common/decorators/skip-auth.decorator';
import { User } from './entities/user.entity';
import {
  STORAGE_SERVICE_TOKEN,
  StorageService,
  IUploadFile,
} from '../modules/storage/storage.service.interface';

@UseInterceptors(EncryptionInterceptor)
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storageService: StorageService,
  ) {}

  @SkipAuth()
  @Get('/test')
  getHello(): string {
    return this.userService.getHello();
  }

  @Get('/profile')
  async getProfile(@Request() req: any) {
    const user = await this.userService.findById(req.user.userId);
    return this.transformUserAvatar(user);
  }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req: any,
    @UploadedFile() file: IUploadFile,
  ) {
    if (!file) {
      throw new BadRequestException('请上传图片文件');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('仅支持 JPG、PNG、GIF、WEBP 格式的图片');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('图片大小不能超过 5MB');
    }

    const result = await this.storageService.upload(file, 'avatars');
    const updatedUser = await this.userService.updateAvatar(
      req.user.userId,
      result.filename,
    );

    return {
      avatar: result.url,
      user: this.transformUserAvatar(updatedUser),
    };
  }

  private transformUserAvatar(user: User | null): User | null {
    if (!user) return null;
    if (user.avatar) {
      user.avatar = this.storageService.getUrl(user.avatar);
    }
    return user;
  }
}
