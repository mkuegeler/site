// next.config.js

const { withContentlayer } = require('next-contentlayer2');
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });

// -- CSP must be proper (semicolon after each directive) --
const ContentSecurityPolicy = [
  "default-src 'self';",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;", 
  "style-src 'self' 'unsafe-inline';",
  "img-src * blob: data:;",
  "media-src *.s3.amazonaws.com;",
  "connect-src *;",
  "font-src 'self';",
  "frame-src giscus.app;"
].join(' ');

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];

// Compose plugins
const plugins = [withContentlayer, withBundleAnalyzer];

const nextConfig = {
  output: 'export',                                 // <-- STATIC EXPORT
  reactStrictMode: true,
  trailingSlash: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['app', 'components', 'layouts', 'scripts'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' }
    ],
    unoptimized: true,                              // <-- disables next/image optimization
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      }
    ];
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = plugins.reduce((acc, plugin) => plugin(acc), nextConfig);