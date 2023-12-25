import { groupBy } from 'lodash';
import { Config } from '../config';
import { ckFileDirectory, getComponentNamesFromNodeModules } from './file';
const init = (configs: Config[]) => {
  // 获取组件名
  const getNames = (config) =>
    getComponentNamesFromNodeModules(config.INPUT_PATH, config.FILTER_ICON);

  const infoArr = configs.map((config) => ({
    config,
    // 生成文件内容
    fileContent: getNames(config)
      .map((name) => config.outPutIndexTemplate({ name, config }))
      ?.join('\n'),
  }));

  // 按输出路径分组
  const outPaths = groupBy(infoArr, (info) => {
    return info.config.OUTPUT_PATH_INDEX;
  });
  Object.keys(outPaths).forEach((outPath) => {
    // 校验文件，文件夹是否存在，不存在创建
    const fileContent = outPaths[outPath].reduce(
      (pre, next) => `${pre}\n${next.fileContent}`,
      '',
    );
    ckFileDirectory({
      name: outPath,
      type: 'file',
      fileContent,
      reCreate: true,
    });
  });
};
export default init;
