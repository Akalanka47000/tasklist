const execSync = require('child_process').execSync;
const { globPlugin } = require('esbuild-plugin-glob');

execSync('npx rimraf ./dist && mkdir dist');

require('esbuild')
  .build({
    entryPoints: ['./src/**/*.js', './src/**/*.json', './src/**/*.html'],
    bundle: false,
    outdir: './dist',
    platform: 'node',
    target: 'node18.0',
    format: 'cjs',
    minify: false,
    sourcemap: true,
    keepNames: true,
    loader: {
      '.json': 'copy',
      '.html': 'copy'
    },
    plugins: [globPlugin()]
  })
  .catch(() => process.exit(1));
