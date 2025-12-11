/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['default', 'es'],
    defaultLocale: 'es',
    localeDetection: false
  },
  // Transpile react-pdf para evitar problemas con ESM
  transpilePackages: ['@react-pdf/renderer']
}

module.exports = nextConfig
