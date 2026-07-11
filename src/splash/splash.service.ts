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

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { SplashConfig, SplashType, SplashStatus, SplashTheme } from './entities/splash-config.entity';

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

interface IQuerySplashConfigDto {
  type?: SplashType;
  status?: SplashStatus;
  theme?: SplashTheme;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class SplashService {
  constructor(private dataSource: DataSource) {}

  async findList(query: IQuerySplashConfigDto = {}) {
    const { type, status, theme, page = 1, pageSize = 20 } = query;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const queryBuilder = queryRunner.manager
        .createQueryBuilder(SplashConfig, 'splash');

      if (type) {
        queryBuilder.where('splash.type = :type', { type });
      }
      if (status) {
        queryBuilder.andWhere('splash.status = :status', { status });
      }
      if (theme) {
        queryBuilder.andWhere('splash.theme = :theme', { theme });
      }

      queryBuilder.orderBy('splash.sortOrder', 'ASC');
      queryBuilder.orderBy('splash.createdAt', 'DESC');

      const [items, total] = await queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      return {
        items: items.map(item => plainToClass(SplashConfig, item)),
        total,
        page,
        pageSize,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: number): Promise<SplashConfig | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const item = await queryRunner.manager
        .createQueryBuilder(SplashConfig, 'splash')
        .where('splash.id = :id', { id })
        .getOne();
      return item ? plainToClass(SplashConfig, item) : null;
    } finally {
      await queryRunner.release();
    }
  }

  async findActive(type?: SplashType, theme?: SplashTheme): Promise<SplashConfig[] | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const now = new Date();
      const queryBuilder = queryRunner.manager
        .createQueryBuilder(SplashConfig, 'splash')
        .where('splash.status = :status', { status: SplashStatus.ACTIVE });

      if (type) {
        queryBuilder.andWhere('splash.type = :type', { type });
      }

      if (theme) {
        queryBuilder.andWhere(
          '(splash.theme = :theme OR splash.theme = :allTheme)',
          { theme, allTheme: SplashTheme.ALL },
        );
      }

      queryBuilder.andWhere(
        '(splash.startTime IS NULL OR splash.startTime <= :now)',
        { now },
      );
      queryBuilder.andWhere(
        '(splash.endTime IS NULL OR splash.endTime >= :now)',
        { now },
      );

      queryBuilder.orderBy('splash.sortOrder', 'ASC');

      const items = await queryBuilder.getMany();
      return items.length > 0 ? items.map(item => plainToClass(SplashConfig, item)) : null;
    } finally {
      await queryRunner.release();
    }
  }

  async create(data: ICreateSplashConfigDto): Promise<SplashConfig> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      const config = new SplashConfig();
      config.type = data.type;
      config.title = data.title;
      config.content = data.content || '';
      config.imageUrl = data.imageUrl || '';
      config.linkUrl = data.linkUrl || '';
      config.duration = data.duration || 3;
      config.sortOrder = data.sortOrder || 0;
      config.status = data.status || SplashStatus.ACTIVE;
      config.theme = data.theme || SplashTheme.ALL;
      config.startTime = data.startTime;
      config.endTime = data.endTime;

      const saved = await queryRunner.manager.save(config);

      await queryRunner.commitTransaction();
      return plainToClass(SplashConfig, saved);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, data: IUpdateSplashConfigDto): Promise<SplashConfig | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      const config: SplashConfig | null = await queryRunner.manager.findOne(SplashConfig, { where: { id } });
      if (!config) {
        await queryRunner.rollbackTransaction();
        return null;
      }

      if (data.type !== undefined) config.type = data.type;
      if (data.title !== undefined) config.title = data.title;
      if (data.content !== undefined) config.content = data.content;
      if (data.imageUrl !== undefined) config.imageUrl = data.imageUrl;
      if (data.linkUrl !== undefined) config.linkUrl = data.linkUrl;
      if (data.duration !== undefined) config.duration = data.duration;
      if (data.sortOrder !== undefined) config.sortOrder = data.sortOrder;
      if (data.status !== undefined) config.status = data.status;
      if (data.theme !== undefined) config.theme = data.theme;
      if (data.startTime !== undefined) config.startTime = data.startTime;
      if (data.endTime !== undefined) config.endTime = data.endTime;

      const saved = await queryRunner.manager.save(config);

      await queryRunner.commitTransaction();
      return plainToClass(SplashConfig, saved);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      const result = await queryRunner.manager.delete(SplashConfig, { id });

      await queryRunner.commitTransaction();
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
