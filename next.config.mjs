/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", //static export
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath: '/music-visualizer'
};

export default nextConfig;
