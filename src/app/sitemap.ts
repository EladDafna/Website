import type { MetadataRoute } from "next";
import { navLinks, siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return navLinks.map((link) => ({
    url: new URL(link.href, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: link.href === "/projects" ? "daily" : "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
