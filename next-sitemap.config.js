/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://clinicarepro.com",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/portal/*", "/api/*"],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/portal", "/api"] },
    ],
  },
};
