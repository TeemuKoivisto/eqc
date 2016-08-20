module.exports = {
  entry: './src/main.js',
  target: 'node',
  output: {
    path: './dist',
    filename: 'build.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  }
}