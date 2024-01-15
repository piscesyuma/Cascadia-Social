/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bzquotasibuzwyhlneqp.supabase.co",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },

  experimental: {
    scrollRestoration: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/sass")],
  },
};

const { withAxiom } = require("next-axiom");

module.exports = withAxiom(nextConfig);
