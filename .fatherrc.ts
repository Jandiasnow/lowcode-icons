import { defineConfig } from 'father';
import { join } from 'path';

const library = 'TenxUiIconMaterials';

const externals = {
  react: 'var window.React',
  lodash: 'var window._',
};
const output = join(__dirname, '/dist/umd');
export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'dist' },
  umd: {
    entry: {
      'src/index.tsx': {
        name: library,
        sourcemap: true,
        externals,
        output,
      },
      'lowcode/meta.ts': {
        name: 'TenxUiIconMaterialsMeta',
        sourcemap: true,
        externals,
        output,
      },
    },
  },
});
