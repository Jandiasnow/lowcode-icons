import { groupBy } from 'lodash';
import { Config } from '../config';
import { ckFileDirectory, getComponentNamesFromNodeModules } from './file';
const outPutFileComponents = ({ name, config }) => {
  return `components.push(${config.COMPONENT_NAME_PRE?.toLowerCase()}${name?.toLowerCase()});`;
};
const outPutFileImport = ({ name, config }) => {
  return `import ${config.COMPONENT_NAME_PRE?.toLowerCase()}${name?.toLowerCase()} from './${config.COMPONENT_NAME_PRE?.toLowerCase()}${name?.toLowerCase()}/meta.tsx';`;
};
const init = (configs: Config[]) => {
  // 获取组件名
  const getNames = (config) =>
    getComponentNamesFromNodeModules(config.INPUT_PATH, config.FILTER_ICON);

  const infoArr = configs.map((config) => ({
    config,
    // 生成文件内容
    fileImport: getNames(config)
      .map((name) => outPutFileImport({ name, config }))
      ?.join('\n'),
    fileComponents: getNames(config)
      .map((name) => outPutFileComponents({ name, config }))
      ?.join('\n'),
  }));

  // 按输出路径分组
  const outPaths = groupBy(infoArr, (info) => {
    return info.config.OUTPUT_PATH_META;
  });
  Object.keys(outPaths).forEach((outPath) => {
    // 校验文件，文件夹是否存在，不存在创建
    const fileImport = outPaths[outPath].reduce(
      (pre, next) => `${pre}\n${next.fileImport}`,
      '',
    );
    const fileComponents = outPaths[outPath].reduce(
      (pre, next) => `${pre}\n${next.fileComponents}`,
      '',
    );
    ckFileDirectory({
      name: outPath,
      type: 'file',
      fileContent: `
      ${fileImport}

const components = [] as any;
      ${fileComponents}
      
export default { 
  components
}
      `,
      reCreate: true,
    });
  });
};
export default init;
