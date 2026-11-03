import type { MetadataRoute } from "next";
import { profile } from "@/data/portfolioData";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: profile.siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
