import { useMemo } from 'react';

import type { GalleryImage } from '@/types/property-details.types';

/**
 * Minimal shape this hook needs from a Property record. Kept narrow and
 * structural (rather than importing the full Property type) so this hook
 * stays easy to reuse/test in isolation.
 */
type PropertyImageSource = {
  id: number | string;
  image_url: string;
  public_id?: string;
  property_images?: Array<{
    image_id: number | string;
    image_url: string;
    public_id?: string;
  }>;
};

/** Builds a deduped list of gallery images (cover image + gallery images) for the carousel. */
export function useGalleryImages(property: PropertyImageSource | null | undefined): GalleryImage[] {
  return useMemo<GalleryImage[]>(() => {
    if (!property) return [];

    const images: GalleryImage[] = [
      {
        id: `cover-${property.public_id || property.id}`,
        image_url: property.image_url,
        public_id: property.public_id,
      },
      ...(property.property_images ?? []).map((image) => ({
        id: `gallery-${image.image_id}-${image.public_id}`,
        image_url: image.image_url,
        public_id: image.public_id,
      })),
    ];

    const seen = new Set<string>();
    return images.filter((image) => {
      if (!image.image_url || seen.has(image.image_url)) return false;
      seen.add(image.image_url);
      return true;
    });
  }, [property]);
}
