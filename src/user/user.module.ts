import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionModule } from '../modules/encryption/encryption.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EncryptionModule],
  exports: [TypeOrmModule, UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
