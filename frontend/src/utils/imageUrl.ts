export function resolveImageUrl(raw: string | null | undefined): string {
  if (!raw) return "";

  try {
    const beHost = process.env.NEXT_PUBLIC_BE_HOST || "";

    // If absolute URL
    if (/^https?:\/\//i.test(raw)) {
      const u = new URL(raw);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
        if (beHost) {
          const base = new URL(beHost);
          base.pathname = u.pathname;
          base.search = u.search;
          return base.toString();
        }
      }
      return raw;
    }

    // If it's a backend-served path like /images/... or images/...
    if (raw.startsWith("/images") || raw.startsWith("images/")) {
      const path = raw.startsWith("/") ? raw : `/${raw}`;
      if (beHost) {
        return new URL(path, beHost).toString();
      }
    }

    // Otherwise return as-is (might be from public/ folder like /images/logo/...)
    return raw;
  } catch {
    return raw as string;
  }
}

export function isExternalUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    return /^https?:\/\//i.test(url);
  } catch {
    return false;
  }
}


