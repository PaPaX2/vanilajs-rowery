const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const html = ["index", "onas", "rowery", "kategoria", "produkt"].map(
  (item) =>
    new HtmlWebpackPlugin({
      template: `./src/${item}.html`,
      filename: `${item}.html`,
    })
);
module.exports = {
  entry: "./src/app.js",
  //devtool: "inline-source-map",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "./docs"),
  },
  node: {
    global: false,
    __filename: "mock",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
          },
        },
      },
      {
        test: /\.html$/i,
        exclude: /src\templates/,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "src/style.[contenthash].css",
    }),

    new CleanWebpackPlugin(),

    ...html,
  ],
};
