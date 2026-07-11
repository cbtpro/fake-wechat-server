// Copyright 2024 Peter Chen
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { SkipAuth } from '../common/decorators/skip-auth.decorator';
import EncryptionInterceptor from '../interceptor/encryption.interceptor';
import { SplashService } from './splash.service';
import { SplashType, SplashStatus, SplashTheme } from './entities/splash-config.entity';

interface ICreateSplashConfigDto {
  type: SplashType;
  title: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  duration?: number;
  sortOrder?: number;
  status?: SplashStatus;
  theme?: SplashTheme;
  startTime?: Date;
  endTime?: Date;
}

interface IUpdateSplashConfigDto {
  type?: SplashType;
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  duration?: number;
  sortOrder?: number;
  status?: SplashStatus;
  theme?: SplashTheme;
  startTime?: Date;
  endTime?: Date;
}

@UseInterceptors(EncryptionInterceptor)
@Controller('/admin/splash')
export class SplashController {
  constructor(private readonly splashService: SplashService) {}

  @Get('/list')
  async findList(
    @Query('type') type?: SplashType,
    @Query('status') status?: SplashStatus,
    @Query('theme') theme?: SplashTheme,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const result = await this.splashService.findList({
      type,
      status,
      theme,
      page: page ? parseInt(String(page), 10) : 1,
      pageSize: pageSize ? parseInt(String(pageSize), 10) : 20,
    });
    return {
      success: true,
      message: '',
      data: result,
    } as IResponseBody<typeof result>;
  }

  @SkipAuth()
  @Get('/active')
  async findActive(
    @Query('type') type?: SplashType,
    @Query('theme') theme?: SplashTheme,
  ) {
    const items = await this.splashService.findActive(type, theme);
    return {
      success: true,
      message: '',
      data: items,
    } as IResponseBody<typeof items>;
  }

  @Get('/:id')
  async findById(@Param('id') id: number) {
    const item = await this.splashService.findById(parseInt(String(id), 10));
    return {
      success: true,
      message: '',
      data: item,
    } as IResponseBody<typeof item>;
  }

  @Post('/create')
  async create(@Body() data: ICreateSplashConfigDto) {
    const item = await this.splashService.create(data);
    return {
      success: true,
      message: '创建成功',
      data: item,
    } as IResponseBody<typeof item>;
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() data: IUpdateSplashConfigDto) {
    const item = await this.splashService.update(parseInt(String(id), 10), data);
    if (!item) {
      return {
        success: false,
        message: '配置不存在',
        data: null,
      } as IResponseBody<null>;
    }
    return {
      success: true,
      message: '更新成功',
      data: item,
    } as IResponseBody<typeof item>;
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    const success = await this.splashService.delete(parseInt(String(id), 10));
    if (!success) {
      return {
        success: false,
        message: '配置不存在',
        data: null,
      } as IResponseBody<null>;
    }
    return {
      success: true,
      message: '删除成功',
      data: null,
    } as IResponseBody<null>;
  }
}
