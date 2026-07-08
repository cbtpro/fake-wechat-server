import { Module } from '@nestjs/common';
import { MockController } from './mock.controller';
import { EncryptionModule } from '../modules/encryption/encryption.module';

@Module({
  imports: [EncryptionModule],
  controllers: [MockController],
})
export class MockModule {}
