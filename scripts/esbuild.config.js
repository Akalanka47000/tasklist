const fs = require("fs")
const { build } = require('esbuild');
const { globPlugin } = require('esbuild-plugin-glob');

const outdir = "./dist";

if (fs.existsSync(outdir)) fs.rmdirSync(outdir)

fs.mkdirSync(outdir)

build({
  entryPoints: ['./src/**/*.ts', './src/**/*.json', './src/**/*.html'],
  bundle: false,
  outdir,
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
});
