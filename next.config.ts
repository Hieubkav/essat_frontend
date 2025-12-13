import type { NextConfig } from "next";

// Dedupe Lexical packages by forcing Turbopack/Webpack to transpile
// from the root node_modules copy. Avoid resolveAlias because Lexical
// does not export the package root (caused dev failure).
const lexicalPkgs = [
  "lexical",
  "@lexical/react",
  "@lexical/list",
  "@lexical/rich-text",
  "@lexical/utils",
  "@lexical/selection",
  "@lexical/code",
  "@lexical/link",
  "@lexical/markdown",
  "@lexical/table",
];

const nextConfig: NextConfig = {
  transpilePackages: lexicalPkgs,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
