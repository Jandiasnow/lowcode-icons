import { Config } from '../config';
import { ckFileDirectory, getComponentNamesFromNodeModules } from './file';

const init = (config: Config) => {
  // 创建 components 文件夹
  ckFileDirectory({
    name: config.OUTPUT_PATH_COMPONENTS,
    type: 'directory',
  });

  // 获取组件名
  const fileNames = getComponentNamesFromNodeModules(
    config.INPUT_PATH,
    config.FILTER_ICON,
  );
  fileNames.forEach((fileName) => {
    // 创建组件文件
    ckFileDirectory({
      name: `${config.OUTPUT_PATH_COMPONENTS}/${config.COMPONENT_NAME_PRE}${fileName}`,
      type: 'file',
      fileContent: config.outPutComponentsTemplate({ name: fileName, config }),
      fileSuffix: 'tsx',
    });
  });
};

export default init;
