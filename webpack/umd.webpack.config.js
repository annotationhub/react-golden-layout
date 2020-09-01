/**
 * This file creates an UMD bundle designed to be consumed
 * by legacy browsers, such as IE11.
 */
const path = require("path");

module.exports = (env, argv) => ({
  entry: path.resolve("src/index.js"),
  devtool: argv.mode === "production" ? "source-map" : "inline-source-map",
  mode: argv.mode,
  output: {
    path: path.resolve("dist/umd"),
    filename: `golden-layout${argv.mode === "production" ? ".min" : ""}.js`,
    library: "GoldenLayout",
    libraryTarget: "umd",
  },
  externals: {
    jquery: {
      commonjs: "jquery",
      commonjs2: "jquery",
      amd: "jquery",
      root: "$",
    },
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
          ],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "transform-react-jsx"
          ]
        },
      },
    }],
  },
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    }
  },
});
