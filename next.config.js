/** @type {import('next').NextConfig} */

const { withPlausibleProxy } = require("next-plausible");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    // need to change first domain to project domain
    domains: [
      "torsalonproducts.com",
      "tor-salon-products.vercel.app",
      "cdn.sanity.io",
      "localhost",
      "s.gravatar.com",
      "framer.com",
      "cdn.shopify.com",
      "images.pexels.com",
    ],
    formats: ["image/avif", "image/webp"],
  },
  // compiler: { emotion: true },
  experimental: {
    serverActions: true,
    urlImports: [
      "https://framer.com/m/",
      "https://framerusercontent.com/",
      "https://fonts.gstatic.com/",
      "https://fonts.googleapis.com/",
      "https://ga.jspm.io/",
      "https://jspm.dev/",
      "https://cdn.jsdelivr.net/",
    ],
  },
  async redirects(){
    return [{
      source: '/product/gift-cards',
      destination: '/gift-cards',
      permanent: true
    }, {
      source: '/offer/try-tor',
      destination: '/pages/wash-style-bundle',
      permanent: true
    },
    {
      source: '/type/:handle*',
      destination: '/collection/:handle*',
      permanent: true
    }]
  },
  async rewrites() {
    return [
        {
            source: '/js/script.manual.revenue.js',
            destination: 'https://plausible.io/js/script.manual.revenue.js'
        },
        {
            source: '/api/event', // Or '/api/event/' if you have `trailingSlash: true` in this config
            destination: 'https://plausible.io/api/event'
        }
    ];
},
}

module.exports = withPlausibleProxy()(withBundleAnalyzer(nextConfig));
