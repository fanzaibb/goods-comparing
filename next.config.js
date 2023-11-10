/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  assetPrefix: 'https://fanzaibb.github.io/goods-comparing',
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;
