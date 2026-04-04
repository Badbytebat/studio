"use client";

import * as React from "react";
import type { SiteMeta } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";

type Props = {
  siteMeta: SiteMeta;
  onChange: (field: keyof SiteMeta, value: string) => void;
  onFaviconUpload?: (file: File) => void;
  faviconUploading?: boolean;
};

/** SEO fields (edit mode only — wired from parent). */
export default function SiteMetaSection({
  siteMeta,
  onChange,
  onFaviconUpload,
  faviconUploading = false,
}: Props) {
  const faviconInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <section id="seo" className="scroll-mt-24 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-dashed bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">SEO & sharing</CardTitle>
            <CardDescription>
              Page title, description, social preview, and browser tab icon (saved with your portfolio).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="site-meta-title">Site title</Label>
              <Input
                id="site-meta-title"
                value={siteMeta.title}
                onChange={(e) => onChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site-meta-desc">Meta description</Label>
              <Textarea
                id="site-meta-desc"
                value={siteMeta.description}
                onChange={(e) => onChange("description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Tab icon (favicon)</Label>
              <p className="text-xs text-muted-foreground">
                Upload a square image (PNG, JPG, WebP, SVG, or ICO). Visitors will see it on the browser tab.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {siteMeta.faviconUrl ? (
                  <img
                    src={siteMeta.faviconUrl}
                    alt=""
                    className="h-10 w-10 rounded-md border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
                    None
                  </div>
                )}
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*,.ico"
                  className="sr-only"
                  aria-hidden
                  tabIndex={-1}
                  disabled={!onFaviconUpload || faviconUploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f && onFaviconUpload) onFaviconUpload(f);
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={!onFaviconUpload || faviconUploading}
                  onClick={() => faviconInputRef.current?.click()}
                >
                  {faviconUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload image
                </Button>
                {siteMeta.faviconUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange("faviconUrl", "")}
                    disabled={faviconUploading}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site-meta-og">Open Graph image URL (optional)</Label>
              <Input
                id="site-meta-og"
                value={siteMeta.ogImageUrl ?? ""}
                onChange={(e) => onChange("ogImageUrl", e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site-meta-tw">Twitter @handle (optional)</Label>
              <Input
                id="site-meta-tw"
                value={siteMeta.twitterSite ?? ""}
                onChange={(e) => onChange("twitterSite", e.target.value)}
                placeholder="@username"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
