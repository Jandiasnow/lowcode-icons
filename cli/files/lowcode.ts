import { Config } from '../config';
import { ckFileDirectory, getComponentNamesFromNodeModules } from './file';

const init = (config: Config) => {
  // 创建 lowcode 文件夹
  ckFileDirectory({
    name: config.OUTPUT_PATH_LOWCODE,
    type: 'directory',
  });

  // 获取组件名
  const fileNames = getComponentNamesFromNodeModules(
    config.INPUT_PATH,
    config.FILTER_ICON,
  );

  fileNames.forEach((fileName) => {
    const pre = `${
      config.OUTPUT_PATH_LOWCODE
    }/${config.COMPONENT_NAME_PRE?.toLowerCase()}${fileName?.toLowerCase()}`;
    // 创建组件文件夹
    ckFileDirectory({
      name: pre,
      type: 'directory',
    });
    // 创建meta文件
    ckFileDirectory({
      name: `${pre}/meta`,
      type: 'file',
      fileContent: config.outPutLowcodeTemplate({ name: fileName, config }),
      fileSuffix: 'tsx',
    });
  });
};

export default init;
