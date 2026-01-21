function isProd() {
  return process.env.NODE_ENV === "production";
}

function parseBool(value, fallback = false) {
  if (value === undefined) return fallback;
  return value === "true";
}

function getCookieOptions({ rememberMe = false } = {}) {
  const prod = isProd();

  // ---- Duration ----
  const oneDay = 24 * 60 * 60 * 1000;
  const thirtyDays = 30 * oneDay;

  // ---- ENV-driven but SAFE ----
  const secure = parseBool(process.env.COOKIE_SECURE, prod);
  const sameSite = process.env.COOKIE_SAMESITE || (prod ? "None" : "Lax");

  const domain =
    process.env.COOKIE_DOMAIN || (prod ? ".barangayholyspirit.com" : undefined);

  const maxAge =
    Number(process.env.COOKIE_MAX_AGE) || (rememberMe ? thirtyDays : oneDay);

  return {
    httpOnly: true,
    secure, // ✅ must be true for SameSite=None
    sameSite, // Lax in dev, None in prod
    domain, // shared across www + non-www
    path: "/", // 🔥 CRITICAL: ensures overwrite
    maxAge,
  };
}

module.exports = { getCookieOptions };
