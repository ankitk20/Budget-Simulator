const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Keep this if you want to avoid build failures due to linting errors
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: isDev
              ? "frame-ancestors 'self' http://localhost https://sandbox-checkout.paddle.com https://sandbox-buy.paddle.com; report-uri /csp-violation-report"
              : "frame-ancestors 'self' https://checkout.paddle.com https://buy.paddle.com; report-uri /csp-violation-report",
          },
        ],
      },
    ];
  },
};
