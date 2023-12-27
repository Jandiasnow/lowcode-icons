export const ROOT_PATH = '../';
export interface SingleConfig {
  COMPONENT_NAME_PRE: string; // 组件名前缀
  INPUT_PATH: string; // 入口文件
  FILTER_ICON: string[]; // 需要过滤掉的入口文件名
  INPUT_PACKAGE_NAME: string; // 仓库名
}
export interface CommonConfig {
  OUTPUT_PATH_INDEX: string; // index 入口文件
  OUTPUT_PATH_META: string; // meta 入口文件
  OUTPUT_PATH_LOWCODE: string; // 低码文件夹
  OUTPUT_PATH_COMPONENTS: string; // 组件文件夹
  OUTPUT_PATH_DOCS: string; // 文档
  outPutIndexTemplate: ({
    config,
    name,
  }: {
    config: Config;
    name: string;
  }) => string; // index 入口文件模板
  outPutComponentsTemplate: ({
    config,
    name,
  }: {
    config: Config;
    name: string;
  }) => string; // 组件文件模板
  outPutLowcodeTemplate: ({
    config,
    name,
  }: {
    config: Config;
    name: string;
  }) => string; // 组件文件模板
}
export interface Config extends SingleConfig, CommonConfig {}

export interface Configs extends CommonConfig {
  tenx?: SingleConfig;
  antd?: SingleConfig;
}

const outPutIndexTemplate = ({ name, config }) => {
  return `export { default as ${config.COMPONENT_NAME_PRE}${name} } from './components/${config.COMPONENT_NAME_PRE}${name}';`;
};
const outPutComponentsTemplate = ({ name, config }) => {
  return `import * as React from 'react';
import { createElement } from 'react';
import { ${name} } from '${config.INPUT_PACKAGE_NAME}'
${
  config.INPUT_PACKAGE_NAME === '@tenx-ui/icon'
    ? `import '@tenx-ui/icon/assets/index.css';`
    : ''
}
export default ${name}`;
};
const outPutLowcodeTemplate = ({ name, config }) => {
  const getAntdCategory = () => {
    if (name.endsWith('Outlined')) {
      return 'antd 线框图标';
    }
    if (name.endsWith('Filled')) {
      return 'antd 实底图标';
    }
    return 'antd 双色图标';
  };
  const fileName = config.COMPONENT_NAME_PRE + name;
  const sizeName =
    config.INPUT_PACKAGE_NAME === '@tenx-ui/icon' ? 'size' : 'style.fontSize';
  const colorName =
    config.INPUT_PACKAGE_NAME === '@tenx-ui/icon' ? 'color' : 'style.color';
  const category =
    config.INPUT_PACKAGE_NAME === '@tenx-ui/icon'
      ? 'tenxui 图标'
      : getAntdCategory();

  return `import * as React from 'react';
import { createElement } from 'react';
// import '@tenx-ui/icon/assets/index.css';
import {${name}} from '${config.INPUT_PACKAGE_NAME}';
// 获取组件优先级
const getPriority = (componentName) => {
  const priorities = {}
  const SortArr = [
  ]
  SortArr.map((component, i) => {
    priorities[component] = SortArr.length - i
  })
  return priorities[componentName]
}
export const getMeta = (componentName, exportName?: string) => {
  const componentNameArr = componentName.split('.')
  // 基础信息
  return {
    base: {
      componentName,
      priority: getPriority(componentNameArr[0]),
      devMode: 'proCode'
    },
    npm: {
      package: '@tenx-ui/icon-materials',
      version: 'latest',
      exportName: exportName || componentNameArr[0],
      destructuring: true,
      subName: componentNameArr[1] || ''
    }
  }
}
const { base, npm } = getMeta('${fileName}')
export default {
  snippets:[
    {
      title: '${name}',
      screenshot: ${name} && <${name} style={{ fontSize: "40px", color: "#666", }}/>,
      schema: {
        componentName: '${fileName}',
        props: {
          __component_name: '${fileName}',
          style: {
            fontSize: undefined
          }
        }
      }
    }
  ],
  ...base,
  npm,
  title: '${fileName}',
  group: '图标',
  category: '${category}',
  props: [
    {
      name: '${sizeName}',
      title: '大小',
      setter: ['NumberSetter', 'StringSetter']
    },
    {
      name: '${colorName}',
      title: '颜色',
      propType: 'string',
      setter: 'ColorSetter'
    },
  ],
  configure: {
    component: {
      isContainer: false
    },
    supports: {
      style: true,
      loop: true,
      condition: true,
      events: [
        {
          name: 'onClick',
          template: 'onClick(){// 点击按钮时的回调}'
        }
      ]
    }
  }
}`;
};
const CONFIG: Configs = {
  OUTPUT_PATH_INDEX: 'src/index.tsx',
  OUTPUT_PATH_META: 'lowcode/meta.ts',
  OUTPUT_PATH_LOWCODE: 'lowcode',
  OUTPUT_PATH_COMPONENTS: 'src/components',
  OUTPUT_PATH_DOCS: 'docs',
  outPutIndexTemplate,
  outPutComponentsTemplate,
  outPutLowcodeTemplate,
  antd: {
    COMPONENT_NAME_PRE: 'AntdIcon',
    INPUT_PATH: 'node_modules/@ant-design/icons/es/icons',
    FILTER_ICON: ['index'],
    INPUT_PACKAGE_NAME: '@ant-design/icons',
  },
  tenx: {
    COMPONENT_NAME_PRE: 'TenxIcon',
    INPUT_PATH: 'node_modules/@tenx-ui/icon/es',
    FILTER_ICON: ['index', 'lib', '_old'],
    INPUT_PACKAGE_NAME: '@tenx-ui/icon',
  },
};

export default CONFIG;
