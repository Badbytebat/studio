"use client";

import { useEffect } from "react";
import type { SiteMeta } from "@/lib/types";

type Props = {
  siteMeta: SiteMeta;
  canonicalUrl?: string;
};

/** Syncs document title and basic meta tags from portfolio data (client-side). */
export default function SiteMetadata({ siteMeta, canonicalUrl }: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = siteMeta.title;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", siteMeta.description);
    setMeta("og:title", siteMeta.title, "property");
    setMeta("og:description", siteMeta.description, "property");
    setMeta("og:type", "website", "property");
    if (siteMeta.ogImageUrl?.trim()) {
      setMeta("og:image", siteMeta.ogImageUrl.trim(), "property");
    }
    setMeta("twitter:card", "summary_large_image");
    if (siteMeta.twitterSite?.trim()) {
      setMeta("twitter:site", siteMeta.twitterSite.trim());
    }

    if (canonicalUrl?.trim()) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonicalUrl.trim();
    }

    const fav = siteMeta.faviconUrl?.trim();
    const favLinkSel = 'link[rel="icon"][data-portfolio-favicon="1"]';
    const existingFav = document.querySelector(favLinkSel) as HTMLLinkElement | null;
    if (fav) {
      let link = existingFav;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        link.setAttribute("data-portfolio-favicon", "1");
        document.head.appendChild(link);
      }
      link.href = fav;
    } else if (existingFav) {
      existingFav.remove();
    }
  }, [siteMeta, canonicalUrl]);

  return null;
}
