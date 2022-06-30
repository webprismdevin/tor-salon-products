/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
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
    formats: ["image/avif", "image/webp", "image/png", "image/jpeg"],
  },
  experimental: {
    // concurrentFeatures: true,
    urlImports: [
      "https://framer.com/m/",
      "https://framerusercontent.com/",
      "https://fonts.gstatic.com/",
      "https://fonts.googleapis.com/",
      "https://ga.jspm.io/",
      "https://jspm.dev/",
      "https://cdn.jsdelivr.net/"
    ],
  },
  async redirects(){
    return [{
      source: '/product/gift-cards',
      destination: '/gift-card',
      permanent: true
    }]
  }
}

module.exports = withBundleAnalyzer(nextConfig)
