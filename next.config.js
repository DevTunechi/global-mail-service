/** @type {import('next').NextConfig} */
const nextConfig = {
  // We don't need remotePatterns anymore since we moved to local public images!
  images: {
    unoptimized: true, 
  },
};

module.exports = nextConfig;