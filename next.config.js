/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@nestjs/common", "@nestjs/core", "reflect-metadata"]
};

module.exports = nextConfig;
