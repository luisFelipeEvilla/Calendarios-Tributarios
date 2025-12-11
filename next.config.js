/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['default', 'es'],
    defaultLocale: 'es',
    localeDetection: false
  },
}

module.exports = nextConfig
