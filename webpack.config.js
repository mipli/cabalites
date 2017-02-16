module.exports = {
  entry: './src/index.ts',
  output: {
    filename: './app/dist/bundle.js',
    path: '/app'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }, {
       enforce: 'pre',
       test: /\.js$/,
       loader: "source-map-loader"
      }, {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: "source-map-loader"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devtool: 'inline-source-map'
};
