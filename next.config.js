/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      const MiniCssExtractPluginModule = require('next/dist/compiled/mini-css-extract-plugin');
      const MiniCssExtractPlugin =
        MiniCssExtractPluginModule.default || MiniCssExtractPluginModule;
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
