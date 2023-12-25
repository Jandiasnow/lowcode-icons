import fs from 'fs';

// 获取组件名列表
export const getComponentNamesFromNodeModules = (
  inputPath: string,
  FILTER_ICON?: string[],
) => {
  const dirList = fs.readdirSync(inputPath);
  const names = dirList
    ?.map((item) => item.split('.')?.[0])
    ?.filter((name) => !(FILTER_ICON || []).includes(name));
  return names;
};

// 创建文件文件夹
interface MKFileDirectoryProps {
  name: string;
  type: 'file' | 'directory';
  typeName?: string;
  fileSuffix?: string; // tsx | ts ...
  fileContent?: string;
}
export const mkFileDirectory = (props: MKFileDirectoryProps) => {
  const { name, type, typeName, fileSuffix, fileContent = '' } = props;
  try {
    if (type === 'file') {
      // 创建文件
      fs.writeFileSync(
        `${name}${fileSuffix ? `.${fileSuffix}` : ''}`,
        fileContent,
      );
    } else {
      // 创建文件夹
      fs.mkdirSync(name);
    }
    console.log(`创建${typeName} ${name}成功`);
  } catch (error) {
    if (type === 'file') {
      const prename = name
        .split('/')
        .slice(0, name.split('/').length - 1)
        .join('/');
      if (!fs.existsSync(prename)) {
        fs.mkdirSync(prename);
        fs.writeFileSync(
          `${name}${fileSuffix ? `.${fileSuffix}` : ''}`,
          fileContent,
        );
        return;
      }
    }
    console.log(`创建${typeName} ${name} 失败`);
  }
};

// 删除文件文件夹
interface RMFileDirectoryProps {
  name: string;
  type: 'file' | 'directory';
  typeName?: string;
  fileSuffix?: string; // tsx | ts ...
}
export const rmFileDirectory = async (props: RMFileDirectoryProps) => {
  const { name, type, typeName, fileSuffix } = props;
  try {
    if (type === 'file') {
      // 删除文件
      fs.unlinkSync(`${name}${fileSuffix ? `.${fileSuffix}` : ''}`);
    } else {
      const dirList = (await fs.readdirSync(name)) || [];
      if (!(dirList.length > 0)) {
        // 删除文件夹
        fs.rmdirSync(name);
      } else {
        // 删除文件夹下列表
        dirList.forEach((child, i) => {
          const childName = `${name}/${child}`;
          const childStat = fs.statSync(childName);
          rmFileDirectory({
            name: childName,
            type: childStat.isDirectory() ? 'directory' : 'file',
            typeName: childStat.isDirectory() ? '文件夹' : '文件',
            fileSuffix,
          });
          if (i === dirList.length - 1) {
            fs.rmdirSync(name);
          }
        });
      }
    }
    console.log(`删除${typeName} ${name}成功`);
  } catch (error) {
    console.log(`删除${typeName} ${name} 失败`);
  }
};

// 校验文件文件夹存在
interface CKFileDirectoryProps {
  name: string; // 文件，文件夹名称
  type: 'file' | 'directory';
  reCreate?: boolean; // 存在重新创建
  fileSuffix?: string; // 文件后缀
  fileContent?: string; // 文件内容
}
export const ckFileDirectory = (props: CKFileDirectoryProps) => {
  const { name, type, reCreate } = props;
  const typeName = type === 'file' ? '文件' : '文件夹';

  try {
    fs.statSync(name);

    if (reCreate) {
      // 删除重新创建
      rmFileDirectory({
        ...props,
        typeName,
      } as RMFileDirectoryProps);
      mkFileDirectory({ ...props, typeName } as MKFileDirectoryProps);
    }
  } catch (error) {
    // 文件文件夹不存在新创建
    console.log(`${typeName} ${name} 不存在`);
    mkFileDirectory({ ...props, typeName } as MKFileDirectoryProps);
  }
};
