import cleanup from 'rollup-plugin-cleanup'

export default {
  input: 'lib/index.mjs',
  output: { file: 'lib/index.cjs', format: 'cjs', sourcemap: true },
  plugins: [cleanup()]
}
