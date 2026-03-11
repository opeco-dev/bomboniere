/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', 
        hostname: 'jscxuru740.ufs.sh'
      }
    ]
  }

};

export default nextConfig;
