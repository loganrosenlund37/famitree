const path = require('path');

const SRC_DIR = path.join(__dirname, '/client');
const DIST_DIR = path.join(__dirname, '/public/dist');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  mode: 'production',
  module: {
    rules: [
      {
        test: [/\.(jsx)$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['css-loader', 'style-loader'],
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx', '.css'] },
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
};
