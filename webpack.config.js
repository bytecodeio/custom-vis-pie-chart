const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/customVis.js",
  devServer: {
    static: "./dist",
    https: true,
    port: 8080,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        use: "babel-loader",
        exclude: /node_modules/,
        include: /src/,
        sideEffects: false,
      },
      { test: /\.css$/i, use: ["to-string-loader", "css-loader"] },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
    fallback: { buffer: false },
  },
  devtool: "source-map",
};
