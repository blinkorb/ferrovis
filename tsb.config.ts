import { Config } from '@jakesidsmith/tsb';

const config: Config = {
  main: 'src/index.ts',
  outDir: 'build',
  indexHTMLPath: 'src/index.html',
  outputIndexHTMLFor: ['build'],
};

export default config;
