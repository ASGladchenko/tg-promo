/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@nestjs/common", "@nestjs/core", "reflect-metadata"],
  webpack(config) {
    const assetRule = config.module.rules.find(
      (rule) => typeof rule === "object" && rule?.test instanceof RegExp && rule.test.test(".svg")
    );

    if (assetRule && typeof assetRule === "object") {
      assetRule.exclude = /\.svg$/i;
    }

    config.module.rules.push(
      {
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: ["@svgr/webpack"],
      }
    );

    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

module.exports = nextConfig;
