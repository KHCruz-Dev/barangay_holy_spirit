function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAMESITE,
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
    maxAge: Number(process.env.COOKIE_MAX_AGE) || 86400000,
  };
}

module.exports = { getCookieOptions };
