import brandsJson from "../data/brands.json";
import beautyEventsJson from "../data/events_beauty.json";
import teaEventsJson from "../data/events_tea.json";
import autoEventsJson from "../data/events_auto.json";
import type { BrandDefinition } from "../types/brand";
import type { BrandCategory } from "../types/brand";
import type { EventDefinition } from "../types/event";
import type { BrandTypeId } from "../types/brand";

const brands: BrandDefinition[] = brandsJson as BrandDefinition[];

const eventsByCategory: Record<BrandCategory, EventDefinition[]> = {
  beauty: beautyEventsJson as EventDefinition[],
  tea: teaEventsJson as EventDefinition[],
  auto: autoEventsJson as EventDefinition[],
};

export function listBrands() {
  return brands;
}

export function getBrandById(id: BrandTypeId): BrandDefinition {
  const brand = brands.find((b) => b.id === id);
  // In MVP we keep it strict to catch integration issues early.
  if (!brand) throw new Error(`Unknown brandId: ${id}`);
  return brand;
}

export function getEventsForBrandCategory(category: BrandCategory): EventDefinition[] {
  return eventsByCategory[category] ?? [];
}

export function getBrandEvents(brandId: BrandTypeId) {
  const brand = getBrandById(brandId);
  return getEventsForBrandCategory(brand.category);
}

export const allBrands = brands;

export function getEventsCountByBrand(brandId: BrandTypeId) {
  return getBrandEvents(brandId).length;
}

