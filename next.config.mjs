/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['registration.recruso.co.uk'],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig