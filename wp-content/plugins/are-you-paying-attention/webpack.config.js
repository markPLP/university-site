const path = require('path');

module.exports = {
  entry: {
    frontend: './src/frontend.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'], // Loaders for SCSS
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.scss'],
  },
};
