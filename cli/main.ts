#!/usr/bin/env node

import { Command } from 'commander';
import DEFAULT_CONFIG, { Config, ROOT_PATH } from './config';
import initComponents from './files/components';
import initIndex from './files/index';
import initLowcode from './files/lowcode';
import initMd from './files/md';
import initMeta from './files/meta';

const program = new Command();

type Types = string[];
// const INIT_TYPES: Types = ['tenx', 'antd'];
const INIT_TYPES: Types = ['antd'];

const main = async (configs: Config[]) => {
  // 初始化 index 文件
  initIndex(configs);
  // 初始化 lowcode/meta 文件
  initMeta(configs);
  // 初始化 docs/md 文件
  initMd(configs);
  configs.forEach((config) => {
    // 初始化 components 文件
    initComponents(config);
    // 初始化 lowcode 文件
    initLowcode(config);
  });
};
program
  .name('lowcode-icon')
  .description('init lowcode icon files')
  .version('0.0.1')
  .usage('[options]')
  .allowUnknownOption()
  .option('-p, --COMPONENT_PRE <COMPONENT_PRE>', 'use custom COMPONENT_PRE')
  .option('-t, --TYPE <TYPE>', 'use custom TYPE', INIT_TYPES)
  .action((str, options) => {
    let types: Types = options.TYPE || str.TYPE || INIT_TYPES;
    if (types && !Array.isArray(types)) {
      types = [types];
    }
    // 配置文件列表
    str.CONFIGS = types.map((type) => {
      const config = {
        ...DEFAULT_CONFIG,
        ...(DEFAULT_CONFIG[type] || {}),
      };
      types.forEach((key) => {
        delete config[key];
      });
      Object.keys(config).forEach((key) => {
        if (key.includes('_PATH')) {
          config[key] = ROOT_PATH + config[key];
        }
      });
      return config;
    });
    main(str.CONFIGS);
  });
program.parse(process.argv);
