export function getBaseUrl(req) {
  // 1️⃣ Explicit override (production / CI)
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // 2️⃣ Vercel (always available)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3️⃣ Derived from request (local & prod-safe)
  const proto =
    req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.headers.host;

  return `${proto}://${host}`;
}
