/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.gorfactory.es",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.toptex.com",
        pathname: "/**",
      }
    ]
  }
};

export default nextConfig;
