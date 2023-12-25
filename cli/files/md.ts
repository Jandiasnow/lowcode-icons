import { groupBy } from 'lodash';
import { Config } from '../config';
import { ckFileDirectory, getComponentNamesFromNodeModules } from './file';
const outPutFileComponents = ({ name, config }) => {
  return `<Icons.${config.COMPONENT_NAME_PRE}${name}  style={{ margin: "10px", fontSize: 24, color: "#ccc" }}/>`;
};
const outPutFileImport = ({ name, config }) => {
  return `import ${config.COMPONENT_NAME_PRE}${name} from '../src/components/${config.COMPONENT_NAME_PRE}${name}';`;
};
const init = (configs: Config[]) => {
  // 获取组件名
  const getNames = (config) =>
    getComponentNamesFromNodeModules(config.INPUT_PATH, config.FILTER_ICON);

  const infoArr = configs.map((config) => ({
    config,
    // 生成文件内容
    fileIndexAction: `
    - text: ${config.COMPONENT_NAME_PRE}
      link: /${config.COMPONENT_NAME_PRE.slice(
        0,
        1,
      ).toLowerCase()}${config.COMPONENT_NAME_PRE.slice(1)
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()}  
`,
    filePre: `# ${config.COMPONENT_NAME_PRE}
This is examples of ${config.COMPONENT_NAME_PRE}.
`,
    fileImport: getNames(config)
      .map((name) => outPutFileImport({ name, config }))
      ?.join('\n'),
    fileComponents: getNames(config)
      ?.sort((a, b) => {
        const aEnd =
          a.endsWith('Outlined') || a.endsWith('TwoTone') ? a.slice(-7) : a;
        const bEnd =
          b.endsWith('Outlined') || b.endsWith('TwoTone') ? b.slice(-7) : b;
        return aEnd.localeCompare(bEnd);
      })
      .map((name) => outPutFileComponents({ name, config }))
      ?.join('\n'),
  }));

  ckFileDirectory({
    name: `${configs?.[0]?.OUTPUT_PATH_DOCS}/index.md`,
    type: 'file',
    fileContent: `---
hero:
  title: lowcode-icons
  description: lowcode-icons of tenx-ui and antd
  actions:
${infoArr.map((item) => item.fileIndexAction)?.join('\n')}
---
`,
    reCreate: true,
  });

  // 按输出路径分组
  const outPaths = groupBy(infoArr, (info) => {
    return `${configs?.[0]?.OUTPUT_PATH_DOCS}/${info.config.COMPONENT_NAME_PRE}.md`;
  });
  Object.keys(outPaths).forEach((outPath) => {
    // 校验文件，文件夹是否存在，不存在创建
    // const fileImport = outPaths[outPath].reduce(
    //   (pre, next) => `${pre}\n${next.fileImport}`,
    //   '',
    // );
    const fileComponents = outPaths[outPath].reduce(
      (pre, next) => `${pre}\n${next.fileComponents}`,
      '',
    );
    const filePre = outPaths[outPath]?.[0]?.filePre;
    ckFileDirectory({
      name: outPath,
      type: 'file',
      fileContent: `
${filePre}
${'```jsx'}
import * as Icons from 'lowcode-icons';
const components = () => {
  return <div>
    ${fileComponents}
    </div>
  }
export default components
${'```'}
`,
      reCreate: true,
    });
  });
};
export default init;
