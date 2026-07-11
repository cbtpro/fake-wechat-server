-- Copyright 2024 Peter Chen
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

-- 首屏/广告配置表
-- 用于管理首屏加载时间、首屏加载内容、广告页面等配置
CREATE TABLE IF NOT EXISTS `splash_config` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `type` VARCHAR(32) NOT NULL DEFAULT 'SPLASH' COMMENT '类型: SPLASH-首屏配置, AD-广告配置',
  `title` VARCHAR(255) NOT NULL COMMENT '标题',
  `content` TEXT COMMENT '内容/描述',
  `image_url` VARCHAR(512) COMMENT '图片URL',
  `link_url` VARCHAR(512) COMMENT '点击跳转链接',
  `duration` INT NOT NULL DEFAULT 3 COMMENT '显示时长(秒)',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序(数字越小越靠前)',
  `status` VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE-启用, INACTIVE-禁用',
  `theme` VARCHAR(32) NOT NULL DEFAULT 'ALL' COMMENT '适用主题: ALL-全部, LIGHT-浅色, DARK-深色',
  `start_time` DATETIME COMMENT '开始时间(定时展示)',
  `end_time` DATETIME COMMENT '结束时间(定时展示)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_theme` (`theme`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='首屏/广告配置表';

-- 初始化默认首屏配置
INSERT INTO `splash_config` (`type`, `title`, `content`, `image_url`, `duration`, `sort_order`, `status`, `theme`)
VALUES ('SPLASH', '默认首屏', '应用启动首屏展示', '', 3, 0, 'ACTIVE', 'ALL')
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;
