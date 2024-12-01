import { Config } from '@jakesidsmith/tsb';

const config: Config = {
  main: 'src/index.tsx',
  outDir: 'build',
  indexHTMLPath: 'src/index.html',
  outputIndexHTMLFor: ['build'],
  tsconfigPath: 'tsconfig.tsb.json',
};

export default config;
