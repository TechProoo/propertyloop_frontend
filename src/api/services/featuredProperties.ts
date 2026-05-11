import api from "../client";

export interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  priceNaira: number;
  priceLabel: string;
  type: string;
  propertyType: string;
  beds: number;
  baths: number;
  sqft?: string;
  imageUrls: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const featuredPropertiesService = {
  listActive(): Promise<FeaturedProperty[]> {
    return api.get("/featured-properties").then((r) => r.data);
  },
};

export default featuredPropertiesService;
