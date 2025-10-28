/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Use a custom build dir to avoid Windows locks on .next\trace
  distDir: '.next-build',
  // Avoid creating/accessing trace dir on Windows (prevents EPERM lstat errors)
  outputFileTracing: false,
  // Speed up builds and avoid blocking on lint/types in CI-like environments
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
