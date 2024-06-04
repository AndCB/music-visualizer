/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", //static export
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
