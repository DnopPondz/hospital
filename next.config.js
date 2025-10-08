const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      const hasMiniCssPlugin = config.plugins.some(
        (plugin) => plugin?.constructor?.name === 'MiniCssExtractPlugin'
      );

      if (!hasMiniCssPlugin) {
        config.plugins.push(
          new MiniCssExtractPlugin({
            filename: 'static/css/[contenthash].css',
            chunkFilename: 'static/css/[contenthash].css'
          })
        );
      }
    }

    return config;
  }
};

module.exports = nextConfig;
